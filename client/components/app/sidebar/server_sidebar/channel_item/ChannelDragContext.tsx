import React, { ReactNode, useContext, useState } from "react";
import { ChannelState } from "types/store.interfaces";

interface DragData {
  index: number;
  channel: ChannelState;
}

interface IChannelDragContext {
  drag: DragData | undefined;
  target: DragData | undefined;
  setDrag: (data: DragData | undefined) => void;
  setTarget: (data: DragData | undefined) => void;
}

export const ChannelDragContext = React.createContext<IChannelDragContext>(
  {} as IChannelDragContext
);

type ChannelDragProviderProps = { children: ReactNode };

const ChannelDragProvider = ({ children }: ChannelDragProviderProps) => {
  const [drag, setDrag] = useState<DragData>();
  const [target, setTarget] = useState<{
    index: number;
    channel: ChannelState;
  }>();

  return (
    <ChannelDragContext.Provider value={{ drag, target, setDrag, setTarget }}>
      {children}
    </ChannelDragContext.Provider>
  );
};

const useChannelDrag = (): IChannelDragContext => {
  const context = useContext(ChannelDragContext);

  if (context == undefined) {
    throw new Error("useChannelDrag must be used within a ChannelDragProvider");
  }

  return context;
};

export { ChannelDragProvider, useChannelDrag };
