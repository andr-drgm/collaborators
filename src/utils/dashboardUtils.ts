import { getCommits } from "@/services/github";

export interface Project {
  id: string;
  name: string;
  owner: string;
  repo: string;
}

export interface CommitData {
  date: Date;
  count: number;
}

export interface DashboardData {
  commitData: CommitData[];
  totalCommits: number;
  tokensHeld: number;
}

export const fetchUserProjects = async (): Promise<Project[]> => {
  try {
    const response = await fetch("/api/projects/user");
    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (error) {
    console.error("Error fetching user projects:", error);
    return [];
  }
};

export const fetchCommitsData = async (
  selectedProject: Project | null
): Promise<DashboardData> => {
  try {
    const commits = await getCommits(selectedProject);

    // Transform commits into the format expected by the chart
    const commitCounts: { [date: string]: number } = {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    commits.forEach((commit: any) => {
      if (commit.commit?.author?.date) {
        const commitDate = new Date(commit.commit.author.date);
        const dateKey = commitDate.toISOString().split("T")[0]; // YYYY-MM-DD format

        if (commitCounts[dateKey]) {
          commitCounts[dateKey]++;
        } else {
          commitCounts[dateKey] = 1;
        }
      }
    });

    // Transform to the format expected by the chart
    const transformedData = Object.entries(commitCounts).map(
      ([dateStr, count]) => ({
        date: new Date(dateStr),
        count,
      })
    );

    return {
      commitData: transformedData,
      totalCommits: commits.length,
      tokensHeld: commits.length, // 1 token per commit for now
    };
  } catch (error) {
    console.error("Error fetching commits:", error);
    return {
      commitData: [],
      totalCommits: 0,
      tokensHeld: 0,
    };
  }
};

export const formatMemberSince = (createdAt?: string): string => {
  if (!createdAt) return "";
  return new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
