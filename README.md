# Collaborators

Collaborators is a GitHub-first bounty marketplace for open-source work. Maintainers publish USDC-denominated rewards on GitHub issues, contributors submit pull requests, and the app tracks bounty status, submissions, verification, and solver history.

The application is built as a Next.js dashboard with Privy authentication, Prisma/PostgreSQL persistence, GitHub issue and webhook integrations, and Solana wallet support for the reward flow.

## What The App Does

- Turns GitHub issues into bounty listings with repository, issue, label, amount, poster, and status metadata.
- Lets contributors discover active bounties, open the source issue, and submit a PR URL for review.
- Tracks each bounty submission as `PENDING`, `APPROVED`, or `REJECTED`.
- Marks bounties as solved when a maintainer closes the tracked issue or a webhook records the accepted solver.
- Stores user profile, GitHub identity, Privy wallet identity, bot installation, and legacy project-assignment data.
- Provides a dashboard for posted bounties, submitted solutions, issue search, profile state, and wallet connection.

## Tech Stack

- Next.js 15 and React 19
- TypeScript
- Tailwind CSS 4
- Prisma 6 with PostgreSQL
- Privy for embedded authentication and wallet identity
- Octokit for GitHub API access
- Solana Web3.js and SPL Token helpers
- Vercel-oriented deployment config

## Repository Map

```text
src/app/                         Next.js app routes and API handlers
src/app/api/bounties/            Bounty listing, detail, and submission APIs
src/app/api/github/              GitHub issue search, labels, webhook, and bot installation APIs
src/components/dashboard/        Dashboard cards and bounty UI
src/hooks/usePrivyAuth.ts        Privy session helper
src/lib/privy.ts                 Server-side Privy client
src/prisma.ts                    Prisma client export
prisma/schema.prisma             Database schema
PRIVY_SETUP.md                   Privy setup notes
MIGRATION_SUMMARY.md             Migration context from legacy project flows
```

## Data Model

The current Prisma schema centers on these records:

- `User`: profile, GitHub login, Privy id, wallet address, unclaimed token count, and relationships.
- `Bounty`: one reward listing per GitHub issue and repository, with USDC amount, labels, poster, status, solved fields, and submissions.
- `BountySubmission`: a contributor PR URL, PR number, status, verification fields, and the submitting user.
- `BotInstallation`: installed GitHub bot state for a repository.
- `Project` and `ProjectAssignment`: legacy project-tracking models kept for migration compatibility.

## Local Setup

### Prerequisites

- Node.js 20 or newer
- pnpm
- PostgreSQL
- A Privy app
- GitHub OAuth or GitHub app credentials, depending on the flow you are testing

### Install

```bash
git clone https://github.com/andr-drgm/collaborators.git
cd collaborators
pnpm install
```

### Environment

Create `.env.local` and configure the values used by the app:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE

NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret

GITHUB_WEBHOOK_SECRET=your_webhook_secret

NEXT_PUBLIC_X_URL=https://x.com/collaborat0rs
NEXT_PUBLIC_PRIVACY_URL=https://example.com/privacy
NEXT_PUBLIC_TERMS_URL=https://example.com/terms
```

Use local-only test credentials for development. Do not commit real secrets.

### Database

Generate the Prisma client after dependency installation:

```bash
pnpm prisma generate
```

Apply migrations or sync the schema with the workflow used by your deployment:

```bash
pnpm prisma migrate dev
```

### Run

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Common Workflows

### Post Or Track A Bounty

1. Create a GitHub issue for the work.
2. Add bounty metadata in the Collaborators dashboard.
3. The app stores the issue id, repository owner/name, title, description, labels, poster, and USDC amount.
4. Contributors use the linked issue and repository to prepare their PR.

### Submit A Solution

1. Open an active bounty.
2. Create a PR in the target repository.
3. Submit the PR URL through the bounty submission flow.
4. The app records the PR number and keeps the submission pending until verification.

### Webhook Verification

The GitHub webhook route listens for issue and PR events. When a tracked issue is closed or a completion signal is detected, the app can update the matching bounty as solved and record solver metadata.

Configure the webhook secret with `GITHUB_WEBHOOK_SECRET` and point GitHub to the deployed webhook route.

## Scripts

```bash
pnpm dev       # Start local development server
pnpm build     # Generate Prisma client and build Next.js
pnpm start     # Start production build
pnpm lint      # Run lint command configured by the project
```

`postinstall` runs `prisma generate`, and Husky is prepared through the `prepare` script.

## Deployment Notes

- Set the same environment variables in Vercel or your hosting provider.
- Ensure the production database is reachable by Prisma.
- Keep webhook secrets and Privy secrets server-side only.
- Run the production build before release to catch Prisma and Next.js integration issues.

## Security Notes

- Never expose `PRIVY_APP_SECRET`, `DATABASE_URL`, private wallet keys, or webhook secrets in client-side code.
- Validate PR URLs before accepting bounty submissions.
- Treat webhook events as untrusted until signature verification succeeds.
- Keep payout state separate from display state so pending submissions cannot be mistaken for approved rewards.

## Contributing

Contributions are welcome. For bounty work, link your PR to the relevant GitHub issue and keep changes scoped to the requested behavior. For documentation changes, prefer repository-accurate setup steps over broad marketing copy.
