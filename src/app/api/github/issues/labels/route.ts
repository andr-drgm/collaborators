import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/core";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { owner, repo, issue_number, labels } = body;

    if (!owner || !repo || !issue_number || !labels) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    const response = await octokit.request(
      "POST /repos/{owner}/{repo}/issues/{issue_number}/labels",
      {
        owner,
        repo,
        issue_number: parseInt(issue_number),
        labels,
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("GitHub add labels error:", error);
    return NextResponse.json(
      { error: "Failed to add labels" },
      { status: 500 }
    );
  }
}
