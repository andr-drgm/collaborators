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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // or a loading spinner

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {!publicKey ? (
        <WalletMultiButton
          className="!bg-blue-600 hover:!bg-blue-700 !rounded-md !px-4 !py-2 !text-sm" // Add Tailwind classes
        />
      ) : (
        <>
          <span className="text-sm font-mono bg-zinc-800 px-3 py-1.5 rounded">
            {shortenAddress(publicKey.toBase58())}
          </span>
          <WalletDisconnectButton
            className="!bg-red-600 hover:!bg-red-700 !rounded-md !px-4 !py-2 !text-sm" // Consistent styling
          />
        </>
      )}
    </div>
  );
}
