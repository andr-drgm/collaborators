import { PrivyClient } from "@privy-io/server-auth";
import { PrismaClient } from "@prisma/client";

// Server-side Privy client
export const privyServer = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

interface LinkedAccount {
  type: string;
  subject?: string | null;
  username?: string | null;
  name?: string | null;
  profilePictureUrl?: string | null;
  avatarUrl?: string | null;
  accessToken?: string | null;
  address?: string | null;
}

interface PrivyUser {
  id: string;
  linkedAccounts?: LinkedAccount[];
  email?: { address?: string | null };
  wallet?: {
    address?: string | null;
    walletClientType?: string | null;
    chainType?: string | null;
  };
  github?: {
    subject?: string | null;
    name?: string | null;
    username?: string | null;
    profilePictureUrl?: string | null;
    avatarUrl?: string | null;
  };
}

// Helper to get user from Privy access token
export async function getPrivyUser(accessToken: string) {
  try {
    const verifiedClaims = await privyServer.verifyAuthToken(accessToken);

    // The verified claims should contain the user ID
    if (!verifiedClaims?.userId) {
      console.error("No userId in verified claims");
      return null;
    }

    // Fetch the full user profile from Privy
    try {
      const userProfile = await privyServer.getUser(verifiedClaims.userId);
      console.log("Full user profile:", JSON.stringify(userProfile, null, 2));
      return userProfile;
    } catch (profileError) {
      console.error("Error fetching user profile:", profileError);
      // Fallback to basic user object with just the ID
      return {
        id: verifiedClaims.userId,
        ...verifiedClaims,
      };
    }
  } catch (error) {
    console.error("Error verifying Privy token:", error);
    return null;
  }
}

// Helper to sync Privy user with database
export async function syncPrivyUserToDb(
  privyUser: PrivyUser,
  prisma: PrismaClient
) {
  try {
    if (!privyUser?.id) {
      throw new Error("Privy user ID is missing");
    }

    // Extract GitHub data if available
    const githubAccount = privyUser.linkedAccounts?.find(
      (account) => account.type === "github_oauth" || account.type === "github"
    );

    // Extract wallet data if available
    const wallet = privyUser.linkedAccounts?.find(
      (account) => account.type === "wallet" || account.type === "smart_wallet"
    );

    // Debug: Log GitHub account data
    console.log("GitHub account data:", JSON.stringify(githubAccount, null, 2));

    // Extract GitHub profile image
    // Privy doesn't provide the avatar URL directly, so construct it from GitHub user ID
    const githubUserId = githubAccount?.subject || privyUser.github?.subject;
    const githubImage = githubUserId
      ? `https://avatars.githubusercontent.com/u/${githubUserId}?v=4`
      : githubAccount?.profilePictureUrl ||
        githubAccount?.avatarUrl ||
        privyUser.github?.profilePictureUrl ||
        privyUser.github?.avatarUrl;

    console.log("Extracted GitHub image:", githubImage);

    // Upsert user in database
    const user = await prisma.user.upsert({
      where: { privyId: privyUser.id },
      update: {
        name:
          githubAccount?.name ||
          privyUser.github?.name ||
          privyUser.email?.address?.split("@")[0] ||
          "User",
        email: privyUser.email?.address,
        username: githubAccount?.username || privyUser.github?.username,
        login: githubAccount?.username || privyUser.github?.username,
        image: githubImage,
        walletAddress: wallet?.address,
      },
      create: {
        privyId: privyUser.id,
        name:
          githubAccount?.name ||
          privyUser.github?.name ||
          privyUser.email?.address?.split("@")[0] ||
          "User",
        email: privyUser.email?.address,
        username: githubAccount?.username || privyUser.github?.username,
        login: githubAccount?.username || privyUser.github?.username,
        image: githubImage,
        walletAddress: wallet?.address,
        unclaimedTokens: 0,
      },
    });

    // If GitHub account is linked, also sync the account
    if (githubAccount) {
      console.log(
        "GitHub account has accessToken:",
        !!githubAccount.accessToken
      );

      // Only upsert if we have an access token and subject
      if (githubAccount.accessToken && githubAccount.subject) {
        await prisma.account.upsert({
          where: {
            provider_providerAccountId: {
              provider: "github",
              providerAccountId: githubAccount.subject,
            },
          },
          update: {
            access_token: githubAccount.accessToken,
          },
          create: {
            userId: user.id,
            type: "oauth",
            provider: "github",
            providerAccountId: githubAccount.subject,
            access_token: githubAccount.accessToken,
          },
        });
      } else {
        console.warn(
          "GitHub account found but no access token available. You may need to configure 'Return OAuth tokens' in Privy dashboard."
        );
      }
    }

    return user;
  } catch (error) {
    console.error("Error syncing Privy user to database:", error);
    throw error;
  }
}
