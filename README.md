<p align="center">
  <img src="public/logo.png" alt="Collaborators Logo" width="200" />
</p>

<h1 align="center">Collaborators</h1>

<p align="center">
  <strong>Transform your open source contributions into on-chain rewards</strong>
</p>

<p align="center">
  <a href="https://collaborators.build">Website</a> •
  <a href="#-quickstart">Quickstart</a> •
  <a href="#-bounty-marketplace">Bounty Marketplace</a> •
  <a href="#-api-reference">API</a> •
  <a href="#-contributing">Contributing</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Solana-Mainnet-9945FF?logo=solana&logoColor=white" alt="Solana" />
  <img src="https://img.shields.io/badge/USDC-Payments-2775CA?logo=circle&logoColor=white" alt="USDC" />
  <img src="https://img.shields.io/badge/Next.js-14-000?logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License" />
</p>

---

## What is Collaborators?

Collaborators is a **GitHub Bounty Marketplace** where developers earn USDC for solving open source issues. Create bounties on GitHub issues, solve them, submit a PR, and get paid automatically when your code is merged.

### For Issue Creators
Post a bounty on any GitHub issue. USDC is locked in escrow. When a contributor's PR is merged, payment releases automatically — no invoices, no delays.

### For Contributors
Find issues with real USDC rewards attached. Fix the issue, submit a PR, and get paid the moment it merges. Build an on-chain reputation that follows you everywhere.

---

## 🚀 Quickstart

### As a Contributor (Earn USDC)

```
1. Visit https://collaborators.build
2. Sign in with GitHub
3. Connect your Solana wallet (Phantom, Solflare, etc.)
4. Browse open bounties
5. Fork the repo, fix the issue, submit a PR
6. Get paid automatically on merge ✅
```

### As a Bounty Creator (Fund Issues)

```
1. Sign in with GitHub at collaborators.build
2. Navigate to any GitHub issue you own
3. Set a USDC bounty amount
4. USDC is locked in escrow
5. Review & merge the winning PR
6. Payment releases to the contributor automatically
```

---

## 💰 Bounty Marketplace

### How Bounties Work

| Step | Creator | Contributor |
|------|---------|-------------|
| 1 | Posts bounty + funds escrow | Finds open bounty |
| 2 | Reviews incoming PRs | Forks repo, implements fix |
| 3 | Merges the best PR | Submits PR with solution |
| 4 | Payment auto-releases | Receives USDC in wallet |

### Bounty Lifecycle

```
CREATED → ACTIVE → SUBMITTED → VERIFIED → PAID
   │                    │           │
   │                    │           └── USDC released to contributor
   │                    └── PR submitted & linked
   └── USDC locked in escrow
```

### Current Bounties

Browse live bounties at **[collaborators.build](https://collaborators.build)** or via the API:

```bash
curl https://collaborators.build/api/bounties
```

---

## 📡 API Reference

### List Bounties

```http
GET /api/bounties
```

Returns all active bounties with submission details.

**Response:**
```json
[
  {
    "id": "cmhds5ikz...",
    "title": "Fix authentication bug",
    "bountyAmount": "100",
    "status": "ACTIVE",
    "githubRepoOwner": "org-name",
    "githubRepoName": "repo-name",
    "githubIssueUrl": "https://github.com/org/repo/issues/1",
    "submissions": []
  }
]
```

### Submit a Bounty Claim

After merging your PR, submit through the Collaborators web UI. The platform verifies the merge and releases payment.

---

## 🏗️ Architecture

```
┌──────────────┐     ┌──────────────────┐     ┌─────────────┐
│  Next.js UI  │────▶│  API Routes      │────▶│  PostgreSQL  │
│  (React)     │     │  (NextAuth +     │     │  (Prisma)    │
│              │     │   GitHub OAuth)   │     │              │
└──────────────┘     └──────────────────┘     └─────────────┘
       │                      │
       ▼                      ▼
┌──────────────┐     ┌──────────────────┐
│  Solana      │     │  GitHub API      │
│  Blockchain  │     │  (Webhooks +     │
│  (USDC +     │     │   PR tracking)   │
│   NFT mint)  │     │                  │
└──────────────┘     └──────────────────┘
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, React, TypeScript, Tailwind CSS |
| **Auth** | NextAuth.js with GitHub OAuth |
| **Database** | PostgreSQL via Prisma ORM |
| **Blockchain** | Solana (USDC payments, NFT badges) |
| **Wallets** | Phantom, Solflare, and WalletConnect |
| **Deployment** | Vercel |

---

## 🛠️ Development Setup

### Prerequisites

- **Node.js** 18+ and **pnpm**
- **PostgreSQL** database
- **Solana wallet** with SOL for transaction fees
- **GitHub account** with OAuth app configured

### Installation

```bash
# Clone the repository
git clone https://github.com/andr-drgm/collaborators.git
cd collaborators

# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env.local
```

### Environment Variables

```env
# GitHub OAuth (create at github.com/settings/developers)
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret     # openssl rand -hex 32
NEXTAUTH_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/collaborators

# Solana
REACT_APP_MINT_AUTHORITY_SECRET_KEY=your_mint_authority_key
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

### GitHub OAuth Setup

1. Go to **Settings → Developer Settings → OAuth Apps → New OAuth App**
2. Set **Homepage URL**: `http://localhost:3000`
3. Set **Callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret to `.env.local`

### Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🎨 Design System

| Element | Spec |
|---------|------|
| **Theme** | Dark mode with cyan-to-teal gradients |
| **Fonts** | Geist Sans (UI), Geist Mono (code) |
| **Components** | Glass-morphism cards, hover animations |
| **Layout** | Mobile-first, responsive breakpoints |
| **Accessibility** | WCAG 2.1 AA contrast ratios, keyboard navigation |

---

## 🗺️ Roadmap

- [x] GitHub OAuth + wallet connection
- [x] USDC bounty creation and escrow
- [x] Automatic payment on PR merge
- [x] NFT badge minting for achievements
- [ ] Team leaderboards
- [ ] Multi-chain support (Polygon, Base)
- [ ] API keys for programmatic bounty creation
- [ ] Discord/Slack integration for bounty notifications
- [ ] AI agent compatibility (autonomous bounty claiming)

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create a branch**: `git checkout -b feat/your-feature`
3. **Make changes** and write tests
4. **Run linting**: `pnpm lint`
5. **Submit a PR** with a clear description

### Code Standards

- TypeScript strict mode
- ESLint + Prettier formatting (enforced via pre-commit hooks)
- Conventional commits (`feat:`, `fix:`, `docs:`)
- All PRs require review before merge

### Bounty Contributors

Check [open bounties](https://collaborators.build) for paid contribution opportunities. Bounty PRs follow the same process — your payment releases automatically on merge.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

## 🆘 Support

- 📖 **Docs**: This README + inline help tooltips
- 🐛 **Bugs**: [Open an issue](https://github.com/andr-drgm/collaborators/issues)
- 💬 **Community**: GitHub Discussions
- 📧 **Contact**: Reach the team via GitHub

---

<p align="center">
  <strong>Collaborators</strong> — Get paid for open source. Build reputation on-chain.
</p>
