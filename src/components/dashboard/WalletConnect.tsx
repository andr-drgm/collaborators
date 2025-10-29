"use client";

import { shortenAddress } from "@/utils/helpers";
import { usePrivyAuth } from "@/hooks/usePrivyAuth";
import { useEffect, useState, memo, useCallback } from "react";

interface WalletConnectProps {
  className?: string;
}

const WalletConnect = memo(function WalletConnect({
  className = "",
}: WalletConnectProps) {
  const { ready, authenticated, internalWalletAddress, login } = usePrivyAuth();

  const [mounted, setMounted] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpenModal = useCallback(() => {
    setShowWalletModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowWalletModal(false);
  }, []);

  if (!mounted || !ready) return null;

  // If not authenticated, show login button
  if (!authenticated) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <button
          onClick={login}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl px-6 py-3 text-sm font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  // If authenticated but no wallet, encourage creating one
  if (!internalWalletAddress) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className="liquid-glass rounded-xl px-4 py-2 border border-yellow-500/30">
          <span className="text-sm text-yellow-300">Setting up wallet...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Wallet Display */}
      <button
        onClick={handleOpenModal}
        className="flex items-center gap-3 liquid-glass rounded-xl px-4 py-2 border border-white/20 hover:border-white/40 transition-all"
      >
        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
        <div className="flex flex-col text-left">
          <span className="text-xs text-white/60 mb-0.5">Wallet</span>
          <span className="text-sm font-mono text-white/90 font-medium">
            {shortenAddress(internalWalletAddress)}
          </span>
        </div>
      </button>

      {/* Wallet Details Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="liquid-glass rounded-2xl p-8 max-w-md w-full mx-4 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Wallet Info</h3>
              <button
                onClick={handleCloseModal}
                className="text-white/60 hover:text-white transition-colors"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Wallet Section */}
            <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <h4 className="text-sm font-semibold text-white/80">
                  Your Wallet (Privy)
                </h4>
              </div>
              <p className="text-xs text-white/60 mb-3">
                Your embedded Solana wallet where rewards are accumulated and
                claimed.
              </p>
              <div className="bg-black/20 rounded-lg p-3">
                <p className="text-xs text-white/50 mb-1">Address</p>
                <p className="text-sm font-mono text-white break-all">
                  {internalWalletAddress}
                </p>
              </div>
            </div>

            <button
              onClick={handleCloseModal}
              className="w-full bg-white/10 hover:bg-white/20 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

WalletConnect.displayName = "WalletConnect";

export default WalletConnect;
