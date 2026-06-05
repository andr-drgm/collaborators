# Collaborators

Collaborators is a GitHub bounty marketplace where maintainers fund public
issues with USDC and contributors get paid when their pull requests are merged
and verified.

The platform connects GitHub identity, an embedded Solana wallet, and
webhook-based pull request tracking so open-source work can be rewarded without
manual payout coordination.

## What It Does

- Lets maintainers attach USDC bounties to GitHub issues.
- Helps contributors discover paid issues across public repositories.
- Tracks submitted pull requests against bounty issues.
- Verifies merged PRs through GitHub events.
- Releases escrowed USDC to the connected contributor wallet.
- Builds an on-chain contribution and reward history for developers.

## How It Works

1. Sign in with GitHub.
2. Connect or create a Solana wallet through Privy.
3. Browse active bounties and choose a GitHub issue.
4. Open a pull request that solves the issue.
5. Submit the PR URL to the bounty.
6. When the PR is merged and verified, the reward is released.

## Repository Status

This project is a Next.js application for the Collaborators bounty marketplace.
It includes the web app, database schema, GitHub integration logic, and
deployment configuration.

The app currently uses:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- Privy authentication and embedded wallet flows
- GitHub APIs and webhooks
- Vercel deployment configuration

## Prerequisites

Before running the app locally, install:

- Node.js 18 or newer
- pnpm
- PostgreSQL
- A GitHub OAuth app
- A Privy app
- Access to a Solana-compatible wallet for testing payout flows

## Local Setup

Clone the repository:

```bash
git clone https://github.com/andr-drgm/collaborators.git
cd collaborators
```

Install dependencies:

```bash
pnpm install
```

Create the local environment file:

```bash
cp .env.example .env.local
```

If `.env.example` is not present yet, create `.env.local` manually using the
variables listed below.

## Environment Variables

The exact required variables can change as integrations evolve, but a local
setup generally needs:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/collaborators"

GITHUB_CLIENT_ID="your_github_oauth_client_id"
GITHUB_CLIENT_SECRET="your_github_oauth_client_secret"
GITHUB_WEBHOOK_SECRET="your_github_webhook_secret"
GITHUB_TOKEN="optional_server_side_github_token"
GITHUB_ACCESS_TOKEN="optional_server_side_github_token"

NEXT_PUBLIC_PRIVY_APP_ID="your_privy_app_id"
PRIVY_APP_SECRET="your_privy_app_secret"

NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_X_URL="https://x.com/collaborat0rs"
NEXT_PUBLIC_PRIVACY_URL="#"
NEXT_PUBLIC_TERMS_URL="#"
```

Check the source before deployment for any newly required integration-specific
variables.

Legacy archive components may also reference Solana mint settings such as
`NEXT_PUBLIC_SOLANA_RPC_URL` and `NEXT_PUBLIC_MINT_AUTHORITY_SECRET_KEY`. Keep
those out of production unless the archived token claim flow is intentionally
re-enabled.

## Database

Generate the Prisma client:

```bash
pnpm prisma generate
```

Apply migrations:

```bash
pnpm prisma migrate dev
```

Open Prisma Studio if you need to inspect local data:

```bash
pnpm prisma studio
```

## Run Locally

Start the development server:

```bash
pnpm dev
```

Open the app:

```text
http://localhost:3000
```

## GitHub OAuth Setup

Create a GitHub OAuth app from GitHub Developer Settings.

For local development, use:

```text
Homepage URL: http://localhost:3000
Authorization callback URL: http://localhost:3000/api/auth/callback/github
```

For production, replace the host with your deployed domain.

## GitHub Webhooks

Collaborators depends on GitHub events to track bounty progress. Configure the
webhook URL in the relevant GitHub app or repository settings.

Typical events to subscribe to:

- Issues
- Pull requests
- Pull request reviews
- Push events, if branch-level tracking is needed

Use `GITHUB_WEBHOOK_SECRET` to validate incoming webhook payloads.

## Privy and Wallet Setup

Privy handles authentication and wallet onboarding. Configure your Privy app
with the same domain used by `NEXT_PUBLIC_APP_URL`.

For local testing:

1. Create a Privy app.
2. Add `http://localhost:3000` as an allowed origin.
3. Enable the wallet and login methods used by the app.
4. Add the public app ID and server secret to `.env.local`.

See [PRIVY_SETUP.md](./PRIVY_SETUP.md) for deeper setup notes.

## Bounty Lifecycle

A typical bounty moves through these states:

1. A maintainer creates or imports a GitHub issue.
2. The bounty is funded in USDC.
3. A contributor submits a pull request URL.
4. GitHub webhook events update the bounty and PR status.
5. A merged PR is verified against the bounty.
6. The payout is released to the contributor wallet.

## Development Commands

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm prisma generate
pnpm prisma migrate dev
```

Run `pnpm build` before deploying to catch type and production build issues.

## Project Structure

```text
.
├── prisma/              # Database schema and migrations
├── public/              # Static assets
├── src/                 # Application source code
├── next.config.ts       # Next.js configuration
├── package.json         # Scripts and dependencies
├── pnpm-lock.yaml       # Locked dependency versions
├── PRIVY_SETUP.md       # Privy integration notes
└── vercel.json          # Vercel deployment configuration
```

## Security Notes

- Never commit `.env.local` or private keys.
- Validate GitHub webhook signatures before processing events.
- Treat wallet addresses as public identifiers, not authentication by
  themselves.
- Keep payout logic server-side.
- Use least-privilege credentials for GitHub and database access.
- Review dependency updates before deploying changes that touch auth, wallet, or
  webhook flows.

## Deployment

The repository includes Vercel configuration. Before deploying:

1. Set all production environment variables.
2. Run database migrations against the production database.
3. Configure GitHub OAuth callback URLs for the production domain.
4. Configure Privy allowed origins for the production domain.
5. Verify GitHub webhook delivery in the deployment environment.

Then deploy through Vercel or the configured CI/CD flow.

## Contributing

Contributions are welcome. For bounty-related work:

1. Pick an issue with an active bounty.
2. Create a focused branch.
3. Include clear implementation notes in the PR.
4. Reference the issue number in the PR body.
5. Add tests or verification notes when the change is not documentation-only.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) if it
is present in the repository.

## Links

- Website: <https://collaborators.build>
- Repository: <https://github.com/andr-drgm/collaborators>
- GitHub issue tracker: <https://github.com/andr-drgm/collaborators/issues>
