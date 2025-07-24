export const getCommits = async () => {
  try {
    const response = await fetch("/api/github/commits", {
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
