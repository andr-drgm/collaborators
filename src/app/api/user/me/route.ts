import { NextRequest, NextResponse } from "next/server";
import { getPrivyUser, syncPrivyUserToDb } from "@/lib/privy";
import { prisma } from "@/prisma";

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

    // Sync user to database
    const dbUser = await syncPrivyUserToDb(privyUser, prisma);

    // Return user data
    return NextResponse.json({
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      username: dbUser.username,
      image: dbUser.image,
      walletAddress: dbUser.walletAddress,
      unclaimedTokens: dbUser.unclaimedTokens,
      createdAt: dbUser.createdAt,
    });
  } catch (error) {
    console.error("Error in /api/user/me:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
