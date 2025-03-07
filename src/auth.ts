import NextAuth from "next-auth";
import authConfig from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60,
    updateAge: 10 * 60,
  },
  trustHost: true,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        if (user.id) {
          token.id = user.id;
        }
        token.user = user.user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.user = token.user;
      return session;
    },
    authorized: async ({auth}) => {
      return !!auth
    }
  },
  cookies: {
    sessionToken: {
      name: `${process.env.COOKIE_PREFIX}_session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: `${process.env.COOKIE_PREFIX}_csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name: `${process.env.COOKIE_PREFIX}_callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
});