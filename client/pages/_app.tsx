import SVGMasks from "@app/SVGMasks";
import axios from "axios";
import { NextPage } from "next";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode, useState } from "react";
import { Provider as ReduxProvider } from "react-redux";
import "simplebar/dist/simplebar.min.css";
import "tippy.js/dist/tippy.css";
import { store } from "../lib/store/store";
import "../styles/fonts.css";
import "../styles/globals.css";
import "../styles/simplebar.css";
import { Hydrate, QueryClient, QueryClientProvider } from "@tanstack/react-query";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  pageProps: any;
};

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider refetchOnWindowFocus={false} session={session}>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <div className="absolute" id="tippy-portal" />
            <SVGMasks />
            {getLayout(<Component {...pageProps} />)}{" "}
          </Hydrate>
        </QueryClientProvider>
      </ReduxProvider>
    </SessionProvider>
  );
}
