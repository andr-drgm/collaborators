import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/core";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");
    const issueNumber = searchParams.get("issue_number");

    if (!owner || !repo || !issueNumber) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/issues/{issue_number}",
      {
        owner,
        repo,
        issue_number: parseInt(issueNumber),
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("GitHub issue details error:", error);
    return NextResponse.json(
      { error: "Failed to fetch issue details" },
      { status: 500 }
    );
  }
}
