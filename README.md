# Collaborators 🚀

> **The Decentralized GitHub Bounty Marketplace.**  
> Turn open-source GitHub issues into escrow-backed USDC bounties on Solana. Solve problems, submit pull requests, and get paid instantly upon merge.

[![Live App](https://img.shields.io/badge/Live%20App-collaborators.build-14F195?style=flat&logo=solana)](https://collaborators.build)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Solana](https://img.shields.io/badge/Solana-Web3.js-9945FF?style=flat&logo=solana)](https://solana.com/)
[![Privy](https://img.shields.io/badge/Auth-Privy-indigo)](https://privy.io/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma%206-2D3748?style=flat&logo=prisma)](https://prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📖 Overview

**Collaborators** bridges open-source software development with Web3 micro-incentives. Project maintainers and community sponsors can attach guaranteed **USDC bounties** to any public GitHub issue. Developers worldwide can discover bounties, resolve issues, and receive automated on-chain payouts the moment their Pull Request is merged.

No manual invoice chasing. No middlemen. Just code, merge, and get rewarded.

---

## ✨ Key Features

- **Guaranteed Escrow in USDC**: Bounties are funded upfront and held in smart escrow, ensuring solvers always get paid when their solution is accepted.
- **GitHub-Native Workflow**: Connect via GitHub, browse issues, and submit solutions directly through normal Git pull requests.
- **Instant Settlement on Merge**: Integrated GitHub webhooks detect when a PR closes an issue, automatically releasing USDC directly to the solver's Solana wallet.
- **Seamless Web3 Onboarding with Privy**: Frictionless login connecting your GitHub account with embedded or external Solana wallets (Phantom, Solflare, Backpack).
- **Public & Multi-Repo Support**: Fund and solve issues across any public GitHub repository.

---

## 🔄 How It Works

```
┌───────────────────────────┐         ┌───────────────────────────┐
│   Maintainer / Sponsor    │         │   Contributor / Solver    │
└─────────────┬─────────────┘         └─────────────┬─────────────┘
              │                                     │
     1. Connect Wallet & GitHub            2. Browse Active Bounties
              │                                     │
     3. Fund Issue with USDC (Escrow)      4. Fork Repo & Write Fix
              │                                     │
     5. Set Up GitHub Webhook              6. Open PR with Solution
              │                                     │
              └───────────────► 7. Review & Merge ◄─┘
                                       │
                         8. Webhook Detects PR Merge
                                       │
                  9. Smart Escrow Releases USDC to Solver's Wallet! 💸
```

### 1. For Bounty Posters (Maintainers & Sponsors)
1. **Connect**: Log in at [collaborators.build](https://collaborators.build) using your GitHub account and connect your Solana wallet.
2. **Select Issue**: Search and select any issue from your repositories or public projects.
3. **Fund Bounty**: Set the bounty reward amount in USDC and deposit to escrow.
4. **Automate Tracking**: Add the webhook URL `https://collaborators.build/api/github/webhook` to your repository settings with `Issues` and `Pull requests` events enabled.

### 2. For Bounty Solvers (Contributors)
1. **Explore**: Browse open bounties on the [Active Bounties](https://collaborators.build) dashboard.
2. **Build**: Fork the repository, create a branch, write clean code, and run tests.
3. **Submit**: Open a Pull Request referencing the issue (e.g., `Closes #40`) and submit your PR URL on the Collaborators dashboard.
4. **Earn**: When the maintainer approves and merges your PR, the webhook triggers the payment release directly to your connected wallet.

---

## 🛠️ Technical Stack

| Layer | Technologies |
|---|---|
| **Framework** | [Next.js 15.3](https://nextjs.org/) (App Router, Turbopack) |
| **Frontend Library** | [React 19](https://react.dev/) |
| **Styling & FX** | [Tailwind CSS v4](https://tailwindcss.com/), [GSAP](https://greensock.com/), [OGL](https://github.com/oframe/ogl) |
| **Authentication** | [@privy-io/react-auth](https://privy.io/) & `@privy-io/server-auth` |
| **Blockchain** | [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/), [@solana/spl-token](https://spl.solana.com/token) (USDC) |
| **Database & ORM** | [PostgreSQL](https://www.postgresql.org/), [Prisma ORM 6](https://www.prisma.io/) |
| **GitHub API** | [@octokit/core](https://github.com/octokit/core.js), GitHub Webhooks API |

---

## 📁 Repository Structure

```
the-collaborator/
├── prisma/
│   └── schema.prisma         # Database schema (Users, Bounties, Repositories, Solutions)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── bounties/     # Bounty creation, funding & lifecycle endpoints
│   │   │   ├── github/
│   │   │   │   └── webhook/  # Webhook handler listening to PR merge & issue events
│   │   │   └── user/         # User profile and wallet management
│   │   ├── dashboard/        # Main bounty marketplace dashboard
│   │   ├── layout.tsx        # App root layout with PrivyProvider & theme
│   │   └── page.tsx          # Landing page with WebGL shaders & marketing copy
│   ├── components/
│   │   ├── dashboard/        # Active bounties, issue search, and solver modals
│   │   ├── ui/               # Reusable UI components & cards
│   │   └── wallet/           # Solana wallet connectors
│   └── lib/                  # Database, Octokit & Solana escrow utility clients
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- **Node.js**: v20.x or higher
- **Package Manager**: `pnpm` (`npm install -g pnpm`)
- **PostgreSQL Database**: Local instance or hosted (Neon, Supabase)
- **Privy Account**: Application ID & App Secret from [dashboard.privy.io](https://dashboard.privy.io)
- **Solana Wallet / Devnet RPC**: Phantom, Solflare, or a local keypair for testing

### 1. Clone & Install
```bash
git clone https://github.com/andr-drgm/collaborators.git
cd collaborators
pnpm install
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/collaborators?schema=public"

# Privy Authentication
NEXT_PUBLIC_PRIVY_APP_ID="your_privy_app_id"
PRIVY_APP_SECRET="your_privy_app_secret"

# Solana & Escrow
NEXT_PUBLIC_SOLANA_RPC_URL="https://api.devnet.solana.com"
NEXT_PUBLIC_USDC_MINT_ADDRESS="4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU" # Devnet USDC
ESCROW_AUTHORITY_SECRET_KEY="[your_solana_private_key_array]"

# GitHub Webhook
GITHUB_WEBHOOK_SECRET="your_custom_webhook_secret"
```

### 3. Initialize Database
```bash
pnpm prisma generate
pnpm prisma db push
```

### 4. Run Development Server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🔔 GitHub Webhook Setup Guide

To automate bounty payouts when PRs are merged:

1. Go to your repository on GitHub: `Settings` → `Webhooks` → `Add webhook`.
2. **Payload URL**: `https://collaborators.build/api/github/webhook`
3. **Content type**: `application/json`
4. **Secret**: Enter your `GITHUB_WEBHOOK_SECRET` (optional but recommended).
5. **Which events would you like to trigger this webhook?**:
   - Select **Let me select individual events**.
   - Check **Issues**.
   - Check **Pull requests**.
6. Click **Add webhook**.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork this repository.
2. Create a feature branch (`git checkout -b feat/my-improvement`).
3. Commit your changes with clear messages (`git commit -m 'feat: add feature'`).
4. Push to your branch (`git push origin feat/my-improvement`).
5. Open a Pull Request referencing any relevant issues.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built for the open-source community by <a href="https://collaborators.build">Collaborators.build</a>.</sub>
</div>
