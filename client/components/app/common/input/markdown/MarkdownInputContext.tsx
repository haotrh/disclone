import React, { ReactNode, useContext } from "react";

interface IMarkdownInputContext {
  close: () => any;
}

export const MarkdownInputContext = React.createContext<IMarkdownInputContext>(
  {} as IMarkdownInputContext
);

type MarkdownInputProviderProps = { children: ReactNode; close: () => any };

const MarkdownInputProvider = ({ children, close }: MarkdownInputProviderProps) => {
  return (
    <MarkdownInputContext.Provider value={{ close }}>{children}</MarkdownInputContext.Provider>
  );
};

const useMarkdownInput = (): IMarkdownInputContext => {
  const context = useContext(MarkdownInputContext);

  if (context == undefined) {
    throw new Error("useMarkdownInput must be used within a MarkdownInputProvider");
  }

  return context;
};

export { MarkdownInputProvider, useMarkdownInput };
