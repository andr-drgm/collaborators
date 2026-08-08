# Collaborators

Collaborators is a GitHub bounty marketplace for funding open-source work and
rewarding accepted pull requests in USDC. Maintainers attach bounties to GitHub
issues, contributors submit a pull request as their solution, and repository
webhooks keep the bounty status in sync when the work is merged.

> **Project status:** this repository contains the bounty-focused MVP. Parts of
> the original contribution-tracking product remain under `archive/`
> directories, but they are not part of the active dashboard.

## How it works

```mermaid
flowchart LR
    A["Maintainer selects a GitHub issue"] --> B["Creates a USDC bounty"]
    B --> C["Contributor opens a pull request"]
    C --> D["Contributor submits the PR URL"]
    D --> E["Repository webhook observes the merge"]
    E --> F["Submission is approved and bounty is solved"]
```

1. Sign in with GitHub. Privy handles authentication and creates an embedded
   Solana wallet for users who do not already have one.
2. Search public GitHub issues or browse the issues you created.
3. Add a USDC-denominated bounty to an issue and configure the repository
   webhook.
4. A contributor solves the issue and submits the pull request URL from the
   bounty card.
5. When GitHub reports that the pull request was merged, Collaborators approves
   the matching submission and marks the bounty as solved.

## Features

- GitHub OAuth through Privy
- Embedded Solana wallet creation on first login
- Public GitHub issue search and personal issue discovery
- USDC-denominated bounty creation, editing, filtering, and deletion
- Pull request solution submissions
- GitHub webhook tracking for issues and pull requests
- Automatic submission verification after a matching pull request is merged
- Separate views for active bounties, solved bounties, personal issues, and
  bounties you posted
- Responsive dark interface built with Tailwind CSS

## Technology

| Area | Implementation |
| --- | --- |
| Web application | Next.js 15 App Router, React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Authentication | Privy with GitHub OAuth |
| Wallets | Privy embedded Solana wallets, Solana Web3.js |
| GitHub integration | Octokit and GitHub webhooks |
| Data | PostgreSQL with Prisma 6 |
| Deployment | Vercel configuration included |

## Local development

### Prerequisites

- Node.js 20 or newer
- pnpm
- PostgreSQL
- A Privy application with GitHub login and Solana embedded wallets enabled
- A GitHub token for issue search and label operations

### 1. Clone and install

```bash
git clone https://github.com/andr-drgm/collaborators.git
cd collaborators
pnpm install
```

### 2. Configure Privy

In the [Privy dashboard](https://dashboard.privy.io/):

1. Enable GitHub as a login method.
2. Enable **Return OAuth tokens** for GitHub. The personal-issues view needs the
   returned token to call the GitHub API for the signed-in user.
3. Enable Solana embedded wallets and create them for users without wallets.
4. Add `http://localhost:3000` to the allowed application domains.

Privy's GitHub callback URL is:

```text
https://auth.privy.io/api/v1/oauth/github/callback
```

### 3. Add environment variables

Create `.env.local` in the project root:

```dotenv
# PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/collaborators"

# Privy
NEXT_PUBLIC_PRIVY_APP_ID="your-privy-app-id"
PRIVY_APP_SECRET="your-privy-app-secret"

# GitHub API access
GITHUB_TOKEN="your-github-token"

# Use the same value in the GitHub repository webhook settings
GITHUB_WEBHOOK_SECRET="replace-with-a-long-random-secret"
```

Optional configuration:

```dotenv
# Fallback token used by the personal-issues endpoint
GITHUB_ACCESS_TOKEN="your-github-token"

# Footer links
NEXT_PUBLIC_X_URL="https://x.com/collaborat0rs"
NEXT_PUBLIC_PRIVACY_URL="https://example.com/privacy"
NEXT_PUBLIC_TERMS_URL="https://example.com/terms"
```

Keep server secrets out of variables prefixed with `NEXT_PUBLIC_`, and never
commit `.env.local`.

### 4. Prepare the database

```bash
pnpm prisma generate
pnpm prisma db push
```

### 5. Start the app

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## GitHub webhook setup

Each repository that uses bounty automation needs a webhook:

1. Open the repository's **Settings → Webhooks → Add webhook** page.
2. Set **Payload URL** to `https://your-domain.example/api/github/webhook`.
3. Choose `application/json` as the content type.
4. Enter the same secret as `GITHUB_WEBHOOK_SECRET`.
5. Select individual events and enable **Issues** and **Pull requests**.
6. Keep the webhook active and add it.

The endpoint handles these events:

| Event | Result |
| --- | --- |
| `ping` | Registers the repository for the GitHub user |
| `issues` | Updates a matching bounty when its issue changes state |
| `pull_request` | Solves a bounty when its submitted PR is merged |

For local webhook testing, expose port `3000` through an HTTPS tunnel and use
the tunnel URL as the payload URL.

## Project structure

```text
prisma/
├── schema.prisma                  # PostgreSQL data model
└── migrations/                    # Database changes
src/
├── app/
│   ├── api/
│   │   ├── bounties/              # Bounty CRUD and submissions
│   │   ├── github/                # Issue search, labels, and webhooks
│   │   └── user/                  # Authenticated user sync
│   ├── dashboard/                 # Marketplace dashboard
│   └── PrivyProviders.tsx         # Privy and embedded-wallet config
├── components/                    # Landing page and dashboard UI
├── hooks/usePrivyAuth.ts          # Client authentication state
├── lib/                           # Privy and webhook helpers
└── services/github.ts             # Client-side GitHub API helpers
```

## Main API routes

| Route | Purpose |
| --- | --- |
| `GET /api/bounties` | List and filter bounties |
| `POST /api/bounties` | Create a bounty for a GitHub issue |
| `PATCH /api/bounties/:id` | Update a bounty you posted |
| `DELETE /api/bounties/:id` | Delete a bounty you posted |
| `POST /api/bounties/submissions` | Submit a PR for an active bounty |
| `GET /api/github/search/issues` | Search public GitHub issues |
| `GET /api/github/user/issues` | List the signed-in user's issues |
| `POST /api/github/webhook` | Process repository webhook events |
| `GET /api/user/me` | Verify the Privy token and sync the local user record |

Authenticated routes expect a Privy access token:

```http
Authorization: Bearer <privy-access-token>
```

## Development checks

Run a type check and lint the source before opening a pull request:

```bash
pnpm exec tsc --noEmit
pnpm exec eslint .
```

To verify a production build, provide the required environment variables and a
reachable PostgreSQL database, then run:

```bash
pnpm build
```

## Security notes

- Give GitHub tokens only the permissions required by the repositories and
  operations you use.
- Store `PRIVY_APP_SECRET`, GitHub tokens, database credentials, and the webhook
  secret only in server-side secret storage.
- Always configure a unique webhook secret for production deployments.
- Review OAuth permissions before authorizing the application, especially when
  private repositories are accessible to the selected GitHub account.
- Do not put wallet private keys or mint authority secrets in client-exposed
  environment variables.

## Contributing

1. Fork the repository and create a focused branch.
2. Keep changes scoped and document any new environment variables or migrations.
3. Run the development checks above.
4. Open a pull request that explains the behavior change and how it was
   verified.

Bug reports and feature proposals are welcome in [GitHub Issues].

[GitHub Issues]: https://github.com/andr-drgm/collaborators/issues

## Additional documentation

- [`PRIVY_SETUP.md`](PRIVY_SETUP.md) explains the authentication and
  embedded-wallet configuration in more detail.
- [`MIGRATION_SUMMARY.md`](MIGRATION_SUMMARY.md) describes the shift from
  contribution tracking to the current bounty marketplace MVP.

## License

No license file is currently included in this repository. Until the maintainers
add one, normal copyright rules apply.
