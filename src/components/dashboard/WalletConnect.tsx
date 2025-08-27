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
          <WalletMultiButton className="!bg-gradient-to-r !from-blue-600 !to-cyan-600 hover:!from-blue-700 hover:!to-cyan-700 !rounded-xl !px-6 !py-3 !text-sm !font-semibold !shadow-lg hover:!shadow-blue-500/25 !transition-all !duration-300 hover:!scale-105" />
          <button
            className="ml-3 text-white/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
            onMouseEnter={() => setShowWalletHelp(true)}
            onMouseLeave={() => setShowWalletHelp(false)}
          >
            <svg
              className="w-5 h-5"
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

          {/* Wallet Help Tooltip with liquid glass */}
          {showWalletHelp && (
            <div className="absolute right-0 top-full mt-3 liquid-glass rounded-2xl p-6 text-sm text-white max-w-xs z-50 shadow-2xl border border-white/20">
              <h4 className="font-semibold text-blue-200 mb-3 text-base">
                Need a Solana Wallet?
              </h4>
              <p className="text-white/80 mb-4 leading-relaxed">
                We recommend Phantom or Solflare. Make sure you have some SOL
                for transaction fees.
              </p>
              <div className="space-y-3 text-sm">
                <a
                  href="https://phantom.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  → Get Phantom Wallet
                </a>
                <a
                  href="https://solflare.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  → Get Solflare Wallet
                </a>
              </div>
              <div className="absolute top-0 right-6 transform -translate-y-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-white/20"></div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 liquid-glass rounded-xl px-4 py-2 border border-white/20">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
            <span className="text-sm font-mono text-white/90 font-medium">
              {shortenAddress(publicKey.toBase58())}
            </span>
          </div>
          <WalletDisconnectButton className="!bg-gradient-to-r !from-red-600 !to-pink-600 hover:!from-red-700 hover:!to-pink-700 !rounded-xl !px-6 !py-3 !text-sm !font-semibold !shadow-lg hover:!shadow-red-500/25 !transition-all !duration-300 hover:!scale-105" />
        </>
      )}
    </div>
  );
}
