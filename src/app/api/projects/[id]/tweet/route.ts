import { NextRequest, NextResponse } from "next/server";
import { getPrivyUser } from "@/lib/privy";
import { prisma } from "@/prisma";

// POST /api/projects/[id]/tweet - Add tweet URL to approve a project
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
    const body = await request.json();
    const { tweetUrl } = body;

    if (!tweetUrl) {
      return NextResponse.json(
        { error: "X post URL is required" },
        { status: 400 }
      );
    }

    // Validate X post URL format
    const xUrlPattern =
      /^https:\/\/(twitter\.com|x\.com)\/[^\/]+\/status\/\d+$/;
    if (!xUrlPattern.test(tweetUrl)) {
      return NextResponse.json(
        { error: "Invalid X post URL format" },
        { status: 400 }
      );
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if project is already approved
    if (project.isApproved) {
      return NextResponse.json(
        { error: "Project is already approved" },
        { status: 409 }
      );
    }

    // Update project with tweet URL and approve it
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        tweetUrl,
        isApproved: true,
      },
      include: {
        _count: {
          select: {
            projectAssignments: true,
          },
        },
      },
    });

    return NextResponse.json({
      project: updatedProject,
    });
  } catch (error) {
    console.error("Error updating project with tweet:", error);
    return NextResponse.json(
      { error: "Failed to update project with X post" },
      { status: 500 }
    );
  }
}
