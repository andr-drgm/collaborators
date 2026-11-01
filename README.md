# Collaborators

Collaborators is a USDC bounty marketplace for open-source software. Maintainers post bounties — paid in **USDC on Solana** — linked to specific GitHub issues; contributors earn rewards by solving those issues through verified pull requests.

## How It Works

1. **Reward posters create bounties.** A maintainer (or project sponsor) deposits USDC into escrow and links it to a GitHub issue via collaborators.build.
2. **Contributors solve the issue.** Fork the repository, fix the issue in a branch, open a pull request referencing the bounty/issue (#40 for this README enhancement).
3. **Verification & payout.** After your PR is merged into the base repository and verified by the platform bot, escrowed USDC is paid out automatically to your linked Solana wallet — claimers pay no gas.

## For Contributors

- Browse active bounties at [collaborators.build](https://collaborators.build) or look for GitHub issues labeled `bounty` / `usdc-reward`.
- Fork the repo, create a branch (`git checkout -b fix/issue-N`), implement your solution.
- Open a PR against the base repository with a body referencing the issue (e.g. "fixes #40" or part of bounty program).
- Once merged and verified, rewards are paid out on Solana.

## For Reward Posters

Create bounties for issues you want solved: specify USDC amount, link to GitHub issue via collaborators.build, fund escrow; the platform handles verification and automatic payouts after PR merge.

## Technical Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Blockchain**: Solana (USDC rewards paid on-chain)
- **Authentication**: GitHub OAuth + Solana wallet connection for payouts
- **Database**: Prisma with PostgreSQL

## Development Setup

Prerequisites: Node.js 18+, pnpm, a GitHub account.

```bash
git clone https://github.com/andr-drgm/collaborators.git   # or your fork
cd collaborators
pnpm install
cp .env.example .env.local
# configure GITHUB_ID/GITHUB_SECRET (NextAuth), NEXTAUTH_*, and Solana RPC/mint settings as needed
pnpm dev
```

Git hooks (`husky`) run `pnpm lint` on each commit.

## Contributing

We welcome contributions — code improvements, documentation fixes like this README enhancement (#40), or bounty submissions. Please:

1. Fork the repository.
2. Create a descriptive branch from `main`.
3. Keep changes focused; document user-facing behavior in the README when applicable.
4. Open a PR referencing any related issue.

## License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

**Collaborators** — turning open-source contributions into on-chain USDC rewards and verifiable reputation.
