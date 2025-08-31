import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";

// GET /api/projects - List all projects with search and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status"); // "all", "approved", "pending"
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { owner: { contains: search, mode: "insensitive" } },
        { repo: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status === "approved") {
      where.isApproved = true;
    } else if (status === "pending") {
      where.isApproved = false;
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          votes: {
            include: {
              user: {
                select: { name: true, image: true },
              },
            },
          },
          projectAssignments: {
            include: {
              user: {
                select: { name: true, image: true },
              },
            },
          },
          _count: {
            select: {
              votes: true,
              projectAssignments: true,
            },
          },
        },
        orderBy: [
          { isApproved: "desc" },
          { voteCount: "desc" },
          { createdAt: "desc" },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.project.count({ where }),
    ]);

    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, githubUrl } = body;

    if (!name || !description || !githubUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Parse GitHub URL to extract owner and repo
    const githubUrlPattern =
      /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)(?:\/.*)?$/;
    const match = githubUrl.match(githubUrlPattern);

    if (!match) {
      return NextResponse.json(
        { error: "Invalid GitHub URL format" },
        { status: 400 }
      );
    }

    const [, owner, repo] = match;

    // Check if project already exists
    const existingProject = await prisma.project.findUnique({
      where: { githubUrl },
    });

    if (existingProject) {
      return NextResponse.json(
        { error: "Project with this GitHub URL already exists" },
        { status: 409 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        githubUrl,
        owner,
        repo,
      },
      include: {
        _count: {
          select: {
            votes: true,
            projectAssignments: true,
          },
        },
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
