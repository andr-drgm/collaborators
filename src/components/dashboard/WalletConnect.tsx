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

  if (!mounted || !ready) {
    return (
      <div
        className={`skeleton h-11 w-36 rounded-[var(--radius-control)] ${className}`}
        aria-hidden="true"
      ></div>
    );
  }

  // If not authenticated, show login button
  if (!authenticated) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <button type="button" onClick={login} className="btn btn-primary">
          Connect Wallet
        </button>
      </div>
    );
  }

  // If authenticated but no wallet, encourage creating one
  if (!internalWalletAddress) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div
          role="status"
          className="flex items-center gap-2 rounded-[var(--radius-control)] border border-warning/40 bg-warning/10 px-4 py-2"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-warning"></span>
          <span className="text-sm text-warning">Setting up wallet...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Wallet Display */}
      <button
        type="button"
        onClick={handleOpenModal}
        aria-haspopup="dialog"
        className="flex items-center gap-3 rounded-[var(--radius-control)] border border-line-strong bg-surface-strong px-4 py-2 transition-colors hover:border-white/40"
      >
        <span
          aria-hidden="true"
          className="h-2.5 w-2.5 animate-pulse rounded-full bg-success"
        ></span>
        <span className="flex flex-col text-left">
          <span className="text-xs text-subtle">Wallet</span>
          <span className="font-mono text-sm font-medium text-fg/90">
            {shortenAddress(internalWalletAddress)}
          </span>
        </span>
      </button>

      {/* Wallet Details Modal */}
      {showWalletModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="wallet-modal-title"
            className="card w-full max-w-md bg-bg/90 p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 id="wallet-modal-title" className="text-xl font-semibold">
                Wallet Info
              </h2>
              <button
                type="button"
                onClick={handleCloseModal}
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
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-6 rounded-xl border border-line bg-surface p-4">
              <div className="mb-3 flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-success"
                ></span>
                <h3 className="text-sm font-semibold text-muted">
                  Your Wallet (Privy)
                </h3>
              </div>
              <p className="mb-3 text-xs text-subtle">
                Your embedded Solana wallet where rewards are accumulated and
                claimed.
              </p>
              <div className="rounded-lg bg-black/30 p-3">
                <p className="mb-1 text-xs text-subtle">Address</p>
                <p className="break-all font-mono text-sm text-fg">
                  {internalWalletAddress}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCloseModal}
              className="btn btn-secondary w-full"
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
