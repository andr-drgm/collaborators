# Collaborators

Collaborators connects GitHub issues with bounties listed in USDC. Contributors
submit pull requests, and repository maintainers review them on GitHub. The app
tracks which submission was merged and records the solver's credit.

[Open the marketplace](https://collaborators.build/) or
[browse active listings as JSON](https://collaborators.build/api/bounties?status=ACTIVE).

## Submit a solution

1. Sign in with the GitHub account you will use to open your pull request.
   In **Bounties**, choose **Active**, then **View Issue**. Read the issue,
   its comments and any existing pull requests before starting work.
2. Open a pull request against the repository named on the bounty. Reference
   the issue in the description, explain your change and include your checks.
3. Return to the bounty and choose **Submit Solution** before the PR is merged.
   Paste the upstream PR URL, such as `https://github.com/owner/repo/pull/123`.
   Wait for the submission confirmation. Each contributor can register one
   submission per bounty. Only other contributors can solve a bounty you post.
4. Follow review on the same PR. Once it is merged, the repository's webhook
   matches the PR number, repository and GitHub author to the pending submission.
   An approved solution appears under **Solved Issues**.

### What the reward status means

An **Active** listing records the amount a poster entered. After a matching merge,
the webhook marks the bounty **Solved**, approves the submission and increments
the solver's `unclaimedTokens` balance in PostgreSQL. The creation and approval
handlers record database entries. Neither handler locks funds or broadcasts a
USDC transfer. To confirm a wallet payment, look for a separate transaction
signature on the settlement network.

See the [listing handler][listings], [submission handler][submissions] and
[merge handler][webhook] for the exact transitions.

## Offer a bounty

Sign in, open **My Issues** and select **Add Bounty** on the GitHub issue.
Describe the work in the GitHub issue body. In Collaborators, enter the amount,
choose **Create Bounty** and find your listing under **My Bounties**.
For automatic merge tracking, the repository administrator must configure a
webhook for the deployment handling the bounty.

In the repository's GitHub webhook settings, use the deployment's
`/api/github/webhook` URL, choose `application/json`, and subscribe to
**Issues** and **Pull requests**. The webhook secret must match the deployment's
`GITHUB_WEBHOOK_SECRET`. Check the latest delivery in GitHub after setup.
A matching signed merge event can still approve a pending submission if the
issue-closed event arrived first.

## Run a local instance

Use Node.js 22 LTS or 24 LTS, pnpm 10, a local PostgreSQL database and a Privy
app configured for GitHub login. Enable GitHub OAuth token return for **My
Issues**, allow `http://localhost:3000`, and enable embedded Solana wallets for
users who lack one. The [client configuration][privy] defaults to Solana devnet.

```sh
git clone https://github.com/andr-drgm/collaborators.git
cd collaborators
```

Create a file named `.env` in the repository root. Prisma and Next.js both read
it. Replace the example values with your local database details and the values
for your own Privy app. Use a separate, randomly generated webhook secret.

```dotenv
DATABASE_URL=postgresql://db_user:password@localhost:5432/collaborators
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id
PRIVY_APP_SECRET=your-privy-app-secret
GITHUB_WEBHOOK_SECRET=your-local-webhook-secret
```

Use an empty database created for this project. Install the locked dependencies,
apply the committed migration, then start the development server.

```sh
pnpm install --frozen-lockfile
pnpm exec prisma migrate deploy
pnpm dev
```

Open [the local app](http://localhost:3000). To check the database connection,
visit [the local bounty feed](http://localhost:3000/api/bounties?status=ACTIVE).
A fresh database returns an empty JSON array. `GITHUB_TOKEN` is an optional
server-side token used by GitHub issue search, detail and label routes.

## Verify a change

Run `pnpm lint` for the application checks and `pnpm build` for a production
build. For the merge workflow, keep the dev server running against a dedicated
local test database. Run this command in a second terminal from the same directory.

```sh
node --env-file=.env scripts/check-webhook.mjs
```

The [webhook check][check] creates temporary records and exercises signature
validation, author matching, duplicate delivery and event order. A successful run
prints `webhook check OK`. If your server uses another local port, set `BASE_URL`
in the test environment to its origin.

The [Prisma schema][schema] defines the records used by these checks. For
deployments, review [the Vercel configuration][vercel] before choosing a database.
Its build command also runs `prisma db push`.

[listings]: src/app/api/bounties/route.ts
[submissions]: src/app/api/bounties/submissions/route.ts
[webhook]: src/app/api/github/webhook/route.ts
[privy]: src/app/PrivyProviders.tsx
[check]: scripts/check-webhook.mjs
[schema]: prisma/schema.prisma
[vercel]: vercel.json
