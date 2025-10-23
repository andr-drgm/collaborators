import { NextRequest, NextResponse } from "next/server";
import { getPrivyUser } from "@/lib/privy";
import { prisma } from "@/prisma";

// GET /api/projects/user - Get user's assigned projects
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

    // Find user in database by privyId
    const user = await prisma.user.findUnique({
      where: { privyId: privyUser.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const assignments = await prisma.projectAssignment.findMany({
      where: {
        userId: user.id,
      },
      include: {
        project: {
          include: {
            _count: {
              select: {
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
