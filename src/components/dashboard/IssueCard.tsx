"use client";

import { memo } from "react";
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

interface IssueCardProps {
  issue: GitHubIssue;
  authenticated: boolean;
  onAddBounty?: (issue: GitHubIssue) => void;
}

const IssueCard = memo(function IssueCard({
  issue,
  authenticated,
  onAddBounty,
}: IssueCardProps) {
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
    <div className="glass-card rounded-xl p-4">
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
          {onAddBounty && (
            <button
              onClick={() => onAddBounty(issue)}
              className="btn-primary px-3 py-1 text-sm"
            >
              Add Bounty
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

IssueCard.displayName = "IssueCard";

export default IssueCard;
