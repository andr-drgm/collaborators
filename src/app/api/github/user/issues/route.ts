import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/core";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get("state") || "open";
    const sort = searchParams.get("sort") || "updated";
    const direction = searchParams.get("direction") || "desc";
    const labels = searchParams.get("labels");
    const per_page = parseInt(searchParams.get("per_page") || "30");

    // Get the authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("API: Missing or malformed Authorization header");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract the token
    const token = authHeader.substring(7);
    console.log("API: Received Privy JWT token:", token);

    // Verify the token with Privy and get user's GitHub access token
    const { getPrivyUser } = await import("@/lib/privy");
    const privyUser = await getPrivyUser(token);
    if (!privyUser) {
      console.error("API: Invalid Privy JWT token");
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    console.log("API: Privy user verified:", privyUser.id);

    // Find user in database by privyId
    const { prisma } = await import("@/prisma");
    const user = await prisma.user.findUnique({
      where: { privyId: privyUser.id },
    });

    if (!user) {
      console.error("API: User not found in database");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("API: User found in database:", user.id);

    // Use GitHub access token from user's account
    const githubAccount = await prisma.account.findFirst({
      where: {
        userId: user.id,
        provider: "github",
      },
    });

    // Use user's GitHub token if available, otherwise fall back to app token
    const githubToken =
      githubAccount?.access_token ||
      process.env.GITHUB_ACCESS_TOKEN ||
      process.env.GITHUB_TOKEN;

    console.log(
      "API: GitHub access token from DB/ENV:",
      githubToken ? "present" : "missing"
    );

    if (!githubToken) {
      console.error("API: GitHub access token not found for user or in ENV");
      console.error("API: User has GitHub account:", !!githubAccount);
      console.error("API: Available env vars:", {
        hasGithubToken: !!process.env.GITHUB_ACCESS_TOKEN,
        hasGithubTokenAlt: !!process.env.GITHUB_TOKEN,
      });

      // Return empty array instead of error for now
      return NextResponse.json([]);
    }

    const octokit = new Octokit({
      auth: githubToken,
    });

    try {
      // Use the GitHub Issues API to get issues for the authenticated user
      // Filter by created to only get issues created by the user
      console.log("Fetching issues for authenticated user...");

      const issuesResponse = await octokit.request("GET /issues", {
        state: state as "open" | "closed" | "all",
        sort: sort as "created" | "updated" | "comments",
        direction: direction as "asc" | "desc",
        per_page: Math.min(per_page, 100), // GitHub allows up to 100 per page
      });

      console.log(`Found ${issuesResponse.data.length} issues for user`);

      // Apply label filtering if specified
      let filteredIssues = issuesResponse.data;
      if (labels) {
        const labelList = labels.split(",").map((l) => l.trim().toLowerCase());
        filteredIssues = issuesResponse.data.filter((issue) =>
          issue.labels.some((label) => {
            const labelName = typeof label === "string" ? label : label.name;
            return labelName && labelList.includes(labelName.toLowerCase());
          })
        );
      }

      console.log(`Returning ${filteredIssues.length} filtered issues`);
      return NextResponse.json(filteredIssues.slice(0, per_page));
    } catch (apiError) {
      console.error("GitHub API error:", apiError);
      throw apiError;
    }
  } catch (error) {
    console.error("GitHub user issues error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        error: "Failed to fetch user issues",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
