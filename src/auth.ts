import NextAuth, { DefaultSession } from "next-auth";
import GitHub from "next-auth/providers/github";
import { prisma } from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";

declare module "next-auth" {
  interface User {
    username?: string;
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
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      session.user = {
        ...session.user,
        username: dbUser?.username || session.user.name || "",
        tokens: dbUser?.tokens || 0,
        createdAt: dbUser?.createdAt || new Date(),
        login: dbUser?.username || session.user.name || "",
      };
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "github" && user && !user?.username) {
        try {
          const response = await fetch("https://api.github.com/user", {
            headers: { Authorization: `token ${account.access_token}` },
          });

          if (!response.ok) {
            console.error("GitHub API error:", response.statusText);
            return true;
          }

          const githubData = await response.json();
          await prisma.user.update({
            where: { id: user.id },
            data: { username: githubData.login },
          });
        } catch (error) {
          console.error("Username update failed:", error);
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
});
