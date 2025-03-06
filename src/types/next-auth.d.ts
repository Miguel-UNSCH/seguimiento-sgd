import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      user: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    user: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    user: string;
  }
}