import NextAuth from "next-auth";
import authConfig from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // Tiempo de expiracón 30 min
    updateAge: 10 * 60, // Actualiza el tiempo de expiración cada 10 min
  },
  trustHost: true,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Verificar que user.id no sea undefined
        if (user.id) {
          token.id = user.id;  // Asignar solo si user.id es un string
        }
        token.user = user.user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id; // Incluye el ID en la sesión
      session.user.user = token.user; //
      return session;
    },
    authorized: async ({auth}) => {
      return !!auth
    }
  },// Configuración de las cookies
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
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
});