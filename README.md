# Collaborators

Collaborators is a bounty marketplace for GitHub work. It lets users create USDC-denominated bounties for GitHub issues, submit pull requests as solutions, and track bounty status through a Privy-authenticated dashboard with Solana wallet support.

## What It Does

- Lists active, solved, expired, and cancelled bounties.
- Connects users through Privy GitHub OAuth.
- Stores user profiles, GitHub handles, wallet addresses, bounties, submissions, and bot installations in PostgreSQL.
- Lets bounty posters attach rewards to GitHub issues.
- Lets contributors submit pull request URLs against active bounties.
- Uses GitHub webhooks to react to issue and pull-request events.
- Tracks repository bot installation state for bounty repositories.

## How The Bounty Flow Works

1. A user signs in with GitHub through Privy.
2. The app syncs the Privy user, GitHub account, and wallet data into the database.
3. A poster creates a bounty from a GitHub issue with a title, description, issue URL, repository owner/name, and USDC amount.
4. A contributor opens a pull request for the issue.
5. The contributor submits the PR URL and PR number to the bounty.
6. When a matching PR is merged, the webhook flow can mark the submission verified and the bounty solved.

## Tech Stack

- Next.js 15, React 19, and TypeScript
- Tailwind CSS 4
- Prisma 6 and PostgreSQL
- Privy React and server auth
- GitHub API and GitHub webhooks
- Solana wallet support through Privy embedded wallets
- Vercel deployment

## Prerequisites

- Node.js 18 or newer
- pnpm
- PostgreSQL database
- Privy app with GitHub login enabled
- GitHub token for server-side issue/search routes
- GitHub webhook secret for repository events

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

Create `.env.local`:

```bash
touch .env.local
```

Add the required environment variables:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

NEXT_PUBLIC_PRIVY_APP_ID="your_privy_app_id"
PRIVY_APP_SECRET="your_privy_app_secret"

GITHUB_WEBHOOK_SECRET="your_github_webhook_secret"
GITHUB_TOKEN="github_token_for_server_routes"
GITHUB_ACCESS_TOKEN="optional_fallback_github_token"

NEXT_PUBLIC_X_URL="https://x.com/collaborat0rs"
NEXT_PUBLIC_PRIVACY_URL="https://example.com/privacy"
NEXT_PUBLIC_TERMS_URL="https://example.com/terms"
```

Generate Prisma and run migrations:

```bash
pnpm prisma generate
pnpm prisma migrate dev
```

Start the development server:

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Privy Setup

Configure Privy before testing authenticated flows:

1. Create a Privy app.
2. Enable GitHub as the login method.
3. Enable "Return OAuth tokens" for GitHub if you want per-user GitHub API access.
4. Enable embedded Solana wallets.
5. Add `localhost:3000` and your production domain to the allowed domains.
6. Copy the Privy app ID and app secret into `.env.local`.

The app uses:

- `src/app/PrivyProviders.tsx` for the client provider.
- `src/lib/privy.ts` for server-side token verification.
- `src/hooks/usePrivyAuth.ts` for dashboard auth and wallet state.
- `src/app/api/user/me/route.ts` to sync Privy users into Prisma.

## GitHub Webhooks

Point GitHub repository webhooks at:

```text
https://YOUR_DOMAIN/api/github/webhook
```

Recommended event types:

- `ping`
- `issues`
- `pull_request`

Set the webhook secret to the same value as `GITHUB_WEBHOOK_SECRET`.

Current webhook behavior:

- `ping` registers the repository in `BotInstallation` when the sender exists in the database.
- `issues.opened` checks whether the issue already has a bounty and logs label work.
- `issues.closed` marks a matching active bounty solved.
- `pull_request.closed` with `merged: true` verifies pending submissions whose PR number and repository match an active bounty.

## API Routes

### Authentication And User

- `POST /api/auth/privy` handles optional Privy events.
- `GET /api/user/me` returns and syncs the authenticated user.

### Bounties

- `GET /api/bounties` lists bounties by status.
- `POST /api/bounties` creates a bounty for a GitHub issue.
- `GET /api/bounties/[id]` returns bounty detail.
- `PATCH /api/bounties/[id]` updates bounty status.
- `GET /api/bounties/my` lists bounties posted by the authenticated user.
- `GET /api/bounties/solved` lists solved bounties.
- `GET /api/bounties/submissions` lists submissions.
- `POST /api/bounties/submissions` submits a PR URL and PR number for an active bounty.

### GitHub

- `GET /api/github/search/issues` searches GitHub issues.
- `GET /api/github/issues/details` fetches issue detail.
- `GET /api/github/issues/labels` fetches labels.
- `GET /api/github/user/issues` fetches user-related issues.
- `GET /api/github/commits` fetches commits.
- `GET /api/github/bot/installation` checks bot installation state.
- `POST /api/github/webhook` receives repository webhook events.

### Legacy Projects

- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/user`
- `POST /api/projects/[id]/assign`
- `POST /api/projects/[id]/tweet`

## Database Models

The Prisma schema includes:

- `User`
- `Account`
- `Session`
- `VerificationToken`
- `Authenticator`
- `Bounty`
- `BountySubmission`
- `BotInstallation`
- `Project`
- `ProjectAssignment`

`Project` and `ProjectAssignment` are marked as legacy in the schema and kept for migration compatibility.

## Useful Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm prisma studio
pnpm prisma generate
pnpm prisma migrate dev
```

## Project Structure

```text
src/app                 App Router pages and API routes
src/app/api             Auth, bounty, GitHub, project, and user endpoints
src/components          Landing, dashboard, and UI components
src/hooks               Client-side Privy and dashboard hooks
src/lib                 Privy and GitHub webhook helpers
src/services            GitHub service helpers
src/utils               Shared UI helpers and external links
prisma                  Prisma schema and migrations
public                  Favicons, logo, and static assets
```

## Development Notes

- Keep server secrets out of client components.
- Only expose browser-safe values with the `NEXT_PUBLIC_` prefix.
- Use Privy access tokens in the `Authorization: Bearer <token>` header for protected API routes.
- Keep GitHub tokens on the server. Use Privy-returned OAuth tokens for user-specific GitHub data when available.
- Keep webhook signature verification enabled in production.
- Add screenshots to pull requests that change UI behavior.

## Troubleshooting

### Privy Login Fails

Check `NEXT_PUBLIC_PRIVY_APP_ID`, `PRIVY_APP_SECRET`, allowed domains, and GitHub login settings in the Privy dashboard.

### GitHub Data Is Empty

Enable "Return OAuth tokens" for GitHub in Privy, or set `GITHUB_TOKEN` / `GITHUB_ACCESS_TOKEN` for server-side fallback routes.

### Webhooks Do Not Update Bounties

Confirm the webhook URL, event subscriptions, `GITHUB_WEBHOOK_SECRET`, and GitHub delivery logs.

### Prisma Errors Occur

Check `DATABASE_URL`, run `pnpm prisma generate`, then run `pnpm prisma migrate dev`.

### Wallet Data Does Not Appear

Confirm embedded Solana wallets are enabled in Privy and that the user has completed login.

## Contributing

1. Create a focused branch.
2. Make the smallest useful change.
3. Run linting or the most relevant validation.
4. Open a pull request that explains the impact and validation.

## License

This project is licensed under the MIT License.
