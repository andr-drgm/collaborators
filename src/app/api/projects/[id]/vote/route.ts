import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";

// POST /api/projects/[id]/vote - Vote for a project
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: projectId } = await params;

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if user already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId: projectId,
        },
      },
    });

    if (existingVote) {
      return NextResponse.json(
        { error: "You have already voted for this project" },
        { status: 409 }
      );
    }

    // Create vote and update project vote count
    const [vote, updatedProject] = await Promise.all([
      prisma.vote.create({
        data: {
          userId: session.user.id,
          projectId: projectId,
        },
        include: {
          user: {
            select: { name: true, image: true },
          },
        },
      }),
      prisma.project.update({
        where: { id: projectId },
        data: {
          voteCount: { increment: 1 },
          // Auto-approve if vote count reaches 5
          isApproved: project.voteCount + 1 >= 5,
        },
      }),
    ]);

    return NextResponse.json({
      vote,
      project: updatedProject,
    });
  } catch (error) {
    console.error("Error voting for project:", error);
    return NextResponse.json(
      { error: "Failed to vote for project" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id]/vote - Remove vote from a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: projectId } = await params;

    // Check if vote exists
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId: projectId,
        },
      },
    });

    if (!existingVote) {
      return NextResponse.json({ error: "Vote not found" }, { status: 404 });
    }

    // Get current project to check vote count
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Remove vote and update project vote count
    const [, updatedProject] = await Promise.all([
      prisma.vote.delete({
        where: {
          userId_projectId: {
            userId: session.user.id,
            projectId: projectId,
          },
        },
      }),
      prisma.project.update({
        where: { id: projectId },
        data: {
          voteCount: { decrement: 1 },
          // Unapprove if vote count drops below 5
          isApproved: project.voteCount - 1 >= 5,
        },
      }),
    ]);

    return NextResponse.json({
      project: updatedProject,
    });
  } catch (error) {
    console.error("Error removing vote:", error);
    return NextResponse.json(
      { error: "Failed to remove vote" },
      { status: 500 }
    );
  }
}
