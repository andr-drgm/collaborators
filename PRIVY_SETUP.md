# Privy Integration Setup Guide

This project now uses Privy for authentication and wallet management.

## Features

- ✅ **GitHub OAuth** - Sign in with GitHub
- ✅ **Embedded Wallets** - Privy creates a Solana wallet for each user automatically
- ✅ **Email Login** - Alternative login method
- ✅ **External Wallet Support** - Users can connect existing Solana wallets
- ✅ **Unified Authentication** - Single provider for both auth and wallets

## Setup Instructions

### 1. Create a Privy Account

1. Go to [privy.io](https://privy.io) and sign up
2. Create a new application
3. Note your App ID and App Secret

### 2. Configure Privy

In your Privy dashboard:

1. **Enable Login Methods:**

   - Enable GitHub OAuth
   - Enable Email
   - Enable Wallet (optional)

2. **Configure GitHub OAuth:**

   - Go to Settings → Login Methods → GitHub
   - Add your GitHub OAuth app credentials
   - Set redirect URI to: `https://auth.privy.io/api/v1/oauth/github/callback`

3. **Configure Embedded Wallets:**

   - Enable "Embedded Wallets"
   - Select "Solana" as supported chain
   - Choose "Create on login for users without wallets"

4. **Configure Allowed Domains:**
   - Add your development domain (e.g., `localhost:3000`)
   - Add your production domain

### 3. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

- `NEXT_PUBLIC_PRIVY_APP_ID` - From Privy dashboard
- `PRIVY_APP_SECRET` - From Privy dashboard (keep secret!)
- `DATABASE_URL` - Your PostgreSQL connection string

### 4. Database Migration

Run the Prisma migration to add Privy fields:

```bash
pnpm prisma migrate dev --name add_privy_fields
```

### 5. Start Development

```bash
pnpm dev
```

## How It Works

### Authentication Flow

1. User clicks "Start Earning Rewards" on the home page
2. Privy modal opens with login options (GitHub, Email, Wallet)
3. User authenticates via their chosen method
4. Privy automatically creates an embedded Solana wallet for the user
5. User is redirected to the dashboard
6. User data is synced to your database via the `/api/user/me` endpoint

### Wallet Management

- **Embedded Wallet**: Automatically created by Privy, no seed phrase needed
- **External Wallet**: Users can optionally connect Phantom, Solflare, etc.
- Wallet address is stored in the database for token transfers

### GitHub Integration

- Privy handles GitHub OAuth
- Access tokens are stored and can be used for GitHub API calls
- User's GitHub username and profile data are synced to your database

## API Endpoints

### `/api/user/me` (GET)

Returns the current authenticated user's data.

**Headers:**

```
Authorization: Bearer <privy-access-token>
```

**Response:**

```json
{
  "id": "user-id",
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "image": "https://...",
  "walletAddress": "5Xyz...",
  "tokens": 0,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### `/api/auth/privy` (POST)

Webhook endpoint for Privy events (optional).

## Key Components

### `PrivyProviders` (`src/app/PrivyProviders.tsx`)

Wraps the app with Privy authentication context.

### `usePrivyAuth` (`src/hooks/usePrivyAuth.ts`)

Custom hook that provides:

- `authenticated` - Boolean indicating auth status
- `userData` - User data from your database
- `walletAddress` - User's Solana wallet address
- `embeddedWallet` - Privy embedded wallet instance
- `login()` - Function to trigger login
- `logout()` - Function to log out
- `linkGitHub()` - Function to link GitHub account
- `getAccessToken()` - Function to get Privy access token

### `WalletConnect` (`src/components/dashboard/WalletConnect.tsx`)

Displays wallet connection status and info about the embedded wallet.

## Migration from NextAuth

The following changes were made:

1. ✅ Removed NextAuth and its dependencies
2. ✅ Added Privy packages
3. ✅ Updated database schema with Privy fields
4. ✅ Created new Privy provider and hooks
5. ✅ Updated all authentication calls
6. ✅ Removed old Solana wallet adapter (Privy handles this)

## Troubleshooting

### "Unauthorized" errors

- Check that your `PRIVY_APP_SECRET` is correct
- Verify the access token is being passed in the Authorization header

### GitHub login not working

- Ensure GitHub OAuth is enabled in Privy dashboard
- Check redirect URIs are correctly configured
- Verify GitHub OAuth app settings

### Wallet not showing

- Check that embedded wallets are enabled in Privy
- Ensure Solana is selected as a supported chain
- Verify "Create on login" is enabled

### Database errors

- Run `pnpm prisma generate` to regenerate Prisma client
- Run migrations: `pnpm prisma migrate dev`
- Check DATABASE_URL is correct

## Support

For Privy-specific issues:

- [Privy Documentation](https://docs.privy.io)
- [Privy Discord](https://discord.gg/privy)

For project issues:

- Check the console for errors
- Review the Privy dashboard logs
- Ensure all environment variables are set correctly
