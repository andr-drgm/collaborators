import { NextResponse } from "next/server";
import { Octokit } from "@octokit/core";
import { auth } from "@/auth";

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

export async function GET(request: Request) {
  const session = await auth();
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");

  // Return empty array if no owner/repo provided
  if (!owner || !repo) {
    return NextResponse.json([]);
  }

  try {
    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/commits",
      {
        owner,
        repo,
        committer: session?.user.username,
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
