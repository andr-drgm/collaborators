"use client";

import { useState } from "react";
import { usePrivyAuth } from "@/hooks/usePrivyAuth";
import { Keypair, PublicKey, Transaction, Connection } from "@solana/web3.js";
import {
  createMintToInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import bs58 from "bs58";

// Extend the wallet type to include Solana signing methods
interface SolanaWallet {
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
}

interface TokenClaimButtonProps {
  tokensHeld: number;
  onTokensClaimed: (amount: number) => void;
}

export default function TokenClaimButton({
  tokensHeld,
  onTokensClaimed,
}: TokenClaimButtonProps) {
  const [isClaiming, setIsClaiming] = useState(false);
  const [showClaimOptions, setShowClaimOptions] = useState(false);
  const { internalWalletAddress, externalWalletAddress, embeddedWallet } =
    usePrivyAuth();

  const handleClaimTokens = async (destinationAddress?: string) => {
    const targetAddress = destinationAddress || internalWalletAddress;

    console.log("=== TOKEN CLAIM DEBUG ===");
    console.log("Target address:", targetAddress);
    console.log("Embedded wallet object:", embeddedWallet);
    console.log(
      "Embedded wallet methods:",
      embeddedWallet ? Object.getOwnPropertyNames(embeddedWallet) : "No wallet"
    );
    console.log("========================");

    if (!targetAddress) {
      alert("Wallet not connected!");
      return;
    }

    if (!embeddedWallet) {
      alert(
        "Embedded wallet not available for transactions. Please try refreshing the page."
      );
      return;
    }
    if (!process.env.NEXT_PUBLIC_MINT_AUTHORITY_SECRET_KEY) {
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

      // Create Solana connection
      const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
          "https://api.devnet.solana.com",
        "confirmed"
      );

      const mintAddress = new PublicKey(
        "H4bLS9gYGfrHL2CfbtqRf4HhixyXqEXoinFExBdvMrkT"
      );
      const mintAuthority = Keypair.fromSecretKey(
        bs58.decode(process.env.NEXT_PUBLIC_MINT_AUTHORITY_SECRET_KEY)
      );

      const publicKey = new PublicKey(targetAddress);

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

      // Serialize and encode transaction for Privy wallet to sign
      console.log("Requesting user signature...");

      // Sign the transaction with the user's wallet
      const signedTx = await (
        embeddedWallet as unknown as SolanaWallet
      ).signTransaction(transaction);

      // Send the signed transaction
      console.log("Sending signed transaction...");
      const signature = await connection.sendRawTransaction(
        signedTx.serialize()
      );
      console.log("Transaction sent with signature:", signature);

      // Confirm the transaction
      await connection.confirmTransaction(signature, "confirmed");
      console.log("Transaction confirmed!");

      alert(`Tokens minted successfully! Signature: ${signature}`);
      onTokensClaimed(tokensHeld);
    } catch (error) {
      console.error("Mint failed:", error);

      let errorMessage = "Token mint failed. ";
      if (error instanceof Error) {
        errorMessage += error.message;
        if (error.message.includes("User rejected the request")) {
          errorMessage = "Transaction rejected by user.";
        } else if (error.message.includes("RPC")) {
          errorMessage += " (Check RPC connection)";
        }
      } else {
        errorMessage += "An unknown error occurred.";
      }
      alert(errorMessage);
    } finally {
      setIsClaiming(false);
    }
  };

  // If user has an external wallet, show claim options
  if (externalWalletAddress) {
    return (
      <div className="w-full mt-6 relative">
        {showClaimOptions && (
          <div className="absolute bottom-full mb-2 left-0 right-0 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-lg rounded-xl p-4 border border-white/20 shadow-2xl">
            <p className="text-xs text-white/60 mb-3">Claim tokens to:</p>
            <button
              onClick={() => {
                handleClaimTokens(internalWalletAddress);
                setShowClaimOptions(false);
              }}
              disabled={isClaiming}
              className="w-full mb-2 bg-white/10 hover:bg-white/20 rounded-lg px-4 py-3 text-sm font-semibold text-white transition-all text-left"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div>
                  <p className="font-medium">Internal Wallet</p>
                  <p className="text-xs text-white/60 font-mono">
                    {internalWalletAddress?.slice(0, 8)}...
                    {internalWalletAddress?.slice(-6)}
                  </p>
                </div>
              </div>
            </button>
            <button
              onClick={() => {
                handleClaimTokens(externalWalletAddress);
                setShowClaimOptions(false);
              }}
              disabled={isClaiming}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg px-4 py-3 text-sm font-semibold text-white transition-all text-left"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div>
                  <p className="font-medium">External Wallet</p>
                  <p className="text-xs text-white/80 font-mono">
                    {externalWalletAddress.slice(0, 8)}...
                    {externalWalletAddress.slice(-6)}
                  </p>
                </div>
              </div>
            </button>
          </div>
        )}
        <button
          className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          onClick={() => setShowClaimOptions(!showClaimOptions)}
          disabled={!tokensHeld || !internalWalletAddress || isClaiming}
        >
          {!internalWalletAddress
            ? "Connect Wallet to Claim"
            : isClaiming
            ? "Claiming..."
            : showClaimOptions
            ? "Cancel"
            : "Claim Tokens"}
        </button>
      </div>
    );
  }

  // Default: claim to internal wallet only
  return (
    <button
      className="w-full mt-6 btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
      onClick={() => handleClaimTokens()}
      disabled={!tokensHeld || !internalWalletAddress || isClaiming}
    >
      {!internalWalletAddress
        ? "Connect Wallet to Claim"
        : isClaiming
        ? "Claiming..."
        : "Claim Tokens to Internal Wallet"}
    </button>
  );
}
