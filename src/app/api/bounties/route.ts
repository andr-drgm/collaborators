import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prismaClient";
import { getPrivyUser, syncPrivyUserToDb } from "@/lib/privy";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "ACTIVE";
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const bounties = await prisma.bounty.findMany({
      where: {
        status: status as "ACTIVE" | "SOLVED" | "EXPIRED" | "CANCELLED",
      },
      include: {
        bountyPoster: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        submissions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    // For solved bounties, add solver information
    const bountiesWithSolvers = await Promise.all(
      bounties.map(async (bounty) => {
        if (bounty.status === "SOLVED" && bounty.solvedBy) {
          const solver = await prisma.user.findUnique({
            where: { id: bounty.solvedBy },
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
              walletAddress: true,
            },
          });
          return {
            ...bounty,
            solver,
          };
        }
        return bounty;
      })
    );

    return NextResponse.json(bountiesWithSolvers);
  } catch (error) {
    console.error("Error fetching bounties:", error);
    return NextResponse.json(
      { error: "Failed to fetch bounties" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract the token
    const token = authHeader.substring(7);

    // Verify the token with Privy
    const privyUser = await getPrivyUser(token);
    if (!privyUser) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Sync user to database to ensure they exist
    const dbUser = await syncPrivyUserToDb(privyUser, prisma);

    const body = await request.json();
    const {
      githubIssueId,
      githubRepoOwner,
      githubRepoName,
      title,
      description,
      bountyAmount,
      githubIssueUrl,
    } = body;

    // Validate required fields
    if (
      !githubIssueId ||
      !githubRepoOwner ||
      !githubRepoName ||
      !title ||
      !description ||
      !bountyAmount ||
      !githubIssueUrl
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if bounty already exists for this issue
    const existingBounty = await prisma.bounty.findUnique({
      where: {
        githubIssueId_githubRepoOwner_githubRepoName: {
          githubIssueId: parseInt(githubIssueId),
          githubRepoOwner,
          githubRepoName,
        },
      },
    });

    if (existingBounty) {
      return NextResponse.json(
        { error: "Bounty already exists for this issue" },
        { status: 409 }
      );
    }

    // Create the bounty
    const bounty = await prisma.bounty.create({
      data: {
        githubIssueId: parseInt(githubIssueId),
        githubRepoOwner,
        githubRepoName,
        title,
        description,
        bountyAmount: parseFloat(bountyAmount),
        bountyPosterId: dbUser.id,
        githubIssueUrl,
        githubLabels: ["bounty", "usdc-reward"],
        status: "ACTIVE", // Bounty is immediately active
      },
      include: {
        bountyPoster: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    // TODO: Add bounty labels to the GitHub issue

    return NextResponse.json(bounty);
  } catch (error) {
    console.error("Error creating bounty:", error);
    return NextResponse.json(
      { error: "Failed to create bounty" },
      { status: 500 }
    );
  }
}
