import HeroSection from "@/components/HeroSection";
import {
  GITHUB_APP_SETTINGS_URL,
  PRIVACY_POLICY_URL,
  TERMS_OF_USE_URL,
  TWITTER_URL,
} from "@/utils/links";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <HeroSection />

      {/* Crypto Coding Metrics Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-950/20 to-black"></div>
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <h2 className="text-5xl font-bold mb-20 text-center gradient-text">
            GitHub Bounty Marketplace
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">
                Discover Issues
              </h3>
              <p className="text-white/70 leading-relaxed">
                Browse GitHub issues across all public repositories. Find bugs
                to fix, features to build, and problems to solve for USDC
                rewards.
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
                Earn USDC Rewards
              </h3>
              <p className="text-white/70 leading-relaxed">
                Get paid in USDC for solving GitHub issues. Automatic
                verification when your pull request is merged. Rewards are
                escrowed upfront for guaranteed payment.
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">
                Automatic Tracking
              </h3>
              <p className="text-white/70 leading-relaxed">
                Our GitHub bot automatically tracks issue status, PR merges, and
                solution verification. No manual intervention needed - just code
                and get paid.
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
                Find GitHub issues with USDC bounties, solve them with pull
                requests, and get paid automatically when your solution is
                merged. Our bot tracks everything and ensures fair, transparent
                payments.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <span className="text-white/90 font-medium">
                    Browse GitHub issues and add USDC bounties
                  </span>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <span className="text-white/90 font-medium">
                    Developers submit pull request solutions
                  </span>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-purple-500 flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <span className="text-white/90 font-medium">
                    Bot automatically verifies when PR is merged
                  </span>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <span className="text-white/90 font-medium">
                    USDC payment is automatically released
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
                How are bounties verified?
              </h3>
              <p className="text-white/70 leading-relaxed">
                Our GitHub bot automatically tracks when pull requests are
                merged that reference bounty issues. When a PR closes an issue,
                the bot verifies the solution and releases the USDC payment.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8 transition-all duration-500 hover:glass-card-hover">
              <h3 className="text-xl font-semibold mb-3 text-white">
                When do USDC payments get released?
              </h3>
              <p className="text-white/70 leading-relaxed">
                USDC payments are escrowed when bounties are created and
                automatically released when your pull request is merged and
                verified. Payments go directly to your connected wallet.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8 transition-all duration-500 hover:glass-card-hover">
              <h3 className="text-xl font-semibold mb-3 text-white">
                What repositories are supported?
              </h3>
              <p className="text-white/70 leading-relaxed">
                Any public GitHub repository! You can browse issues across all
                public repositories and add bounties to any issue you find
                interesting. No repository opt-in required.
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
                Collaborators
              </h3>
              <p className="text-white/70 text-lg">
                On-chain developer reputation system powered by Solana
              </p>
              <p className="text-white/50 text-sm mt-2">
                collaborators.build – Collaborators platform
              </p>
              <div className="mt-6 text-white/50 text-xs space-y-3 leading-relaxed">
                <p>
                  Collaborators is an experimental developer rewards platform.
                  Token allocations are not guaranteed and nothing on this site
                  should be interpreted as financial, investment, or legal
                  advice.
                </p>
                <p>
                  When you connect GitHub we request read-only access to your
                  public profile, email, and contribution data to power product
                  features. You can revoke access anytime from your GitHub
                  account settings.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-white/60">
                  <a
                    href={PRIVACY_POLICY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                  <a
                    href={TERMS_OF_USE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Use
                  </a>
                  <a
                    href={GITHUB_APP_SETTINGS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Manage GitHub Connection
                  </a>
                </div>
              </div>
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
            © 2025 Collaborators.
          </div>
        </div>
      </footer>
    </div>
  );
}
