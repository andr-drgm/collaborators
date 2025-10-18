"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface PrivyUserData {
  id: string;
  name?: string;
  email?: string;
  username?: string;
  image?: string;
  walletAddress?: string;
  unclaimedTokens?: number;
  createdAt?: Date;
}

export function usePrivyAuth() {
  const router = useRouter();
  const {
    ready,
    authenticated,
    user: privyUser,
    login,
    logout: privyLogout,
    linkGithub,
    unlinkGithub,
    getAccessToken,
  } = usePrivy();

  const { wallets } = useWallets();
  const [userData, setUserData] = useState<PrivyUserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Get the embedded Solana wallet (Privy embedded wallet)
  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === "privy"
  );

  // Fallback: Get wallet from user profile if not found in wallets hook
  const fallbackWallet = privyUser?.wallet
    ? {
        address: privyUser.wallet.address,
        walletClientType: privyUser.wallet.walletClientType,
      }
    : null;

  // Use the actual wallet object for transactions, fallback for display
  const finalEmbeddedWallet = embeddedWallet || fallbackWallet;
  const walletForTransactions = embeddedWallet; // Only use actual wallet object for transactions

  // Fetch user data from your database
  useEffect(() => {
    const fetchUserData = async () => {
      if (!authenticated || !privyUser) {
        setUserData(null);
        setLoading(false);
        return;
      }

      try {
        const accessToken = await getAccessToken();
        const response = await fetch("/api/user/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (ready) {
      fetchUserData();
    }
  }, [authenticated, privyUser, ready, getAccessToken]);

  const logout = async () => {
    await privyLogout();
    router.push("/");
  };

  const linkGitHub = async () => {
    try {
      await linkGithub();
      // Refresh user data after linking
      const accessToken = await getAccessToken();
      const response = await fetch("/api/user/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    } catch (error) {
      console.error("Error linking GitHub:", error);
      throw error;
    }
  };

  const unlinkGitHub = async () => {
    try {
      const githubAccount = privyUser?.linkedAccounts?.find(
        (account) => account.type === "github_oauth"
      );
      if (githubAccount && "subject" in githubAccount) {
        await unlinkGithub(githubAccount.subject);
      }
    } catch (error) {
      console.error("Error unlinking GitHub:", error);
      throw error;
    }
  };

  // Get GitHub username
  const githubAccount = privyUser?.linkedAccounts?.find(
    (account) => account.type === "github_oauth"
  );
  const githubUsername =
    (githubAccount && "username" in githubAccount
      ? githubAccount.username
      : null) || userData?.username;

  // Get GitHub access token
  const getGithubAccessToken = async () => {
    const githubAccount = privyUser?.linkedAccounts?.find(
      (account) => account.type === "github_oauth"
    );
    return githubAccount && "accessToken" in githubAccount
      ? githubAccount.accessToken
      : undefined;
  };

  return {
    // Auth state
    ready,
    authenticated,
    loading,
    user: privyUser,
    userData,

    // Wallet state
    embeddedWallet: walletForTransactions, // Use actual wallet object for transactions
    embeddedWalletAddress: finalEmbeddedWallet?.address, // Use fallback for display
    internalWalletAddress: finalEmbeddedWallet?.address,
    // Primary wallet address for authentication/identification
    walletAddress: finalEmbeddedWallet?.address,

    // GitHub state
    githubUsername,
    hasGithub: !!privyUser?.linkedAccounts?.find(
      (account) => account.type === "github_oauth"
    ),

    // Auth methods
    login,
    logout,
    linkGitHub,
    unlinkGitHub,
    getAccessToken,
    getGithubAccessToken,
  };
}
