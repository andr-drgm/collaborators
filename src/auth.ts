import NextAuth, { DefaultSession } from "next-auth";
import GitHub from "next-auth/providers/github";
import { prisma } from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";

declare module "next-auth" {
  interface Session {
    user: {
      tokens: number;
      createdAt: Date;
      login: string;
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
        tokens: session.user.tokens as number,
        createdAt: session.user.createdAt as Date,
        login: session.user.login as string,
      };
      return session;
    },
  },
});
