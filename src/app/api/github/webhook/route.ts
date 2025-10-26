import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prismaClient";
import { verifyGitHubWebhook } from "@/lib/github-webhook";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-hub-signature-256");

    // Verify webhook signature
    if (!verifyGitHubWebhook(body, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);
    const eventType = request.headers.get("x-github-event");

    console.log(`Received GitHub webhook: ${eventType}`);

    switch (eventType) {
      case "issues":
        await handleIssueEvent(event);
        break;
      case "pull_request":
        await handlePullRequestEvent(event);
        break;
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleIssueEvent(event: {
  action: string;
  issue: { number: number };
  repository: { owner: { login: string }; name: string };
}) {
  const { action, issue, repository } = event;

  if (action === "opened") {
    // Check if this issue has a bounty
    const bounty = await prisma.bounty.findUnique({
      where: {
        githubIssueId_githubRepoOwner_githubRepoName: {
          githubIssueId: issue.number,
          githubRepoOwner: repository.owner.login,
          githubRepoName: repository.name,
        },
      },
    });

    if (bounty) {
      // Add bounty label to the issue
      await addBountyLabel(
        repository.owner.login,
        repository.name,
        issue.number
      );
    }
  } else if (action === "closed") {
    // Check if this was a solved bounty
    const bounty = await prisma.bounty.findUnique({
      where: {
        githubIssueId_githubRepoOwner_githubRepoName: {
          githubIssueId: issue.number,
          githubRepoOwner: repository.owner.login,
          githubRepoName: repository.name,
        },
      },
    });

    if (bounty && bounty.status === "ACTIVE") {
      // Mark bounty as solved if it was closed
      await prisma.bounty.update({
        where: { id: bounty.id },
        data: {
          status: "SOLVED",
          isSolved: true,
          solvedAt: new Date(),
        },
      });
    }
  }
}

async function handlePullRequestEvent(event: {
  action: string;
  pull_request: { merged: boolean; number: number; body: string };
  repository: { owner: { login: string }; name: string };
}) {
  const { action, pull_request, repository } = event;

  if (action === "closed" && pull_request.merged) {
    // Check if this PR closes any bounty issues
    const issueNumbers = extractIssueNumbers(pull_request.body);

    for (const issueNumber of issueNumbers) {
      const bounty = await prisma.bounty.findUnique({
        where: {
          githubIssueId_githubRepoOwner_githubRepoName: {
            githubIssueId: issueNumber,
            githubRepoOwner: repository.owner.login,
            githubRepoName: repository.name,
          },
        },
      });

      if (bounty && bounty.status === "ACTIVE") {
        // Find the submission for this PR
        const submission = await prisma.bountySubmission.findFirst({
          where: {
            bountyId: bounty.id,
            prNumber: pull_request.number,
            status: "PENDING",
          },
        });

        if (submission) {
          // Mark submission as verified and bounty as solved
          await prisma.$transaction([
            prisma.bountySubmission.update({
              where: { id: submission.id },
              data: {
                status: "APPROVED",
                isVerified: true,
                verifiedAt: new Date(),
              },
            }),
            prisma.bounty.update({
              where: { id: bounty.id },
              data: {
                status: "SOLVED",
                isSolved: true,
                solvedAt: new Date(),
                solvedBy: submission.userId,
              },
            }),
          ]);

          // TODO: Trigger USDC payment to the solver
          console.log(
            `Bounty ${bounty.id} solved by user ${submission.userId}`
          );
        }
      }
    }
  }
}

function extractIssueNumbers(prBody: string): number[] {
  // Extract issue numbers from PR body (e.g., "Fixes #123", "Closes #456")
  const issueRegex = /(?:fixes?|closes?|resolves?)\s*#(\d+)/gi;
  const matches = prBody.match(issueRegex);

  if (!matches) return [];

  return matches
    .map((match) => {
      const number = match.match(/#(\d+)/);
      return number ? parseInt(number[1]) : 0;
    })
    .filter((num) => num > 0);
}

async function addBountyLabel(
  owner: string,
  repo: string,
  issueNumber: number
) {
  // This would require GitHub App authentication
  // For now, we'll just log it
  console.log(`Should add bounty label to ${owner}/${repo}#${issueNumber}`);

  // TODO: Implement GitHub API call to add label
  // const github = new Octokit({ auth: process.env.GITHUB_APP_TOKEN });
  // await github.rest.issues.addLabels({
  //   owner,
  //   repo,
  //   issue_number: issueNumber,
  //   labels: ['bounty', 'usdc-reward']
  // });
}
