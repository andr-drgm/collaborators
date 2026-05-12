# Collaborators

Collaborators is a GitHub bounty marketplace for funding and solving open
source issues with USDC rewards. Maintainers create bounties against GitHub
issues, contributors submit pull requests, and the app tracks submissions,
GitHub activity, and bounty status.

## What The App Does

- Lets users sign in with Privy and connect GitHub identity.
- Displays active, solved, expired, and cancelled GitHub bounties.
- Lets maintainers create USDC bounties tied to GitHub issue URLs.
- Lets contributors submit pull request URLs for active bounties.
- Stores bounties and submissions in PostgreSQL through Prisma.
- Uses GitHub webhooks to react to issue and pull request events.
- Tracks GitHub bot installation status per repository.
- Keeps the older contribution-tracking dashboard code archived for reference.

## Current Product Flow

### Maintainers

1. Sign in with Privy.
2. Connect GitHub through the supported auth flow.
3. Choose a GitHub issue from the dashboard or provide an issue URL.
4. Create a USDC bounty with the desired reward amount.
5. Install and configure the GitHub webhook or bot integration.
6. Review submitted pull requests and complete payout according to the current
   product process.

### Contributors

1. Browse active bounties.
2. Open the linked GitHub issue.
3. Fork the repository and submit a pull request.
4. Submit the pull request URL through Collaborators.
5. Wait for maintainer review, merge verification, and payout processing.

## Tech Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma 6
- PostgreSQL
- Privy for authentication and wallet-aware user identity
- Octokit for GitHub API integration
- GitHub webhooks for issue and pull request status updates
- Vercel deployment configuration

## Repository Structure

```text
src/app
  api
    auth/privy              Privy auth endpoint
    bounties                Bounty listing, detail, solved, and submission APIs
    github                  GitHub issue, bot, commit, label, and webhook APIs
    projects                Legacy project routes kept for archived flows
  dashboard                 Authenticated dashboard routes
  page.tsx                  Public landing page
src/components
  dashboard                 Current and archived dashboard components
src/hooks
  usePrivyAuth.ts           Privy user and wallet helper
src/lib
  github-webhook.ts         GitHub webhook signature helper
  privy.ts                  Server-side Privy helpers
src/utils
  links.ts                  Public link configuration
prisma
  schema.prisma             User, bounty, submission, and installation models
```

## Main Data Models

The Prisma schema currently includes these core models:

- `User`: Privy identity, GitHub profile fields, wallet fields, and relations.
- `Bounty`: GitHub issue metadata, USDC reward amount, poster, status, and
  solver metadata.
- `BountySubmission`: Submitted PR URL, PR number, contributor, bounty, and
  review status.
- `BotInstallation`: GitHub App or bot installation metadata for repositories.

The schema also contains legacy project and assignment models used by archived
dashboard flows.

## API Overview

| Area | Endpoint | Purpose |
| --- | --- | --- |
| Auth | `POST /api/auth/privy` | Sync or validate Privy-authenticated users |
| Bounties | `GET /api/bounties` | List bounties |
| Bounties | `POST /api/bounties` | Create a bounty |
| Bounties | `GET /api/bounties/[id]` | Fetch one bounty |
| Bounties | `GET /api/bounties/my` | Fetch bounties created by the current user |
| Bounties | `GET /api/bounties/solved` | Fetch solved bounties |
| Submissions | `GET /api/bounties/submissions` | Fetch bounty submissions |
| Submissions | `POST /api/bounties/submissions` | Submit a PR for a bounty |
| GitHub | `POST /api/github/webhook` | Handle issue, PR, and ping webhook events |
| GitHub | `GET /api/github/user/issues` | Fetch issues connected to the user |
| GitHub | `GET /api/github/issues/details` | Fetch GitHub issue details |
| GitHub | `GET /api/github/issues/labels` | Fetch issue labels |
| GitHub | `GET /api/github/search/issues` | Search GitHub issues |
| GitHub | `GET /api/github/commits` | Fetch GitHub commits |
| GitHub | `GET/POST /api/github/bot/installation` | Check or store bot installation state |

## Environment Variables

Create a local `.env.local` file before running the app.

### Required

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
NEXT_PUBLIC_PRIVY_APP_ID="your_privy_app_id"
PRIVY_APP_SECRET="your_privy_app_secret"
```

### Recommended For GitHub Features

```env
GITHUB_WEBHOOK_SECRET="shared_webhook_secret"
GITHUB_TOKEN="github_token_for_server_calls"
GITHUB_ACCESS_TOKEN="fallback_github_access_token"
```

Privy GitHub login should be configured to return OAuth tokens when the app
needs user-scoped GitHub access. See `PRIVY_SETUP.md` for the Privy setup
checklist.

### Optional Public Links

```env
NEXT_PUBLIC_X_URL="https://x.com/collaborat0rs"
NEXT_PUBLIC_PRIVACY_URL="https://example.com/privacy"
NEXT_PUBLIC_TERMS_URL="https://example.com/terms"
```

### Legacy Archived Token Claim Variables

These variables are referenced only by archived Solana token-claim code and are
not required for the current bounty marketplace flow.

```env
NEXT_PUBLIC_SOLANA_RPC_URL="https://api.mainnet-beta.solana.com"
NEXT_PUBLIC_MINT_AUTHORITY_SECRET_KEY="legacy_mint_authority_secret"
```

## Local Development

Install dependencies:

```bash
pnpm install
```

Generate the Prisma client:

```bash
pnpm prisma generate
```

Apply database migrations or push the schema to a development database:

```bash
pnpm prisma migrate dev
```

Start the development server:

```bash
pnpm dev
```

Open `http://localhost:3000` in your browser.

## GitHub Webhook Setup

Configure a webhook on each repository that should update bounty status.

- Payload URL: `https://your-domain.com/api/github/webhook`
- Content type: `application/json`
- Secret: same value as `GITHUB_WEBHOOK_SECRET`
- Events: `Issues`, `Pull requests`, and `Ping`

The webhook handler currently:

- Accepts `ping` events and records bot installation metadata when present.
- Handles issue lifecycle events for matching bounties.
- Handles merged pull requests and approves matching pending bounty submissions.

The `addBountyLabel` helper is currently a placeholder, so automatic GitHub
label creation still needs to be implemented before labels can be managed by
the webhook.

## Development Notes

- The current README should describe the bounty marketplace, not the older
  automatic SOL/NFT reputation product.
- `PRIVY_SETUP.md` contains a detailed Privy integration checklist.
- Archived dashboard and Solana token-claim code remain in `archive`
  directories for future reference.
- This repository does not currently include a license file.

## Contributing

1. Pick an open issue or bounty.
2. Keep changes small and focused.
3. Run the relevant checks before opening a pull request.
4. Link the pull request to the issue or bounty it solves.
5. Submit the PR URL through Collaborators when the bounty requires it.

Useful checks:

```bash
pnpm lint
pnpm build
```

## Status

Collaborators is focused on the USDC GitHub bounty workflow. The app still has
some archived code and placeholder integration points, so documentation should
call out current behavior clearly instead of describing planned or legacy
features as completed.
