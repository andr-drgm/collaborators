import { NextRequest, NextResponse } from "next/server";
import { getPrivyUser } from "@/lib/privy";
import { prisma } from "@/prisma";

// GET /api/projects - List all projects with search and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status"); // "all", "approved", "pending"
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const where: {
      OR?: Array<{
        name?: { contains: string; mode: "insensitive" };
        description?: { contains: string; mode: "insensitive" };
        owner?: { contains: string; mode: "insensitive" };
        repo?: { contains: string; mode: "insensitive" };
      }>;
      isApproved?: boolean;
    } = {};

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
          projectAssignments: {
            include: {
              user: {
                select: { name: true, image: true },
              },
            },
          },
          _count: {
            select: {
              projectAssignments: true,
            },
          },
        },
        orderBy: [{ isApproved: "desc" }, { createdAt: "desc" }],
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

    const body = await request.json();
    const { name, description, githubUrl, tweetUrl } = body;

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

    // Validate X post URL if provided
    if (tweetUrl) {
      const xUrlPattern =
        /^https:\/\/(twitter\.com|x\.com)\/[^\/]+\/status\/\d+$/;
      if (!xUrlPattern.test(tweetUrl)) {
        return NextResponse.json(
          { error: "Invalid X post URL format" },
          { status: 400 }
        );
      }
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        githubUrl,
        owner,
        repo,
        tweetUrl,
        isApproved: !!tweetUrl, // Auto-approve if tweet URL is provided
      },
      include: {
        _count: {
          select: {
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
