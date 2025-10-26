import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/core";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const sort = searchParams.get("sort") || "updated";
    const order = searchParams.get("order") || "desc";

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    const response = await octokit.request("GET /search/issues", {
      q: query,
      sort: sort as
        | "updated"
        | "created"
        | "comments"
        | "reactions"
        | "reactions-+1"
        | "reactions--1"
        | "reactions-smile"
        | "reactions-thinking_face"
        | "reactions-heart"
        | "reactions-tada"
        | "interactions",
      order: order as "asc" | "desc",
      per_page: 30,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("GitHub search error:", error);
    return NextResponse.json(
      { error: "Failed to search issues" },
      { status: 500 }
    );
  }
}
