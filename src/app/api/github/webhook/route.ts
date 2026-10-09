import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prismaClient";
import { verifyGitHubWebhook } from "@/lib/github-webhook";

export async function POST(request: NextRequest) {
  try {
    // Read body as string for signature verification
    const bodyString = await request.text();
    const signature = request.headers.get("x-hub-signature-256");

    // Fails closed: also rejects when GITHUB_WEBHOOK_SECRET is unset
    if (!verifyGitHubWebhook(bodyString, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
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
  // Org-level webhooks ping without a repository
  if (!repository) return;

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
    // Issue closed: close the bounty. Solving (and crediting) only happens via a
    // merged PR, whose event may arrive after this one and still wins.
    await prisma.bounty.updateMany({
      where: {
        githubIssueId: issue.number,
        githubRepoOwner: { equals: repository.owner.login, mode: "insensitive" },
        githubRepoName: { equals: repository.name, mode: "insensitive" },
        status: "ACTIVE",
      },
      data: { status: "CANCELLED" },
    });
  }
}

interface PullRequestEvent {
  action: string;
  pull_request: {
    number: number;
    merged: boolean;
    user: { login: string };
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

  if (action !== "closed" || !pull_request.merged) return;

  // A submission matches when it names this PR number in this repo AND was
  // made by the PR's author, so nobody can claim someone else's merged PR.
  const submissions = await prisma.bountySubmission.findMany({
    where: {
      prNumber: pull_request.number,
      status: "PENDING",
      bounty: {
        githubRepoOwner: { equals: repository.owner.login, mode: "insensitive" },
        githubRepoName: { equals: repository.name, mode: "insensitive" },
      },
      user: {
        username: { equals: pull_request.user.login, mode: "insensitive" },
      },
    },
  });

  for (const submission of submissions) {
    await prisma.$transaction(async (tx) => {
      // The conditional update is the idempotency guard: a redelivered or
      // concurrent event matches 0 rows here and credits nothing.
      const solved = await tx.bounty.updateMany({
        where: {
          id: submission.bountyId,
          isSolved: false,
          // CANCELLED = the issues.closed event for this fix arrived first
          status: { in: ["ACTIVE", "CANCELLED"] },
        },
        data: {
          status: "SOLVED",
          isSolved: true,
          solvedAt: new Date(),
          solvedBy: submission.userId,
        },
      });
      if (solved.count === 0) return;

      const bounty = await tx.bounty.findUniqueOrThrow({
        where: { id: submission.bountyId },
      });
      await tx.bountySubmission.update({
        where: { id: submission.id },
        data: { status: "APPROVED", isVerified: true, verifiedAt: new Date() },
      });
      await tx.user.update({
        where: { id: submission.userId },
        data: { unclaimedTokens: { increment: bounty.bountyAmount } },
      });

      console.log(
        `Bounty ${bounty.id} solved by ${submission.userId} via PR #${pull_request.number}, credited ${bounty.bountyAmount}`
      );
    });
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
