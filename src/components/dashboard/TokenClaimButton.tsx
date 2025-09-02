"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey, Transaction } from "@solana/web3.js";
import {
  createMintToInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import bs58 from "bs58";
import { WalletSendTransactionError } from "@solana/wallet-adapter-base";

interface TokenClaimButtonProps {
  tokensHeld: number;
  onTokensClaimed: (amount: number) => void;
}

export default function TokenClaimButton({
  tokensHeld,
  onTokensClaimed,
}: TokenClaimButtonProps) {
  const [isClaiming, setIsClaiming] = useState(false);
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const handleClaimTokens = async () => {
    if (!publicKey || !sendTransaction) {
      alert("Wallet not connected!");
      return;
    }
    if (!process.env.REACT_APP_MINT_AUTHORITY_SECRET_KEY) {
      console.error("Mint authority secret key environment variable not set!");
      alert(
        "Configuration error: Mint authority not set. Please contact support."
      );
      return;
    }
    if (tokensHeld <= 0) {
      alert("No tokens available to claim.");
      return;
    }

    try {
      setIsClaiming(true);
      const mintAddress = new PublicKey(
        "H4bLS9gYGfrHL2CfbtqRf4HhixyXqEXoinFExBdvMrkT"
      );
      const mintAuthority = Keypair.fromSecretKey(
        bs58.decode(process.env.REACT_APP_MINT_AUTHORITY_SECRET_KEY)
      );

      // Get or derive the associated token account address
      const userTokenAccount = await getAssociatedTokenAddress(
        mintAddress,
        publicKey
      );

      const transaction = new Transaction();

      // Check if the associated token account exists
      const accountInfo = await connection.getAccountInfo(userTokenAccount);

      if (!accountInfo) {
        console.log("Associated token account not found. Creating it...");
        transaction.add(
          createAssociatedTokenAccountInstruction(
            publicKey,
            userTokenAccount,
            publicKey,
            mintAddress
          )
        );
      }

      // Add the mint instruction
      const amountToMint = tokensHeld * Math.pow(10, 9);
      transaction.add(
        createMintToInstruction(
          mintAddress,
          userTokenAccount,
          mintAuthority.publicKey,
          amountToMint
        )
      );

      // Set recent blockhash and fee payer
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Partially sign with the mint authority's keypair
      transaction.partialSign(mintAuthority);

      // Send the transaction for the user to approve
      console.log("Sending transaction for user approval...");
      const signature = await sendTransaction(transaction, connection);
      console.log("Transaction sent with signature:", signature);

      // Confirm the transaction
      await connection.confirmTransaction(signature, "confirmed");
      console.log("Transaction confirmed!");

      alert(`Tokens minted successfully! Signature: ${signature}`);
      onTokensClaimed(tokensHeld);
    } catch (error) {
      console.error("Mint failed:", error);

      let errorMessage = "Token mint failed. ";
      if (error instanceof WalletSendTransactionError) {
        errorMessage += `Wallet Error: ${error.message}`;
        if (error.message.includes("User rejected the request")) {
          errorMessage = "Transaction rejected by user.";
        } else if (error.message.includes("RPC")) {
          errorMessage += " (Check RPC connection)";
        }
      } else if (error instanceof Error) {
        errorMessage += error.message;
      } else {
        errorMessage += "An unknown error occurred.";
      }
      alert(errorMessage);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <button
      className="w-full mt-6 btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
      onClick={handleClaimTokens}
      disabled={!tokensHeld || !publicKey || isClaiming}
    >
      {!publicKey
        ? "Connect Wallet to Claim"
        : isClaiming
        ? "Claiming..."
        : "Claim All Tokens"}
    </button>
  );
}
