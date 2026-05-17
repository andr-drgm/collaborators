# Collaborators

Collaborators is a GitHub bounty marketplace for funding open-source issues
with USDC rewards. Maintainers create bounties from GitHub issues, contributors
submit pull request URLs as solutions, and the dashboard tracks bounty,
submission, webhook, and wallet state.

This README describes the current bounty marketplace implementation. Older
automatic SOL reward, NFT badge, and NextAuth-based flows are legacy concepts
and are not the active product path in this repository.

## Current Product Flow

### Contributors

1. Sign in with GitHub through Privy.
2. Link or use a Solana wallet managed by Privy.
3. Browse active bounties in the dashboard.
4. Open the linked GitHub issue and implement the fix in a focused pull
   request.
5. Submit the pull request URL through Collaborators.
6. Wait for maintainer review and merge verification.

### Bounty Posters

1. Sign in with GitHub through Privy.
2. Open the dashboard and review GitHub issues visible to the account.
3. Create a USDC bounty tied to a specific issue URL.
4. Confirm the GitHub bot or webhook setup for the repository.
5. Review submitted pull requests.
6. Complete payout handling after the accepted pull request is merged.

## What Is Implemented

- Public landing page for GitHub-based bounty onboarding.
- Privy authentication with GitHub as the configured login method.
- Privy Solana embedded wallet creation for users without wallets.
- Dashboard tabs for active bounties, user issues, solved bounties, and posted
  bounties.
- Bounty creation, editing, deletion, listing, and submission APIs.
- GitHub issue search and user issue lookup helpers.
- GitHub webhook handling for `ping`, `issues`, and `pull_request` events.
- Prisma models for users, bounties, submissions, and bot installations.
- Repository-level bot installation status tracking.

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 15 App Router |
| UI | React 19, TypeScript, Tailwind CSS 4 |
| Auth | Privy with GitHub OAuth |
| Wallets | Privy Solana embedded wallets and external wallet support |
| Database | PostgreSQL with Prisma 6 |
| GitHub | Octokit, GitHub REST APIs, GitHub webhooks |
| Deployment | Vercel-ready Next.js app |

## Repository Map

```text
prisma/
  schema.prisma                 User, bounty, submission, and bot models
  migrations/                   SQL migration files
public/                         Static assets and icons
src/app/
  api/                          Next.js route handlers
  dashboard/page.tsx            Authenticated bounty dashboard
  page.tsx                      Public landing page
  PrivyProviders.tsx            Privy client provider and wallet config
src/components/
  dashboard/                    Bounty, issue, profile, and wallet cards
  ui/                           Shared UI effects
src/hooks/
  usePrivyAuth.ts               Client hook for synced user and wallet state
src/lib/
  github-webhook.ts             Webhook signature verification
  privy.ts                      Server-side Privy verification and user sync
src/services/
  github.ts                     Client helpers for app GitHub API routes
src/utils/
  links.ts                      Public link constants
```

## Prerequisites

- Node.js 18 or newer
- pnpm
- PostgreSQL database
- Privy app with GitHub login enabled
- GitHub OAuth app or token configuration for GitHub API access
- Optional GitHub webhook secret for production webhook verification

## Environment Variables

Create `.env.local` and set the values needed by the routes you run locally.

### Required

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
NEXT_PUBLIC_PRIVY_APP_ID="your_privy_app_id"
PRIVY_APP_SECRET="your_privy_app_secret"
```

### GitHub Integration

```env
GITHUB_TOKEN="server_github_token_for_public_issue_search_or_label_reads"
GITHUB_ACCESS_TOKEN="fallback_token_for_user_issue_or_commit_routes"
GITHUB_WEBHOOK_SECRET="shared_secret_for_github_webhook_verification"
```

Privy GitHub login should be configured to return OAuth tokens when the app
needs user-scoped GitHub access. The user issue and commit routes can fall back
to `GITHUB_ACCESS_TOKEN` or `GITHUB_TOKEN`, but user-specific behavior works best
when Privy returns the GitHub OAuth token.

### Public Links

```env
NEXT_PUBLIC_X_URL="https://x.com/collaborat0rs"
NEXT_PUBLIC_PRIVACY_URL="https://example.com/privacy"
NEXT_PUBLIC_TERMS_URL="https://example.com/terms"
```

### Archived Token Claim Flow

These variables are only referenced by archived dashboard token-claim code and
are not required for the current bounty marketplace path.

```env
NEXT_PUBLIC_SOLANA_RPC_URL="https://api.mainnet-beta.solana.com"
NEXT_PUBLIC_MINT_AUTHORITY_SECRET_KEY="legacy_mint_authority_secret"
```

Never commit `.env.local`, private keys, OAuth secrets, webhook secrets, wallet
seed material, or mint authority keys.

## Local Development

Install dependencies:

```bash
pnpm install
```

Generate the Prisma client:

```bash
pnpm prisma generate
```

Apply migrations in a development database:

```bash
pnpm prisma migrate dev
```

Start the app:

```bash
pnpm dev
```

Open the local app:

```text
http://localhost:3000
```

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the Next.js development server with Turbopack. |
| `pnpm build` | Generate Prisma Client and build the production app. |
| `pnpm start` | Start the production app after a build. |
| `pnpm lint` | Run the configured lint command. |
| `pnpm postinstall` | Generate Prisma Client after dependency install. |
| `pnpm prepare` | Install Husky hooks. |

## Main API Routes

### Bounties

| Route | Purpose |
| --- | --- |
| `GET /api/bounties` | List bounties by status, limit, and offset. |
| `POST /api/bounties` | Create a bounty for a GitHub issue. Requires a Privy bearer token. |
| `PUT /api/bounties/[id]` | Update a bounty. Requires the poster's Privy bearer token. |
| `DELETE /api/bounties/[id]` | Delete a bounty. Requires the poster's Privy bearer token. |
| `GET /api/bounties/my` | List bounties posted by the authenticated user. |
| `GET /api/bounties/solved` | List solved bounties for the authenticated user. |
| `GET /api/bounties/submissions` | List submissions for the authenticated user or a bounty. |
| `POST /api/bounties/submissions` | Submit a pull request URL for an active bounty. |

### GitHub

| Route | Purpose |
| --- | --- |
| `GET /api/github/search/issues` | Search GitHub issues. |
| `GET /api/github/user/issues` | Fetch issues visible to the authenticated GitHub user. |
| `GET /api/github/issues/details` | Fetch details for one issue. |
| `POST /api/github/issues/labels` | Add labels when a server GitHub token is available. |
| `GET /api/github/commits` | Fetch commits for a repository. |
| `GET /api/github/bot/installation` | Check stored bot installation status for a repository. |
| `POST /api/github/bot/installation` | Store bot installation status for a repository. |
| `DELETE /api/github/bot/installation` | Remove stored bot installation status for a repository. |
| `POST /api/github/webhook` | Handle GitHub `ping`, `issues`, and `pull_request` webhooks. |

## Bounty State Model

The core Prisma models are:

- `User`: Privy identity, GitHub profile fields, wallet address, and relations.
- `Bounty`: GitHub issue metadata, USDC amount, poster, status, and solved
  metadata.
- `BountySubmission`: Submitted PR URL, PR number, contributor, verification
  state, and related bounty.
- `BotInstallation`: Stored repository installation status for the
  Collaborators bot or webhook flow.

`Bounty.status` can be `ACTIVE`, `SOLVED`, `EXPIRED`, or `CANCELLED`.
`BountySubmission.status` can be `PENDING`, `APPROVED`, or `REJECTED`.

## Webhook Behavior

Configure GitHub to send webhook events to:

```text
https://your-domain.com/api/github/webhook
```

Recommended events:

- `ping`
- `issues`
- `pull_request`

When `GITHUB_WEBHOOK_SECRET` is configured, the route verifies the
`x-hub-signature-256` signature. The current development-friendly handler logs
signature failures instead of rejecting them, so tighten this behavior before
using the route in a strict production environment.

The webhook currently:

- records bot installation metadata on `ping` when the sender maps to a known
  user;
- marks an active bounty solved when its linked issue is closed;
- approves matching pending submissions and marks the bounty solved when a
  submitted pull request is merged.

## Known Limitations

- USDC transfer or escrow settlement is not implemented in this repository; the
  app records bounty and submission state, while payout handling still needs a
  production settlement flow.
- Automatic GitHub label writing is incomplete in the webhook helper and bounty
  creation flow.
- A contributor can submit only one solution per bounty.
- Some archived project assignment and token claim components remain in the
  repository for reference and are not part of the current bounty marketplace.
- The default Privy Solana chain in the client provider is Devnet, which is
  appropriate for testing but should be reviewed before mainnet payout flows.

## Contributing

1. Keep changes small and tied to a GitHub issue or bounty.
2. Update documentation when behavior, routes, environment variables, or setup
   steps change.
3. Run the relevant checks before opening a pull request.
4. Include the issue number, changed files, and verification steps in the pull
   request description.
5. Submit the pull request URL through Collaborators when working on a bounty.

Useful checks:

```bash
pnpm lint
pnpm build
```
