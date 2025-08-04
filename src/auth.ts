import NextAuth, { DefaultSession } from "next-auth";
import GitHub from "next-auth/providers/github";
import { prisma } from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";

declare module "next-auth" {
  interface User {
    username?: string
  }
  interface Session {
    user: {
      tokens: number;
      createdAt: Date;
      login: string;
      username: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [GitHub],
  callbacks: {
    async session({ session, token }) {
      session.user = {
        ...session.user,
        username: session.user.username as string,
        tokens: session.user.tokens as number,
        createdAt: session.user.createdAt as Date,
        login: session.user.login as string,
      };
      return session;
    },
    async signIn({ user, account }) { 
      if (account?.provider === 'github' && user && !user?.username) {
        try {
          const response = await fetch('https://api.github.com/user', {
            headers: { Authorization: `token ${account.access_token}` }
          });
          const githubData = await response.json();
          const updateResult = await prisma.user.update({
            where: { id: user.id },
            data: { username: githubData.login }
          });
        } catch (error) {
          console.error('Username update failed:', error);
        }
      }
      return true;
    }
  },
});
