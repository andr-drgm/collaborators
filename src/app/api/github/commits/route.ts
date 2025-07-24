import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/core";

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

export async function GET(request: NextRequest) {
  try {
    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/commits",
      {
        owner: "andr-drgm",
        repo: "the-collaborator",
        per_page: 100, // Get more commits
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
