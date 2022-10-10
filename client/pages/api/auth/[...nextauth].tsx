import axios from "axios";
import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { IErrorResponse } from "types/api.interfaces";
import urlJoin from "url-join";
import { User } from "../../../types/user";
import { JwtUtils } from "../../../utils/JwtUtils";

type IRefreshToken = {
  accessToken: string;
  refreshToken: string;
} & IErrorResponse;

type ILoginResponse = {
  user: User;
  token: {
    accessToken: string;
    refreshToken: string;
  };
};

const refreshAccessToken = async (token: JWT) => {
  try {
    const url = urlJoin(process.env.NEXT_PUBLIC_API_URL, "auth/refresh");
    const res = await axios.post<IRefreshToken>(url, {
      token: token.refreshToken,
    });
    const data = res.data;
    const accessTokenPayload = JwtUtils.decode(data.accessToken) as JWT;
    return {
      ...token,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      exp: accessTokenPayload.exp,
    };
  } catch (error: any) {
    return { ...token, error: "RefreshAccessTokenError" };
  }
};

export const config: NextAuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;
        const loginUrl = urlJoin(process.env.NEXT_PUBLIC_API_URL, "auth/login");
        try {
          const data = (
            await axios.post<ILoginResponse>(loginUrl, {
              email: credentials.email,
              password: credentials.password,
            })
          ).data;
          return data;
        } catch {
          return null;
        }
      },
    }),
  ],
  secret: process.env.SESSION_SECRET,
  session: {
    maxAge: 604800, //7 days
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  callbacks: {
    //@ts-ignore
    async jwt({ token, user }: { token: JWT; user?: ILoginResponse }) {
      if (user) {
        const accessTokenPayload = JwtUtils.decode(
          user.token.accessToken as string
        ) as JWT;

        return {
          ...token,
          sub: user.user.id,
          accessToken: user.token.accessToken,
          refreshToken: user.token.refreshToken,
          user: user.user,
          exp: accessTokenPayload.exp,
        };
      }

      const accessTokenPayload = JwtUtils.decode(
        token.accessToken ?? ""
      ) as JWT;

      const { exp = 0 } = accessTokenPayload;

      if (dayjs().unix() < exp) {
        const url = urlJoin(process.env.NEXT_PUBLIC_API_URL, "users/@me");

        const newUser: User = (
          await axios.get(url, {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          })
        ).data;

        if (newUser) {
          return { ...token, user: newUser };
        } else {
          return { error: "user not found" };
        }
      }

      token = await refreshAccessToken(token);
      return token;
    },
    async session({ session, token }) {
      session.error = token.error;
      session.accessToken = token.accessToken;
      session.user = token.user as User;
      return session;
    },
  },
};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, config);
}
