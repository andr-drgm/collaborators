import HeroSection from "@/components/HeroSection";
import XLogo from "@/components/ui/XLogo";

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
              
              {/* Social Media Links */}
              <div className="flex items-center justify-center gap-6 mt-8">
                <a
                  href="https://x.com/collaborat0rs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-400/50 transition-all duration-300"
                  aria-label="Follow us on X (Twitter)"
                >
                  <XLogo className="group-hover:scale-110 transition-transform duration-300" />
                </a>
                <a
                  href="https://github.com/collab0rators"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-400/50 transition-all duration-300"
                  aria-label="View our GitHub"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform duration-300"
                  >
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                    <path d="M9 18c-4.51 2-5-2-7-2"></path>
                  </svg>
                </a>
                <a
                  href="https://www.notion.so/Collab0rator-Web3-Project-Hub-22cc164c642780f49c10d769fccf424f?source=copy_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-400/50 transition-all duration-300"
                  aria-label="View our Notion"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform duration-300"
                  >
                    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.214V6.354c0-.654-.28-.933-.748-.887l-15.177.887c-.514.046-.747.28-.747.933zm14.337.746c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"></path>
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
