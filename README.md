# Collaborators

Collaborators is a GitHub bounty marketplace that connects public GitHub issues with on-chain USDC rewards. Maintainers can attach bounties to issues, contributors can submit pull request solutions, and the platform tracks bounty status, submissions, and verification.

## What It Does

- Browse public GitHub issues and discover bounty opportunities.
- Add USDC bounties to GitHub issues.
- Submit pull request solutions for active bounties.
- Track active bounties, submitted solutions, and user-created bounties.
- Connect GitHub identity with a Solana wallet through Privy.
- Store bounty, submission, user, and bot-installation state in PostgreSQL through Prisma.

## How The Bounty Flow Works

1. A user signs in and connects GitHub through Privy.
2. The user searches public GitHub issues from the dashboard.
3. A bounty is created for a GitHub issue and labeled for tracking.
4. A contributor submits a pull request URL as the bounty solution.
5. The GitHub bot and platform state track whether the PR solves the issue.
6. Once the work is accepted, the bounty can be marked solved and payment can be released according to the platform flow.

## Tech Stack

- Next.js 15 and React 19
- TypeScript
- Tailwind CSS
- Privy for authentication, GitHub OAuth, and Solana wallet management
- Prisma and PostgreSQL
- GitHub API and webhook integration
- Vercel-ready deployment configuration

## Repository Structure

```text
src/app/                    Next.js app routes and API routes
src/app/dashboard/           Bounty marketplace dashboard
src/app/api/bounties/        Bounty creation, lookup, submission, and solved-state APIs
src/app/api/github/          GitHub search, issue, commit, webhook, and bot APIs
src/components/dashboard/    Dashboard cards, bounty cards, issue cards, wallet UI
src/hooks/                   Privy auth helpers
src/lib/                     Privy and GitHub webhook utilities
src/services/                GitHub service helpers
src/utils/                   Shared helpers and external links
prisma/                      Prisma schema and migrations
```

Archived dashboard code from the previous contribution-tracking system lives under `src/**/archive/`. See `MIGRATION_SUMMARY.md` for the migration notes.

## Prerequisites

- Node.js 18 or newer
- pnpm
- PostgreSQL database
- Privy application with GitHub login enabled
- GitHub account
- Optional: GitHub token for server-side GitHub API fallback calls

## Environment Variables

Create `.env.local` and configure the values needed for your environment:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/collaborators"

NEXT_PUBLIC_PRIVY_APP_ID="your_privy_app_id"
PRIVY_APP_SECRET="your_privy_app_secret"

GITHUB_WEBHOOK_SECRET="your_github_webhook_secret"
GITHUB_TOKEN="optional_github_token"
GITHUB_ACCESS_TOKEN="optional_github_access_token"

NEXT_PUBLIC_X_URL="https://x.com/collaborat0rs"
NEXT_PUBLIC_PRIVACY_URL="https://example.com/privacy"
NEXT_PUBLIC_TERMS_URL="https://example.com/terms"
```

Privy GitHub login should be configured to return OAuth tokens if you want user-authenticated GitHub API calls. See `PRIVY_SETUP.md` for the full setup guide.

## Local Development

Install dependencies:

```bash
pnpm install
```

Generate the Prisma client:

```bash
pnpm prisma generate
```

Run database migrations:

```bash
pnpm prisma migrate dev
```

Start the development server:

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Useful Scripts

```bash
pnpm dev      # Start the local Next.js dev server
pnpm build    # Generate Prisma client and build the Next.js app
pnpm start    # Start the production server
pnpm lint     # Run the configured lint command
```

## Privy Setup Checklist

1. Create a Privy application.
2. Enable GitHub login.
3. Enable email login if desired.
4. Enable Solana embedded wallets.
5. Add local and production domains to the allowed-domain list.
6. Enable GitHub OAuth token return if GitHub API calls need the user's token.
7. Add `NEXT_PUBLIC_PRIVY_APP_ID` and `PRIVY_APP_SECRET` to `.env.local`.

## GitHub Integration

The platform includes API routes for:

- Searching GitHub issues.
- Reading issue details and labels.
- Reading user issues.
- Handling GitHub webhooks.
- Tracking bot installation state.
- Tracking PR submissions against bounties.

For webhook verification, set `GITHUB_WEBHOOK_SECRET`. For unauthenticated or fallback GitHub API calls, set either `GITHUB_TOKEN` or `GITHUB_ACCESS_TOKEN`.

## Bounty Data Model

The main Prisma models are:

- `User`: Privy identity, GitHub profile fields, wallet address, and user relationships.
- `Bounty`: GitHub issue metadata, USDC amount, status, labels, and poster.
- `BountySubmission`: Submitted PR URL, PR number, review status, and verification state.
- `BotInstallation`: GitHub owner/repo bot installation tracking.

The bounty status enum supports `ACTIVE`, `SOLVED`, `EXPIRED`, and `CANCELLED`. Submission status supports `PENDING`, `APPROVED`, and `REJECTED`.

## Security Notes

- Never commit `.env.local` or private keys.
- Keep `PRIVY_APP_SECRET`, GitHub tokens, and webhook secrets server-side only.
- Use Privy wallet flows for user wallet management instead of handling seed phrases.
- Validate GitHub webhook signatures before trusting webhook payloads.
- Treat bounty payment and approval flows as financial actions that need clear user confirmation.

## Deployment

The app is configured for Vercel-style deployment. Before deploying:

1. Add all required environment variables to the hosting provider.
2. Run database migrations against the production database.
3. Configure Privy allowed domains and OAuth settings for the production URL.
4. Configure GitHub webhook delivery to the deployed API route.

## Additional Documentation

- `PRIVY_SETUP.md`: Privy authentication and wallet setup guide.
- `MIGRATION_SUMMARY.md`: Dashboard migration summary.
- `prisma/schema.prisma`: Database schema and relationships.

## License

The repository currently references an MIT license. Add or verify a `LICENSE` file before publishing release artifacts that depend on explicit license terms.
