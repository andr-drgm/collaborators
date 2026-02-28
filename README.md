   # Collaborator 🚀

   **Transform your GitHub work into on-chain rewards. The Premier USDC Bounty Marketplace on Solana.**

   Collaborators connects project maintainers with world-class developers through an automated, on-chain bounty
 system. Earn **USDC stablecoins** and build your verifiable on-chain reputation for every meaningful contribution.

   ---

   ## 💸 The Value Proposition

   - **USDC Payments**: Get paid in stablecoins (Solana SPL-USDC) directly to your wallet.
   - **Escrow-Backed**: Every bounty is funded upfront. No "missing" payments.
   - **On-Chain Reputation**: Every completed bounty mints a Soulbound NFT (non-transferable) as permanent proof of
 your skill.
   - **Real-Time Tracking**: Monitor your activity with GitHub-style heatmaps and live reward calculation.

   ## 🛠️ How It Works

   1. **Browse Bounties**: Explore open issues with attached USDC rewards.
   2. **Connect Wallet**: Link your Solana wallet (Phantom, Solflare, Backpack).
   3. **Submit PR**: Code, document, or fix. Link your Pull Request to the bounty issue.
   4. **Get Paid**: Once your PR is merged, the USDC is released to your wallet automatically.

   ## 💻 Technical Stack

   - **Frontend**: Next.js 14, React, TypeScript
   - **Styling**: Tailwind CSS with custom design system
   - **Blockchain**: Solana (Smart Contracts for Escrow)
   - **Authentication**: NextAuth.js with GitHub OAuth
   - **Database**: Prisma with PostgreSQL
   - **Deployment**: Vercel-ready configuration

   ## 🚀 Getting Started

   ### Prerequisites
   - **Node.js 18+** & **pnpm**
   - **Solana Wallet** (with a small amount of SOL for transaction fees)
   - **GitHub account**

   ### Installation
   1. Clone the repository:
      ```bash
      git clone https://github.com/andr-drgm/collaborators.git
      cd collaborators
       ```

 2. Install dependencies:
   ```bash
     pnpm install
   ```
 3. Set up environment variables:
   ```bash
     cp .env.example .env.local
   ```

 ### Configuration

 - GitHub OAuth: Create a new OAuth App in Developer Settings. Set callback to
 http://localhost:3000/api/auth/callback/github.
 - Solana: Configure your MINT_AUTHORITY_SECRET_KEY in .env.local.

 🎨 Design & UX

 - Theme: Dark theme with Cyan to Teal gradients.
 - Typography: Geist Sans and Geist Mono.
 - Accessibility: High contrast ratios and full keyboard navigation support.

 🔮 Roadmap

 - USDC Bounty Marketplace Integration
 - Team Leaderboards & Competition
 - Multi-Chain Rewards (Base, Arbitrum)
 - Exclusive NFT Tiers for Top Contributors

 🤝 Contributing

 We welcome contributions! Please check our issues for open bounties. This project uses Husky for pre-commit linting
 and quality control.

 📄 License

 This project is licensed under the MIT License - see the LICENSE file for details.

 ────────────────────────────────────────────────────────────────────────────────

 Collaborators - Building the future of developer collaboration.
 Transform your contributions. Build your reputation. Get rewarded in USDC.
