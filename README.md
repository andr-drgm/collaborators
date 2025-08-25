# Collab0rator

Transform your GitHub work into on-chain rewards and reputation. Earn NFT badges and SOL tokens for your real contributions on GitHub.

## 🚀 What We've Built

Collab0rators is a Web3 platform that automatically converts your GitHub activity into verifiable on-chain achievements. Every meaningful contribution mints NFT badges and earns SOL tokens, helping you build your on-chain reputation while getting rewarded for open-source collaboration.

## ✨ Key Features

- **GitHub Integration**: Seamlessly connect your GitHub account to track contributions
- **Automatic Rewards**: Earn SOL tokens for commits, pull requests, reviews, and issue resolution
- **NFT Badges**: Unique digital credentials minted for your achievements
- **On-Chain Reputation**: Verifiable proof of your contributions stored on Solana blockchain
- **Real-Time Tracking**: Monitor your contribution activity with GitHub-style heatmaps
- **Secure Wallet Integration**: Support for Phantom, Solflare, and other Solana wallets

## 🎯 How It Works

1. **Connect GitHub**: Log in with your GitHub account
2. **Link Wallet**: Connect your Solana wallet (Phantom, Solflare, etc.)
3. **Start Contributing**: Continue your normal GitHub workflow
4. **Get Rewarded**: Earn tokens and NFT badges automatically

## 🛠️ Technical Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Blockchain**: Solana blockchain integration
- **Authentication**: NextAuth.js with GitHub OAuth
- **Database**: Prisma with PostgreSQL
- **Deployment**: Vercel-ready configuration

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Solana wallet (Phantom, Solflare, etc.)
- GitHub account
- Some SOL for transaction fees

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/the-collaborator.git
cd the-collaborator
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Configure your environment variables:

```env
# GitHub OAuth
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Solana
REACT_APP_MINT_AUTHORITY_SECRET_KEY=your_mint_authority_key
```

5. Run the development server:

```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔧 Configuration

### GitHub OAuth Setup

1. Go to GitHub Developer Settings
2. Create a new OAuth App
3. Set the callback URL to `http://localhost:3000/api/auth/callback/github`
4. Copy the Client ID and Client Secret to your `.env.local`

### Solana Configuration

1. Set up a Solana wallet with some SOL
2. Configure your mint authority for token distribution
3. Update the mint address in the dashboard component

## 📱 User Experience Improvements

### For Newcomers

- **Clear Value Proposition**: "Transform GitHub work into on-chain rewards and reputation"
- **Key Terms Explained**: Hover tooltips for SOL tokens, NFT badges, and on-chain reputation
- **Simple Steps**: 3-step onboarding process clearly explained
- **Visual Flowchart**: Step-by-step process visualization

### For Web3 Developers

- **Advanced Features**: Detailed contribution tracking and analytics
- **Technical Details**: Comprehensive dashboard with GitHub-style heatmaps
- **Wallet Integration**: Seamless Solana wallet connection
- **Real-Time Updates**: Live contribution tracking and reward calculation

### Trust & Security

- **Security Information**: Clear explanations of data privacy and wallet security
- **FAQ Section**: Common questions about tracking, rewards, and supported wallets
- **Help Tooltips**: Contextual assistance throughout the platform
- **Onboarding Guidance**: Step-by-step help for wallet setup

## 🎨 Design System

- **Color Palette**: Cyan to teal gradients with dark theme
- **Typography**: Geist Sans and Geist Mono fonts
- **Components**: Consistent card designs with hover effects
- **Responsive**: Mobile-first design with desktop optimizations
- **Accessibility**: High contrast ratios and keyboard navigation

## 🔮 Coming Soon

- **Team Leaderboards**: Compete with your team and climb the ranks
- **Exclusive NFT Tiers**: Rare collectibles for top contributors
- **API Access**: Integrate rewards into your own applications
- **Multi-Chain Support**: Expand beyond Solana to other blockchains

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details on:

- Code style and standards
- Testing requirements
- Pull request process
- Community guidelines

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline help tooltips
- **Issues**: Report bugs or feature requests via GitHub Issues
- **Discussions**: Join community discussions for help and ideas
- **Email**: Contact the team directly for urgent matters

## 🌟 Acknowledgments

- Solana Foundation for blockchain infrastructure
- GitHub for developer platform integration
- Next.js team for the amazing framework
- Our community of contributors and testers

---

**Collab0rators** - Building the future of developer collaboration and rewards.

_Transform your contributions. Build your reputation. Get rewarded._
