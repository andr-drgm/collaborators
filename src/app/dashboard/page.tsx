"use client";

import ProfileCard from "@/components/dashboard/ProfileCard";
import WalletConnect from "@/components/dashboard/WalletConnect";
import IssueCard from "@/components/dashboard/IssueCard";
import BountyCard from "@/components/dashboard/BountyCard";
import { useState, useEffect, useCallback } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

const TABS: { id: TabType; label: string }[] = [
  { id: "bounties", label: "Bounties" },
  { id: "my-issues", label: "My Issues" },
  { id: "solved-issues", label: "Solved Issues" },
  { id: "my-bounties", label: "My Bounties" },
];

const WEBHOOK_BENEFITS = [
  "Automatically track when issues are closed by PRs",
  "Verify bounty solutions and release payments",
  "Get notifications when solutions are submitted",
];

// Loading skeleton, error, and empty placeholders shared by every dashboard list.
function ListState({
  loading,
  error,
  isEmpty,
  emptyTitle,
  emptyHint,
  onRetry,
  children,
}: {
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
  emptyTitle: string;
  emptyHint?: string;
  onRetry: () => void;
  children: React.ReactNode;
}) {
  if (loading) {
    return (
      <div className="space-y-4" role="status" aria-label="Loading">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card space-y-3 p-5" aria-hidden="true">
            <div className="flex justify-between gap-4">
              <div className="skeleton h-5 w-2/3"></div>
              <div className="skeleton h-5 w-20"></div>
            </div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-4/5"></div>
            <div className="flex justify-between gap-4 pt-2">
              <div className="skeleton h-4 w-32"></div>
              <div className="skeleton h-8 w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="card border-danger/40 p-8 text-center">
        <p className="font-medium text-danger">{error}</p>
        <p className="mt-1 text-sm text-subtle">
          Check your connection and try again.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="btn btn-secondary mt-4"
        >
          Try again
        </button>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="card border-dashed p-8 text-center sm:p-10">
        <p className="font-medium text-fg">{emptyTitle}</p>
        {emptyHint && <p className="mt-1 text-sm text-subtle">{emptyHint}</p>}
      </div>
    );
  }

  return <div className="space-y-4">{children}</div>;
}

export default function Dashboard() {
  const router = useRouter();
  const { authenticated, getAccessToken, logout } = usePrivy();
  const { userData } = usePrivyAuth();

  const [activeTab, setActiveTab] = useState<TabType>("bounties");

  // My issues tab state
  const [myIssues, setMyIssues] = useState<GitHubIssue[]>([]);
  const [myIssuesLoading, setMyIssuesLoading] = useState(false);
  const [myIssuesError, setMyIssuesError] = useState<string | null>(null);
  const [issueFilters, setIssueFilters] = useState({
    state: "open" as "open" | "closed" | "all",
    sort: "created" as "created" | "updated" | "comments",
    direction: "desc" as "asc" | "desc",
    labels: "",
  });

  // Bounties tab state
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [bountiesLoading, setBountiesLoading] = useState(true);
  const [bountiesError, setBountiesError] = useState<string | null>(null);
  const [bountyFilters, setBountyFilters] = useState({
    status: "ACTIVE" as "ACTIVE" | "SOLVED" | "EXPIRED" | "CANCELLED",
    sort: "created" as "created" | "amount",
    direction: "desc" as "asc" | "desc",
  });

  // My Bounties tab state
  const [myBounties, setMyBounties] = useState<Bounty[]>([]);
  const [myBountiesLoading, setMyBountiesLoading] = useState(false);
  const [myBountiesError, setMyBountiesError] = useState<string | null>(null);
  const [myBountyFilters, setMyBountyFilters] = useState({
    status: "all" as "all" | "ACTIVE" | "SOLVED" | "EXPIRED" | "CANCELLED",
    sort: "created" as "created" | "amount",
    direction: "desc" as "asc" | "desc",
  });

  // Solved issues tab state
  const [solvedBounties, setSolvedBounties] = useState<SolvedBounty[]>([]);
  const [solvedBountiesLoading, setSolvedBountiesLoading] = useState(false);
  const [solvedBountiesError, setSolvedBountiesError] = useState<
    string | null
  >(null);

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
    setBountiesLoading(true);
    setBountiesError(null);
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
      setBountiesError("We couldn't load bounties.");
    } finally {
      setBountiesLoading(false);
    }
  }, [bountyFilters.status, bountyFilters.sort, bountyFilters.direction]);

  const loadMyIssues = useCallback(async () => {
    if (!authenticated) return;

    setMyIssuesLoading(true);
    setMyIssuesError(null);
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
      setMyIssuesError("We couldn't load your GitHub issues.");
    } finally {
      setMyIssuesLoading(false);
    }
  }, [authenticated, issueFilters, getAccessToken]);

  const loadMyBounties = useCallback(async () => {
    if (!authenticated) return;

    setMyBountiesLoading(true);
    setMyBountiesError(null);
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
        setMyBountiesError("We couldn't load your bounties.");
      }
    } catch (error) {
      console.error("Error loading my bounties:", error);
      setMyBountiesError("We couldn't load your bounties.");
    } finally {
      setMyBountiesLoading(false);
    }
  }, [authenticated, myBountyFilters, getAccessToken]);

  const loadSolvedBounties = useCallback(async () => {
    if (!authenticated) return;

    setSolvedBountiesLoading(true);
    setSolvedBountiesError(null);
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
        setSolvedBountiesError("We couldn't load your solved bounties.");
      }
    } catch (error) {
      console.error("Error loading solved bounties:", error);
      setSolvedBountiesError("We couldn't load your solved bounties.");
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

  const handleLogout = useCallback(async () => {
    await logout();
    router.push("/");
  }, [logout, router]);

  // Memoized handlers with dependencies
  const memoizedHandleAddBounty = useCallback((issue: GitHubIssue) => {
    setSelectedIssue(issue);
    setShowCreateBounty(true);
  }, []);

  const memoizedHandleEdit = useCallback((bounty: Bounty) => {
    setEditingBounty(bounty);
    setEditBountyAmount(bounty.bountyAmount.toString());
    setShowEditBountyModal(true);
  }, []);

  const memoizedHandleDelete = useCallback(
    async (bountyId: string, bountyTitle: string) => {
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
          setBounties((prev) =>
            prev.filter((bounty) => bounty.id !== bountyId)
          );
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
    },
    [getAccessToken]
  );

  const memoizedHandleSubmitSolution = useCallback(
    async (bountyId: string, prUrl: string, prNumber: number) => {
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
    },
    [authenticated, getAccessToken]
  );

  const renderIssueCard = useCallback(
    (issue: GitHubIssue) => (
      <IssueCard
        key={issue.id}
        issue={issue}
        authenticated={authenticated}
        onAddBounty={memoizedHandleAddBounty}
      />
    ),
    [authenticated, memoizedHandleAddBounty]
  );

  const renderBountyCard = useCallback(
    (bounty: Bounty, showManageButtons = false) => (
      <BountyCard
        key={bounty.id}
        bounty={bounty}
        showManageButtons={showManageButtons}
        authenticated={authenticated}
        onEdit={memoizedHandleEdit}
        onDelete={memoizedHandleDelete}
        onSubmitSolution={memoizedHandleSubmitSolution}
      />
    ),
    [
      authenticated,
      memoizedHandleEdit,
      memoizedHandleDelete,
      memoizedHandleSubmitSolution,
    ]
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
      <div className="flex min-h-screen items-center justify-center bg-bg text-fg">
        <div role="status" className="flex items-center gap-3 text-muted">
          <span
            aria-hidden="true"
            className="h-5 w-5 animate-spin rounded-full border-2 border-line-strong border-t-brand-teal"
          ></span>
          Redirecting...
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg px-4 py-6 text-fg sm:px-8 sm:py-8">
      {/* Background gradient elements */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-20 right-20 h-64 w-64 rounded-full bg-brand-blue/10 blur-3xl"></div>
        <div className="absolute bottom-20 left-20 h-48 w-48 rounded-full bg-brand-teal/10 blur-3xl"></div>
      </div>

      <main className="relative z-10 mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="shrink-0 rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.svg"
                alt="Collaborators home"
                width={40}
                height={40}
                className="h-10 w-10"
              />
            </Link>
            <h1 className="gradient-text text-3xl font-bold tracking-tight sm:text-4xl">
              Dashboard
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <WalletConnect />
            {authenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-ghost"
              >
                Logout
              </button>
            )}
          </div>
        </header>

        {/* Profile Card */}
        <ProfileCard
          imageUrl={userImage}
          name={userName}
          username={userName}
          githubUsername={userData?.username}
          memberSince={memberSince}
          className="mb-10"
        />

        {/* GitHub Installation Banner */}
        <section className="card mb-8 border-l-4 border-l-brand-teal">
          <div className="p-5 sm:p-6">
            <h2 className="text-lg font-semibold sm:text-xl">
              <button
                type="button"
                onClick={() =>
                  setIsWebhookSectionExpanded(!isWebhookSectionExpanded)
                }
                aria-expanded={isWebhookSectionExpanded}
                aria-controls="webhook-setup"
                className="flex w-full items-center justify-between gap-3 rounded-lg text-left"
              >
                <span className="flex items-center gap-2">
                  <svg
                    className="h-6 w-6 shrink-0 text-brand-teal"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Set Up GitHub Webhooks
                </span>
                <svg
                  className={`h-5 w-5 shrink-0 text-muted transition-transform ${
                    isWebhookSectionExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </h2>
            <p className="mt-2 text-sm text-muted sm:text-base">
              Set up webhooks in your GitHub repositories to enable automatic
              bounty tracking.
            </p>
          </div>

          {isWebhookSectionExpanded && (
            <div
              id="webhook-setup"
              className="border-t border-line px-5 pt-6 pb-6 sm:px-6"
            >
              <div className="mb-4 rounded-xl bg-surface p-4">
                <h3 className="mb-4 font-semibold">Installation steps</h3>
                <ol className="space-y-3 text-muted">
                  <li className="flex gap-3">
                    <span className="step-num" aria-hidden="true">
                      1
                    </span>
                    <div className="min-w-0 pt-0.5">
                      Go to your repository settings:{" "}
                      <a
                        href="https://github.com/settings"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link"
                      >
                        github.com/settings
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="step-num" aria-hidden="true">
                      2
                    </span>
                    <div className="min-w-0 pt-0.5">
                      Navigate to{" "}
                      <span className="chip">
                        Settings → Webhooks → Add webhook
                      </span>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="step-num" aria-hidden="true">
                      3
                    </span>
                    <div className="min-w-0 pt-0.5">
                      Set the Payload URL to:{" "}
                      <span className="chip">
                        {typeof window !== "undefined"
                          ? window.location.origin
                          : "https://collaborators.build"}
                        /api/github/webhook
                      </span>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="step-num" aria-hidden="true">
                      4
                    </span>
                    <div className="min-w-0 pt-0.5">
                      Set Content type to{" "}
                      <span className="chip">application/json</span>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="step-num" aria-hidden="true">
                      5
                    </span>
                    <div className="min-w-0 pt-0.5">
                      Select the following events:{" "}
                      <span className="chip">Issues</span> and{" "}
                      <span className="chip">Pull requests</span>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="step-num" aria-hidden="true">
                      6
                    </span>
                    <div className="min-w-0 pt-0.5">
                      Paste the Collaborators webhook secret (required) and
                      click <span className="chip">Add webhook</span>
                    </div>
                  </li>
                </ol>
              </div>
              <ul className="ml-2 list-inside list-disc space-y-1 text-sm text-muted">
                {WEBHOOK_BENEFITS.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Dashboard sections"
          className="mb-8 grid grid-cols-2 gap-1 rounded-xl border border-line bg-surface p-1 sm:flex"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-surface-strong text-fg shadow-[inset_0_-2px_0_var(--color-brand-teal)]"
                  : "text-muted hover:bg-surface hover:text-fg"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bounties Tab */}
        {activeTab === "bounties" && (
          <section
            role="tabpanel"
            id="panel-bounties"
            aria-labelledby="tab-bounties"
            className="space-y-6"
          >
            <div className="card p-5 sm:p-6">
              <h2 className="mb-1 text-2xl font-semibold">Active Bounties</h2>
              <p className="mb-5 text-sm text-muted">
                Browse all available bounties. Find issues you can solve and
                earn USDC rewards.
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <label className="field-label">
                  Status
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
                    className="field"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="SOLVED">Solved</option>
                    <option value="EXPIRED">Expired</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </label>

                <label className="field-label">
                  Sort by
                  <select
                    value={bountyFilters.sort}
                    onChange={(e) =>
                      setBountyFilters((prev) => ({
                        ...prev,
                        sort: e.target.value as "created" | "amount",
                      }))
                    }
                    className="field"
                  >
                    <option value="created">Recently Created</option>
                    <option value="amount">Bounty Amount</option>
                  </select>
                </label>

                <label className="field-label">
                  Order
                  <select
                    value={bountyFilters.direction}
                    onChange={(e) =>
                      setBountyFilters((prev) => ({
                        ...prev,
                        direction: e.target.value as "asc" | "desc",
                      }))
                    }
                    className="field"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </label>
              </div>
            </div>

            <ListState
              loading={bountiesLoading}
              error={bountiesError}
              isEmpty={bounties.length === 0}
              emptyTitle={`No ${bountyFilters.status.toLowerCase()} bounties yet.`}
              emptyHint="Open the My Issues tab to put a bounty on one of your GitHub issues."
              onRetry={loadBounties}
            >
              {bounties.map((bounty) => renderBountyCard(bounty))}
            </ListState>
          </section>
        )}

        {/* My Issues Tab */}
        {activeTab === "my-issues" && (
          <section
            role="tabpanel"
            id="panel-my-issues"
            aria-labelledby="tab-my-issues"
            className="space-y-6"
          >
            <div className="card p-5 sm:p-6">
              <h2 className="mb-1 text-2xl font-semibold">My Issues</h2>
              <p className="mb-5 text-sm text-muted">
                View all GitHub issues you&apos;ve opened. Monitor their status
                and see if anyone has added bounties.
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <label className="field-label">
                  State
                  <select
                    value={issueFilters.state}
                    onChange={(e) =>
                      setIssueFilters((prev) => ({
                        ...prev,
                        state: e.target.value as "open" | "closed" | "all",
                      }))
                    }
                    className="field"
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="all">All</option>
                  </select>
                </label>

                <label className="field-label">
                  Sort by
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
                    className="field"
                  >
                    <option value="created">Recently Created</option>
                    <option value="updated">Recently Updated</option>
                    <option value="comments">Most Comments</option>
                  </select>
                </label>

                <label className="field-label">
                  Order
                  <select
                    value={issueFilters.direction}
                    onChange={(e) =>
                      setIssueFilters((prev) => ({
                        ...prev,
                        direction: e.target.value as "asc" | "desc",
                      }))
                    }
                    className="field"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </label>

                <label className="field-label">
                  Labels
                  <input
                    type="text"
                    placeholder="e.g. bug, help wanted"
                    value={issueFilters.labels}
                    onChange={(e) =>
                      setIssueFilters((prev) => ({
                        ...prev,
                        labels: e.target.value,
                      }))
                    }
                    className="field placeholder:text-subtle"
                  />
                </label>
              </div>

              {!authenticated && (
                <p className="mt-4 text-sm text-muted">
                  Please connect your wallet to view your issues.
                </p>
              )}
            </div>

            <ListState
              loading={myIssuesLoading}
              error={myIssuesError}
              isEmpty={myIssues.length === 0}
              emptyTitle={
                authenticated
                  ? "You haven't created any issues yet."
                  : "Please log in to view your issues."
              }
              emptyHint={
                authenticated
                  ? "Issues you open on GitHub will show up here."
                  : undefined
              }
              onRetry={loadMyIssues}
            >
              {myIssues.map((issue) => renderIssueCard(issue))}
            </ListState>
          </section>
        )}

        {/* Solved Issues Tab */}
        {activeTab === "solved-issues" && (
          <section
            role="tabpanel"
            id="panel-solved-issues"
            aria-labelledby="tab-solved-issues"
            className="space-y-6"
          >
            <div className="card p-5 sm:p-6">
              <h2 className="mb-1 text-2xl font-semibold">Solved Issues</h2>
              <p className="text-sm text-muted">
                Track all the bounties you&apos;ve successfully solved. View
                your submission history and approved solutions.
              </p>
            </div>

            <ListState
              loading={solvedBountiesLoading}
              error={solvedBountiesError}
              isEmpty={solvedBounties.length === 0}
              emptyTitle={
                authenticated
                  ? "You haven't solved any bounties yet."
                  : "Please log in to view your solved bounties."
              }
              emptyHint={
                authenticated
                  ? "Submit a pull request for an active bounty to get started."
                  : undefined
              }
              onRetry={loadSolvedBounties}
            >
              {solvedBounties.map((bounty) => (
                <article key={bounty.id} className="card p-4 sm:p-5">
                  <div className="mb-2 flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                    <h3 className="min-w-0 flex-1 break-words text-lg font-semibold">
                      {bounty.title}
                    </h3>
                    <div className="text-right">
                      <div className="text-lg font-bold text-success">
                        ${bounty.bountyAmount} USDC
                      </div>
                      <div className="text-xs font-medium uppercase tracking-wide text-subtle">
                        {bounty.status}
                      </div>
                    </div>
                  </div>
                  {bounty.description && (
                    <p className="mb-3 line-clamp-2 break-words text-sm text-muted">
                      {bounty.description}
                    </p>
                  )}

                  {bounty.prUrl && (
                    <div className="mb-3 flex items-center gap-2 border-b border-line pb-3 text-sm">
                      <span className="text-subtle">Your solution:</span>
                      <a
                        href={bounty.prUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link"
                      >
                        PR #{bounty.prNumber}
                      </a>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="min-w-0 break-all text-sm text-subtle">
                      {bounty.githubRepoOwner}/{bounty.githubRepoName}
                    </span>
                    <a
                      href={bounty.githubIssueUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      View Issue
                    </a>
                  </div>
                </article>
              ))}
            </ListState>
          </section>
        )}

        {/* My Bounties Tab */}
        {activeTab === "my-bounties" && (
          <section
            role="tabpanel"
            id="panel-my-bounties"
            aria-labelledby="tab-my-bounties"
            className="space-y-6"
          >
            <div className="card p-5 sm:p-6">
              <h2 className="mb-1 text-2xl font-semibold">My Bounties</h2>
              <p className="mb-5 text-sm text-muted">
                Manage all the bounties you&apos;ve created. Track submissions,
                approve solutions, and manage rewards.
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <label className="field-label">
                  Status
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
                    className="field"
                  >
                    <option value="all">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="SOLVED">Solved</option>
                    <option value="EXPIRED">Expired</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </label>

                <label className="field-label">
                  Sort by
                  <select
                    value={myBountyFilters.sort}
                    onChange={(e) =>
                      setMyBountyFilters((prev) => ({
                        ...prev,
                        sort: e.target.value as "created" | "amount",
                      }))
                    }
                    className="field"
                  >
                    <option value="created">Recently Created</option>
                    <option value="amount">Bounty Amount</option>
                  </select>
                </label>

                <label className="field-label">
                  Order
                  <select
                    value={myBountyFilters.direction}
                    onChange={(e) =>
                      setMyBountyFilters((prev) => ({
                        ...prev,
                        direction: e.target.value as "asc" | "desc",
                      }))
                    }
                    className="field"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </label>
              </div>

              {!authenticated && (
                <p className="mt-4 text-sm text-muted">
                  Please connect your wallet to view your created bounties.
                </p>
              )}
            </div>

            <ListState
              loading={myBountiesLoading}
              error={myBountiesError}
              isEmpty={myBounties.length === 0}
              emptyTitle={
                authenticated
                  ? "You haven't created any bounties yet."
                  : "Please log in to view your bounties."
              }
              emptyHint={
                authenticated
                  ? "Pick an issue in My Issues and click Add Bounty."
                  : undefined
              }
              onRetry={loadMyBounties}
            >
              {myBounties.map((bounty) => renderBountyCard(bounty, true))}
            </ListState>
          </section>
        )}

        {/* Create Bounty Modal */}
        {showCreateBounty && selectedIssue && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="create-bounty-title"
              className="card w-full max-w-md bg-bg/90 p-6"
            >
              <h2 id="create-bounty-title" className="mb-4 text-xl font-semibold">
                Create Bounty
              </h2>
              <div className="mb-4 rounded-xl border border-line bg-surface p-3">
                <p className="mb-1 text-xs font-medium text-subtle">Issue</p>
                <p className="break-words font-medium">{selectedIssue.title}</p>
                <p className="break-all text-sm text-subtle">
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
              <div className="mb-6">
                <label
                  htmlFor="create-bounty-amount"
                  className="mb-2 block text-sm font-medium"
                >
                  Bounty Amount (USDC)
                </label>
                <input
                  id="create-bounty-amount"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="1"
                  value={bountyAmount}
                  onChange={(e) => setBountyAmount(e.target.value)}
                  className="field placeholder:text-subtle"
                  placeholder="Enter amount in USDC"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateBounty(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={createBounty}
                  disabled={!bountyAmount}
                  className="btn btn-primary flex-1"
                >
                  Create Bounty
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Bounty Modal */}
        {showEditBountyModal && editingBounty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="edit-bounty-title"
              className="card w-full max-w-md bg-bg/90 p-6"
            >
              <h2 id="edit-bounty-title" className="mb-4 text-xl font-semibold">
                Edit Bounty Reward
              </h2>
              <div className="mb-4 rounded-xl border border-line bg-surface p-3">
                <p className="mb-1 text-xs font-medium text-subtle">Issue</p>
                <p className="break-words font-medium">{editingBounty.title}</p>
                <p className="break-all text-sm text-subtle">
                  {editingBounty.githubRepoOwner}/{editingBounty.githubRepoName}
                </p>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="edit-bounty-amount"
                  className="mb-2 block text-sm font-medium"
                >
                  Bounty Amount (USDC)
                </label>
                <input
                  id="edit-bounty-amount"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="1"
                  value={editBountyAmount}
                  onChange={(e) => setEditBountyAmount(e.target.value)}
                  aria-describedby="edit-bounty-note"
                  className="field placeholder:text-subtle"
                  placeholder="Enter amount in USDC"
                />
                <p id="edit-bounty-note" className="mt-2 text-xs text-subtle">
                  Note: Title and description are automatically synced from the
                  GitHub issue. The maintainer will manually send rewards to
                  solvers.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditBountyModal(false);
                    setEditingBounty(null);
                  }}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateBounty}
                  className="btn btn-primary flex-1"
                >
                  Update Reward
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
