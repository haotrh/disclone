import React, { ReactNode, useContext } from "react";

interface IModalContext {
  close: () => any;
}

export const ModalContext = React.createContext<IModalContext>(
  {} as IModalContext
);

type ModalProviderProps = { children: ReactNode; close: () => Promise<any> };

const ModalProvider = ({ children, close }: ModalProviderProps) => {
  const handleClose = () => {
    close();
    return new Promise((res) => setTimeout(res, 125));
  };

  return (
    <ModalContext.Provider value={{ close: handleClose }}>
      {children}
    </ModalContext.Provider>
  );
};

const useModal = (): IModalContext => {
  const context = useContext(ModalContext);

  if (context == undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }

  return context;
};

export { ModalProvider, useModal };
