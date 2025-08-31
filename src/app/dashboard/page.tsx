"use client";

import { useState, useEffect } from "react";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey, Transaction } from "@solana/web3.js";
import {
  createMintToInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction, // <-- Add this import
} from "@solana/spl-token";
import bs58 from "bs58";
import { WalletSendTransactionError } from "@solana/wallet-adapter-base"; // <-- Import specific error type
import ProfileCard from "@/components/dashboard/ProfileCard";

import { useRouter } from "next/navigation";
import WalletConnect from "@/components/dashboard/WalletConnect";
import { useSession } from "next-auth/react";

import { signOut } from "next-auth/react";
import { getCommits } from "@/services/github";
import ProjectModal from "@/components/ProjectModal";

const colors = ["#ebf6ff", "#7dd3fc", "#38bdf8", "#0ea5e9", "#0369a1"];

export default function Dashboard() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);
  const [tokensClaimed, setTokensClaimed] = useState<number>(0);
  const [showHelp, setShowHelp] = useState<string | null>(null);
  const navigate = useRouter();
  const { connection } = useConnection();
  const { publicKey, sendTransaction, disconnect } = useWallet();
  const { data: session, status: sessionStatus } = useSession();

  // --- NEW: loading state ---
  const [loading, setLoading] = useState(false);

  // --- NEW STATE for API data ---
  const [commitData, setCommitData] = useState<{ date: Date; count: number }[]>(
    []
  );
  const [totalCommits, setTotalCommits] = useState(0);
  const [tokensHeld, setTokensHeld] = useState(0);

  // Project management state
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<{
    id: string;
    name: string;
    owner: string;
    repo: string;
  } | null>(null);
  const [userProjects, setUserProjects] = useState<any[]>([]);

  // --- FETCH USER PROJECTS ---
  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        const response = await fetch("/api/projects/user");
        if (response.ok) {
          const projects = await response.json();
          setUserProjects(projects);

          // Auto-select the first project if user has projects but none selected
          if (projects.length > 0 && !selectedProject) {
            setSelectedProject({
              id: projects[0].id,
              name: projects[0].name,
              owner: projects[0].owner,
              repo: projects[0].repo,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user projects:", error);
      }
    };

    if (sessionStatus === "authenticated") {
      fetchUserProjects();
    }
  }, [sessionStatus, selectedProject]);

  // --- FETCH GITHUB COMMITS DATA ---
  useEffect(() => {
    const fetchCommits = async () => {
      try {
        setLoading(true);
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

        setCommitData(transformedData);
        setTotalCommits(commits.length);

        // Calculate tokens based on total commits (1 token per commit for now)
        setTokensHeld(commits.length);
      } catch (error) {
        console.error("Error fetching commits:", error);
        // Fallback to empty data
        setCommitData([]);
        setTotalCommits(0);
        setTokensHeld(0);
      } finally {
        setLoading(false);
      }
    };

    if (sessionStatus === "authenticated") {
      fetchCommits();
    }
  }, [sessionStatus, selectedProject]);

  // --- LOADING STATE FOR SESSION ---
  useEffect(() => {
    if (sessionStatus === "loading") setLoading(true);
    else if (sessionStatus === "unauthenticated") {
      setLoading(false);
      // Redirect to login if not authenticated
      navigate.push("/");
    }
  }, [sessionStatus, navigate]);

  const handleClaimTokens = async () => {
    if (!publicKey || !sendTransaction) {
      alert("Wallet not connected!");
      return;
    }
    if (!process.env.REACT_APP_MINT_AUTHORITY_SECRET_KEY) {
      console.error("Mint authority secret key environment variable not set!");
      alert(
        "Configuration error: Mint authority not set. Please contact support."
      );
      return;
    }
    if (tokensHeld <= 0) {
      alert("No tokens available to claim.");
      return;
    }

    try {
      const mintAddress = new PublicKey(
        "H4bLS9gYGfrHL2CfbtqRf4HhixyXqEXoinFExBdvMrkT"
      ); // Your token mint address
      const mintAuthority = Keypair.fromSecretKey(
        bs58.decode(process.env.REACT_APP_MINT_AUTHORITY_SECRET_KEY)
      );

      // 1. Get or derive the associated token account address
      const userTokenAccount = await getAssociatedTokenAddress(
        mintAddress, // mint address
        publicKey // owner address
      );

      const transaction = new Transaction();
      let signature = "";

      // 2. Check if the associated token account exists
      const accountInfo = await connection.getAccountInfo(userTokenAccount);

      if (!accountInfo) {
        console.log("Associated token account not found. Creating it...");
        // Add instruction to create the account if it doesn't exist
        transaction.add(
          createAssociatedTokenAccountInstruction(
            publicKey, // Payer (who pays for the creation)
            userTokenAccount, // Address of the account to create
            publicKey, // Owner of the new account
            mintAddress // Mint address
          )
        );
      }

      // 3. Add the mint instruction
      const amountToMint = tokensHeld * Math.pow(10, 9); // Adjust decimals if needed (e.g., 9 for USDC)
      transaction.add(
        createMintToInstruction(
          mintAddress, // Mint address
          userTokenAccount, // Destination account
          mintAuthority.publicKey, // Mint authority
          amountToMint // Amount to mint (in smallest units)
        )
      );

      // 4. Set recent blockhash and fee payer
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // 5. Partially sign with the mint authority's keypair
      //    The user's wallet will provide the other signature (as fee payer)
      transaction.partialSign(mintAuthority);

      // 6. Send the transaction for the user to approve via their wallet
      console.log("Sending transaction for user approval...");
      signature = await sendTransaction(transaction, connection);
      console.log("Transaction sent with signature:", signature);

      // 7. Confirm the transaction
      await connection.confirmTransaction(signature, "confirmed");
      console.log("Transaction confirmed!");

      alert(`Tokens minted successfully! Signature: ${signature}`);
      setTokensClaimed((prev) => prev + tokensHeld);
      setTokensHeld(0); // Reset tokens held after successful claim
    } catch (error) {
      console.error("Mint failed:", error);

      // Provide more specific error messages
      let errorMessage = "Token mint failed. ";
      if (error instanceof WalletSendTransactionError) {
        // Errors from the wallet adapter/wallet interaction
        errorMessage += `Wallet Error: ${error.message}`;
        if (error.message.includes("User rejected the request")) {
          errorMessage = "Transaction rejected by user.";
        } else if (error.message.includes("RPC")) {
          errorMessage += " (Check RPC connection)";
        }
      } else if (error instanceof Error) {
        // General JavaScript errors
        errorMessage += error.message;
      } else {
        errorMessage += "An unknown error occurred.";
      }
      alert(errorMessage);
    }
  };

  const handleLogout = () => {
    disconnect();
    signOut({ redirectTo: "/" });
  };

  const handleProjectSelect = (project: any) => {
    setSelectedProject({
      id: project.id,
      name: project.name,
      owner: project.owner,
      repo: project.repo,
    });
    setShowProjectModal(false);
  };

  const helpContent = {
    wallet:
      "Need help setting up your wallet? We support Phantom, Solflare, and other Solana wallets. Make sure you have some SOL for transaction fees.",
    commits:
      "This chart shows your GitHub contribution activity. Darker colors indicate more commits on that day. Hover over squares to see details.",
    tokens:
      "Tokens are earned based on your GitHub contributions. Each meaningful contribution (commits, PRs, reviews) earns you SOL tokens that you can claim to your wallet.",
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 relative overflow-hidden">
      {/* Background gradient elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <button
              className="btn-secondary px-4 py-2 text-sm"
              onClick={handleLogout}
            >
              &larr; Log Out
            </button>
            <h1 className="text-5xl font-bold gradient-text">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowProjectModal(true)}
              className="btn-primary px-6 py-3 text-sm font-semibold"
            >
              Manage Projects
            </button>
            <WalletConnect />
          </div>
        </div>

        {/* Onboarding Banner with liquid glass */}
        {!publicKey && (
          <div className="mb-10 liquid-glass rounded-2xl p-6 transition-all duration-500 hover:liquid-glass-hover">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-200 text-lg">
                  Connect Your Wallet to Start Earning
                </h3>
                <p className="text-blue-300 text-sm">
                  Link your Solana wallet to claim SOL tokens for your GitHub
                  contributions
                </p>
              </div>
              <button
                className="btn-primary px-6 py-3 text-sm"
                onClick={() => setShowHelp("wallet")}
              >
                Need Help?
              </button>
            </div>
          </div>
        )}

        {/* Profile Card */}
        <ProfileCard
          imageUrl={session?.user?.image}
          name={session?.user?.name}
          username={session?.user.tokens.toString()}
          memberSince={
            session?.user?.createdAt
              ? new Date(session.user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : ""
          }
          className="mb-12"
        />

        {/* Main Grid */}
        <div>
          {/* Loading Overlay */}
          {loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
              <div className="liquid-glass rounded-3xl p-12 flex flex-col items-center">
                <div className="mb-6">
                  <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent border-b-transparent rounded-full animate-spin"></div>
                </div>
                <span className="text-xl text-blue-200 font-semibold">
                  Loading dashboard...
                </span>
              </div>
            </div>
          )}

          {/* Project Selector - Only show if user has assigned projects */}
          {userProjects.length > 0 && (
            <div className="w-full flex justify-center mb-8">
              <div className="liquid-glass p-6 rounded-2xl border border-white/10 max-w-2xl w-full">
                <div className="flex items-center gap-4">
                  <label className="text-white/80 font-medium">
                    Current Project:
                  </label>
                  <select
                    value={selectedProject?.id || ""}
                    onChange={(e) => {
                      const project = userProjects.find(
                        (p) => p.id === e.target.value
                      );
                      if (project) {
                        setSelectedProject({
                          id: project.id,
                          name: project.name,
                          owner: project.owner,
                          repo: project.repo,
                        });
                      } else {
                        setSelectedProject(null);
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                  >
                    {userProjects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name} ({project.owner}/{project.repo})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Chart Section - Only show if user has assigned projects */}
          {userProjects.length > 0 && (
            <div className="w-full flex flex-col items-center mb-12">
              <div className="relative w-full max-w-7xl">
                {/* Chart Header with Help */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold gradient-text">
                    Contribution Activity
                    {selectedProject && (
                      <span className="text-lg text-blue-300 ml-3">
                        - {selectedProject.name}
                      </span>
                    )}
                  </h2>
                  <button
                    className="text-white/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                    onMouseEnter={() => setShowHelp("commits")}
                    onMouseLeave={() => setShowHelp(null)}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>

                {/* Chart Container with liquid glass */}
                <div className="liquid-glass rounded-3xl p-8 transition-all duration-500 hover:liquid-glass-hover">
                  {/* Month Labels */}
                  <div className="flex pl-12 pr-2 mb-3 text-sm text-white/60 font-medium select-none w-full">
                    {(() => {
                      // Calculate the week index for each month start
                      const year = new Date().getFullYear();
                      const weeks: {
                        month: string;
                        weekIndex: number;
                      }[] = [];
                      for (let m = 0; m < 12; m++) {
                        const firstDayOfMonth = new Date(year, m, 1);
                        const startOfYear = new Date(year, 0, 1);
                        // Calculate week index (Monday as first day)
                        const dayOffset =
                          startOfYear.getDay() === 0
                            ? 6
                            : startOfYear.getDay() - 1;
                        const daysSinceYearStart = Math.floor(
                          (firstDayOfMonth.getTime() - startOfYear.getTime()) /
                            (1000 * 60 * 60 * 24)
                        );
                        const weekIndex = Math.floor(
                          (daysSinceYearStart + dayOffset) / 7
                        );
                        weeks.push({
                          month: firstDayOfMonth.toLocaleString("en-US", {
                            month: "short",
                          }),
                          weekIndex,
                        });
                      }
                      // Render month labels with correct spacing
                      return weeks.map((w, i) => {
                        const nextWeek = weeks[i + 1]?.weekIndex ?? 53;
                        const colSpan = nextWeek - w.weekIndex;
                        return (
                          <div
                            key={w.month}
                            className="text-center"
                            style={{
                              minWidth: `calc(${colSpan} * 1fr)`,
                              flex: colSpan,
                            }}
                          >
                            {w.month}
                          </div>
                        );
                      });
                    })()}
                  </div>
                  <div className="flex">
                    {/* Weekday Labels */}
                    <div className="flex flex-col mr-3 text-sm text-white/60 font-medium select-none">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                        (d) => (
                          <div
                            key={d}
                            className="h-[24px] flex items-center justify-center"
                            style={{
                              lineHeight: "24px",
                              height: "28px",
                            }}
                          >
                            {d}
                          </div>
                        )
                      )}
                    </div>
                    {/* Contribution Grid */}
                    <div className="flex-1">
                      <div
                        className="relative grid grid-flow-col gap-[4px] w-full"
                        style={{
                          gridTemplateRows: "repeat(7, 1fr)",
                          gridTemplateColumns: "repeat(53, 1fr)",
                          height: "168px",
                        }}
                      >
                        {Array.from({ length: 53 }).map((_, weekIndex) =>
                          Array.from({ length: 7 }).map((_, dayIndex) => {
                            // Calculate the date for this cell
                            const year = new Date().getFullYear();
                            const startOfYear = new Date(year, 0, 1);
                            const dayOffset =
                              startOfYear.getDay() === 0
                                ? 6
                                : startOfYear.getDay() - 1;
                            const cellDate = new Date(startOfYear);
                            cellDate.setDate(
                              cellDate.getDate() -
                                dayOffset +
                                weekIndex * 7 +
                                dayIndex
                            );

                            // --- USE commitData INSTEAD OF mockCommitData ---
                            const dayData = commitData.find(
                              (d) =>
                                d.date.getFullYear() ===
                                  cellDate.getFullYear() &&
                                d.date.getMonth() === cellDate.getMonth() &&
                                d.date.getDate() === cellDate.getDate()
                            );
                            const count = dayData ? dayData.count : 0;

                            return (
                              <div
                                key={weekIndex + "-" + dayIndex}
                                className="rounded-[3px] cursor-pointer relative transition-all duration-200"
                                style={{
                                  backgroundColor: colors[Math.min(count, 4)],
                                  width: "100%",
                                  height: "24px",
                                  opacity:
                                    hoveredWeek === null
                                      ? count === 0
                                        ? 0.4
                                        : 1
                                      : weekIndex === hoveredWeek
                                      ? 1
                                      : 0.4,
                                }}
                                onMouseEnter={() => {
                                  setActiveIndex(weekIndex * 7 + dayIndex);
                                  setHoveredWeek(weekIndex);
                                }}
                                onMouseLeave={() => {
                                  setActiveIndex(null);
                                  setHoveredWeek(null);
                                }}
                              >
                                {activeIndex === weekIndex * 7 + dayIndex && (
                                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 liquid-glass p-4 rounded-xl text-sm text-white border border-white/20 z-30 min-w-[160px] shadow-2xl">
                                    <div className="font-semibold text-lg">
                                      {count} commits
                                    </div>
                                    <div className="text-white/70">
                                      {cellDate.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                        {/* Week highlight */}
                        {hoveredWeek !== null && (
                          <div
                            className="absolute top-0 pointer-events-none"
                            style={{
                              left: `calc(${hoveredWeek} * (100% / 53))`,
                              width: `calc(100% / 53)`,
                              height: "calc(100% + 24px)",
                              border: "2px solid #38bdf8",
                              borderRadius: "8px",
                              boxShadow: "0 0 16px #38bdf8aa",
                              zIndex: 10,
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Legend */}
                  <div className="flex items-center justify-center gap-3 text-sm mt-8 w-full">
                    <span className="text-white/60">Less</span>
                    <div className="flex items-center gap-1">
                      {colors.map((color, i) => (
                        <div
                          key={i}
                          className="w-5 h-5 rounded-[3px]"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="text-white/60">More</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* No Projects Message - Show when user has no assigned projects */}
          {userProjects.length === 0 && (
            <div className="w-full flex justify-center mb-12">
              <div className="liquid-glass p-8 rounded-2xl border border-white/10 max-w-2xl w-full text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No Projects Assigned
                </h3>
                <p className="text-white/70 mb-6">
                  You haven't been assigned to any projects yet. Discover and
                  join projects to start tracking your contributions.
                </p>
                <button
                  onClick={() => setShowProjectModal(true)}
                  className="btn-primary px-6 py-3 text-sm font-semibold"
                >
                  Discover Projects
                </button>
              </div>
            </div>
          )}

          {/* Stats Section - Below Chart */}
          <div className="w-full flex justify-center">
            <div className="liquid-glass p-8 rounded-3xl shadow-2xl w-full max-w-5xl transition-all duration-500 hover:liquid-glass-hover">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold gradient-text">
                  Developer Stats
                </h2>
                <button
                  className="text-white/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                  onMouseEnter={() => setShowHelp("tokens")}
                  onMouseLeave={() => setShowHelp(null)}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Total Commits Card */}
                <div className="glass-card p-8 rounded-2xl border border-white/10 hover:glass-card-hover transition-all duration-500 group">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle cx="7" cy="7" r="3" fill="#0ea5e9" />
                        <circle cx="17" cy="17" r="3" fill="#0369a1" />
                        <path
                          d="M7 10v2a5 5 0 0 0 5 5h2"
                          stroke="#7dd3fc"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg text-white/70 font-medium">
                        Total Commits
                      </p>
                      <p className="text-4xl font-bold text-white">
                        {totalCommits}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tokens Held Card */}
                <div className="glass-card p-8 rounded-2xl border border-white/10 hover:glass-card-hover transition-all duration-500 group">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          fill="#7dd3fc"
                          stroke="#0369a1"
                          strokeWidth="2"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="5"
                          fill="#38bdf8"
                          stroke="#0ea5e9"
                          strokeWidth="2"
                        />
                        <path
                          d="M12 7v2M12 15v2M7 12h2M15 12h2"
                          stroke="#0369a1"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg text-white/70 font-medium">
                        Tokens Held
                      </p>
                      <p className="text-4xl font-bold text-white">
                        {tokensHeld}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tokens Claimed Card */}
                <div className="glass-card p-8 rounded-2xl border border-white/10 hover:glass-card-hover transition-all duration-500 group">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          fill="#ebf6ff"
                          stroke="#38bdf8"
                          strokeWidth="2"
                        />
                        <path
                          d="M9 12l2 2 4-4"
                          stroke="#0ea5e9"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="5"
                          fill="none"
                          stroke="#7dd3fc"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg text-white/70 font-medium">
                        Tokens Claimed
                      </p>
                      <p className="text-4xl font-bold text-white">
                        {tokensClaimed}
                      </p>
                    </div>
                  </div>
                  <button
                    className="w-full mt-6 btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    onClick={handleClaimTokens}
                    disabled={!tokensHeld || !publicKey}
                  >
                    {!publicKey
                      ? "Connect Wallet to Claim"
                      : "Claim All Tokens"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Help Tooltips */}
          {showHelp && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="liquid-glass border border-white/20 rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white gradient-text">
                    Help & Tips
                  </h3>
                  <button
                    onClick={() => setShowHelp(null)}
                    className="text-white/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-white/80 text-base leading-relaxed">
                  {helpContent[showHelp as keyof typeof helpContent]}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onProjectSelect={handleProjectSelect}
      />
    </div>
  );
}
