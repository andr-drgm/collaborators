// Types
export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body?: string;
  state: string;
  created_at: string;
  updated_at: string;
  html_url: string;
  repository_url?: string;
  labels: Array<{
    name: string;
    color: string;
  }>;
  user: {
    login: string;
    avatar_url: string;
  };
  repository?: {
    name: string;
    full_name: string;
    owner: {
      login: string;
    };
  };
}

// Legacy function - keeping for backward compatibility
export const getCommits = async (
  selectedProject?: { owner: string; repo: string } | null,
  accessToken?: string
) => {
  // Return empty array if no project is selected
  if (!selectedProject) {
    return [];
  }

  try {
    const params = new URLSearchParams();
    params.append("owner", selectedProject.owner);
    params.append("repo", selectedProject.repo);

    const headers: HeadersInit = {};
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(`/api/github/commits?${params.toString()}`, {
      headers,
      next: { revalidate: 300000 }, // 5 min
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("GitHub API response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching commits from GitHub:", error);
    // Return empty array as fallback
    return [];
  }
};

// New bounty marketplace functions
export const searchGitHubIssues = async (
  query: string,
  accessToken?: string
): Promise<GitHubIssue[]> => {
  try {
    const params = new URLSearchParams();
    params.append("q", query);
    params.append("sort", "updated");
    params.append("order", "desc");

    const headers: HeadersInit = {};
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(
      `/api/github/search/issues?${params.toString()}`,
      {
        headers,
        next: { revalidate: 300 }, // 5 min cache
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Error searching GitHub issues:", error);
    return [];
  }
};

export const getIssueDetails = async (
  owner: string,
  repo: string,
  issueNumber: number,
  accessToken?: string
): Promise<GitHubIssue | null> => {
  try {
    const params = new URLSearchParams();
    params.append("owner", owner);
    params.append("repo", repo);
    params.append("issue_number", issueNumber.toString());

    const headers: HeadersInit = {};
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(
      `/api/github/issues/details?${params.toString()}`,
      {
        headers,
        next: { revalidate: 300 }, // 5 min cache
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching issue details:", error);
    return null;
  }
};

export const addBountyLabel = async (
  owner: string,
  repo: string,
  issueNumber: number,
  accessToken?: string
): Promise<boolean> => {
  try {
    const response = await fetch("/api/github/issues/labels", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      body: JSON.stringify({
        owner,
        repo,
        issue_number: issueNumber,
        labels: ["bounty", "usdc-reward"],
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Error adding bounty label:", error);
    return false;
  }
};

export const getUserIssues = async (
  privyJwtToken: string,
  options: {
    state?: "open" | "closed" | "all";
    sort?: "created" | "updated" | "comments";
    direction?: "asc" | "desc";
    labels?: string;
    per_page?: number;
  } = {}
): Promise<GitHubIssue[]> => {
  try {
    const params = new URLSearchParams();

    if (options.state) params.append("state", options.state);
    if (options.sort) params.append("sort", options.sort);
    if (options.direction) params.append("direction", options.direction);
    if (options.labels) params.append("labels", options.labels);
    if (options.per_page)
      params.append("per_page", options.per_page.toString());

    const response = await fetch(
      `/api/github/user/issues?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${privyJwtToken}`,
        },
        next: { revalidate: 300 }, // 5 min cache
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });
      throw new Error(
        `HTTP error! status: ${response.status} - ${
          errorData.error || response.statusText
        }`
      );
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching user issues:", error);
    return [];
  }
};
