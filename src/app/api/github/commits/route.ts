import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/core";
import { getPrivyUser } from "@/lib/privy";
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

    // Find user in database by privyId
    const user = await prisma.user.findUnique({
      where: { privyId: privyUser.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");

    // Return empty array if no owner/repo provided
    if (!owner || !repo) {
      return NextResponse.json([]);
    }

    // Use GitHub access token from user's account
    const githubAccount = await prisma.account.findFirst({
      where: {
        userId: user.id,
        provider: "github",
      },
    });

    // Use user's GitHub token if available, otherwise fall back to app token
    const githubToken =
      githubAccount?.access_token || process.env.GITHUB_ACCESS_TOKEN;

    if (!githubToken) {
      return NextResponse.json(
        {
          error:
            "GitHub access token not configured. Please set GITHUB_ACCESS_TOKEN or enable 'Return OAuth tokens' in Privy dashboard.",
        },
        { status: 401 }
      );
    }

    const userOctokit = new Octokit({
      auth: githubToken,
    });

    const response = await userOctokit.request(
      "GET /repos/{owner}/{repo}/commits",
      {
        owner,
        repo,
        author: user.username, // Changed from committer to author for better filtering
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching commits from GitHub:", error);
    return NextResponse.json(
      { error: "Failed to fetch commits" },
      { status: 500 }
    );
  }
}
