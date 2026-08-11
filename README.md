# Collaborators

A GitHub bounty marketplace where developers can discover issues, fund rewards, and get paid for solving real engineering work. The platform combines GitHub issue discovery, Privy wallet authentication, and a lightweight bounty workflow backed by Prisma and a Next.js app.

## Overview

Collaborators turns GitHub activity into a structured marketplace for open-source contribution. Users can:

- sign in with Privy
- connect a GitHub account and wallet
- browse public GitHub issues
- create or fund bounties on issues
- submit pull requests for bounty-linked tasks
- track their issues and solved work from a dashboard

This project is best understood as an MVP for a developer rewards marketplace, not a fully mature blockchain payout system yet.

## Key Features

- Privy-based authentication and wallet access
- GitHub issue search and issue detail integration
- Bounty creation and listing workflow
- User dashboard for my issues, my bounties, and solved work
- GitHub webhook support for issue and pull request lifecycle tracking
- Prisma-backed persistence for users, bounties, submissions, and bot installation metadata
- Solana-related wallet support via Privy embedded wallet configuration

## Product Flow

1. A user signs in through Privy and links a GitHub account.
2. The app syncs the Privy user to the database and stores GitHub metadata.
3. A user browses or creates a bounty for a GitHub issue.
4. Another developer solves the issue via a pull request.
5. GitHub webhook events update the submission and bounty status.
6. The dashboard surfaces active bounties, solved work, and user activity.

## Tech Stack

- Frontend: Next.js 15, React 19, TypeScript
- Styling: Tailwind CSS
- Auth: Privy
- Database: PostgreSQL via Prisma
- GitHub integration: GitHub REST API + webhook handling
- Wallet/crypto: Solana SDK and Privy wallet support
- Runtime: Node.js
- Deployment: Vercel-ready Next.js app

## Project Structure

```text
.
├── prisma/
│   └── schema.prisma
├── public/
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── dashboard/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── PrivyProviders.tsx
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   ├── utils/
│   ├── prisma.ts
│   └── prismaClient.ts
├── package.json
├── pnpm-lock.yaml
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
├── vercel.json
└── README.md
```

## Core Architecture

### Authentication

The app uses Privy as the primary identity layer, with user synchronization into the database via the helper in [src/lib/privy.ts](src/lib/privy.ts). This includes:

- access token verification
- user profile retrieval
- database upsert/sync for Privy users
- GitHub account linkage handling

### Dashboard

The application dashboard is implemented in [src/app/dashboard/page.tsx](src/app/dashboard/page.tsx). It handles:

- active bounties
- user issues
- my bounties
- solved submissions
- bounty creation and editing flows

### Bounty System

The bounty workflow is driven by Prisma models and API routes:

- [src/app/api/bounties/route.ts](src/app/api/bounties/route.ts)
- [src/app/api/bounties/my/route.ts](src/app/api/bounties/my/route.ts)
- [src/app/api/bounties/submissions/route.ts](src/app/api/bounties/submissions/route.ts)
- [src/app/api/bounties/solved/route.ts](src/app/api/bounties/solved/route.ts)

These endpoints authorize users by Privy token, sync the user, and then read or mutate bounty-related records.

### GitHub Integration

The app uses GitHub issue search and issue retrieval APIs through the service layer in [src/services/github.ts](src/services/github.ts). Webhook handlers for repository events live in [src/app/api/github/webhook/route.ts](src/app/api/github/webhook/route.ts).

## Environment Variables

Create a `.env.local` file at the project root with the required values:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/collaborators

# GitHub API
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_WEBHOOK_SECRET=your_github_webhook_secret

# Optional: if you add custom Solana or payout configuration later
SOLANA_RPC_URL=https://api.devnet.solana.com
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL database
- Privy app configured for your project
- GitHub access token for API usage
- GitHub webhook secret for webhook verification

### Install dependencies

```bash
pnpm install
```

### Generate Prisma client

```bash
npx prisma generate
```

### Run database migrations

```bash
npx prisma migrate dev
```

### Start the app

```bash
pnpm dev
```

Then open:

```text
http://localhost:3000
```

## Privy Setup

1. Create a Privy app in the Privy dashboard.
2. Copy the app ID and secret into your environment variables.
3. Configure your app to support wallet login and GitHub account linking.
4. Ensure your frontend uses the app ID in [src/app/PrivyProviders.tsx](src/app/PrivyProviders.tsx).

The app is currently configured to use embedded Solana wallets and GitHub login methods via Privy.

## GitHub Setup

### GitHub API

The project uses the GitHub REST API through the app routes and services, including:

- issue search
- issue details
- labels
- user-owned issues retrieval

### GitHub Webhooks

Configure a webhook for your repository or test endpoint to receive:

- issue events
- pull request events
- ping events

The verification logic is in [src/app/api/github/webhook/route.ts](src/app/api/github/webhook/route.ts).

## Database Schema

The Prisma schema in [prisma/schema.prisma](prisma/schema.prisma) includes:

- User
- Account
- Session
- Bounty
- BountySubmission
- BotInstallation
- Legacy Project and ProjectAssignment models

The schema is broader than the current UI flow and includes legacy fields from earlier product iterations.

## Typical User Journey

```text
Login -> GitHub link -> Dashboard -> Search issue -> Create bounty -> Submit PR -> Verify via webhook -> Bounty status updates
```

## Current Status

This repository is an early-to-mid stage MVP for a developer bounty marketplace. The core workflow is implemented, but some parts are still evolving, including:

- GitHub label automation
- full payout/escrow logic
- deeper reward automation
- production hardening and security validation

## Roadmap

- complete GitHub bot integration for repo labeling and verification
- add stronger bounty payout and escrow flows
- improve submission validation and fraud detection
- strengthen production webhook signing and admin controls
- add analytics and user reputation surfaces
- expand wallet and payout capabilities across chains

## Contributing

Contributions are welcome. Please follow the existing coding style and keep changes focused.

### Development notes

This project uses Husky hooks during install, and the repository includes a lint step via the project scripts in [package.json](package.json).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details if present in your checkout.

## Support

For questions or issues:

- open a GitHub issue
- review the app routes and dashboard implementation
- check the current configuration in [src/lib/privy.ts](src/lib/privy.ts) and [src/app/PrivyProviders.tsx](src/app/PrivyProviders.tsx)

---

Collaborators is built to help developers turn GitHub work into visible, verifiable rewards and structured issue-based collaboration.

