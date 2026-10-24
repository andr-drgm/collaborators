# Collaborators

Collaborators is a GitHub bounty marketplace for funding issues with USDC,
submitting pull request solutions, and tracking bounty outcomes from a single
dashboard.

The app is built around a simple loop:

1. A maintainer signs in, picks a GitHub issue, and creates a USDC bounty.
2. A contributor finds an active bounty and submits a pull request.
3. The contributor submits the pull request URL back to Collaborators.
4. The GitHub webhook flow detects the merged pull request and marks the bounty
   as solved.

## Current Product

The current codebase focuses on a bounty workflow, not the older generic
contribution-reputation concept. The main user experience is available from the
dashboard after Privy authentication.

Core capabilities:

- Browse active, solved, expired, and cancelled bounties.
- Create a bounty from a GitHub issue.
- Submit a pull request URL as a solution to an active bounty.
- Track submitted solutions and solved bounties.
- Connect GitHub identity through Privy.
- Store Solana wallet information for reward routing.
- Check whether a repository webhook has been installed for automatic tracking.

## How The Bounty Flow Works

### For maintainers

1. Log in with Privy.
2. Connect or create the wallet managed by the configured Privy application.
3. Use the dashboard to find or select a GitHub issue.
4. Create a bounty with the issue URL, repository owner, repository name,
   title, description, and USDC amount.
5. Install the webhook on the repository so Collaborators can receive issue and
   pull request events.
6. Review submitted pull requests and merge the accepted solution.

### For contributors

1. Log in with Privy.
2. Browse active bounties in the dashboard.
3. Open the linked GitHub issue and read the repository requirements.
4. Create a pull request that fixes the issue.
5. Submit the pull request URL through the bounty card.
6. Wait for the maintainer to review and merge the pull request.

## Dashboard Areas

The dashboard is implemented in `src/app/dashboard/page.tsx` and is organized
around four tabs:

- `Bounties`: active bounty discovery and solution submission.
- `My Issues`: authenticated GitHub issue browsing.
- `Solved Issues`: bounties with submitted solutions and verification state.
- `My Bounties`: bounty management for bounties created by the current user.

Supporting dashboard components live in `src/components/dashboard/`:

- `ProfileCard.tsx`: current user information.
- `WalletConnect.tsx`: connected wallet display.
- `BountyCard.tsx`: bounty summary, issue link, bot status, and PR submission.
- `IssueCard.tsx`: GitHub issue summary and bounty creation entry point.
- `BotInstallationStatus.tsx`: webhook installation guidance for repositories.

## Architecture

```text
Privy auth + wallet
        |
        v
Next.js app router dashboard
        |
        +--> GitHub issue search/read APIs
        |
        +--> Bounty CRUD APIs
        |
        +--> Submission APIs
        |
        v
Prisma + PostgreSQL
        |
        v
GitHub webhook events for issues and pull requests
```

Important paths:

- `src/app/page.tsx`: public landing page.
- `src/app/dashboard/page.tsx`: authenticated marketplace dashboard.
- `src/app/api/bounties/route.ts`: list and create bounties.
- `src/app/api/bounties/[id]/route.ts`: update and delete bounties.
- `src/app/api/bounties/submissions/route.ts`: submit and list PR solutions.
- `src/app/api/bounties/solved/route.ts`: solved bounty data.
- `src/app/api/github/search/issues/route.ts`: GitHub issue search proxy.
- `src/app/api/github/user/issues/route.ts`: authenticated user issue list.
- `src/app/api/github/webhook/route.ts`: GitHub webhook event handling.
- `src/lib/privy.ts`: Privy server client and user sync.
- `src/lib/github-webhook.ts`: webhook signature validation.
- `prisma/schema.prisma`: database models and relations.

## Data Model

The main Prisma models are:

- `User`: Privy identity, GitHub login fields, wallet address, and relations.
- `Bounty`: one funded GitHub issue with amount, status, poster, labels, and
  solved state.
- `BountySubmission`: one contributor submission per bounty/user pair,
  containing the pull request URL and PR number.
- `BotInstallation`: records repositories where the webhook setup has been
  confirmed.

Current status enums:

- `BountyStatus`: `ACTIVE`, `SOLVED`, `EXPIRED`, `CANCELLED`
- `SubmissionStatus`: `PENDING`, `APPROVED`, `REJECTED`

## Tech Stack

- Next.js 15 app router
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma 6
- PostgreSQL
- Privy authentication and embedded wallet support
- Octokit for GitHub API access
- Vercel-ready deployment configuration

## Local Development

### Prerequisites

- Node.js 20 or newer is recommended.
- `pnpm`
- PostgreSQL database
- Privy application with GitHub login enabled
- GitHub token or Privy GitHub OAuth tokens for GitHub issue APIs

### Install dependencies

```bash
pnpm install
```

### Configure environment

Create `.env.local` in the repository root.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
NEXT_PUBLIC_PRIVY_APP_ID="your-privy-app-id"
PRIVY_APP_SECRET="your-privy-app-secret"
GITHUB_TOKEN="github-token-for-public-issue-search"
GITHUB_ACCESS_TOKEN="optional-fallback-github-token"
GITHUB_WEBHOOK_SECRET="optional-webhook-secret"
NEXT_PUBLIC_X_URL="https://x.com/collaborat0rs"
NEXT_PUBLIC_PRIVACY_URL="https://example.com/privacy"
NEXT_PUBLIC_TERMS_URL="https://example.com/terms"
```

Notes:

- Keep `PRIVY_APP_SECRET`, database URLs, GitHub tokens, and webhook secrets out
  of source control.
- Enable "Return OAuth tokens" for GitHub in the Privy dashboard if the app
  should call GitHub APIs using the authenticated user's GitHub account.
- `GITHUB_TOKEN` is used by the public GitHub issue search and label routes as a
  server-side fallback.

### Prepare the database

```bash
pnpm prisma generate
pnpm prisma migrate dev
```

### Run the app

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Webhook Setup

For automatic bounty verification, each bounty repository needs a GitHub
webhook that points to:

```text
https://YOUR_DOMAIN/api/github/webhook
```

Recommended webhook settings:

- Content type: `application/json`
- Events: `Issues` and `Pull requests`
- Secret: match `GITHUB_WEBHOOK_SECRET` when configured

The webhook route currently handles:

- `ping`: records the repository installation for the authenticated user when
  possible.
- `issues`: marks matching active bounties solved when the issue closes.
- `pull_request`: approves pending submissions and solves the bounty when a
  matching pull request is merged.

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm prisma generate
pnpm prisma migrate dev
```

`pnpm build` runs `prisma generate` before building the Next.js app.

## Repository Notes

- Archived dashboard components are kept under `src/components/dashboard/archive/`,
  `src/hooks/archive/`, and `src/utils/archive/` for reference.
- `PRIVY_SETUP.md` contains detailed Privy configuration guidance.
- `MIGRATION_SUMMARY.md` explains the migration from the earlier contribution
  tracking dashboard to the bounty marketplace dashboard.
- `vercel.json` is present for deployment configuration.

## Security And Payment Notes

- Never commit real private keys, API keys, database URLs, wallet recovery
  phrases, webhook secrets, or OAuth tokens.
- Treat wallet addresses as public identifiers, but keep wallet recovery details
  private.
- Use HTTPS for production webhook URLs.
- Configure webhook signature verification before relying on automatic bounty
  state changes in production.
- Review bounty amount, issue URL, and repository owner/name before creating a
  bounty.
- Confirm that a submitted PR belongs to the correct repository and issue before
  approving or paying a bounty.

## Troubleshooting

### GitHub issue search returns empty results

- Confirm `GITHUB_TOKEN` is configured.
- Confirm Privy GitHub OAuth has "Return OAuth tokens" enabled.
- Check the API response from `src/app/api/github/search/issues/route.ts`.

### User issue browsing fails

- Confirm the user is authenticated with Privy.
- Confirm the Privy access token is being sent in the `Authorization` header.
- Confirm the linked GitHub account returned an OAuth token.

### Webhook events are not changing bounty status

- Confirm the repository webhook URL points to the deployed app.
- Confirm `Issues` and `Pull requests` events are enabled.
- Confirm the webhook secret matches `GITHUB_WEBHOOK_SECRET`.
- Check deployment logs for the event type and signature validation output.

### Bounty submission is rejected

- Confirm the bounty is still `ACTIVE`.
- Confirm the PR URL is a valid GitHub pull request URL.
- Confirm the same user has not already submitted for the bounty.
- Confirm the PR number matches the submitted PR URL.

## Contributing

1. Create a branch from `main`.
2. Keep changes scoped to one issue.
3. Run the relevant checks before opening a pull request.
4. Include a concise summary of what changed and how it was verified.

For documentation-only changes, confirm that referenced files, routes,
environment variables, and scripts exist in the repository.

## License

This repository currently does not include a license file. Add one before
claiming a specific open-source license in the README or package metadata.
