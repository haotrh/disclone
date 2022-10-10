import React, { ReactNode, useContext, useState } from "react";

interface ITabContext<T> {
  tab: T;
  setTab: (tab: T) => void;
}

export const TabContext = React.createContext<ITabContext<any>>(
  {} as ITabContext<any>
);

type TabProviderProps<T> = { children: ReactNode } & ITabContext<T>;

const TabProvider = <T extends unknown>({
  children,
  tab,
  setTab,
}: TabProviderProps<T>) => {
  return (
    <TabContext.Provider
      value={{
        tab,
        setTab,
      }}
    >
      {children}
    </TabContext.Provider>
  );
};

const useTab = <T extends unknown>(): ITabContext<T> => {
  const context = useContext(TabContext);
  return context;
};

export { TabProvider, useTab };
