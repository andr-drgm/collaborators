"use client";

import { useState, useEffect, useCallback } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { searchGitHubIssues, getUserIssues } from "@/services/github";
import { usePrivyAuth } from "@/hooks/usePrivyAuth";
import BotInstallationStatus from "@/components/BotInstallationStatus";

interface GitHubIssue {
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

interface Bounty {
  id: string;
  githubIssueId: number;
  githubRepoOwner: string;
  githubRepoName: string;
  title: string;
  description: string;
  bountyAmount: number;
  status: string;
  isSolved: boolean;
  solvedAt: string | null;
  solvedBy: string | null;
  githubIssueUrl: string;
  bountyPoster: {
    name: string;
    username: string;
    image: string;
  };
  solver?: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
  createdAt: string;
}

type TabType = "search" | "my-issues" | "bounties" | "my-bounties";

export default function BountyMarketplace() {
  const { authenticated, getAccessToken } = usePrivy();
  const { getGithubAccessToken } = usePrivyAuth();

  // State for storing GitHub access token
  const [githubAccessToken, setGithubAccessToken] = useState<string | null>(
    null
  );

  const [activeTab, setActiveTab] = useState<TabType>("search");

  // Search tab state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchIssues, setSearchIssues] = useState<GitHubIssue[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // My issues tab state
  const [myIssues, setMyIssues] = useState<GitHubIssue[]>([]);
  const [myIssuesLoading, setMyIssuesLoading] = useState(false);
  const [issueFilters, setIssueFilters] = useState({
    state: "open" as "open" | "closed" | "all",
    sort: "created" as "created" | "updated" | "comments",
    direction: "desc" as "asc" | "desc",
    labels: "",
  });

  // Bounties tab state
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [bountyFilters, setBountyFilters] = useState({
    status: "ACTIVE" as "ACTIVE" | "SOLVED" | "EXPIRED" | "CANCELLED",
    sort: "created" as "created" | "amount",
    direction: "desc" as "asc" | "desc",
  });

  // My Bounties tab state
  const [myBounties, setMyBounties] = useState<Bounty[]>([]);
  const [myBountiesLoading, setMyBountiesLoading] = useState(false);
  const [myBountyFilters, setMyBountyFilters] = useState({
    status: "all" as "all" | "ACTIVE" | "SOLVED" | "EXPIRED" | "CANCELLED",
    sort: "created" as "created" | "amount",
    direction: "desc" as "asc" | "desc",
  });

  // Common state
  const [selectedIssue, setSelectedIssue] = useState<GitHubIssue | null>(null);
  const [bountyAmount, setBountyAmount] = useState("");
  const [showCreateBounty, setShowCreateBounty] = useState(false);

  // Edit bounty state
  const [editingBounty, setEditingBounty] = useState<Bounty | null>(null);
  const [editBountyAmount, setEditBountyAmount] = useState("");
  const [showEditBountyModal, setShowEditBountyModal] = useState(false);

  const loadBounties = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.append("status", bountyFilters.status);
      params.append("limit", "50");

      const response = await fetch(`/api/bounties?${params.toString()}`);
      const data = await response.json();

      // Sort bounties
      const sortedData = data.sort((a: Bounty, b: Bounty) => {
        if (bountyFilters.sort === "amount") {
          return bountyFilters.direction === "desc"
            ? b.bountyAmount - a.bountyAmount
            : a.bountyAmount - b.bountyAmount;
        } else {
          return bountyFilters.direction === "desc"
            ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
      });

      setBounties(sortedData);
    } catch (error) {
      console.error("Error loading bounties:", error);
    }
  }, [bountyFilters.status, bountyFilters.sort, bountyFilters.direction]);

  const loadMyIssues = useCallback(async () => {
    if (!authenticated) return;

    setMyIssuesLoading(true);
    try {
      // Get the Privy JWT token for authentication
      const privyToken = await getAccessToken();
      if (!privyToken) {
        console.error("No Privy access token available. Please log in.");
        return;
      }

      const issues = await getUserIssues(privyToken, issueFilters);
      setMyIssues(issues);
    } catch (error) {
      console.error("Error loading user issues:", error);
    } finally {
      setMyIssuesLoading(false);
    }
  }, [authenticated, issueFilters, getAccessToken]);

  const loadMyBounties = useCallback(async () => {
    if (!authenticated) return;

    setMyBountiesLoading(true);
    try {
      // Get the Privy JWT token for authentication
      const privyToken = await getAccessToken();
      if (!privyToken) {
        console.error("No Privy access token available. Please log in.");
        return;
      }

      const params = new URLSearchParams();
      if (myBountyFilters.status !== "all") {
        params.append("status", myBountyFilters.status);
      }
      params.append("sort", myBountyFilters.sort);
      params.append("direction", myBountyFilters.direction);
      params.append("limit", "50");

      const response = await fetch(`/api/bounties/my?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${privyToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMyBounties(data);
      } else {
        console.error("Failed to load my bounties");
      }
    } catch (error) {
      console.error("Error loading my bounties:", error);
    } finally {
      setMyBountiesLoading(false);
    }
  }, [authenticated, myBountyFilters, getAccessToken]);

  // Load bounties
  useEffect(() => {
    loadBounties();
  }, [loadBounties]);

  // Try to get GitHub access token when component mounts
  useEffect(() => {
    const getToken = async () => {
      if (authenticated && !githubAccessToken) {
        // First try to get from localStorage
        const storedToken = localStorage.getItem("github_access_token");
        if (storedToken) {
          setGithubAccessToken(storedToken);
          return;
        }

        // Fallback to hook method
        try {
          const token = await getGithubAccessToken();
          if (token && typeof token === "string") {
            setGithubAccessToken(token);
          }
        } catch (error) {
          console.error("Error getting GitHub access token:", error);
        }
      }
    };

    getToken();

    // Listen for custom event when token is received
    const handleTokenReceived = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { token } = customEvent.detail;
      console.log("🎉 Token received via custom event:", token);
      setGithubAccessToken(token);
    };

    window.addEventListener("github-token-received", handleTokenReceived);

    return () => {
      window.removeEventListener("github-token-received", handleTokenReceived);
    };
  }, [authenticated, githubAccessToken, getGithubAccessToken]);

  // Load user issues when switching to my-issues tab
  useEffect(() => {
    if (activeTab === "my-issues" && authenticated) {
      loadMyIssues();
    }
  }, [activeTab, authenticated, loadMyIssues]);

  // Load user bounties when switching to my-bounties tab
  useEffect(() => {
    if (activeTab === "my-bounties" && authenticated) {
      loadMyBounties();
    }
  }, [activeTab, authenticated, loadMyBounties]);

  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    try {
      const results = await searchGitHubIssues(searchQuery);
      setSearchIssues(results);
    } catch (error) {
      console.error("Error searching issues:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const createBounty = async () => {
    if (!selectedIssue || !bountyAmount || !authenticated) return;

    // Validate that we have enough repository information
    const repoOwner =
      selectedIssue.repository?.owner?.login ||
      selectedIssue.repository_url?.split("/").slice(-2, -1)[0];
    const repoName =
      selectedIssue.repository?.name ||
      selectedIssue.repository_url?.split("/").slice(-1)[0];

    if (
      !repoOwner ||
      !repoName ||
      repoOwner === "unknown" ||
      repoName === "unknown"
    ) {
      alert(
        "Cannot create bounty: Repository information is missing or incomplete"
      );
      return;
    }

    try {
      // Get the Privy JWT token for authentication
      const privyToken = await getAccessToken();
      if (!privyToken) {
        alert("No access token available. Please log in.");
        return;
      }

      const response = await fetch("/api/bounties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${privyToken}`,
        },
        body: JSON.stringify({
          githubIssueId: selectedIssue.number,
          githubRepoOwner:
            selectedIssue.repository?.owner?.login ||
            selectedIssue.repository_url?.split("/").slice(-2, -1)[0] ||
            "unknown",
          githubRepoName:
            selectedIssue.repository?.name ||
            selectedIssue.repository_url?.split("/").slice(-1)[0] ||
            "unknown",
          title: selectedIssue.title,
          description: selectedIssue.body || "",
          bountyAmount: parseFloat(bountyAmount),
          githubIssueUrl: selectedIssue.html_url,
        }),
      });

      if (response.ok) {
        const newBounty = await response.json();
        setBounties((prev) => [newBounty, ...prev]);
        setMyBounties((prev) => [newBounty, ...prev]);
        setShowCreateBounty(false);
        setSelectedIssue(null);
        setBountyAmount("");
        alert("Bounty created successfully!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error creating bounty:", error);
      alert("Failed to create bounty");
    }
  };

  const extractPrNumberFromUrl = (url: string): number | null => {
    // Extract PR number from GitHub URL like: https://github.com/owner/repo/pull/123
    const match = url.match(/\/pull\/(\d+)/);
    return match ? parseInt(match[1]) : null;
  };

  const submitSolution = async (
    bountyId: string,
    prUrl: string,
    prNumber: number
  ) => {
    if (!authenticated) return;

    try {
      // Get the Privy JWT token for authentication
      const privyToken = await getAccessToken();
      if (!privyToken) {
        alert("No access token available. Please log in.");
        return;
      }

      const response = await fetch("/api/bounties/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${privyToken}`,
        },
        body: JSON.stringify({
          bountyId,
          prUrl,
          prNumber,
        }),
      });

      if (response.ok) {
        alert("Solution submitted successfully!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error submitting solution:", error);
      alert("Failed to submit solution");
    }
  };

  const handleEditBounty = (bounty: Bounty) => {
    setEditingBounty(bounty);
    setEditBountyAmount(bounty.bountyAmount.toString());
    setShowEditBountyModal(true);
  };

  const handleUpdateBounty = async () => {
    if (!editingBounty || !editBountyAmount) {
      alert("Please enter a valid bounty amount");
      return;
    }

    try {
      const response = await fetch(`/api/bounties/${editingBounty.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getAccessToken()}`,
        },
        body: JSON.stringify({
          bountyAmount: parseFloat(editBountyAmount),
        }),
      });

      if (response.ok) {
        const updatedBounty = await response.json();
        setBounties((prev) =>
          prev.map((bounty) =>
            bounty.id === editingBounty.id ? updatedBounty : bounty
          )
        );
        setMyBounties((prev) =>
          prev.map((bounty) =>
            bounty.id === editingBounty.id ? updatedBounty : bounty
          )
        );
        alert("Bounty updated successfully!");
        setShowEditBountyModal(false);
        setEditingBounty(null);
      } else {
        const error = await response.json();
        alert(`Error updating bounty: ${error.error}`);
      }
    } catch (error) {
      console.error("Error updating bounty:", error);
      alert("Failed to update bounty");
    }
  };

  const handleDeleteBounty = async (bountyId: string, bountyTitle: string) => {
    if (
      !confirm(
        `Are you sure you want to delete the bounty "${bountyTitle}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/bounties/${bountyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${await getAccessToken()}`,
        },
      });

      if (response.ok) {
        setBounties((prev) => prev.filter((bounty) => bounty.id !== bountyId));
        setMyBounties((prev) =>
          prev.filter((bounty) => bounty.id !== bountyId)
        );
        alert("Bounty deleted successfully!");
      } else {
        const error = await response.json();
        alert(`Error deleting bounty: ${error.error}`);
      }
    } catch (error) {
      console.error("Error deleting bounty:", error);
      alert("Failed to delete bounty");
    }
  };

  const renderIssueCard = (issue: GitHubIssue, showAddBounty = true) => {
    const repoOwner =
      issue.repository?.owner?.login ||
      (issue.repository_url
        ? issue.repository_url.split("/").slice(-2, -1)[0]
        : null);
    const repoName =
      issue.repository?.name ||
      (issue.repository_url
        ? issue.repository_url.split("/").slice(-1)[0]
        : null);

    return (
      <div key={issue.id} className="glass-card rounded-xl p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{issue.title}</h3>
          <span className="text-sm text-white/60">#{issue.number}</span>
        </div>
        <p className="text-white/70 text-sm mb-3 line-clamp-2">
          {issue.body?.substring(0, 150)}...
        </p>

        {/* Labels */}
        {issue.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {issue.labels.map((label) => (
              <span
                key={label.name}
                className="text-xs px-2 py-1 rounded"
                style={{
                  backgroundColor: `#${label.color}20`,
                  color: `#${label.color}`,
                  border: `1px solid #${label.color}40`,
                }}
              >
                {label.name}
              </span>
            ))}
          </div>
        )}

        {/* Bot Installation Status for Maintainers */}
        {authenticated && repoOwner && repoName && (
          <div className="mb-3 pb-3 border-b border-white/10">
            <BotInstallationStatus owner={repoOwner} repo={repoName} />
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/60">
              {issue.repository?.full_name ||
                (issue.repository_url
                  ? issue.repository_url.split("/").slice(-2).join("/")
                  : "Unknown Repository")}
            </span>
            <span className="text-xs px-2 py-1 bg-white/10 rounded">
              {issue.state}
            </span>
          </div>
          <div className="flex gap-2">
            <a
              href={issue.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary px-3 py-1 text-sm"
            >
              View Issue
            </a>
            {showAddBounty && (
              <button
                onClick={() => {
                  setSelectedIssue(issue);
                  setShowCreateBounty(true);
                }}
                className="btn-primary px-3 py-1 text-sm"
              >
                Add Bounty
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderBountyCard = (bounty: Bounty, showManageButtons = false) => (
    <div key={bounty.id} className="glass-card rounded-xl p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{bounty.title}</h3>
        <div className="text-right">
          <div className="text-lg font-bold text-green-400">
            ${bounty.bountyAmount} USDC
          </div>
          <div className="text-xs text-white/60">{bounty.status}</div>
        </div>
      </div>
      <p className="text-white/70 text-sm mb-3 line-clamp-2">
        {bounty.description.substring(0, 150)}...
      </p>

      {/* Show who solved it */}
      {bounty.status === "SOLVED" && bounty.solver && (
        <div className="mb-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-white/60">Solved by:</span>
            {bounty.solver.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={bounty.solver.image}
                alt={bounty.solver.name || "Solver"}
                className="w-5 h-5 rounded-full"
              />
            )}
            <span className="text-blue-400 font-medium">
              {bounty.solver.name || bounty.solver.username || "Anonymous"}
            </span>
          </div>
        </div>
      )}

      {/* Bot Installation Status */}
      {authenticated && (
        <div className="mb-3 pb-3 border-b border-white/10">
          <BotInstallationStatus
            owner={bounty.githubRepoOwner}
            repo={bounty.githubRepoName}
          />
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/60">
            {bounty.githubRepoOwner}/{bounty.githubRepoName}
          </span>
        </div>
        <div className="flex gap-2">
          <a
            href={bounty.githubIssueUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary px-3 py-1 text-sm"
          >
            View Issue
          </a>
          {showManageButtons && bounty.status === "ACTIVE" ? (
            <>
              <button
                onClick={() => handleEditBounty(bounty)}
                className="btn-primary px-3 py-1 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteBounty(bounty.id, bounty.title)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded-lg transition-colors"
              >
                Delete
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                const prUrl = prompt("Enter your PR URL:");
                if (prUrl) {
                  const prNumber = extractPrNumberFromUrl(prUrl);
                  if (prNumber) {
                    submitSolution(bounty.id, prUrl, prNumber);
                  } else {
                    alert(
                      "Invalid PR URL. Please enter a valid GitHub PR URL (e.g., https://github.com/owner/repo/pull/123)"
                    );
                  }
                }
              }}
              className="btn-primary px-3 py-1 text-sm"
            >
              Submit Solution
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Bounty Marketplace
          </h1>
          <p className="text-white/70 text-lg">
            Find GitHub issues with USDC bounties or create your own
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white/5 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("search")}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === "search"
                ? "bg-white/10 text-white"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            Search Issues
          </button>
          <button
            onClick={() => setActiveTab("my-issues")}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === "my-issues"
                ? "bg-white/10 text-white"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            My Issues
          </button>
          <button
            onClick={() => setActiveTab("bounties")}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === "bounties"
                ? "bg-white/10 text-white"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            Active Bounties
          </button>
          <button
            onClick={() => setActiveTab("my-bounties")}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === "my-bounties"
                ? "bg-white/10 text-white"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            My Bounties
          </button>
        </div>

        {/* Search Tab */}
        {activeTab === "search" && (
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Search GitHub Issues
              </h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search for issues (e.g., 'bug', 'feature', 'help wanted')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500"
                  onKeyPress={(e) => e.key === "Enter" && performSearch()}
                />
                <button
                  onClick={performSearch}
                  disabled={searchLoading}
                  className="btn-primary px-6 py-2 disabled:opacity-50"
                >
                  {searchLoading ? "Searching..." : "Search"}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {searchIssues.map((issue) => renderIssueCard(issue))}
            </div>
          </div>
        )}

        {/* My Issues Tab */}
        {activeTab === "my-issues" && (
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-2xl font-semibold mb-4">My GitHub Issues</h2>

              {/* Filters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <select
                  value={issueFilters.state}
                  onChange={(e) =>
                    setIssueFilters((prev) => ({
                      ...prev,
                      state: e.target.value as "open" | "closed" | "all",
                    }))
                  }
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="all">All</option>
                </select>

                <select
                  value={issueFilters.sort}
                  onChange={(e) =>
                    setIssueFilters((prev) => ({
                      ...prev,
                      sort: e.target.value as
                        | "created"
                        | "updated"
                        | "comments",
                    }))
                  }
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="created">Recently Created</option>
                  <option value="updated">Recently Updated</option>
                  <option value="comments">Most Comments</option>
                </select>

                <select
                  value={issueFilters.direction}
                  onChange={(e) =>
                    setIssueFilters((prev) => ({
                      ...prev,
                      direction: e.target.value as "asc" | "desc",
                    }))
                  }
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>

                <input
                  type="text"
                  placeholder="Filter by labels (comma-separated)"
                  value={issueFilters.labels}
                  onChange={(e) =>
                    setIssueFilters((prev) => ({
                      ...prev,
                      labels: e.target.value,
                    }))
                  }
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {!authenticated && (
                <p className="text-white/70">
                  Please connect your wallet to view your issues.
                </p>
              )}
            </div>

            <div className="space-y-4">
              {myIssuesLoading ? (
                <div className="text-center py-8">Loading your issues...</div>
              ) : (
                myIssues.map((issue) => renderIssueCard(issue))
              )}
            </div>
          </div>
        )}

        {/* Bounties Tab */}
        {activeTab === "bounties" && (
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-2xl font-semibold mb-4">Active Bounties</h2>

              {/* Filters */}
              <div className="grid grid-cols-3 gap-4">
                <select
                  value={bountyFilters.status}
                  onChange={(e) =>
                    setBountyFilters((prev) => ({
                      ...prev,
                      status: e.target.value as
                        | "ACTIVE"
                        | "SOLVED"
                        | "EXPIRED"
                        | "CANCELLED",
                    }))
                  }
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="SOLVED">Solved</option>
                  <option value="EXPIRED">Expired</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>

                <select
                  value={bountyFilters.sort}
                  onChange={(e) =>
                    setBountyFilters((prev) => ({
                      ...prev,
                      sort: e.target.value as "created" | "amount",
                    }))
                  }
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="created">Recently Created</option>
                  <option value="amount">Bounty Amount</option>
                </select>

                <select
                  value={bountyFilters.direction}
                  onChange={(e) =>
                    setBountyFilters((prev) => ({
                      ...prev,
                      direction: e.target.value as "asc" | "desc",
                    }))
                  }
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {bounties.map((bounty) => renderBountyCard(bounty))}
            </div>
          </div>
        )}

        {/* My Bounties Tab */}
        {activeTab === "my-bounties" && (
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-2xl font-semibold mb-4">
                My Created Bounties
              </h2>

              {/* Filters */}
              <div className="grid grid-cols-3 gap-4">
                <select
                  value={myBountyFilters.status}
                  onChange={(e) =>
                    setMyBountyFilters((prev) => ({
                      ...prev,
                      status: e.target.value as
                        | "all"
                        | "ACTIVE"
                        | "SOLVED"
                        | "EXPIRED"
                        | "CANCELLED",
                    }))
                  }
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="SOLVED">Solved</option>
                  <option value="EXPIRED">Expired</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>

                <select
                  value={myBountyFilters.sort}
                  onChange={(e) =>
                    setMyBountyFilters((prev) => ({
                      ...prev,
                      sort: e.target.value as "created" | "amount",
                    }))
                  }
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="created">Recently Created</option>
                  <option value="amount">Bounty Amount</option>
                </select>

                <select
                  value={myBountyFilters.direction}
                  onChange={(e) =>
                    setMyBountyFilters((prev) => ({
                      ...prev,
                      direction: e.target.value as "asc" | "desc",
                    }))
                  }
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>

              {!authenticated && (
                <p className="text-white/70 mt-4">
                  Please connect your wallet to view your created bounties.
                </p>
              )}
            </div>

            <div className="space-y-4">
              {myBountiesLoading ? (
                <div className="text-center py-8">Loading your bounties...</div>
              ) : myBounties.length === 0 ? (
                <div className="text-center py-8 text-white/70">
                  {authenticated
                    ? "You haven't created any bounties yet."
                    : "Please log in to view your bounties."}
                </div>
              ) : (
                myBounties.map((bounty) => renderBountyCard(bounty, true))
              )}
            </div>
          </div>
        )}

        {/* Create Bounty Modal */}
        {showCreateBounty && selectedIssue && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="glass-card rounded-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold mb-4">Create Bounty</h3>
              <div className="mb-4">
                <p className="text-sm text-white/70 mb-2">Issue:</p>
                <p className="font-medium">{selectedIssue.title}</p>
                <p className="text-sm text-white/60">
                  {selectedIssue.repository?.full_name ||
                    (selectedIssue.repository_url
                      ? selectedIssue.repository_url
                          .split("/")
                          .slice(-2)
                          .join("/")
                      : "Unknown Repository")}
                  #{selectedIssue.number}
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Bounty Amount (USDC)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={bountyAmount}
                  onChange={(e) => setBountyAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter amount in USDC"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateBounty(false)}
                  className="flex-1 btn-secondary py-2"
                >
                  Cancel
                </button>
                <button
                  onClick={createBounty}
                  className="flex-1 btn-primary py-2"
                >
                  Create Bounty
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Bounty Modal */}
        {showEditBountyModal && editingBounty && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="glass-card rounded-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold mb-4">Edit Bounty Reward</h3>
              <div className="mb-4">
                <p className="text-sm text-white/70 mb-2">Issue:</p>
                <p className="font-medium">{editingBounty.title}</p>
                <p className="text-sm text-white/60">
                  {editingBounty.githubRepoOwner}/{editingBounty.githubRepoName}
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Bounty Amount (USDC)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={editBountyAmount}
                  onChange={(e) => setEditBountyAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter amount in USDC"
                />
                <p className="text-xs text-white/60 mt-2">
                  Note: Title and description are automatically synced from the
                  GitHub issue. The maintainer will manually send rewards to
                  solvers.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowEditBountyModal(false);
                    setEditingBounty(null);
                  }}
                  className="flex-1 btn-secondary py-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateBounty}
                  className="flex-1 btn-primary py-2"
                >
                  Update Reward
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
