import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <HeroSection />

      {/* Crypto Coding Metrics Section */}
      <section className="py-24 bg-gradient-to-b from-zinc-900 to-black">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold mb-16 text-center bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
            Web3 Development Suite
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="p-8 border border-cyan-400/20 rounded-xl bg-zinc-900/50 backdrop-blur-sm hover:border-cyan-400/40 transition-all duration-300">
              <svg
                className="h-12 w-12 text-cyan-400 mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
                />
              </svg>
              <h3 className="text-2xl font-semibold mb-4">
                Analyze User Activity
              </h3>
              <p className="text-gray-400">
                Track developer contributions across our platform. Gain insights
                into project engagement and collaborative patterns.
              </p>
            </div>

            <div className="p-8 border border-teal-400/20 rounded-xl bg-zinc-900/50 backdrop-blur-sm hover:border-teal-400/40 transition-all duration-300">
              <svg
                className="h-12 w-12 text-teal-400 mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-2xl font-semibold mb-4">
                Rewarding Contributors
              </h3>
              <p className="text-gray-400">
                Earn SOL tokens for meaningful GitHub activity: code commits,
                pull requests, reviews, and issue resolution. Rewards go
                directly to your linked wallet.
              </p>
            </div>

            <div className="p-8 border border-cyan-400/20 rounded-xl bg-zinc-900/50 backdrop-blur-sm hover:border-cyan-400/40 transition-all duration-300">
              <svg
                className="h-12 w-12 text-cyan-400 mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 4v12m-4-4v4m-4-4v4M4 4h.01M8 4h.01M12 4h.01M16 4h.01M20 4h.01M4 8h.01M8 8h.01M12 8h.01M16 8h.01M20 8h.01M4 12h.01M8 12h.01M12 12h.01M16 12h.01M20 12h.01M4 16h.01M8 16h.01M12 16h.01M16 16h.01M20 16h.01"
                />
              </svg>
              <h3 className="text-2xl font-semibold mb-4">Gamification</h3>
              <p className="text-gray-400">
                Turn Collab0rators into a game. Unlock achievements, climb
                leaderboards, and get real-time feedback for secure, high-impact
                contributions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dev Workflow Section */}
      <section className="py-24 border-t border-b border-zinc-800">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1">
              <svg
                className="h-16 w-16 text-teal-400 mb-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h2 className="text-3xl font-bold mb-6">How it works</h2>
              <p className="text-gray-400 mb-8">
                Automatically convert GitHub activity into verifiable on-chain
                achievements. Every meaningful contribution mints NFT badges and
                earns SOL tokens. Track your impact, build your on-chain
                reputation, and get rewarded for open-source collaboration.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-cyan-400/10 flex items-center justify-center">
                    <span className="text-cyan-400">1</span>
                  </div>
                  <span className="text-gray-300">
                    Connect your GitHub and Solana wallet accounts.
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-teal-400/10 flex items-center justify-center">
                    <span className="text-teal-400">2</span>
                  </div>
                  <span className="text-gray-300">
                    Collaborate & Commit Code
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-cyan-400/10 flex items-center justify-center">
                    <span className="text-cyan-400">3</span>
                  </div>
                  <span className="text-gray-300">
                    All collaborations are minted into SOL tokens.
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-cyan-400/10 flex items-center justify-center">
                    <span className="text-cyan-400">4</span>
                  </div>
                  <span className="text-gray-300">
                    User activity will be analyzed.
                  </span>
                </div>
              </div>
            </div>

            {/* Add code editor graphic placeholder */}
            <div className="flex-1 bg-gradient-to-br from-cyan-400/10 to-teal-400/10 p-12 rounded-2xl border border-zinc-800">
              <div className="mockup-code">
                <pre data-prefix=">" className="text-cyan-400">
                  <code>function grindCode(allNight = true) {"{"}</code>
                </pre>
                <pre data-prefix=">" className="text-green-400">
                  <code>
                    {" "}
                    while (bug) {"{"} debug(☕) {"}"}
                  </code>
                </pre>
                <pre data-prefix=">" className="text-teal-400">
                  <code> return mergePR().then(rewards ={">"}</code>
                </pre>
                <pre data-prefix=">" className="text-green-400">
                  <code> wallet.mint(💲, {"amount: '10 SOL'"}));</code>
                </pre>
                <pre data-prefix=">" className="text-cyan-400">
                  <code>{"}"}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 border-t border-b border-zinc-800">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold mb-16 text-center bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="p-6 border border-zinc-700 rounded-xl bg-zinc-900/50">
              <h3 className="text-xl font-semibold mb-3">
                How do contributions get tracked?
              </h3>
              <p className="text-gray-400">
                We analyze your GitHub activity including commits, pull
                requests, code reviews, and issue contributions. Each meaningful
                contribution is evaluated and converted into rewards.
              </p>
            </div>

            <div className="p-6 border border-zinc-700 rounded-xl bg-zinc-900/50">
              <h3 className="text-xl font-semibold mb-3">
                When do SOL tokens get transferred?
              </h3>
              <p className="text-gray-400">
                SOL tokens are minted and transferred to your wallet immediately
                after your contributions are verified. You can claim them at any
                time from your dashboard.
              </p>
            </div>

            <div className="p-6 border border-zinc-700 rounded-xl bg-zinc-900/50">
              <h3 className="text-xl font-semibold mb-3">
                What blockchains or wallets are supported?
              </h3>
              <p className="text-gray-400">
                Currently, we support Solana blockchain with any
                Solana-compatible wallet (Phantom, Solflare, etc.). More
                blockchain support is coming soon!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-24 bg-gradient-to-b from-zinc-900 to-black">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
            Coming Soon
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            We&apos;re building the future of developer collaboration and
            rewards
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border border-zinc-700 rounded-xl bg-zinc-900/50">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Team Leaderboards</h3>
              <p className="text-gray-400 text-sm">
                Compete with your team and climb the ranks
              </p>
            </div>

            <div className="p-6 border border-zinc-700 rounded-xl bg-zinc-900/50">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 4v2h6V4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Exclusive NFT Tiers
              </h3>
              <p className="text-gray-400 text-sm">
                Rare collectibles for top contributors
              </p>
            </div>

            <div className="p-6 border border-zinc-700 rounded-xl bg-zinc-900/50">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">API Access</h3>
              <p className="text-gray-400 text-sm">
                Integrate rewards into your own applications
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900/80 backdrop-blur-lg border-t border-zinc-800">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="max-w-2xl">
              <h3 className="text-lg font-semibold mb-4">Collab0rators</h3>
              <p className="text-gray-400 text-sm">
                On-chain developer reputation system powered by Solana
              </p>
              <p className="text-gray-500 text-xs mt-2">
                collab0rators.com – Collab0rators platform
              </p>
            </div>
          </div>
          <div className="border-t border-zinc-800 mt-12 pt-8 text-center text-gray-400 text-sm">
            © 2025 Collab0rators.
          </div>
        </div>
      </footer>
    </div>
  );
}
