"use client";

import ProfileCard from "@/components/dashboard/ProfileCard";
import WalletConnect from "@/components/dashboard/WalletConnect";
import BotInstallationStatus from "@/components/BotInstallationStatus";
import { useState, useEffect, useCallback } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { getUserIssues } from "@/services/github";
import { usePrivyAuth } from "@/hooks/usePrivyAuth";

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
    walletAddress: string | null;
  };
  createdAt: string;
}

interface SolvedBounty extends Bounty {
  submissionId?: string;
  prUrl?: string;
  prNumber?: number;
  submissionStatus?: string;
  submissionCreatedAt?: string;
}

type TabType = "bounties" | "my-issues" | "solved-issues" | "my-bounties";

export default function Dashboard() {
  const router = useRouter();
  const { authenticated, getAccessToken, logout } = usePrivy();
  const { getGithubAccessToken, userData } = usePrivyAuth();

  // State for storing GitHub access token
  const [githubAccessToken, setGithubAccessToken] = useState<string | null>(
    null
  );

  const [activeTab, setActiveTab] = useState<TabType>("bounties");

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

  // Solved issues tab state
  const [solvedBounties, setSolvedBounties] = useState<SolvedBounty[]>([]);
  const [solvedBountiesLoading, setSolvedBountiesLoading] = useState(false);

  // Common state
  const [selectedIssue, setSelectedIssue] = useState<GitHubIssue | null>(null);
  const [bountyAmount, setBountyAmount] = useState("");
  const [showCreateBounty, setShowCreateBounty] = useState(false);

  // Edit bounty state
  const [editingBounty, setEditingBounty] = useState<Bounty | null>(null);
  const [editBountyAmount, setEditBountyAmount] = useState("");
  const [showEditBountyModal, setShowEditBountyModal] = useState(false);

  // Webhook installation banner state
  const [isWebhookSectionExpanded, setIsWebhookSectionExpanded] =
    useState(false);

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

  const loadSolvedBounties = useCallback(async () => {
    if (!authenticated) return;

    setSolvedBountiesLoading(true);
    try {
      const privyToken = await getAccessToken();
      if (!privyToken) {
        console.error("No Privy access token available. Please log in.");
        return;
      }

      const response = await fetch("/api/bounties/solved", {
        headers: {
          Authorization: `Bearer ${privyToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSolvedBounties(data);
      } else {
        console.error("Failed to load solved bounties");
      }
    } catch (error) {
      console.error("Error loading solved bounties:", error);
    } finally {
      setSolvedBountiesLoading(false);
    }
  }, [authenticated, getAccessToken]);

  // Redirect to main page if not authenticated
  useEffect(() => {
    if (authenticated === false) {
      router.push("/");
    }
  }, [authenticated, router]);

  // Load bounties
  useEffect(() => {
    loadBounties();
  }, [loadBounties]);

  // Try to get GitHub access token when component mounts
  useEffect(() => {
    const getToken = async () => {
      if (authenticated && !githubAccessToken) {
        const storedToken = localStorage.getItem("github_access_token");
        if (storedToken) {
          setGithubAccessToken(storedToken);
          return;
        }

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

    const handleTokenReceived = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { token } = customEvent.detail;
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

  // Load solved bounties when switching to solved-issues tab
  useEffect(() => {
    if (activeTab === "solved-issues" && authenticated) {
      loadSolvedBounties();
    }
  }, [activeTab, authenticated, loadSolvedBounties]);

  const createBounty = async () => {
    if (!selectedIssue || !bountyAmount || !authenticated) return;

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

  const handleLogout = async () => {
    logout();
    router.push("/");
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

      {bounty.status === "SOLVED" && bounty.solver && (
        <div className="mb-3 pb-3 border-b border-white/10">
          <div className="space-y-2">
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
            {bounty.solver.username && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-white/60">GitHub:</span>
                <a
                  href={`https://github.com/${bounty.solver.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 hover:underline"
                >
                  @{bounty.solver.username}
                </a>
              </div>
            )}
            {bounty.solver.walletAddress && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-white/60">Wallet:</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      bounty.solver!.walletAddress!
                    );
                    alert("Wallet address copied to clipboard!");
                  }}
                  className="text-green-400 font-mono hover:text-green-300 hover:underline cursor-pointer"
                  title="Click to copy full address"
                >
                  {bounty.solver.walletAddress.slice(0, 6)}...
                  {bounty.solver.walletAddress.slice(-4)}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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

  // Get user info for profile card from database
  const userImage = userData?.image || undefined;
  const userName = userData?.name || userData?.username || "User";
  const memberSince = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString()
    : undefined;

  // Show loading state while checking authentication
  if (authenticated === false) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/70">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 relative overflow-hidden">
      {/* Background gradient elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-5xl font-bold gradient-text">Dashboard</h1>
          <div className="flex items-center gap-4">
            <WalletConnect />
            {authenticated && (
              <button
                onClick={handleLogout}
                className="btn-secondary px-4 py-2 text-sm"
              >
                Logout
              </button>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <ProfileCard
          imageUrl={userImage}
          name={userName}
          username={userName}
          githubUsername={userData?.username}
          memberSince={memberSince}
          className="mb-12"
        />

        {/* GitHub Installation Banner */}
        <div className="glass-card rounded-2xl mb-8 border-l-4 border-l-blue-500">
          <div className="p-6">
            <button
              onClick={() =>
                setIsWebhookSectionExpanded(!isWebhookSectionExpanded)
              }
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Set Up GitHub Webhooks
              </h3>
              <svg
                className={`w-5 h-5 text-white/70 transform transition-transform ${
                  isWebhookSectionExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <p className="text-white/80 mt-2">
              Set up webhooks in your GitHub repositories to enable automatic
              bounty tracking.
            </p>
          </div>

          {isWebhookSectionExpanded && (
            <div className="px-6 pb-6 border-t border-white/10 pt-6">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="bg-white/5 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold mb-4 text-white">
                      Installation Steps:
                    </h4>
                    <ol className="space-y-3 text-white/80">
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">
                          1
                        </span>
                        <div>
                          Go to your repository settings:{" "}
                          <a
                            href="https://github.com/settings"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline"
                          >
                            github.com/settings
                          </a>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">
                          2
                        </span>
                        <div>
                          Navigate to{" "}
                          <span className="font-mono text-sm bg-white/10 px-2 py-1 rounded">
                            Settings → Webhooks → Add webhook
                          </span>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">
                          3
                        </span>
                        <div>
                          Set the Payload URL to:{" "}
                          <span className="font-mono text-sm bg-white/10 px-2 py-1 rounded break-all">
                            {typeof window !== "undefined"
                              ? window.location.origin
                              : "https://collaborators.build"}
                            /api/github/webhook
                          </span>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">
                          4
                        </span>
                        <div>
                          Set Content type to{" "}
                          <span className="font-mono text-sm bg-white/10 px-2 py-1 rounded">
                            application/json
                          </span>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">
                          5
                        </span>
                        <div>
                          Select the following events:{" "}
                          <span className="font-mono text-sm bg-white/10 px-2 py-1 rounded">
                            Issues
                          </span>{" "}
                          and{" "}
                          <span className="font-mono text-sm bg-white/10 px-2 py-1 rounded">
                            Pull requests
                          </span>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">
                          6
                        </span>
                        <div>
                          Add a webhook secret (optional but recommended) and
                          click{" "}
                          <span className="font-mono text-sm bg-white/10 px-2 py-1 rounded">
                            Add webhook
                          </span>
                        </div>
                      </li>
                    </ol>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-white/70 text-sm ml-2">
                    <li>Automatically track when issues are closed by PRs</li>
                    <li>Verify bounty solutions and release payments</li>
                    <li>Get notifications when solutions are submitted</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white/5 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("bounties")}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === "bounties"
                ? "bg-white/10 text-white"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            Bounties
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
            onClick={() => setActiveTab("solved-issues")}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === "solved-issues"
                ? "bg-white/10 text-white"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            Solved Issues
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

        {/* Bounties Tab */}
        {activeTab === "bounties" && (
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-2xl font-semibold mb-2">Active Bounties</h2>
              <p className="text-white/70 text-sm mb-4">
                Browse all available bounties. Find issues you can solve and
                earn USDC rewards.
              </p>

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

        {/* My Issues Tab */}
        {activeTab === "my-issues" && (
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-2xl font-semibold mb-2">My Issues</h2>
              <p className="text-white/70 text-sm mb-4">
                View all GitHub issues you&apos;ve opened. Monitor their status
                and see if anyone has added bounties.
              </p>

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
                  placeholder="Filter by labels"
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
              ) : myIssues.length === 0 ? (
                <div className="text-center py-8 text-white/70">
                  {authenticated
                    ? "You haven't created any issues yet."
                    : "Please log in to view your issues."}
                </div>
              ) : (
                myIssues.map((issue) => renderIssueCard(issue))
              )}
            </div>
          </div>
        )}

        {/* Solved Issues Tab */}
        {activeTab === "solved-issues" && (
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-2xl font-semibold mb-2">Solved Issues</h2>
              <p className="text-white/70 text-sm mb-4">
                Track all the bounties you&apos;ve successfully solved. View
                your submission history and approved solutions.
              </p>
            </div>

            <div className="space-y-4">
              {solvedBountiesLoading ? (
                <div className="text-center py-8">
                  Loading your solved bounties...
                </div>
              ) : solvedBounties.length === 0 ? (
                <div className="text-center py-8 text-white/70">
                  {authenticated
                    ? "You haven't solved any bounties yet."
                    : "Please log in to view your solved bounties."}
                </div>
              ) : (
                solvedBounties.map((bounty) => (
                  <div key={bounty.id} className="glass-card rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{bounty.title}</h3>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-400">
                          ${bounty.bountyAmount} USDC
                        </div>
                        <div className="text-xs text-white/60">
                          {bounty.status}
                        </div>
                      </div>
                    </div>
                    <p className="text-white/70 text-sm mb-3 line-clamp-2">
                      {bounty.description.substring(0, 150)}...
                    </p>

                    {bounty.prUrl && (
                      <div className="mb-3 pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-white/60">Your solution:</span>
                          <a
                            href={bounty.prUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 hover:underline"
                          >
                            PR #{bounty.prNumber}
                          </a>
                        </div>
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
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* My Bounties Tab */}
        {activeTab === "my-bounties" && (
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-2xl font-semibold mb-2">My Bounties</h2>
              <p className="text-white/70 text-sm mb-4">
                Manage all the bounties you&apos;ve created. Track submissions,
                approve solutions, and manage rewards.
              </p>

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
