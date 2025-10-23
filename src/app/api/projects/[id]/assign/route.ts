import { NextRequest, NextResponse } from "next/server";
import { getPrivyUser } from "@/lib/privy";
import { prisma } from "@/prisma";

// POST /api/projects/[id]/assign - Assign user to a project
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Find user in database by privyId
    const user = await prisma.user.findUnique({
      where: { privyId: privyUser.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id: projectId } = await params;

    // Check if project exists and is approved
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!project.isApproved) {
      return NextResponse.json(
        { error: "Project is not approved yet" },
        { status: 400 }
      );
    }

    // Check if user is already assigned
    const existingAssignment = await prisma.projectAssignment.findUnique({
      where: {
        userId_projectId: {
          userId: user.id,
          projectId: projectId,
        },
      },
    });

    if (existingAssignment) {
      return NextResponse.json(
        { error: "You are already assigned to this project" },
        { status: 409 }
      );
    }

    // Create assignment
    const assignment = await prisma.projectAssignment.create({
      data: {
        userId: user.id,
        projectId: projectId,
      },
      include: {
        user: {
          select: { name: true, image: true, username: true },
        },
        project: {
          select: { name: true, owner: true, repo: true },
        },
      },
    });

    return NextResponse.json(assignment);
  } catch (error) {
    console.error("Error assigning to project:", error);
    return NextResponse.json(
      { error: "Failed to assign to project" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id]/assign - Remove user assignment from a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Find user in database by privyId
    const user = await prisma.user.findUnique({
      where: { privyId: privyUser.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id: projectId } = await params;

    // Check if assignment exists
    const existingAssignment = await prisma.projectAssignment.findUnique({
      where: {
        userId_projectId: {
          userId: user.id,
          projectId: projectId,
        },
      },
    });

    if (!existingAssignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }

    // Remove assignment
    await prisma.projectAssignment.delete({
      where: {
        userId_projectId: {
          userId: user.id,
          projectId: projectId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing assignment:", error);
    return NextResponse.json(
      { error: "Failed to remove assignment" },
      { status: 500 }
    );
  }
}
