# Collaborators

<p align="center">
  <strong>GitHub Bounty Marketplace — Earn USDC for solving open-source issues</strong>
</p>

<p align="center">
  <a href="https://collaborators.build"><img src="https://img.shields.io/badge/Platform-collaborators.build-blue?style=flat-square" alt="Platform" /></a>
  <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square" alt="Next.js" />
  <img src="https://img.shields.io/badge/Payments-USDC-2775CA?style=flat-square" alt="USDC" />
  <img src="https://img.shields.io/badge/Chain-Solana-9945FF?style=flat-square" alt="Solana" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
</p>

---

## What Is Collaborators?

**Collaborators** is a GitHub bounty marketplace that connects open-source maintainers with developers who want to get paid for their contributions.

- **Maintainers** label GitHub issues with USDC bounty amounts
- **Developers** browse open bounties, submit pull requests, and get paid automatically when their PR is merged
- **No platform fees** — USDC goes directly to the contributor

> "Find GitHub issues with USDC bounties or create your own. Get paid automatically when your pull request is merged."

---

## How It Works

### For Contributors

1. **Browse open bounties** at [collaborators.build](https://collaborators.build)
2. **Pick an issue** that matches your skills
3. **Fork the repo** and submit a pull request
4. **Get paid in USDC** automatically when your PR is merged

### For Maintainers

1. **Post a bounty** by adding the `bounty` and `usdc-reward` labels to any GitHub issue
2. **Set the bounty amount** in USDC
3. **Review pull requests** from contributors
4. **Merge the best one** — payment is handled automatically

---

## Features

| Feature | Description |
|---------|-------------|
| **USDC Payments** | Instant stablecoin rewards on Solana — no crypto volatility |
| **GitHub-Native** | No new workflow — work in GitHub as normal |
| **Auto-Payment** | PR merge triggers payment automatically |
| **Zero KYC** | Connect a Solana wallet, start earning |
| **Transparent** | All bounties and submissions are publicly visible |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React, TypeScript |
| Styling | Tailwind CSS |
| Auth | NextAuth.js (GitHub OAuth) |
| Database | Prisma + PostgreSQL |
| Payments | USDC on Solana |
| Deployment | Vercel |

---

## Development Setup

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- GitHub OAuth App credentials
- Solana wallet

### Installation

```bash
# Clone the repository
git clone https://github.com/andr-drgm/collaborators.git
cd collaborators

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your GitHub OAuth, database URL, and Solana config

# Set up the database
pnpm prisma migrate dev

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Code Quality

This project uses pre-commit hooks (Husky) to enforce code quality:

- `pnpm lint` runs before every commit
- `pnpm build` validates the production build

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXTAUTH_SECRET` | Secret for NextAuth session signing |
| `GITHUB_ID` | GitHub OAuth App client ID |
| `GITHUB_SECRET` | GitHub OAuth App client secret |
| `DATABASE_URL` | PostgreSQL connection string |
| `SOLANA_RPC_URL` | Solana RPC endpoint |

---

## Contributing

Contributions are welcome! Check the [open bounties](https://collaborators.build) for paid issues, or open a regular PR for bug fixes and improvements.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push and open a pull request

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

<p align="center">
  Built with ❤️ for the open-source community &nbsp;|&nbsp;
  <a href="https://collaborators.build">collaborators.build</a>
</p>
