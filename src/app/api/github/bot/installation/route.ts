import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prismaClient";
import { getPrivyUser, syncPrivyUserToDb } from "@/lib/privy";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");

    if (!owner || !repo) {
      return NextResponse.json(
        { error: "Owner and repo are required" },
        { status: 400 }
      );
    }

    // Get current user
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const privyUser = await getPrivyUser(token);
    if (!privyUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Sync user to database (for authentication verification)
    await syncPrivyUserToDb(privyUser, prisma);

    // Check if bot is installed
    const installation = await prisma.botInstallation.findUnique({
      where: {
        owner_repo: {
          owner,
          repo,
        },
      },
    });

    return NextResponse.json({
      installed: installation?.installed || false,
      installation,
    });
  } catch (error) {
    console.error("Error checking bot installation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { owner, repo } = await request.json();

    if (!owner || !repo) {
      return NextResponse.json(
        { error: "Owner and repo are required" },
        { status: 400 }
      );
    }

    // Get current user
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const privyUser = await getPrivyUser(token);
    if (!privyUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Sync user to database
    const user = await syncPrivyUserToDb(privyUser, prisma);
    if (!user) {
      console.error("Failed to sync user to database");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Synced user:", user.id);

    // Create or update installation record
    const installation = await prisma.botInstallation.upsert({
      where: {
        owner_repo: {
          owner,
          repo,
        },
      },
      create: {
        owner,
        repo,
        installed: true,
        installedBy: user.id,
      },
      update: {
        installed: true,
        installedBy: user.id,
      },
    });

    return NextResponse.json(installation);
  } catch (error) {
    console.error("Error updating bot installation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");

    if (!owner || !repo) {
      return NextResponse.json(
        { error: "Owner and repo are required" },
        { status: 400 }
      );
    }

    // Get current user
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const privyUser = await getPrivyUser(token);
    if (!privyUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Sync user to database
    const user = await syncPrivyUserToDb(privyUser, prisma);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Mark as uninstalled
    await prisma.botInstallation.update({
      where: {
        owner_repo: {
          owner,
          repo,
        },
      },
      data: {
        installed: false,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing bot installation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
