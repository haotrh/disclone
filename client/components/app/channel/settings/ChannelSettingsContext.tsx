import React, { ReactNode, useContext, useState } from "react";
import { ChannelState } from "types/store.interfaces";

interface IChannelSettingsContext {
  channel: ChannelState;
}

export const ChannelSettingsContext =
  React.createContext<IChannelSettingsContext>({} as IChannelSettingsContext);

type ChannelSettingsProviderProps = {
  children: ReactNode;
} & IChannelSettingsContext;

const ChannelSettingsProvider = ({
  children,
  channel,
}: ChannelSettingsProviderProps) => {
  return (
    <ChannelSettingsContext.Provider value={{ channel }}>
      {children}
    </ChannelSettingsContext.Provider>
  );
};

const useChannelSettings = (): IChannelSettingsContext => {
  const context = useContext(ChannelSettingsContext);

  if (context == undefined) {
    throw new Error(
      "useChannelSettings must be used within a ChannelSettingsProvider"
    );
  }

  return context;
};

export { ChannelSettingsProvider, useChannelSettings };
