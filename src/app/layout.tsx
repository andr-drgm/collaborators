import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Collab0rators - Transform Open Source into On-Chain Rewards",
  description:
    "Earn NFT badges and SOL tokens for your real contributions on GitHub. Build on-chain reputation and get rewarded for open-source collaboration.",
  keywords: [
    "GitHub",
    "blockchain",
    "Solana",
    "NFT",
    "developer rewards",
    "open source",
    "collaboration",
  ],
  authors: [{ name: "Collab0rators Team" }],
  openGraph: {
    title: "Collab0rators - Open Source to Blockchain Rewards",
    description:
      "Transform your Open Source contributions into on-chain rewards and reputation",
    type: "website",
    url: "https://collab0rators.com",
    siteName: "Collab0rators",
  },
  twitter: {
    card: "summary_large_image",
    title: "Collab0rators - Commits to Blockchain Rewards",
    description:
      "Transform your Open Source contributions into on-chain rewards and reputation",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased animated-background bg-gradient-to-b from-black via-blue-950/20 to-red-950/20`}
      >
        <Providers>
          <SessionProvider>{children}</SessionProvider>
        </Providers>
      </body>
    </html>
  );
}
