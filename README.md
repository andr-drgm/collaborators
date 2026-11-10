# Collaborators

Collaborators is a GitHub bounty marketplace for funding issues, submitting
pull request solutions, and tracking accepted work through a Privy-authenticated
dashboard.

The current product is centered on USDC-denominated bounties, GitHub issue and
pull request workflows, and automatic status updates from GitHub webhooks. Older
references to SOL token rewards and NFT badges are no longer representative of
the active codebase.

## What the App Does

- Lets users sign in with Privy and GitHub OAuth.
- Lists active GitHub issue bounties.
- Lets authenticated users create bounties from GitHub issues they can access.
- Lets developers submit pull request URLs as bounty solutions.
- Tracks bounty submissions and solved bounties in the dashboard.
- Uses GitHub webhook events to mark merged pull request submissions as
  approved and their bounties as solved.
- Tracks whether the Collaborators GitHub bot is installed for a repository.

## Product Workflow

1. A bounty creator connects GitHub and selects an issue from their repositories.
2. The creator posts a USDC bounty with an amount, title, description, and issue
   URL.
3. A developer opens the bounty, fixes the issue in GitHub, and submits the pull
   request URL in Collaborators.
4. When the pull request is merged, the GitHub webhook handler finds matching
   pending submissions for that repository and pull request number.
5. The matching submission is marked `APPROVED`, and the bounty is marked
   `SOLVED`.

## Tech Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma 6
- PostgreSQL
- Privy authentication and embedded wallets
- GitHub OAuth and webhook integration

## Repository Structure

```text
prisma/
  schema.prisma                  Database schema
  migrations/                    SQL migrations
src/app/
  api/                           Next.js route handlers
  dashboard/page.tsx             Main authenticated dashboard
  page.tsx                       Public landing page
src/components/
  dashboard/                     Dashboard cards and wallet UI
  ui/                            Shared UI effects
src/hooks/
  usePrivyAuth.ts                Privy user and wallet helper
src/lib/
  github-webhook.ts              Webhook signature verification
  privy.ts                       Privy token verification and user sync
src/services/
  github.ts                      GitHub issue API client helpers
```

## Prerequisites

- Node.js 18 or newer
- pnpm
- PostgreSQL database
- Privy app
- GitHub OAuth app
- Optional: GitHub App or webhook integration for automatic repository tracking

## Environment Variables

Create `.env.local` and configure the values used by the app:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

NEXT_PUBLIC_PRIVY_APP_ID="your_privy_app_id"
PRIVY_APP_SECRET="your_privy_app_secret"

GITHUB_CLIENT_ID="your_github_oauth_client_id"
GITHUB_CLIENT_SECRET="your_github_oauth_client_secret"
GITHUB_WEBHOOK_SECRET="your_github_webhook_secret"
```

The exact variable names should match the Privy and GitHub helpers in `src/lib`
and the OAuth setup in your deployment environment.

## Local Development

Install dependencies:

```bash
pnpm install
```

Generate the Prisma client:

```bash
pnpm prisma generate
```

Apply the database schema:

```bash
pnpm prisma migrate deploy
```

Run the development server:

```bash
pnpm dev
```

Open the app at:

```text
http://localhost:3000
```

## Available Scripts

```bash
pnpm dev      # Start the Next.js development server
pnpm build    # Generate Prisma client and build the app
pnpm start    # Start the production server
pnpm lint     # Run linting
```

## Main API Routes

### Bounties

- `GET /api/bounties`
  - Lists bounties by status.
  - Query parameters include `status`, `limit`, and `offset`.
- `POST /api/bounties`
  - Creates a bounty for a GitHub issue.
  - Requires a Privy bearer token.
- `PUT /api/bounties/[id]`
  - Updates a bounty.
  - Requires a Privy bearer token.
- `DELETE /api/bounties/[id]`
  - Deletes a bounty.
  - Requires a Privy bearer token.
- `GET /api/bounties/my`
  - Lists bounties created by the authenticated user.
- `GET /api/bounties/solved`
  - Lists bounties solved by the authenticated user.
- `POST /api/bounties/submissions`
  - Submits a pull request URL for a bounty.

### GitHub

- `GET /api/github/user/issues`
  - Fetches issues visible to the authenticated GitHub user.
- `GET /api/github/bot/installation`
  - Checks whether the bot is marked as installed for a repository.
- `POST /api/github/bot/installation`
  - Marks a repository as having the bot installed.
- `POST /api/github/webhook`
  - Handles GitHub webhook events for repository registration, issue updates,
    and merged pull request verification.

## Data Model Overview

The core Prisma models are:

- `User`
  - Stores Privy, GitHub, wallet, and profile fields.
- `Bounty`
  - Stores the GitHub issue, bounty amount, status, poster, and solved metadata.
- `BountySubmission`
  - Stores a developer's pull request submission for a bounty.
- `BotInstallation`
  - Tracks repositories where the Collaborators GitHub bot is installed.

## GitHub Webhook Behavior

The webhook route handles:

- `ping`
  - Registers the repository in `BotInstallation` when the sender can be matched
    to a known user.
- `issues.closed`
  - Marks an active bounty as solved when the linked issue is closed.
- `pull_request.closed` with `merged: true`
  - Finds pending submissions with the same repository and pull request number,
    approves the submission, and marks the bounty as solved.

For production deployments, configure `GITHUB_WEBHOOK_SECRET` and ensure the
GitHub webhook sends `issues`, `pull_request`, and `ping` events.

## Current Limitations

- The app records USDC bounty amounts, but payment settlement is not fully
  implemented in this repository.
- Adding labels to GitHub issues is currently marked as a TODO in the bounty
  creation flow.
- GitHub App authentication for writing labels is not implemented yet.
- Webhook signature verification is logged and checked when configured, but the
  current route still allows development-friendly behavior.
- A user can submit only one solution per bounty.

## Contributing

Open a pull request with a clear description of the behavior changed, the files
affected, and the manual or automated checks you ran. For changes that affect
bounty state, include the relevant API route and webhook scenario in the PR
description.

## License

MIT
