# Collaborators

Collaborators is a GitHub bounty marketplace for open source work. Users can
create USDC bounties for public GitHub issues, submit pull request solutions,
and track solved bounties through GitHub webhook events.

The app is built around a simple flow:

1. Log in with GitHub through Privy.
2. Use the embedded Solana wallet associated with the account.
3. Browse or create issue bounties.
4. Submit a pull request as the solution.
5. Let the GitHub webhook verify merged work and mark the bounty as solved.

## Features

- **GitHub authentication**: Users sign in with GitHub through Privy.
- **Embedded Solana wallet**: Privy provides the wallet identity used for
  reward attribution.
- **Bounty marketplace**: Browse active bounties, filter them, and open the
  linked GitHub issue.
- **Issue search**: Find public GitHub issues and create a bounty from the dashboard.
- **Solution submissions**: Submit a pull request URL and PR number for an
  active bounty.
- **Webhook tracking**: GitHub webhook events can mark bounties as solved when
  linked pull requests are merged.
- **Bounty management**: Bounty owners can edit or delete active bounties.

## Tech Stack

- **Framework**: Next.js 15, React 19, TypeScript
- **Auth and wallet**: Privy
- **Database**: Prisma with PostgreSQL
- **GitHub API**: Octokit
- **Styling**: Tailwind CSS 4
- **Deployment**: Vercel-ready configuration

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL database
- GitHub account
- Privy application

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/andr-drgm/collaborators.git
cd collaborators
pnpm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

If `.env.example` is not present in your checkout, create `.env.local` with the
variables listed below.

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# Privy
NEXT_PUBLIC_PRIVY_APP_ID="your_privy_app_id"
PRIVY_APP_SECRET="your_privy_app_secret"

# GitHub API fallback token for server-side issue lookups
GITHUB_TOKEN="your_github_token"
# or
GITHUB_ACCESS_TOKEN="your_github_access_token"

# GitHub webhook verification
GITHUB_WEBHOOK_SECRET="your_webhook_secret"

# Optional public links
NEXT_PUBLIC_X_URL="https://x.com/collaborat0rs"
NEXT_PUBLIC_PRIVACY_URL="https://example.com/privacy"
NEXT_PUBLIC_TERMS_URL="https://example.com/terms"
```

Never commit real secrets. Use Vercel environment variables, a local secret
manager, or another protected deployment secret store for production values.

### Database Setup

Generate the Prisma client and apply your database migrations:

```bash
pnpm prisma generate
pnpm prisma migrate dev
```

For production, use your normal migration release process:

```bash
pnpm prisma migrate deploy
```

### Run Locally

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## GitHub Webhook Setup

GitHub webhooks are used to keep bounty status in sync with repository activity.

1. Open the GitHub repository that should be tracked.
2. Go to **Settings -> Webhooks -> Add webhook**.
3. Set the payload URL to:

```text
https://YOUR_DOMAIN/api/github/webhook
```

After the URL is set:

1. Set the content type to `application/json`.
2. Add the same secret used in `GITHUB_WEBHOOK_SECRET`.
3. Select issue and pull request events.
4. Save the webhook.

The webhook handler can:

- react to issue events for bounty-related issues;
- detect pull request activity;
- mark submitted bounties as solved after relevant merged PR events.

## Bounty Workflow

### For bounty creators

1. Log in with GitHub.
2. Search for a public GitHub issue.
3. Create a bounty with a USDC amount.
4. Install or verify the repository webhook.
5. Review submitted pull request solutions.

### For contributors

1. Browse active bounties on the dashboard.
2. Open the GitHub issue.
3. Implement the fix in a pull request.
4. Submit the PR URL and number through the bounty card.
5. Wait for merge and webhook verification.

## Available Scripts

```bash
pnpm dev       # Start the local development server
pnpm build     # Generate Prisma client and build the Next.js app
pnpm start     # Start the production server
pnpm lint      # Run linting
```

The repository also installs Husky hooks through the `prepare` script.

## Project Structure

```text
src/app/                 Next.js routes and API handlers
src/app/dashboard/       Dashboard UI
src/app/api/bounties/    Bounty and submission endpoints
src/app/api/github/      GitHub search, issue, webhook, and commit routes
src/components/          Shared UI components
src/components/dashboard Dashboard bounty and issue cards
src/lib/                 Privy and webhook helpers
src/services/            GitHub service functions
prisma/schema.prisma     Database schema
```

## Security Notes

- Do not expose Privy secrets, GitHub tokens, database URLs, or webhook secrets
  in client-side code.
- Keep `GITHUB_WEBHOOK_SECRET` enabled in production.
- Store production environment variables in the deployment platform secret store.
- Review webhook permissions before connecting repositories.
- Validate PR URLs and bounty ownership before accepting submissions.

## Deployment

The project is configured for Vercel.

Before deploying, configure:

- `DATABASE_URL`
- `NEXT_PUBLIC_PRIVY_APP_ID`
- `PRIVY_APP_SECRET`
- `GITHUB_TOKEN` or `GITHUB_ACCESS_TOKEN`
- `GITHUB_WEBHOOK_SECRET`
- optional public URL variables

Then build the app:

```bash
pnpm build
```

## Documentation

- [Privy setup guide](./PRIVY_SETUP.md)
- [Migration summary](./MIGRATION_SUMMARY.md)

## License

Add the project license file before publishing license-specific claims.

## Support

Use GitHub Issues for bug reports, feature requests, and bounty discussions.
