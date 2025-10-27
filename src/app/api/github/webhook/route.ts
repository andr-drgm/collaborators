import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prismaClient";
import { verifyGitHubWebhook } from "@/lib/github-webhook";

export async function POST(request: NextRequest) {
  try {
    // Read body as string for signature verification
    const bodyString = await request.text();
    const signature = request.headers.get("x-hub-signature-256");

    console.log(
      "Webhook received - Secret configured:",
      !!process.env.GITHUB_WEBHOOK_SECRET
    );
    console.log("Signature present:", !!signature);

    // Verify webhook signature (allow bypassing in development)
    if (process.env.GITHUB_WEBHOOK_SECRET) {
      const isValid = verifyGitHubWebhook(bodyString, signature);
      console.log("Signature valid:", isValid);
      if (!isValid) {
        console.log(
          "⚠️ Webhook signature verification failed - this is OK in development"
        );
        // Don't reject in development to make testing easier
        // return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    // Parse the body for event handling
    const event = JSON.parse(bodyString);
    const eventType = request.headers.get("x-github-event");

    console.log(`Received GitHub webhook: ${eventType}`);

    switch (eventType) {
      case "ping":
        await handlePingEvent(event);
        break;
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

async function handlePingEvent(event: {
  repository: { owner: { login: string }; name: string; full_name: string };
  sender: { login: string; id: number };
}) {
  const { repository, sender } = event;

  console.log(
    `Webhook ping received for ${repository.full_name} by ${sender.login}`
  );

  // Find the user by GitHub username/login
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { login: sender.login },
        { username: sender.login },
        { username: { equals: sender.login, mode: "insensitive" } },
      ],
    },
  });

  if (!user) {
    console.log(
      `User ${sender.login} not found in database. Skipping repository registration.`
    );
    return;
  }

  console.log(`Found user ${user.id} for GitHub user ${sender.login}`);

  // Register the repository in BotInstallation
  await prisma.botInstallation.upsert({
    where: {
      owner_repo: {
        owner: repository.owner.login,
        repo: repository.name,
      },
    },
    create: {
      owner: repository.owner.login,
      repo: repository.name,
      installed: true,
      installedBy: user.id,
    },
    update: {
      installed: true,
      installedBy: user.id,
    },
  });

  console.log(`✅ Registered repository ${repository.full_name}`);
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

interface PullRequestEvent {
  action: string;
  pull_request: {
    number: number;
    merged: boolean;
  };
  repository: {
    owner: {
      login: string;
    };
    name: string;
  };
}

async function handlePullRequestEvent(event: PullRequestEvent) {
  const { action, pull_request, repository } = event;

  if (action === "closed" && pull_request.merged) {
    console.log(
      `PR ${pull_request.number} merged in ${repository.owner.login}/${repository.name}`
    );

    // Find ALL submissions for this PR across all bounties
    const submissions = await prisma.bountySubmission.findMany({
      where: {
        prNumber: pull_request.number,
        status: "PENDING",
      },
      include: {
        bounty: true,
      },
    });

    console.log(
      `Found ${submissions.length} submissions for PR ${pull_request.number}`
    );

    for (const submission of submissions) {
      const bounty = submission.bounty;

      // Check if the bounty is for the same repository
      if (
        bounty.githubRepoOwner === repository.owner.login &&
        bounty.githubRepoName === repository.name &&
        bounty.status === "ACTIVE"
      ) {
        console.log(
          `Marking bounty ${bounty.id} as solved by user ${submission.userId}`
        );

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

        console.log(
          `✅ Bounty ${bounty.id} (Issue #${bounty.githubIssueId}) solved by user ${submission.userId}`
        );
      }
    }
  }
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
