import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PrivyProviders from "./PrivyProviders";

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
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    other: [
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
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
        <PrivyProviders>{children}</PrivyProviders>
      </body>
    </html>
  );
}
