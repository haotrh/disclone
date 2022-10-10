import React, { ReactNode, useContext } from "react";

interface IPopoverContext {
  close: () => any;
  isOpen: boolean;
}

export const PopoverContext = React.createContext<IPopoverContext>({} as IPopoverContext);

type PopoverProviderProps = { children: ReactNode } & IPopoverContext;

const PopoverProvider = ({ children, ...props }: PopoverProviderProps) => {
  return <PopoverContext.Provider value={props}>{children}</PopoverContext.Provider>;
};

const usePopover = (): IPopoverContext => {
  const context = useContext(PopoverContext);

  if (context == undefined) {
    throw new Error("usePopover must be used within a PopoverProvider");
  }

  return context;
};

export { PopoverProvider, usePopover };
