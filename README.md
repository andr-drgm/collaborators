# Collaborators

Collaborators is a GitHub bounty marketplace that connects open-source work to on-chain rewards and reputation. Sponsors can attach USDC-denominated bounties to GitHub issues, contributors can submit pull requests as solutions, and the app tracks bounty status from issue discovery through PR submission and verification.

## What you can do

- Browse active bounties across public GitHub repositories.
- Search GitHub issues and create a bounty for an issue you want solved.
- Submit a pull request URL as your solution to an active bounty.
- Track your posted bounties, submitted solutions, and solved bounties from one dashboard.
- Link GitHub identity and a wallet through Privy so accepted work can be associated with the right contributor.
- Install or track the GitHub bot/webhook flow needed to verify repository activity.

## How the bounty flow works

### For sponsors

1. Sign in with Privy and link GitHub.
2. Search for a GitHub issue or select one of your own issues.
3. Create a bounty with an amount, title, description, issue URL, and repository metadata.
4. The bounty appears in the active bounty feed with `bounty` and `usdc-reward` metadata.
5. Review submitted pull requests.
6. When a winning PR is merged, the webhook flow marks the submission approved and the bounty solved.

### For contributors

1. Sign in with Privy and link GitHub.
2. Link or use the wallet created by Privy.
3. Pick an active bounty from the dashboard.
4. Open a pull request that solves the linked GitHub issue.
5. Submit the PR URL through the bounty card.
6. If the PR is merged and the bounty is still active, the app verifies the submission and records the solver.

## Current product areas

The dashboard is the main application surface and is organized around these views:

- **Active Bounties**: Browse open bounty opportunities and submit PR solutions.
- **My Issues**: Load GitHub issues for the authenticated user.
- **Solved Issues**: Review bounties solved by the current user.
- **My Bounties**: Manage bounties created by the current user.

The legacy contribution-tracking and NFT badge components are archived under `src/components/dashboard/archive`, `src/hooks/archive`, and `src/utils/archive` so they can be recovered later without confusing the current bounty marketplace MVP.

## Tech stack

- **Framework**: Next.js 15, React 19, TypeScript
- **Auth and wallet**: Privy with GitHub OAuth and Solana wallet support
- **Database**: Prisma with PostgreSQL
- **GitHub integration**: Octokit, GitHub search APIs, issue metadata, pull request webhook handling
- **Styling**: Tailwind CSS 4 with custom UI components
- **Deployment target**: Vercel or any Node-compatible host that supports Next.js and PostgreSQL

## Repository structure

```text
src/app/page.tsx                         Landing page
src/app/dashboard/page.tsx               Main bounty dashboard
src/app/api/bounties/route.ts            List and create bounties
src/app/api/bounties/[id]/route.ts       Update/delete individual bounties
src/app/api/bounties/submissions/route.ts Submit and list PR solutions
src/app/api/bounties/solved/route.ts     Solved bounty lookups
src/app/api/github/*                     GitHub issue, search, webhook, and bot endpoints
src/components/dashboard/BountyCard.tsx  Bounty display and PR submission UI
src/components/dashboard/IssueCard.tsx   GitHub issue display and bounty creation UI
src/components/dashboard/WalletConnect.tsx Wallet status UI
src/lib/privy.ts                         Privy token verification and user sync
src/lib/github-webhook.ts                GitHub webhook signature verification
prisma/schema.prisma                     User, bounty, submission, and bot models
```

## Local development

### Prerequisites

- Node.js 18 or newer
- pnpm
- PostgreSQL database
- Privy app with GitHub OAuth enabled
- GitHub personal access token or OAuth token for repository and issue lookups

### Install dependencies

```bash
pnpm install
```

`postinstall` runs `prisma generate`, and `prepare` installs Husky hooks.

### Configure environment variables

Create `.env.local` and set the values used by the app:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# Privy
NEXT_PUBLIC_PRIVY_APP_ID="your-privy-app-id"
PRIVY_APP_SECRET="your-privy-app-secret"

# GitHub API fallback tokens
GITHUB_TOKEN="github_pat_or_classic_pat"
GITHUB_ACCESS_TOKEN="optional_alternate_github_token"
GITHUB_WEBHOOK_SECRET="optional_webhook_secret"

# Public links used by the landing page
NEXT_PUBLIC_X_URL="https://x.com/collaborat0rs"
NEXT_PUBLIC_PRIVACY_URL="https://example.com/privacy"
NEXT_PUBLIC_TERMS_URL="https://example.com/terms"
```

Privy setup notes live in [`PRIVY_SETUP.md`](./PRIVY_SETUP.md). In the Privy dashboard, enable GitHub OAuth and turn on **Return OAuth tokens** so GitHub API calls can use the authenticated user's GitHub access token.

### Prepare the database

```bash
pnpm prisma generate
pnpm prisma migrate dev
```

### Run the app

```bash
pnpm dev
```

Open <http://localhost:3000> and sign in through the Privy modal.

## GitHub webhook setup

The webhook endpoint is:

```text
POST /api/github/webhook
```

Configure your GitHub app or repository webhook to send at least these events:

- `ping`
- `issues`
- `pull_request`

If `GITHUB_WEBHOOK_SECRET` is set, the app verifies `x-hub-signature-256` before processing events. In development the route logs signature mismatches instead of hard-failing so local testing is easier.

## Important data models

- `User`: Privy identity, GitHub username, wallet address, and relationships.
- `Bounty`: GitHub issue metadata, amount, status, poster, labels, and solved state.
- `BountySubmission`: contributor PR URL, PR number, status, and verification state.
- `BotInstallation`: repository-level bot installation tracking.

## API overview

### Public

- `GET /api/bounties?status=ACTIVE&limit=50` — list bounties by status.

### Authenticated with `Authorization: Bearer <privy-token>`

- `POST /api/bounties` — create a bounty for a GitHub issue.
- `GET /api/bounties/my` — list bounties created by the current user.
- `PATCH /api/bounties/[id]` — update a bounty amount/status.
- `DELETE /api/bounties/[id]` — cancel/delete a bounty.
- `POST /api/bounties/submissions` — submit a PR URL for a bounty.
- `GET /api/bounties/submissions` — list the current user's submissions or a bounty's submissions.
- `GET /api/bounties/solved` — list solved bounties for the current user.
- `GET /api/github/user/issues` — fetch issues for the authenticated GitHub user.

## Security and operations notes

- Keep `PRIVY_APP_SECRET`, `DATABASE_URL`, GitHub tokens, and webhook secrets server-side only.
- Never expose GitHub access tokens to the client; use Privy access tokens for app authentication.
- Use GitHub webhook signatures in production.
- Store wallet addresses, not private keys.
- Confirm payout and settlement logic before handling high-value bounties.
- The archived token-claiming code references legacy mint-authority environment variables and should not be re-enabled without a fresh security review.

## Roadmap ideas

- Fully automated GitHub label creation when a bounty is posted.
- On-chain escrow and settlement integration for funded bounties.
- Better submission ranking and review workflow for maintainers.
- Contributor reputation pages and public solved-bounty history.
- Notifications for PR submission, approval, rejection, and payout events.
- Public API access for external bounty aggregators and agent workflows.

## Contributing

1. Fork the repository.
2. Create a focused branch.
3. Keep changes small and tied to a single issue.
4. Run the relevant checks before opening a PR.
5. Reference the issue in your PR description.

Example:

```text
Closes #40
```

## Support

- Use GitHub Issues for bugs and feature requests.
- Review [`PRIVY_SETUP.md`](./PRIVY_SETUP.md) for authentication and wallet setup details.
- Check `MIGRATION_SUMMARY.md` for context on the dashboard migration from the legacy contribution tracker to the current bounty marketplace MVP.
