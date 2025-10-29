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
      <div className={`text-sm text-white/60 ${className}`}>
        Checking bot status...
      </div>
    );
  }

  if (isInstalled) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-2 text-green-400">
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
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
          onClick={() => setShowModal(true)}
          className="text-xs text-white/70 hover:text-white underline"
        >
          View Instructions
        </button>
      </div>
    );
  }

  return (
    <>
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex items-center gap-2 text-yellow-400">
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
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
          onClick={() => setShowModal(true)}
          className="btn-primary px-4 py-2 text-sm"
        >
          Install Bot
        </button>
      </div>

      {/* Installation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-semibold">Install GitHub Bot</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/70 hover:text-white"
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
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-white/90 mb-4">
                  To track issue fixes automatically, you need to install our
                  GitHub bot on your repository. This will allow us to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-white/80 mb-4 ml-2">
                  <li>Automatically add labels to issues with bounties</li>
                  <li>Track when pull requests fix bounty issues</li>
                  <li>Mark bounties as solved when issues are closed</li>
                  <li>Verify submissions automatically</li>
                </ul>
              </div>

              <div className="border border-white/20 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Installation Steps:</h4>
                <ol className="space-y-3 text-white/80">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">
                      1
                    </span>
                    <div>
                      Go to your repository settings:{" "}
                      <a
                        href={`https://github.com/${owner}/${repo}/settings`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        {owner}/{repo}/settings
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
                        {window.location.origin}/api/github/webhook
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
                      Add a webhook secret (optional but recommended) and click{" "}
                      <span className="font-mono text-sm bg-white/10 px-2 py-1 rounded">
                        Add webhook
                      </span>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/20">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-secondary py-3"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    window.open(
                      `https://github.com/${owner}/${repo}/settings/hooks/new`,
                      "_blank"
                    );
                  }}
                  className="flex-1 btn-primary py-3"
                >
                  Go to Webhook Settings
                </button>
                <button
                  onClick={markAsInstalled}
                  className="flex-1 btn-primary py-3"
                >
                  I&apos;ve Installed It
                </button>
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
