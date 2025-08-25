"use client";

import { shortenAddress } from "@/utils/helpers";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";

// Add this import at the top
import "@solana/wallet-adapter-react-ui/styles.css";
import { useEffect, useState } from "react";

interface WalletConnectProps {
  className?: string;
}

export default function WalletConnect({ className = "" }: WalletConnectProps) {
  const { publicKey } = useWallet();
  const [mounted, setMounted] = useState(false);
  const [showWalletHelp, setShowWalletHelp] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // or a loading spinner

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {!publicKey ? (
        <div className="relative">
          <WalletMultiButton
            className="!bg-gradient-to-r !from-blue-600 !to-cyan-600 hover:!from-blue-700 hover:!to-cyan-700 !rounded-md !px-4 !py-2 !text-sm !font-medium !shadow-lg hover:!shadow-blue-500/25" // Add Tailwind classes
          />
          <button
            className="ml-2 text-gray-400 hover:text-white transition-colors p-1"
            onMouseEnter={() => setShowWalletHelp(true)}
            onMouseLeave={() => setShowWalletHelp(false)}
          >
            <svg
              className="w-4 h-4"
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

          {/* Wallet Help Tooltip */}
          {showWalletHelp && (
            <div className="absolute right-0 top-full mt-2 bg-zinc-800 border border-zinc-600 rounded-lg p-4 text-sm text-white max-w-xs z-50 shadow-xl">
              <h4 className="font-semibold text-blue-200 mb-2">
                Need a Solana Wallet?
              </h4>
              <p className="text-gray-300 mb-3">
                We recommend Phantom or Solflare. Make sure you have some SOL
                for transaction fees.
              </p>
              <div className="space-y-2 text-xs">
                <a
                  href="https://phantom.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-400 hover:text-blue-300 transition-colors"
                >
                  → Get Phantom Wallet
                </a>
                <a
                  href="https://solflare.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-400 hover:text-blue-300 transition-colors"
                >
                  → Get Solflare Wallet
                </a>
              </div>
              <div className="absolute top-0 right-4 transform -translate-y-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-zinc-800"></div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-500/30 px-3 py-1.5 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-mono text-green-200">
              {shortenAddress(publicKey.toBase58())}
            </span>
          </div>
          <WalletDisconnectButton
            className="!bg-red-600 hover:!bg-red-700 !rounded-md !px-4 !py-2 !text-sm !font-medium" // Consistent styling
          />
        </>
      )}
    </div>
  );
}
