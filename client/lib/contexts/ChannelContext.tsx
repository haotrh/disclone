import { selectChannel } from "@store/selectors";
import { useRouter } from "next/router";
import React, { ReactNode, useContext } from "react";
import { ChannelState, ServerState } from "types/store.interfaces";
import { User } from "types/user";
import { useAppSelector } from "../hooks/redux";

interface IChannelContext {
  server: ServerState | undefined;
  channel: (ChannelState & { recipients: User[] }) | null;
}

export const ChannelContext = React.createContext<IChannelContext>({} as IChannelContext);

type ChannelProviderProps = { children: ReactNode };

const ChannelProvider = ({ children }: ChannelProviderProps) => {
  const router = useRouter();
  const server = useAppSelector((selector) => {
    return selector.servers[(router.query?.serverId as string) ?? ""];
  });
  const channel = useAppSelector((state) =>
    selectChannel(
      state,
      (router.query?.channelId as string) ?? server?.systemChannelId ?? server?.channels[0]
    )
  );
  return (
    <ChannelContext.Provider
      value={{
        channel,
        server,
      }}
    >
      {children}
    </ChannelContext.Provider>
  );
};

const useChannel = (): IChannelContext => {
  const context = useContext(ChannelContext);
  return context;
};

export { ChannelProvider, useChannel };
