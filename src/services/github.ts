export const getCommits = async (
  selectedProject?: { owner: string; repo: string } | null
) => {
  // Return empty array if no project is selected
  if (!selectedProject) {
    return [];
  }

  try {
    const params = new URLSearchParams();
    params.append("owner", selectedProject.owner);
    params.append("repo", selectedProject.repo);

    const response = await fetch(`/api/github/commits?${params.toString()}`, {
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
