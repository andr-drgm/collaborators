import { NextRequest, NextResponse } from "next/server";
import { getPrivyUser, syncPrivyUserToDb } from "@/lib/privy";
import prisma from "@/prismaClient";

export async function GET(request: NextRequest) {
  try {
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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";
    const limit = parseInt(searchParams.get("limit") || "50");
    const sort = searchParams.get("sort") || "created";
    const direction = searchParams.get("direction") || "desc";

    // Build where clause
    const where: {
      bountyPosterId: string;
      status?: "ACTIVE" | "SOLVED" | "EXPIRED" | "CANCELLED";
    } = {
      bountyPosterId: dbUser.id,
    };

    if (status !== "all") {
      where.status = status as "ACTIVE" | "SOLVED" | "EXPIRED" | "CANCELLED";
    }

    // Build orderBy clause
    const orderBy: {
      bountyAmount?: "asc" | "desc";
      createdAt?: "asc" | "desc";
    } = {};
    if (sort === "amount") {
      orderBy.bountyAmount = direction as "asc" | "desc";
    } else {
      orderBy.createdAt = direction as "asc" | "desc";
    }

    // Fetch bounties created by this user
    const bounties = await prisma.bounty.findMany({
      where,
      orderBy,
      take: limit,
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

    // Add solver information for solved bounties
    const bountiesWithSolvers = await Promise.all(
      bounties.map(async (bounty) => {
        if (bounty.status === "SOLVED" && bounty.solvedBy) {
          const solver = await prisma.user.findUnique({
            where: { id: bounty.solvedBy },
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          });
          return {
            ...bounty,
            solver,
          };
        }
        return bounty;
      })
    );

    return NextResponse.json(bountiesWithSolvers);
  } catch (error) {
    console.error("Error fetching user bounties:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
