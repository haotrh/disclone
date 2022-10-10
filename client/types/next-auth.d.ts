import NextAuth, { Session } from "next-auth";
import { User } from "./user";

declare module "next-auth" {
  interface Session {
    user: User;
    accessToken: string;
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    user: User;
    exp: number;
    error?: string;
  }
}
