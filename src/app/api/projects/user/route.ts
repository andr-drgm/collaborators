import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";

// GET /api/projects/user - Get user's assigned projects
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const assignments = await prisma.projectAssignment.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        project: {
          include: {
            _count: {
              select: {
                votes: true,
                projectAssignments: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const projects = assignments.map((assignment) => assignment.project);

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching user projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch user projects" },
      { status: 500 }
    );
  }
}
