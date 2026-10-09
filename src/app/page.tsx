import HeroSection from "@/components/HeroSection";
import XLogo from "@/components/ui/XLogo";
import {
  GITHUB_APP_SETTINGS_URL,
  PRIVACY_POLICY_URL,
  TERMS_OF_USE_URL,
  TWITTER_URL,
} from "@/utils/links";

const FEATURES = [
  {
    title: "Discover Issues",
    body: "Browse GitHub issues across all public repositories. Find bugs to fix, features to build, and problems to solve for USDC rewards.",
    icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  },
  {
    title: "Earn USDC Rewards",
    body: "Get paid in USDC for solving GitHub issues. Automatic verification when your pull request is merged. Rewards are escrowed upfront for guaranteed payment.",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Automatic Tracking",
    body: "Our GitHub bot automatically tracks issue status, PR merges, and solution verification. No manual intervention needed - just code and get paid.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
];

const STEPS = [
  "Browse GitHub issues and add USDC bounties",
  "Developers submit pull request solutions",
  "Bot automatically verifies when PR is merged",
  "USDC payment is automatically released",
];

const FAQ = [
  {
    q: "How are bounties verified?",
    a: "Our GitHub bot automatically tracks when pull requests are merged that reference bounty issues. When a PR closes an issue, the bot verifies the solution and releases the USDC payment.",
  },
  {
    q: "When do USDC payments get released?",
    a: "USDC payments are escrowed when bounties are created and automatically released when your pull request is merged and verified. Payments go directly to your connected wallet.",
  },
  {
    q: "What repositories are supported?",
    a: "Any public GitHub repository! You can browse issues across all public repositories and add bounties to any issue you find interesting. No repository opt-in required.",
  },
];

const COMING_SOON = [
  {
    title: "Team Leaderboards",
    body: "Compete with your team and climb the ranks",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  },
  {
    title: "Exclusive NFT Tiers",
    body: "Rare collectibles for top contributors",
    icon: "M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 4v2h6V4",
  },
  {
    title: "API Access",
    body: "Integrate rewards into your own applications",
    icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
  },
];

const CODE_SAMPLE = `function grindCode(allNight = true) {
  while (bug) { debug(☕️) }
  return mergePR().then(rewards =>
    wallet.mint(💰, { amount: '10 SOL' })
  )
}`;

function Icon({ d, className }: { d: string; className: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={d} />
    </svg>
  );
}

const sectionTitle =
  "gradient-text text-center text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-bg text-fg">
      <main>
        <HeroSection />

        {/* Features */}
        <section className="relative py-20 sm:py-24">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-bg via-brand-blue/5 to-bg"
          ></div>
          <div className="relative z-10 mx-auto max-w-6xl px-4">
            <h2 className={`${sectionTitle} mb-12 sm:mb-16`}>
              GitHub Bounty Marketplace
            </h2>

            <div className="grid gap-6 md:grid-cols-3 md:gap-8">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="card group p-6 transition-colors hover:border-line-strong sm:p-8"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-brand-teal/20 to-brand-blue/20 transition-transform duration-300 group-hover:scale-110">
                    <Icon d={f.icon} className="h-7 w-7 text-brand-teal" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold sm:text-2xl">
                    {f.title}
                  </h3>
                  <p className="leading-relaxed text-muted">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="relative py-20 sm:py-24">
          <div className="relative z-10 mx-auto max-w-5xl px-4">
            <div className="flex flex-col items-center gap-12 md:flex-row md:gap-16">
              <div className="w-full flex-1">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-brand-teal/20 to-brand-blue/20">
                  <Icon
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    className="h-8 w-8 text-brand-teal"
                  />
                </div>
                <h2 className="gradient-text mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  How it works
                </h2>
                <p className="mb-8 text-lg leading-relaxed text-muted">
                  Find GitHub issues with USDC bounties, solve them with pull
                  requests, and get paid automatically when your solution is
                  merged. Our bot tracks everything and ensures fair,
                  transparent payments.
                </p>
                <ol className="space-y-3">
                  {STEPS.map((step, i) => (
                    <li
                      key={step}
                      className="flex items-center gap-4 rounded-xl border border-line bg-surface p-4"
                    >
                      <span className="step-num" aria-hidden="true">
                        {i + 1}
                      </span>
                      <span className="font-medium text-fg/90">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="card w-full min-w-0 flex-1 p-5 sm:p-10">
                <pre className="overflow-x-auto font-mono text-xs leading-6 sm:text-sm sm:leading-7 text-brand-teal">
                  <code>{CODE_SAMPLE}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="relative py-20 sm:py-24">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-bg via-brand-blue/5 to-bg"
          ></div>
          <div className="relative z-10 mx-auto max-w-4xl px-4">
            <h2 className={`${sectionTitle} mb-12 sm:mb-16`}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {FAQ.map((item) => (
                <div key={item.q} className="card p-6 sm:p-8">
                  <h3 className="mb-2 text-lg font-semibold sm:text-xl">
                    {item.q}
                  </h3>
                  <p className="leading-relaxed text-muted">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Coming soon */}
        <section className="relative py-20 sm:py-24">
          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
            <h2 className={`${sectionTitle} mb-4`}>Coming Soon</h2>
            <p className="mb-12 text-lg leading-relaxed text-muted sm:mb-16 sm:text-xl">
              We&apos;re building the future of developer collaboration and
              rewards
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {COMING_SOON.map((f) => (
                <div
                  key={f.title}
                  className="card group p-6 transition-colors hover:border-line-strong sm:p-8"
                >
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-brand-teal to-brand-blue transition-transform duration-300 group-hover:scale-110">
                    <Icon d={f.icon} className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                  <p className="text-sm text-muted">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-surface">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <p className="gradient-text mb-3 text-xl font-semibold">
            Collaborators
          </p>
          <p className="text-lg text-muted">
            On-chain developer reputation system powered by Solana
          </p>
          <p className="mt-2 text-sm text-subtle">
            collaborators.build – Collaborators platform
          </p>
          <div className="mt-6 space-y-3 text-xs leading-relaxed text-subtle">
            <p>
              Collaborators is an experimental developer rewards platform.
              Token allocations are not guaranteed and nothing on this site
              should be interpreted as financial, investment, or legal advice.
            </p>
            <p>
              When you connect GitHub we request read-only access to your
              public profile, email, and contribution data to power product
              features. You can revoke access anytime from your GitHub account
              settings.
            </p>
          </div>
          <nav
            aria-label="Legal"
            className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted"
          >
            <a
              href={PRIVACY_POLICY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded hover:text-fg"
            >
              Privacy Policy
            </a>
            <a
              href={TERMS_OF_USE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded hover:text-fg"
            >
              Terms of Use
            </a>
            <a
              href={GITHUB_APP_SETTINGS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded hover:text-fg"
            >
              Manage GitHub Connection
            </a>
          </nav>
          <a
            href={TWITTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost mt-6"
          >
            <span className="uppercase tracking-wide">Follow us on X</span>
            <XLogo size="sm" />
          </a>
          <div className="mt-10 border-t border-line pt-8 text-sm text-subtle">
            © 2025 Collaborators.
          </div>
        </div>
      </footer>
    </div>
  );
}
