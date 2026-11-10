# Collaborators

Collaborators is a GitHub bounty marketplace for open source work. Maintainers can attach USDC rewards to GitHub issues, developers can submit pull request solutions, and the app tracks bounty and submission status through the dashboard.

The current product is focused on issue bounties, GitHub identity, Solana wallet payout details, and automated workflow tracking.

## What You Can Do

- Browse active GitHub issue bounties
- Connect with GitHub through Privy authentication
- Link or create a Solana wallet with Privy
- Create USDC bounties for GitHub issues
- Submit pull request solutions for bounty review
- Track bounties you created and solutions you submitted
- Manage repository bot installation status

## How The Bounty Flow Works

### For bounty posters

1. Sign in with GitHub.
2. Connect or create a Solana wallet through Privy.
3. Open the dashboard and find a GitHub issue.
4. Add a bounty amount and publish the bounty.
5. Review submitted pull requests.
6. Mark the bounty solved after the accepted PR is merged.

### For contributors

1. Sign in with GitHub.
2. Connect or create a Solana wallet through Privy.
3. Browse active bounties.
4. Pick an issue and open a pull request in the target repository.
5. Submit the PR URL in Collaborators.
6. Wait for the maintainer to review and merge the PR.

## Tech Stack

- Next.js 15 with App Router
- React 19
- TypeScript
- Tailwind CSS
- Privy for authentication and wallet management
- Prisma ORM
- PostgreSQL
- GitHub API via Octokit
- Solana Web3 tooling

## Project Structure

```text
prisma/
  schema.prisma              Database schema for users, bounties, submissions, and bot installs
src/
  app/                       Next.js routes and pages
  app/api/                   API routes for bounties, users, GitHub integration, and auth
  app/dashboard/page.tsx     Main bounty dashboard
  components/dashboard/      Dashboard cards, wallet UI, issue UI, and bounty UI
  hooks/                     Privy and app state hooks
  services/                  GitHub service helpers
  utils/                     Shared utilities
```

## Requirements

- Node.js 18 or newer
- pnpm
- PostgreSQL database
- Privy application
- GitHub account
- Solana wallet support enabled in Privy

## Local Development

Install dependencies:

```bash
pnpm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

If `.env.example` is not present, create `.env.local` and provide the required values listed below.

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

Open http://localhost:3000.

## Environment Variables

The app needs these core values:

```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_PRIVY_APP_ID="your-privy-app-id"
PRIVY_APP_SECRET="your-privy-app-secret"
```

GitHub API calls require GitHub OAuth tokens returned through Privy. In the Privy dashboard, enable GitHub as a login method and turn on OAuth token return for GitHub.

Depending on the local setup, a fallback GitHub token may also be used by GitHub service code:

```env
GITHUB_TOKEN="github_pat_..."
GITHUB_ACCESS_TOKEN="github_pat_..."
```

Keep server-side secrets out of the browser. Only expose variables with the `NEXT_PUBLIC_` prefix when they are intentionally public.

## Privy Setup

1. Create a Privy app.
2. Enable GitHub login.
3. Enable embedded wallets.
4. Select Solana as a supported chain.
5. Add `localhost:3000` and the production domain to allowed domains.
6. Enable GitHub OAuth token return so the app can call the GitHub API for issue and profile data.

See `PRIVY_SETUP.md` for detailed Privy configuration and troubleshooting.

## Database Models

The Prisma schema includes:

- `User`: app user, GitHub identity, Privy ID, and wallet address
- `Bounty`: GitHub issue bounty with amount, repository, status, poster, and solver fields
- `BountySubmission`: contributor PR submission for a bounty
- `BotInstallation`: repository bot installation status
- Legacy project models kept for migration compatibility

## Useful Scripts

```bash
pnpm dev       # Start local development
pnpm build     # Generate Prisma client and build the Next.js app
pnpm start     # Start the production build
pnpm lint      # Run linting
```

## Bounty Statuses

- `ACTIVE`: open for submissions
- `SOLVED`: completed by an accepted solution
- `EXPIRED`: no longer active
- `CANCELLED`: cancelled by the poster

## Submission Statuses

- `PENDING`: submitted and waiting for review
- `APPROVED`: accepted by the maintainer
- `REJECTED`: not accepted

## Troubleshooting

### GitHub issues do not load

- Confirm GitHub login is enabled in Privy.
- Enable GitHub OAuth token return in the Privy dashboard.
- Check whether a fallback `GITHUB_TOKEN` or `GITHUB_ACCESS_TOKEN` is needed for local development.
- Confirm the Privy access token is being sent in the `Authorization` header.

### Authentication returns unauthorized

- Confirm `PRIVY_APP_SECRET` is set correctly.
- Sign out and sign in again to refresh the Privy session.
- Check the server logs for token verification errors.

### Wallet address is missing

- Enable embedded wallets in Privy.
- Select Solana as a supported chain.
- Confirm wallet creation on login is enabled.

### Prisma errors appear after schema changes

Run:

```bash
pnpm prisma generate
pnpm prisma migrate dev
```

Then restart the dev server.

## Security Notes

- Do not commit `.env.local` or private keys.
- Do not expose Privy app secrets to client components.
- Use least-privilege GitHub tokens for local development.
- Treat payout and wallet changes as sensitive operations.

## Contributing

Open an issue or pull request with a focused change. For bounty work, reference the bounty issue in the pull request body and include enough context for maintainers to verify the solution.

## License

This project is licensed under the MIT License. See `LICENSE` for details.
