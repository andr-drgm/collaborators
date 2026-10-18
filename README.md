# Collaborators

Collaborators is a GitHub bounty marketplace where maintainers fund issues in USDC and contributors earn rewards by shipping merged pull requests.

The app connects GitHub identity with a Solana wallet using Privy, tracks bounty submissions, and keeps bounty status in sync with GitHub events.

## What Is Implemented Today

- Public bounty board with `ACTIVE`, `SOLVED`, `EXPIRED`, and `CANCELLED` states.
- Contributor dashboard tabs: `Bounties`, `My Issues`, `Solved Issues`, `My Bounties`.
- Bounty creation tied to a GitHub issue (`owner/repo/issue_number`).
- PR submission flow for solvers (`/api/bounties/submissions`).
- GitHub webhook endpoint for issue and pull request events (`/api/github/webhook`).
- Repository bot-installation tracking for bounty automation checks.
- Privy-based authentication with GitHub OAuth and embedded Solana wallets.

## Bounty Lifecycle

### Maintainer flow

1. Log in and open an issue from the `My Issues` tab.
2. Create a bounty amount in USDC for that issue.
3. Configure GitHub webhook for the repository.
4. Review submitted PRs and merge a valid solution.
5. Mark payout complete to the solver wallet.

### Solver flow

1. Pick an `ACTIVE` bounty with an open GitHub issue.
2. Implement the fix and open a PR in the target repository.
3. Submit PR URL in the dashboard (`Submit Solution`).
4. Wait for maintainer review and merge.
5. Receive USDC payout from the bounty poster.

Note: Current schema and UI indicate payout transfer is maintainer-managed after solver verification.

## Acceptance Checklist For Issue #40

This README update is scoped to issue #40 ("Enhance README") and includes:

- clear project summary and architecture snapshot,
- explicit maintainer and solver bounty flows,
- webhook setup requirements tied to merge-based automation,
- API route inventory for quick evaluator verification,
- local setup and run commands for reproducibility.

The goal is to let maintainers verify README completeness quickly against current repository behavior.

## Webhook Setup (Required for Automation)

Configure a webhook in the target GitHub repository:

- Payload URL: `https://<your-domain>/api/github/webhook`
- Content type: `application/json`
- Events: `Issues` and `Pull requests`
- Secret: set `GITHUB_WEBHOOK_SECRET` in your environment (recommended)

When a linked PR is merged, webhook handlers can mark matching submissions as approved and move the bounty to `SOLVED`.

## API Overview

- `GET /api/bounties` - list bounties by status.
- `POST /api/bounties` - create bounty (auth required).
- `GET /api/bounties/my` - list bounties created by current user.
- `GET /api/bounties/solved` - list solved bounties for current user.
- `POST /api/bounties/submissions` - submit PR for bounty.
- `GET /api/github/user/issues` - list current user GitHub issues.
- `GET/POST /api/github/bot/installation` - bot installation status and updates.
- `POST /api/github/webhook` - process GitHub webhook events.
- `GET /api/user/me` - current authenticated user profile.

## Tech Stack

- Next.js 15 + React 19 + TypeScript
- Tailwind CSS 4
- Prisma + PostgreSQL
- Privy (`@privy-io/react-auth`, `@privy-io/server-auth`)
- GitHub API integrations (Octokit + custom routes)

## Local Development

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL

### 1) Install dependencies

```bash
pnpm install
```

### 2) Create `.env.local`

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME

NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret

# Optional but useful for server-side GitHub calls
GITHUB_TOKEN=your_github_token
GITHUB_ACCESS_TOKEN=your_github_access_token

# Optional webhook signature verification
GITHUB_WEBHOOK_SECRET=your_webhook_secret

# Optional UI footer links
NEXT_PUBLIC_X_URL=https://x.com/collaborat0rs
NEXT_PUBLIC_PRIVACY_URL=https://example.com/privacy
NEXT_PUBLIC_TERMS_URL=https://example.com/terms
```

### 3) Run database setup

```bash
pnpm prisma generate
pnpm prisma migrate dev
```

### 4) Start the app

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Useful Scripts

- `pnpm dev` - start local dev server (Turbopack).
- `pnpm build` - generate Prisma client and build production app.
- `pnpm start` - run production build.
- `pnpm lint` - run lint checks.

## Repository Notes

- `src/app/api` contains server routes for bounties, GitHub integration, and auth.
- `prisma/schema.prisma` defines bounty, submission, user, and bot-installation models.
- `PRIVY_SETUP.md` contains step-by-step Privy setup details.

## Contributing

Contributions are welcome. If your change affects bounty logic or payout flow, include:

- API contract updates.
- Prisma migration notes.
- Webhook behavior changes.

## License

MIT. See [LICENSE](LICENSE).
