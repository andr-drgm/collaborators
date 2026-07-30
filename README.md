<div align="center">

# Collaborators

**Turn your open-source contributions into on-chain USDC rewards.**

GitHub issue bounties — funded in USDC, paid automatically when your PR merges.

[Open a Bounty →](https://collaborators.build) · [Browse Bounties →](https://collaborators.build) · [Discord →](#)

</div>

---

## 🎯 What is Collaborators?

Collaborators is a **GitHub-native USDC bounty marketplace** that turns open-source issue solving into a paid gig. Project maintainers fund issues with USDC; developers solve them with pull requests; payments release **automatically** when the PR merges.

**No escrow intermediaries. No manual payout. No chasing invoices.**

USDC is held in on-chain escrow from the moment a bounty is posted. When your PR is merged on GitHub, our bot verifies the link, releases the USDC, and pays your connected Phantom wallet — usually within minutes.

---

## ⚡ How It Works (4 Steps)

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  1. Fund Bounty │ →  │  2. Developer   │ →  │  3. PR Merged   │ →  │  4. USDC Paid   │
│                 │    │   Submits PR    │    │   on GitHub     │    │   to Wallet     │
│  Issue + USDC   │    │  claims & codes │    │   bot verifies  │    │  usually <5 min │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

1. **Post a bounty** — Add USDC to any public GitHub issue. Funds sit in on-chain escrow.
2. **Developer claims** — A contributor comments intent and submits a pull request that closes the issue.
3. **PR merges** — Once your PR is merged on GitHub, our webhook verifies the connection.
4. **Auto-pay** — USDC is released from escrow directly to the contributor's connected Phantom wallet.

---

## 🏆 Featured Bounty Programs

> Open bounties sponsored by leading AI labs and developer tools.

<p align="center">
  <a href="https://github.com/sponsors/anthropics"><img src="https://img.shields.io/badge/Anthropic-Prize%20Sponsor-D4A574?style=for-the-badge&logo=anthropic&logoColor=white" alt="Anthropic Prize" /></a>
  &nbsp;
  <a href="https://openai.com/contest"><img src="https://img.shields.io/badge/OpenAI-Contest%20Sponsor-10A37F?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI Contest" /></a>
  &nbsp;
  <a href="https://x.ai/grok"><img src="https://img.shields.io/badge/xAI-Grok%20Sponsor-000000?style=for-the-badge&logo=x&logoColor=white" alt="xAI Grok" /></a>
  &nbsp;
  <a href="https://github.com/features/copilot"><img src="https://img.shields.io/badge/GitHub-Copilot%20Sponsor-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Copilot" /></a>
</p>

---

## 🚀 Getting Started as a Contributor

### Prerequisites

- A **GitHub** account
- A **Phantom** wallet (Solana mobile or extension) — [phantom.app](https://phantom.app)
- A **Solana** address to receive USDC payouts
- **Public** repo access (you can work on any open-source project with bounties)

### Step 1: Browse Open Bounties

Visit [collaborators.build](https://collaborators.build) to browse funded issues. Each bounty shows:

- 💰 **Reward amount** in USDC
- 📂 **Repository** and issue link
- 🎯 **Difficulty** and required skills
- ⏰ **Deadline** (if any)

### Step 2: Log In with GitHub

Click **"Log in with GitHub"** on [collaborators.build](https://collaborators.build). Authorize the OAuth app — you'll be redirected back with your dashboard.

### Step 3: Connect Your Phantom Wallet

In your dashboard, click **"Link Wallet"** and paste your Solana address:

```
Phantom → Receive → Copy Address
```

Your address looks like `8zRifG6JruqFEzU69gepZmJcLAbNyCvMvsTgmu9MobJS` (base58, ~44 characters).

### Step 4: Solve and Submit

1. Open the bounty issue on GitHub
2. Comment to claim the issue
3. Submit a pull request that closes the issue
4. Reference the issue number in your PR (`Closes #123`)

### Step 5: Get Paid

Once your PR is merged, our bot verifies the link and releases the USDC. Payment arrives in your Phantom wallet **typically within 5 minutes** of merge.

---

## 💼 Getting Started as a Project Maintainer

### Why Post a Bounty?

- **Get unstuck** on issues that have been sitting for months
- **Tap into** the broader Solana + Web3 developer community
- **Pay only for results** — USDC stays in escrow until the PR merges

### How to Post a Bounty

1. **Add the `bounty` label** to your GitHub issue
2. **Install our GitHub App** at [github.com/apps/collaborators-bot](https://github.com/apps/collaborators-bot)
3. **Fund the bounty** in USDC from your dashboard
4. **Wait for PRs** — payments auto-release on merge

Minimum bounty: **$10 USDC**. Recommended: **$50–$500** for typical issues.

---

## ❓ FAQ

### Do I need to pay to use Collaborators?

**No.** Browsing bounties and submitting pull requests is free. We charge a small platform fee (5%) on bounties that successfully pay out.

### Which wallets are supported?

Currently **Phantom on Solana** (mobile iOS/Android + browser extension). USDC on Solana (SPL token) is the only payout currency.

### How fast is payout?

Most bounties pay out **within 5 minutes** of PR merge. The bot verifies the GitHub event, releases the on-chain escrow, and the USDC arrives in your wallet.

### Can I post a bounty on a private repo?

**No** — bounties are only supported on **public** GitHub repositories. This ensures transparency and verifiability.

### What happens if my PR is closed without merging?

No payment. The bounty stays in escrow and can be reassigned. Once a *different* PR that closes the issue is merged, *that* PR author receives the payout.

### Are bounties taxed?

Yes — USDC is a taxable asset in most jurisdictions. Keep records of your bounty earnings. We provide a transaction history in your dashboard for tax purposes.

### What if there's a dispute?

The bounty creator can dispute a payout within 24 hours of merge. Disputes are reviewed by Collaborators admin and resolved within 72 hours.

---

## 🛠️ Tech Stack

Collaborators is built on:

| Layer | Tech |
|---|---|
| **Frontend** | Next.js 14, React, TypeScript, Tailwind CSS |
| **Backend** | Next.js API routes, Prisma ORM |
| **Database** | PostgreSQL |
| **Auth** | GitHub OAuth + NextAuth |
| **Blockchain** | Solana (USDC SPL token), Phantom wallet adapter |
| **Hosting** | Vercel |
| **Bot** | GitHub App (event listener for issue + PR events) |

---

## 🔐 Security

- **USDC escrow** is held in a Solana program-controlled wallet, not a company-controlled hot wallet
- **OAuth scopes** are minimal — we only request read access to public repos
- **Wallet custody** is yours — we never hold your private keys
- **Open source** — this repository is public; audit our code anytime

Report vulnerabilities: **security@collaborators.build**

---

## 🌟 Community & Support

- 💬 **Discord**: [discord.gg/collaborators](https://discord.gg/collaborators)
- 🐦 **Twitter / X**: [@collaboratorsbld](https://twitter.com/collaboratorsbld)
- 📧 **Email**: hello@collaborators.build
- 🐛 **Issues**: [github.com/andr-drgm/collaborators/issues](https://github.com/andr-drgm/collaborators/issues)

---

## 🤝 Contributing

This is an open-source project — PRs welcome!

- 🐛 **Bug fixes** — See [issues labeled `bug`](https://github.com/andr-drgm/collaborators/issues?q=label%3Abug)
- ✨ **Features** — See [issues labeled `enhancement`](https://github.com/andr-drgm/collaborators/issues?q=label%3Aenhancement)
- 📖 **Docs** — Improve this README, add guides, fix typos

Please read our [Contributing Guide](CONTRIBUTING.md) before opening a PR.

---

## 📄 License

MIT © Collaborators Contributors — see [LICENSE](LICENSE)

---

<sub>🌐 Built with ❤️ on Solana · Maintained by [@andr-drgm](https://github.com/andr-drgm)</sub>
