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
    <article className="card p-4 sm:p-5">
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

      {bounty.status === "SOLVED" && bounty.solver && (
        <div className="mb-3 space-y-2 border-b border-line pb-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-subtle">Solved by:</span>
            {bounty.solver.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={bounty.solver.image}
                alt=""
                className="h-5 w-5 rounded-full"
              />
            )}
            <span className="font-medium text-brand-link">
              {bounty.solver.name || bounty.solver.username || "Anonymous"}
            </span>
          </div>
          {bounty.solver.username && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-subtle">GitHub:</span>
              <a
                href={`https://github.com/${bounty.solver.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                @{bounty.solver.username}
              </a>
            </div>
          )}
          {bounty.solver.walletAddress && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-subtle">Wallet:</span>
              <button
                type="button"
                onClick={() =>
                  handleCopyWallet(bounty.solver!.walletAddress!)
                }
                className="rounded font-mono text-success hover:underline"
                title="Click to copy full address"
                aria-label={`Copy wallet address ${bounty.solver.walletAddress}`}
              >
                {bounty.solver.walletAddress.slice(0, 6)}...
                {bounty.solver.walletAddress.slice(-4)}
              </button>
            </div>
          )}
        </div>
      )}

      {authenticated && (
        <div className="mb-3 border-b border-line pb-3">
          <BotInstallationStatus
            owner={bounty.githubRepoOwner}
            repo={bounty.githubRepoName}
          />
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="min-w-0 break-all text-sm text-subtle">
          {bounty.githubRepoOwner}/{bounty.githubRepoName}
        </span>
        <div className="flex flex-wrap gap-2">
          <a
            href={bounty.githubIssueUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            View Issue
          </a>
          {showManageButtons && bounty.status === "ACTIVE" ? (
            <>
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(bounty)}
                  className="btn btn-secondary btn-sm"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(bounty.id, bounty.title)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              )}
            </>
          ) : (
            <button
              type="button"
              onClick={handleSubmitSolution}
              className="btn btn-primary btn-sm"
            >
              Submit Solution
            </button>
          )}
        </div>
      </div>
    </article>
  );
});

BountyCard.displayName = "BountyCard";

export default BountyCard;
