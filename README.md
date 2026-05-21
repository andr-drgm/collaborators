# Collaborators

Collaborators is a GitHub bounty marketplace for open-source work. Project owners attach USDC rewards to GitHub issues, contributors submit pull requests, and accepted work is tracked through the app.

The current product is focused on a practical bounty workflow:

- Find GitHub issues that need work
- Create and manage USDC-denominated bounties
- Submit pull request URLs as bounty solutions
- Track active, solved, expired, and cancelled bounties
- Use Privy for GitHub sign-in and wallet handling
- Store bounty, submission, user, and bot-installation data in PostgreSQL through Prisma

## How The Bounty Flow Works

### For bounty posters

1. Sign in with GitHub through Privy.
2. Connect or create a wallet through the Privy flow.
3. Search for a GitHub issue from the dashboard.
4. Create a bounty with a USDC amount.
5. Install or confirm the GitHub bot for the target repository.
6. Review submitted pull requests.
7. Approve a solution after the pull request is accepted or merged.

### For contributors

1. Browse active bounties in the dashboard.
2. Open the linked GitHub issue.
3. Fix the issue in a fork or branch.
4. Open a pull request against the repository.
5. Submit the pull request URL through the bounty card.
6. Wait for maintainer review and bounty approval.

## What Is In This Repository

This is a Next.js app with a dashboard-driven bounty marketplace.

Key areas:

- `src/app/page.tsx`: public landing page
- `src/app/dashboard/page.tsx`: authenticated bounty dashboard
- `src/app/api/bounties`: bounty creation, listing, editing, deletion, and solved-bounty routes
- `src/app/api/bounties/submissions`: pull request submission endpoint
- `src/app/api/github`: GitHub issue search, issue details, user issues, labels, commits, and webhook routes
- `src/components/dashboard`: dashboard cards for issues, bounties, profile, and wallet state
- `src/components/BotInstallationStatus.tsx`: repository bot installation guidance and status tracking
- `src/lib/privy.ts`: server-side Privy verification and database sync helpers
- `prisma/schema.prisma`: user, bounty, submission, account, session, and bot installation models

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- Privy authentication and embedded wallets
- GitHub API via Octokit
- Solana libraries for wallet and token-related work
- Vercel deployment configuration

## Data Model

The Prisma schema includes these core marketplace records:

- `User`: stores Privy identity, GitHub identity, wallet address, accounts, sessions, posted bounties, and bounty submissions.
- `Bounty`: stores the GitHub issue, repository owner and name, bounty amount, status, labels, poster, and solution state.
- `BountySubmission`: stores the submitted pull request URL, pull request number, verification state, and approval status.
- `BotInstallation`: stores whether the GitHub bot has been confirmed for a repository.

Important status values:

- Bounties: `ACTIVE`, `SOLVED`, `EXPIRED`, `CANCELLED`
- Submissions: `PENDING`, `APPROVED`, `REJECTED`

## Requirements

Install these before running the app locally:

- Node.js 18 or newer
- pnpm
- PostgreSQL database
- Privy app
- GitHub OAuth app or GitHub token for API calls

## Environment Variables

Create `.env.local` and configure the values needed for your environment.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

NEXT_PUBLIC_PRIVY_APP_ID="your_privy_app_id"
PRIVY_APP_SECRET="your_privy_app_secret"

GITHUB_TOKEN="your_github_token"
GITHUB_ACCESS_TOKEN="optional_fallback_github_access_token"
GITHUB_WEBHOOK_SECRET="optional_webhook_secret"

NEXT_PUBLIC_X_URL="https://x.com/collaborat0rs"
NEXT_PUBLIC_PRIVACY_URL="https://example.com/privacy"
NEXT_PUBLIC_TERMS_URL="https://example.com/terms"
```

Notes:

- `DATABASE_URL` is required by Prisma.
- Privy is required for authenticated dashboard flows.
- GitHub API routes use `GITHUB_TOKEN`, user-linked GitHub tokens, or `GITHUB_ACCESS_TOKEN`, depending on the route.
- `GITHUB_WEBHOOK_SECRET` is optional in development, but should be configured in production.

## Privy Setup

1. Create a Privy application.
2. Enable GitHub login.
3. Enable embedded wallets if you want the app to create wallets for new users.
4. Add local and production domains in the Privy dashboard.
5. If GitHub API calls should use the signed-in user's token, enable GitHub OAuth token return in Privy.
6. Copy the Privy app ID and secret into `.env.local`.

The current provider configuration uses GitHub as the login method and sets up Solana embedded wallets. The local default chain is configured as Solana Devnet, so confirm the intended production chain before using real payout flows.

## GitHub Setup

The app needs GitHub access for issue search, issue details, user issues, labels, commits, and webhook events.

Recommended setup:

1. Create a GitHub OAuth app for local development and production.
2. Configure Privy GitHub login with the OAuth credentials.
3. Add a GitHub token for server-side fallback API calls.
4. Configure webhook delivery for issue and pull request events.
5. Set `GITHUB_WEBHOOK_SECRET` in production.

Webhook route:

```text
/api/github/webhook
```

Handled webhook events:

- `ping`
- `issues`
- `pull_request`

## Local Development

Install dependencies:

```bash
pnpm install
```

Generate the Prisma client:

```bash
pnpm prisma generate
```

Push the schema to your database:

```bash
pnpm prisma db push
```

Run the app:

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

## Available Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```

The production build command in `vercel.json` is:

```bash
prisma generate && prisma db push && next build
```

Review this carefully before production use. Running `prisma db push` during deployment can be convenient for prototypes, but production apps usually need a more controlled migration process.

## Dashboard Features

The dashboard is organized around bounty work:

- Active bounties: browse open bounty opportunities.
- My issues: view GitHub issues connected to the signed-in user.
- Solved issues: review bounties the user has solved.
- My bounties: manage bounties created by the signed-in user.

The bounty cards show:

- Bounty title and description
- USDC amount
- Current status
- Linked GitHub issue
- Repository bot installation state
- Pull request submission action
- Solver information after approval

## Submission Flow

Contributors submit a pull request through the dashboard using the bounty card.

The submission endpoint expects:

```json
{
  "bountyId": "bounty_record_id",
  "prUrl": "https://github.com/owner/repo/pull/123",
  "prNumber": 123
}
```

The app validates that:

- The user is authenticated.
- The bounty exists.
- The bounty is active.
- The user has not already submitted for the same bounty.

## Bot Installation Tracking

`BotInstallationStatus` shows whether the app knows that the GitHub bot is installed for a repository.

The related API route stores:

- Repository owner
- Repository name
- Installation status
- User who confirmed installation

The webhook route can update repository state when GitHub sends events.

## Deployment

The project includes a Vercel configuration:

```json
{
  "buildCommand": "prisma generate && prisma db push && next build",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}
```

Before production deployment, confirm:

- Production database URL is set.
- Privy production domain is configured.
- GitHub OAuth callback settings match the production domain.
- Webhook URL and secret are configured.
- Wallet and chain settings match the intended payout environment.
- Database migration strategy is appropriate for production.

## Security Notes

- Keep `PRIVY_APP_SECRET`, GitHub tokens, and database credentials out of source control.
- Do not expose server-only secrets through `NEXT_PUBLIC_` variables.
- Use webhook signature verification in production.
- Avoid logging full user profiles or tokens in production logs.
- Confirm the chain and token configuration before processing real payouts.
- Treat bounty approval as a financial action and keep the review step explicit.

## Troubleshooting

### GitHub issues are not loading

Check that a GitHub token is configured and that Privy is returning GitHub tokens if the route depends on the signed-in user.

### Authentication works but dashboard data is missing

Confirm that Privy user sync is writing to the database and that `DATABASE_URL` points to the intended database.

### Webhook events are received but not trusted

Set `GITHUB_WEBHOOK_SECRET` and verify that GitHub uses the same secret when sending webhook events.

### Bot status is wrong

Check the `BotInstallation` table and confirm that the repository owner and name match GitHub exactly.

### Build fails on Prisma

Run `pnpm prisma generate` locally and confirm that `DATABASE_URL` is available in the build environment.

## Project Status

Collaborators is currently structured as a GitHub bounty marketplace MVP. Some legacy wording and files still refer to earlier contribution-tracking and token-reputation flows, but the active dashboard and API routes are centered on USDC bounties, GitHub pull request submissions, Privy authentication, and Prisma-backed marketplace records.

## Contributing

Good contributions for this repository include:

- Clearer bounty and submission UX
- Stronger webhook verification and event handling
- More complete payout and approval documentation
- Safer production migration setup
- Better contributor onboarding
- Tests for bounty creation, submission, and approval paths

Open a focused pull request with a short explanation of what changed, why it helps, and how it was checked.

## License

No license file is currently included in the repository. Add a license before encouraging broad reuse or redistribution.
