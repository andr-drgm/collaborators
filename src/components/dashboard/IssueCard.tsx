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
    <article className="card p-4 sm:p-5">
      <div className="mb-2 flex items-start justify-between gap-4">
        <h3 className="min-w-0 flex-1 break-words text-lg font-semibold">
          {issue.title}
        </h3>
        <span className="shrink-0 text-sm text-subtle">#{issue.number}</span>
      </div>
      {issue.body && (
        <p className="mb-3 line-clamp-2 break-words text-sm text-muted">
          {issue.body}
        </p>
      )}

      {issue.labels.length > 0 && (
        <ul className="mb-3 flex flex-wrap gap-1" aria-label="Labels">
          {issue.labels.map((label) => (
            <li
              key={label.name}
              className="rounded-md px-2 py-0.5 text-xs font-medium"
              style={{
                backgroundColor: `#${label.color}26`,
                color: `#${label.color}`,
                border: `1px solid #${label.color}66`,
              }}
            >
              {label.name}
            </li>
          ))}
        </ul>
      )}

      {authenticated && repoOwner && repoName && (
        <div className="mb-3 border-b border-line pb-3">
          <BotInstallationStatus owner={repoOwner} repo={repoName} />
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="min-w-0 break-all text-sm text-subtle">
            {issue.repository?.full_name ||
              (issue.repository_url
                ? issue.repository_url.split("/").slice(-2).join("/")
                : "Unknown Repository")}
          </span>
          <span className="rounded-md bg-surface-strong px-2 py-0.5 text-xs capitalize text-muted">
            {issue.state}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={issue.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            View Issue
          </a>
          {onAddBounty && (
            <button
              type="button"
              onClick={() => onAddBounty(issue)}
              className="btn btn-primary btn-sm"
            >
              Add Bounty
            </button>
          )}
        </div>
      </div>
    </article>
  );
});

IssueCard.displayName = "IssueCard";

export default IssueCard;
