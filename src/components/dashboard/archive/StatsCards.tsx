"use client";

import TokenClaimButton from "./TokenClaimButton";

interface StatsCardsProps {
  totalCommits: number;
  tokensHeld: number;
  tokensClaimed: number;
  onTokensClaimed: (amount: number) => void;
  onShowHelp?: (helpType: string) => void;
}

export default function StatsCards({
  totalCommits,
  tokensHeld,
  tokensClaimed,
  onTokensClaimed,
  onShowHelp,
}: StatsCardsProps) {
  return (
    <div className="w-full flex justify-center">
      <div className="liquid-glass p-8 rounded-3xl shadow-2xl w-full max-w-5xl transition-all duration-500 hover:liquid-glass-hover">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold gradient-text">
            Developer Stats
          </h2>
          {onShowHelp && (
            <button
              className="text-white/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
              onMouseEnter={() => onShowHelp("tokens")}
              onMouseLeave={() => onShowHelp("")}
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
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Total Commits Card */}
          <div className="glass-card p-8 rounded-2xl border border-white/10 hover:glass-card-hover transition-all duration-500 group">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
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
                <p className="text-4xl font-bold text-white">{totalCommits}</p>
              </div>
            </div>
          </div>

          {/* Tokens Held Card */}
          <div className="glass-card p-8 rounded-2xl border border-white/10 hover:glass-card-hover transition-all duration-500 group">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
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
                <p className="text-lg text-white/70 font-medium">Tokens Held</p>
                <p className="text-4xl font-bold text-white">{tokensHeld}</p>
              </div>
            </div>
          </div>

          {/* Tokens Claimed Card */}
          <div className="glass-card p-8 rounded-2xl border border-white/10 hover:glass-card-hover transition-all duration-500 group">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
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
                <p className="text-4xl font-bold text-white">{tokensClaimed}</p>
              </div>
            </div>
            <TokenClaimButton
              tokensHeld={tokensHeld}
              onTokensClaimed={onTokensClaimed}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
