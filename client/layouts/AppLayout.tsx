import { ServerNavbar } from "@app/server_navbar";
import { useWS, withWS } from "@lib/contexts/WSContext";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import AppLoading from "@app/AppLoading";
import { LayerModalProvider } from "@app/common/modal/layer_modal/LayerModalContext";
import { LAYER_MODAL_PORTAL_ID } from "@app/common/modal/layer_modal/LayerModal";
import { ChannelProvider } from "@lib/contexts/ChannelContext";
import { useAppSelector } from "@hooks/redux";
import { setToken } from "@services/api";
import { emojiSpriteSrc } from "@utils/emoji.util";
import { CloseModalProvider } from "@app/common/modal/CloseModalContext";

interface AppLayoutProps {
  children?: ReactNode;
  sidebar?: ReactNode;
}

const AppLayout = ({ children, sidebar }: AppLayoutProps) => {
  const session = useSession();
  const router = useRouter();
  const [isOpenLayerModal, setIsOpenLayerModal] = useState(false);
  const { isInitialized, retry } = useWS();
  const settings = useAppSelector((state) => state.me.settings);

  const onOpenModal = () => {
    setIsOpenLayerModal(true);
  };

  const onCloseModal = () => {
    setIsOpenLayerModal(false);
  };

  useEffect(() => {
    if (router && session) {
      if (session.status === "unauthenticated") {
        router.push("/login");
        return;
      }
      if (session.data?.error === "RefreshAccessTokenError" && retry) {
        signOut({
          redirect: true,
          callbackUrl: "/login",
        });
        return;
      }
    }
  }, [session, router, retry]);

  useEffect(() => {
    if (document) {
      const classes = ["w-full", "h-full", "overflow-hidden", `theme-${settings?.theme ?? "dark"}`];
      classes.forEach((className) => document.body.classList.add(className));
      return () => classes.forEach((className) => document.body.classList.remove(className));
    }
  }, [settings?.theme]);

  useEffect(() => {
    if (session.status === "authenticated") {
      setToken(session.data.accessToken);
    }
  }, [session]);

  return useMemo(() => {
    if (!isInitialized || session.status !== "authenticated") {
      return <AppLoading />;
    }

    return (
      <>
        <Head>
          <title>Discord</title>
          <link rel="preload" href={emojiSpriteSrc} as="image" />
        </Head>
        <div className="bg-background-tertiary w-screen h-screen">
          <CloseModalProvider>
            <LayerModalProvider openModal={onOpenModal} closeModal={onCloseModal}>
              <motion.div
                className="absolute"
                animate={
                  isOpenLayerModal
                    ? { scale: 0.93, opacity: 0, zIndex: 0 }
                    : { scale: 1, opacity: 1, zIndex: 40 }
                }
                transition={{
                  duration: 0.2,
                }}
              >
                <ChannelProvider>
                  <div className="w-screen h-screen flex min-h-0">
                    <ServerNavbar />
                    <div className="flex-1 flex min-h-0 min-w-0">
                      {sidebar}
                      <div className="bg-background-primary flex-1 flex flex-col min-w-0">
                        {children}
                      </div>
                    </div>
                  </div>
                </ChannelProvider>
              </motion.div>
              <div className="absolute inset-0" id={LAYER_MODAL_PORTAL_ID} />
            </LayerModalProvider>
          </CloseModalProvider>
        </div>
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.status, isInitialized, isOpenLayerModal, router]);
};

export default withWS(AppLayout);
