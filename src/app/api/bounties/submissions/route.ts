import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prismaClient";
import { getPrivyUser, syncPrivyUserToDb } from "@/lib/privy";

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
    const { bountyId, prUrl, prNumber } = body;

    // Validate required fields
    if (!bountyId || !prUrl || !prNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if bounty exists and is active
    const bounty = await prisma.bounty.findUnique({
      where: { id: bountyId },
    });

    if (!bounty) {
      return NextResponse.json({ error: "Bounty not found" }, { status: 404 });
    }

    if (bounty.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Bounty is not active" },
        { status: 400 }
      );
    }

    // Check if user already submitted for this bounty
    const existingSubmission = await prisma.bountySubmission.findUnique({
      where: {
        bountyId_userId: {
          bountyId,
          userId: dbUser.id,
        },
      },
    });

    if (existingSubmission) {
      return NextResponse.json(
        { error: "You have already submitted for this bounty" },
        { status: 409 }
      );
    }

    // Create the submission
    const submission = await prisma.bountySubmission.create({
      data: {
        bountyId,
        userId: dbUser.id,
        prUrl,
        prNumber: parseInt(prNumber),
        status: "PENDING",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        bounty: {
          select: {
            id: true,
            title: true,
            bountyAmount: true,
            githubIssueUrl: true,
          },
        },
      },
    });

    return NextResponse.json(submission);
  } catch (error) {
    console.error("Error creating bounty submission:", error);
    return NextResponse.json(
      { error: "Failed to create submission" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const bountyId = searchParams.get("bountyId");

    if (bountyId) {
      // Get submissions for a specific bounty
      const submissions = await prisma.bountySubmission.findMany({
        where: { bountyId },
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
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(submissions);
    } else {
      // Get user's submissions
      const submissions = await prisma.bountySubmission.findMany({
        where: { userId: dbUser.id },
        include: {
          bounty: {
            select: {
              id: true,
              title: true,
              bountyAmount: true,
              githubIssueUrl: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(submissions);
    }
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}
