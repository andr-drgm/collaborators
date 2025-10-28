import { NextRequest, NextResponse } from "next/server";
import { getPrivyUser, syncPrivyUserToDb } from "@/lib/privy";
import prisma from "@/prismaClient";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get the Privy JWT token from the Authorization header
    const authHeader = request.headers.get("Authorization");
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

    // Get the request body
    const body = await request.json();
    const { bountyAmount } = body;

    // Validate required fields
    if (bountyAmount === undefined) {
      return NextResponse.json(
        { error: "Bounty amount is required" },
        { status: 400 }
      );
    }

    // Validate bounty amount
    if (bountyAmount <= 0) {
      return NextResponse.json(
        { error: "Bounty amount must be greater than 0" },
        { status: 400 }
      );
    }

    // Find the bounty and verify ownership
    const existingBounty = await prisma.bounty.findUnique({
      where: { id },
      include: {
        bountyPoster: true,
      },
    });

    if (!existingBounty) {
      return NextResponse.json({ error: "Bounty not found" }, { status: 404 });
    }

    // Check if the user is the owner of the bounty
    if (existingBounty.bountyPosterId !== dbUser.id) {
      return NextResponse.json(
        { error: "You can only edit your own bounties" },
        { status: 403 }
      );
    }

    // Check if bounty can be edited (only allow editing if status is ACTIVE)
    if (existingBounty.status !== "ACTIVE") {
      return NextResponse.json(
        {
          error: "Bounty can only be edited when status is ACTIVE",
        },
        { status: 400 }
      );
    }

    // Update the bounty
    const updatedBounty = await prisma.bounty.update({
      where: { id },
      data: {
        bountyAmount,
      },
      include: {
        bountyPoster: {
          select: {
            name: true,
            username: true,
            image: true,
          },
        },
        submissions: {
          select: {
            id: true,
            prUrl: true,
            prNumber: true,
            status: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    // Add solver information if the bounty is solved
    let bountyWithSolver = updatedBounty;
    if (updatedBounty.status === "SOLVED" && updatedBounty.solvedBy) {
      const solver = await prisma.user.findUnique({
        where: { id: updatedBounty.solvedBy },
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          walletAddress: true,
        },
      });
      bountyWithSolver = { ...updatedBounty, solver };
    }

    return NextResponse.json(bountyWithSolver);
  } catch (error) {
    console.error("Error updating bounty:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get the Privy JWT token from the Authorization header
    const authHeader = request.headers.get("Authorization");
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

    // Find the bounty and verify ownership
    const existingBounty = await prisma.bounty.findUnique({
      where: { id },
      include: {
        bountyPoster: true,
      },
    });

    if (!existingBounty) {
      return NextResponse.json({ error: "Bounty not found" }, { status: 404 });
    }

    // Check if the user is the owner of the bounty
    if (existingBounty.bountyPosterId !== dbUser.id) {
      return NextResponse.json(
        { error: "You can only delete your own bounties" },
        { status: 403 }
      );
    }

    // Check if bounty can be deleted (only allow deleting if status is ACTIVE or CANCELLED)
    if (
      existingBounty.status !== "ACTIVE" &&
      existingBounty.status !== "CANCELLED"
    ) {
      return NextResponse.json(
        {
          error:
            "Bounty can only be deleted when status is ACTIVE or CANCELLED",
        },
        { status: 400 }
      );
    }

    // Delete the bounty
    await prisma.bounty.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Bounty deleted successfully" });
  } catch (error) {
    console.error("Error deleting bounty:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
