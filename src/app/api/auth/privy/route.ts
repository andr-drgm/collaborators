import { NextRequest, NextResponse } from "next/server";
import { getPrivyUser, syncPrivyUserToDb } from "@/lib/privy";
import { prisma } from "@/prisma";

// Webhook handler for Privy events
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, user } = body;

    // Handle different Privy events
    switch (event) {
      case "user.created":
      case "user.authenticated":
      case "user.linked_account":
        // Sync user to database
        await syncPrivyUserToDb(user, prisma);
        break;

      default:
        console.log("Unhandled Privy event:", event);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error handling Privy webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get current user session
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const privyUser = await getPrivyUser(token);

    if (!privyUser) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json({ user: privyUser });
  } catch (error) {
    console.error("Error in /api/auth/privy:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}



