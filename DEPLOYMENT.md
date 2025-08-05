# Vercel Deployment Guide

## Prerequisites

1. **Database Setup**: Set up a PostgreSQL database (Vercel Postgres, PlanetScale, or Supabase)
2. **GitHub OAuth App**: Create a GitHub OAuth application
3. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)

## Environment Variables

Set these environment variables in your Vercel project settings:

### Required Variables

```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-nextauth-secret-key"

# GitHub OAuth
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# GitHub API
GITHUB_ACCESS_TOKEN="your-github-access-token"
```

### Optional Variables (for blockchain features)

```bash
# Solana
REACT_APP_MINT_AUTHORITY_SECRET_KEY="your-solana-secret-key"
```

## Deployment Steps

1. **Connect Repository**: Connect your GitHub repository to Vercel
2. **Set Environment Variables**: Add all required environment variables in Vercel dashboard
3. **Deploy**: Vercel will automatically build and deploy your app
4. **Database Migration**: The build process will run `prisma db push` to set up your database schema

## Database Migration

After deployment, you may need to run database migrations:

```bash
# Generate Prisma client
npx prisma generate

# Push schema changes
npx prisma db push

# Or run migrations (if using migrations)
npx prisma migrate deploy
```

## Troubleshooting

- **Build Errors**: Check that all environment variables are set correctly
- **Database Connection**: Ensure your DATABASE_URL is correct and accessible
- **OAuth Issues**: Verify GitHub OAuth app settings match your Vercel domain
