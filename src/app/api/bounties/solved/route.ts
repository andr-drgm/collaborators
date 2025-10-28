import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prismaClient";
import { getPrivyUser, syncPrivyUserToDb } from "@/lib/privy";

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization header" },
        { status: 401 }
      );
    }

    const privyToken = authHeader.substring(7);

    // Verify the Privy token and get user info
    const privyUser = await getPrivyUser(privyToken);
    if (!privyUser) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Sync user to database to ensure they exist
    const dbUser = await syncPrivyUserToDb(privyUser, prisma);

    // Get bounties that the user has solved
    // This includes:
    // 1. Bounties where the user has approved submissions
    // 2. Bounties where status is SOLVED and solvedBy is the current user

    // Get all submissions by this user with APPROVED status
    const approvedSubmissions = await prisma.bountySubmission.findMany({
      where: {
        userId: dbUser.id,
        status: "APPROVED",
      },
      include: {
        bounty: {
          include: {
            bountyPoster: {
              select: {
                name: true,
                username: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Convert submissions to bounty-like objects for consistent rendering
    const solvedBounties = approvedSubmissions.map((submission) => ({
      id: submission.bounty.id,
      githubIssueId: submission.bounty.githubIssueId,
      githubRepoOwner: submission.bounty.githubRepoOwner,
      githubRepoName: submission.bounty.githubRepoName,
      title: submission.bounty.title,
      description: submission.bounty.description,
      bountyAmount: submission.bounty.bountyAmount,
      status: submission.bounty.status,
      isSolved: submission.bounty.isSolved,
      solvedAt: submission.bounty.solvedAt,
      solvedBy: submission.bounty.solvedBy,
      githubIssueUrl: submission.bounty.githubIssueUrl,
      bountyPoster: submission.bounty.bountyPoster,
      createdAt: submission.bounty.createdAt,
      updatedAt: submission.bounty.updatedAt,
      // Add submission info
      submissionId: submission.id,
      prUrl: submission.prUrl,
      prNumber: submission.prNumber,
      submissionStatus: submission.status,
      submissionCreatedAt: submission.createdAt,
    }));

    return NextResponse.json(solvedBounties);
  } catch (error) {
    console.error("Error fetching solved bounties:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
