"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { usePrivy } from "@privy-io/react-auth";

interface BotInstallationStatusProps {
  owner: string;
  repo: string;
  className?: string;
}

const BotInstallationStatus = memo(function BotInstallationStatus({
  owner,
  repo,
  className = "",
}: BotInstallationStatusProps) {
  const { authenticated, getAccessToken } = usePrivy();
  const [isInstalled, setIsInstalled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const checkInstallationStatus = useCallback(async () => {
    try {
      const token = await getAccessToken();
      if (!token) return;

      const response = await fetch(
        `/api/github/bot/installation?owner=${owner}&repo=${repo}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsInstalled(data.installed);
      }
    } catch (error) {
      console.error("Error checking bot installation:", error);
    } finally {
      setLoading(false);
    }
  }, [owner, repo, getAccessToken]);

  useEffect(() => {
    if (authenticated) {
      checkInstallationStatus();
    }
  }, [authenticated, checkInstallationStatus]);

  const markAsInstalled = useCallback(async () => {
    try {
      const token = await getAccessToken();
      if (!token) return;

      const response = await fetch("/api/github/bot/installation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ owner, repo }),
      });

      if (response.ok) {
        setIsInstalled(true);
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error marking bot as installed:", error);
    }
  }, [owner, repo, getAccessToken]);

  if (loading) {
    return (
      <div
        role="status"
        className={`flex items-center gap-2 text-sm text-subtle ${className}`}
      >
        <span className="skeleton h-4 w-4 rounded-full"></span>
        Checking bot status...
      </div>
    );
  }

  const steps = [
    <>
      Go to your repository settings:{" "}
      <a
        href={`https://github.com/${owner}/${repo}/settings`}
        target="_blank"
        rel="noopener noreferrer"
        className="link break-all"
      >
        {owner}/{repo}/settings
      </a>
    </>,
    <>
      Navigate to <span className="chip">Settings → Webhooks → Add webhook</span>
    </>,
    <>
      Set the Payload URL to:{" "}
      <span className="chip">{typeof window !== "undefined" ? window.location.origin : ""}/api/github/webhook</span>
    </>,
    <>
      Set Content type to <span className="chip">application/json</span>
    </>,
    <>
      Select the following events: <span className="chip">Issues</span> and{" "}
      <span className="chip">Pull requests</span>
    </>,
    <>
      Add a webhook secret (optional but recommended) and click{" "}
      <span className="chip">Add webhook</span>
    </>,
  ];

  return (
    <>
      {isInstalled ? (
        <div className={`flex flex-wrap items-center gap-3 ${className}`}>
          <div className="flex items-center gap-2 text-success">
            <svg
              className="h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium">Bot Installed</span>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="btn btn-ghost btn-sm"
          >
            View Instructions
          </button>
        </div>
      ) : (
        <div className={`flex flex-wrap items-center gap-3 ${className}`}>
          <div className="flex items-center gap-2 text-warning">
            <svg
              className="h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium">Bot Not Installed</span>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="btn btn-primary btn-sm"
          >
            Install Bot
          </button>
        </div>
      )}

      {/* Installation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`bot-modal-${owner}-${repo}`}
            className="card max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-bg/90 p-5 sm:p-6"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <h2
                id={`bot-modal-${owner}-${repo}`}
                className="text-xl font-semibold sm:text-2xl"
              >
                Install GitHub Bot
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                aria-label="Close"
                className="btn btn-ghost btn-sm px-2"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <p className="mb-4 text-fg/90">
                  To track issue fixes automatically, you need to install our
                  GitHub bot on your repository. This will allow us to:
                </p>
                <ul className="ml-2 list-inside list-disc space-y-2 text-muted">
                  <li>Automatically add labels to issues with bounties</li>
                  <li>Track when pull requests fix bounty issues</li>
                  <li>Mark bounties as solved when issues are closed</li>
                  <li>Verify submissions automatically</li>
                </ul>
              </div>

              <div className="rounded-xl border border-line bg-surface p-4">
                <h3 className="mb-3 font-semibold">Installation steps</h3>
                <ol className="space-y-3 text-muted">
                  {steps.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="step-num" aria-hidden="true">
                        {i + 1}
                      </span>
                      <div className="min-w-0 pt-0.5">{step}</div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex flex-col gap-3 border-t border-line pt-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-ghost sm:flex-1"
                >
                  Cancel
                </button>
                <a
                  href={`https://github.com/${owner}/${repo}/settings/hooks/new`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary sm:flex-1"
                >
                  Go to Webhook Settings
                </a>
                {!isInstalled && (
                  <button
                    type="button"
                    onClick={markAsInstalled}
                    className="btn btn-primary sm:flex-1"
                  >
                    I&apos;ve Installed It
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

BotInstallationStatus.displayName = "BotInstallationStatus";

export default BotInstallationStatus;
