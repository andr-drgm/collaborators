"use client";

import { usePrivyAuth } from "@/hooks/usePrivyAuth";

interface OnboardingBannerProps {
  onShowHelp: (helpType: string) => void;
}

export default function OnboardingBanner({
  onShowHelp,
}: OnboardingBannerProps) {
  const { walletAddress } = usePrivyAuth();

  if (walletAddress) return null;

  return (
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
            Wallet Ready - Start Earning!
          </h3>
          <p className="text-blue-300 text-sm">
            Your Privy embedded wallet is ready. Start contributing to earn SOL
            tokens for your GitHub activity.
          </p>
        </div>
        <button
          className="btn-primary px-6 py-3 text-sm"
          onClick={() => onShowHelp("wallet")}
        >
          Learn More
        </button>
      </div>
    </div>
  );
}
