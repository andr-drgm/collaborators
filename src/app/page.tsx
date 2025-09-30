import HeroSection from "@/components/HeroSection";
import { TWITTER_URL } from "@/utils/links";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <HeroSection />

      {/* Crypto Coding Metrics Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-950/20 to-black"></div>
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <h2 className="text-5xl font-bold mb-20 text-center gradient-text">
            Web3 Development Suite
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="glass-card rounded-2xl p-8 transition-all duration-500 hover:glass-card-hover group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="h-8 w-8 text-blue-400"
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
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">
                Analyze User Activity
              </h3>
              <p className="text-white/70 leading-relaxed">
                Track developer contributions across our platform. Gain insights
                into project engagement and collaborative patterns.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8 transition-all duration-500 hover:glass-card-hover group">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="h-8 w-8 text-cyan-400"
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
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">
                Rewarding Contributors
              </h3>
              <p className="text-white/70 leading-relaxed">
                Earn SOL tokens for meaningful GitHub activity: code commits,
                pull requests, reviews, and issue resolution. Rewards go
                directly to your linked wallet.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8 transition-all duration-500 hover:glass-card-hover group">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="h-8 w-8 text-teal-400"
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
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">
                Gamification
              </h3>
              <p className="text-white/70 leading-relaxed">
                Turn Collab0rators into a game. Unlock achievements, climb
                leaderboards, and get real-time feedback for secure, high-impact
                contributions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dev Workflow Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/20 to-black"></div>
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-8">
                <svg
                  className="h-10 w-10 text-teal-400"
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
              </div>
              <h2 className="text-4xl font-bold mb-6 gradient-text-purple">
                How it works
              </h2>
              <p className="text-white/70 mb-8 text-lg leading-relaxed">
                Automatically convert GitHub activity into verifiable on-chain
                achievements. Every meaningful contribution mints NFT badges and
                earns SOL tokens. Track your impact, build your on-chain
                reputation, and get rewarded for open-source collaboration.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <span className="text-white/90 font-medium">
                    Connect your GitHub and Solana wallet accounts.
                  </span>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <span className="text-white/90 font-medium">
                    Collaborate & Commit Code
                  </span>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-purple-500 flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <span className="text-white/90 font-medium">
                    All collaborations are minted into SOL tokens.
                  </span>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <span className="text-white/90 font-medium">
                    User activity will be analyzed.
                  </span>
                </div>
              </div>
            </div>

            {/* Code editor graphic with liquid glass */}
            <div className="flex-1 liquid-glass rounded-3xl p-12 transition-all duration-500 hover:liquid-glass-hover">
              <div className="mockup-code">
                <pre data-prefix=">" className="text-blue-400">
                  <code>function grindCode(allNight = true) {"{"}</code>
                </pre>
                <pre data-prefix=">" className="text-cyan-400">
                  <code>
                    {" "}
                    while (bug) {"{"} debug(☕️) {"}"}
                  </code>
                </pre>
                <pre data-prefix=">" className="text-teal-400">
                  <code> return mergePR().then(rewards ={">"}</code>
                </pre>
                <pre data-prefix=">" className="text-purple-400">
                  <code> wallet.mint(💰, {"amount: '10 SOL'"}); </code>
                </pre>
                <pre data-prefix=">" className="text-teal-400">
                  <code> {")"}</code>
                </pre>
                <pre data-prefix=">" className="text-blue-400">
                  <code>{"}"}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-950/20 to-black"></div>
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <h2 className="text-5xl font-bold mb-20 text-center gradient-text">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-8 transition-all duration-500 hover:glass-card-hover">
              <h3 className="text-xl font-semibold mb-3 text-white">
                How do contributions get tracked?
              </h3>
              <p className="text-white/70 leading-relaxed">
                We analyze your GitHub activity including commits, pull
                requests, code reviews, and issue contributions. Each meaningful
                contribution is evaluated and converted into rewards.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8 transition-all duration-500 hover:glass-card-hover">
              <h3 className="text-xl font-semibold mb-3 text-white">
                When do SOL tokens get transferred?
              </h3>
              <p className="text-white/70 leading-relaxed">
                SOL tokens are minted and transferred to your wallet immediately
                after your contributions are verified. You can claim them at any
                time from your dashboard.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8 transition-all duration-500 hover:glass-card-hover">
              <h3 className="text-xl font-semibold mb-3 text-white">
                What blockchains or wallets are supported?
              </h3>
              <p className="text-white/70 leading-relaxed">
                Currently, we support Solana blockchain with any
                Solana-compatible wallet (Phantom, Solflare, etc.). More
                blockchain support is coming soon!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/20 to-black"></div>
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <h2 className="text-5xl font-bold mb-8 gradient-text-purple">
            Coming Soon
          </h2>
          <p className="text-xl text-white/80 mb-16 leading-relaxed">
            We&apos;re building the future of developer collaboration and
            rewards
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card rounded-2xl p-8 transition-all duration-500 hover:glass-card-hover group">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-10 h-10 text-white"
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
              <h3 className="text-xl font-semibold mb-2 text-white">
                Team Leaderboards
              </h3>
              <p className="text-white/70 text-sm">
                Compete with your team and climb the ranks
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8 transition-all duration-500 hover:glass-card-hover group">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-10 h-10 text-white"
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
              <h3 className="text-xl font-semibold mb-2 text-white">
                Exclusive NFT Tiers
              </h3>
              <p className="text-white/70 text-sm">
                Rare collectibles for top contributors
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8 transition-all duration-500 hover:glass-card-hover group">
              <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-10 h-10 text-white"
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
              <h3 className="text-xl font-semibold mb-2 text-white">
                API Access
              </h3>
              <p className="text-white/70 text-sm">
                Integrate rewards into your own applications
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="liquid-glass border-t border-white/10">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="max-w-2xl">
              <h3 className="text-xl font-semibold mb-4 gradient-text">
                Collab0rators
              </h3>
              <p className="text-white/70 text-lg">
                On-chain developer reputation system powered by Solana
              </p>
              <p className="text-white/50 text-sm mt-2">
                collab0rators.com – Collab0rators platform
              </p>
              <div className="mt-6 flex items-center justify-center">
                <a
                  href={TWITTER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-white/70 hover:text-white transition-colors"
                >
                  <span className="text-sm font-medium uppercase tracking-wide">
                    Follow us on X
                  </span>
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4l16 16" />
                    <path d="M20 4L4 20" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/50 text-sm">
            © 2025 Collab0rators.
          </div>
        </div>
      </footer>
    </div>
  );
}
