declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_URL: string;
    SESSION_SECRET: string;
    JWT_SECRET: string;
    NEXT_PUBLIC_WS_URL: string;
    TENOR_KEY: string;
    TENOR_CLIENT_KEY: string;
    IRON_SESSION_COOKIE_NAME: string;
    IRON_SESSION_PASSWORD: string;
  }
}

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
    accessToken?: string;
  }
}
