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
  title: "Collaborators - GitHub Bounty Marketplace",
  description:
    "Find GitHub issues with USDC bounties or create your own. Get paid automatically when your pull request is merged. Earn USDC for solving open source problems.",
  keywords: [
    "GitHub",
    "bounty",
    "USDC",
    "developer rewards",
    "open source",
    "pull requests",
    "issues",
  ],
  authors: [{ name: "Collaborators Team" }],
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
    title: "Collaborators - GitHub Bounty Marketplace",
    description:
      "Find GitHub issues with USDC bounties or create your own. Get paid automatically when your pull request is merged.",
    type: "website",
    url: "https://collab0rators.com",
    siteName: "Collaborators",
  },
  twitter: {
    card: "summary_large_image",
    title: "Collaborators - GitHub Bounty Marketplace",
    description:
      "Find GitHub issues with USDC bounties or create your own. Get paid automatically when your pull request is merged.",
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
