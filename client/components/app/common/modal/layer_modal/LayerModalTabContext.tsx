import React, { ReactNode, useContext } from "react";

interface ILayerModalTabContext {
  setTab: (tab: [number, number]) => void;
}

export const LayerModalTabContext = React.createContext<ILayerModalTabContext>(
  {} as ILayerModalTabContext
);

type LayerModalTabProviderProps = {
  children: ReactNode;
} & ILayerModalTabContext;

const LayerModalTabProvider = ({
  children,
  setTab,
}: LayerModalTabProviderProps) => {
  return (
    <LayerModalTabContext.Provider value={{ setTab }}>
      {children}
    </LayerModalTabContext.Provider>
  );
};

const useLayerModalTab = (): ILayerModalTabContext => {
  const context = useContext(LayerModalTabContext);

  if (context == undefined) {
    throw new Error(
      "useLayerModalTab must be used within a LayerModalTabProvider"
    );
  }

  return context;
};

export { LayerModalTabProvider, useLayerModalTab };
