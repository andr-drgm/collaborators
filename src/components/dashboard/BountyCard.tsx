"use client";

import { memo, useCallback } from "react";
import BotInstallationStatus from "@/components/BotInstallationStatus";

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

interface BountyCardProps {
  bounty: Bounty;
  showManageButtons: boolean;
  authenticated: boolean;
  onEdit?: (bounty: Bounty) => void;
  onDelete?: (bountyId: string, bountyTitle: string) => void;
  onSubmitSolution?: (
    bountyId: string,
    prUrl: string,
    prNumber: number
  ) => void;
}

const BountyCard = memo(function BountyCard({
  bounty,
  showManageButtons,
  authenticated,
  onEdit,
  onDelete,
  onSubmitSolution,
}: BountyCardProps) {
  const extractPrNumberFromUrl = useCallback((url: string): number | null => {
    const match = url.match(/\/pull\/(\d+)/);
    return match ? parseInt(match[1]) : null;
  }, []);

  const handleSubmitSolution = useCallback(() => {
    if (!onSubmitSolution) return;
    const prUrl = prompt("Enter your PR URL:");
    if (prUrl) {
      const prNumber = extractPrNumberFromUrl(prUrl);
      if (prNumber) {
        onSubmitSolution(bounty.id, prUrl, prNumber);
      } else {
        alert(
          "Invalid PR URL. Please enter a valid GitHub PR URL (e.g., https://github.com/owner/repo/pull/123)"
        );
      }
    }
  }, [onSubmitSolution, bounty.id, extractPrNumberFromUrl]);

  const handleCopyWallet = useCallback((address: string) => {
    navigator.clipboard.writeText(address);
    alert("Wallet address copied to clipboard!");
  }, []);

  return (
    <div className="glass-card rounded-xl p-4">
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
                  onClick={() =>
                    handleCopyWallet(bounty.solver!.walletAddress!)
                  }
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
              {onEdit && (
                <button
                  onClick={() => onEdit(bounty)}
                  className="btn-primary px-3 py-1 text-sm"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(bounty.id, bounty.title)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded-lg transition-colors"
                >
                  Delete
                </button>
              )}
            </>
          ) : (
            <button
              onClick={handleSubmitSolution}
              className="btn-primary px-3 py-1 text-sm"
            >
              Submit Solution
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

BountyCard.displayName = "BountyCard";

export default BountyCard;
