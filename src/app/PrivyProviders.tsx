"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { ReactNode } from "react";
import OAuthTokenHandler from "@/components/OAuthTokenHandler";

export default function PrivyProviders({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        // Customize Privy's appearance and behavior
        appearance: {
          theme: "dark",
          accentColor: "#3b82f6",
          logo: "/logo.png",
          showWalletLoginFirst: false,
        },
        // Configure login methods
        loginMethods: ["github"],
        // Configure embedded wallets - automatically create Solana wallets
        embeddedWallets: {
          solana: {
            createOnLogin: "users-without-wallets",
          },
        },
        // Configure supported chains (Solana)
        supportedChains: [
          {
            id: 1399811149, // Solana Mainnet
            name: "Solana",
            network: "mainnet-beta",
            nativeCurrency: {
              name: "SOL",
              symbol: "SOL",
              decimals: 9,
            },
            rpcUrls: {
              default: {
                http: ["https://api.mainnet-beta.solana.com"],
              },
            },
          },
          {
            id: 1399811150, // Solana Devnet
            name: "Solana Devnet",
            network: "devnet",
            nativeCurrency: {
              name: "SOL",
              symbol: "SOL",
              decimals: 9,
            },
            rpcUrls: {
              default: {
                http: ["https://api.devnet.solana.com"],
              },
            },
          },
        ],
        defaultChain: {
          id: 1399811150, // Default to Devnet
          name: "Solana Devnet",
          network: "devnet",
          nativeCurrency: {
            name: "SOL",
            symbol: "SOL",
            decimals: 9,
          },
          rpcUrls: {
            default: {
              http: ["https://api.devnet.solana.com"],
            },
          },
        },
      }}
    >
      <OAuthTokenHandler />
      {children}
    </PrivyProvider>
  );
}
