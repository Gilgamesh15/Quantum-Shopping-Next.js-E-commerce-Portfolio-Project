import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/connect";
import { DefaultJWT } from "next-auth/jwt";
// Extend the Session interface
declare module "next-auth" {
  // Extend the User interface
  interface User {
    role: string;
  }
}

// Extend the JWT interface
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  callbacks: {
    jwt({ token, user }) {
      token.role = user.role;
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
  providers: [],
  session: {
    strategy: "jwt",
  },
});
