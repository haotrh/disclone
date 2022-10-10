import React, { ReactNode, useContext } from "react";

interface ILayerModalContext {
  closeModal: () => any;
  openModal: () => any;
}

export const LayerModalContext = React.createContext<ILayerModalContext>(
  {} as ILayerModalContext
);

type LayerModalProviderProps = {
  children: ReactNode;
} & ILayerModalContext;

const LayerModalProvider = ({
  children,
  closeModal,
  openModal,
}: LayerModalProviderProps) => {
  return (
    <LayerModalContext.Provider value={{ closeModal, openModal }}>
      {children}
    </LayerModalContext.Provider>
  );
};

const useLayerModal = (): ILayerModalContext => {
  const context = useContext(LayerModalContext);

  if (context == undefined) {
    throw new Error("useLayerModal must be used within a LayerModalProvider");
  }

  return context;
};

export { LayerModalProvider, useLayerModal };
