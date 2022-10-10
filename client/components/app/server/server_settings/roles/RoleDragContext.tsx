import React, { ReactNode, useContext, useState } from "react";
import { Role } from "types/server";

interface DragData {
  index: number;
  role: Role;
}

interface IRoleDragContext {
  drag: DragData | undefined;
  target: DragData | undefined;
  setDrag: (data: DragData | undefined) => void;
  setTarget: (data: DragData | undefined) => void;
}

export const RoleDragContext = React.createContext<IRoleDragContext>(
  {} as IRoleDragContext
);

type RoleDragProviderProps = { children: ReactNode };

const RoleDragProvider = ({ children }: RoleDragProviderProps) => {
  const [drag, setDrag] = useState<DragData>();
  const [target, setTarget] = useState<{
    index: number;
    role: Role;
  }>();

  return (
    <RoleDragContext.Provider value={{ drag, target, setDrag, setTarget }}>
      {children}
    </RoleDragContext.Provider>
  );
};

const useRoleDrag = (): IRoleDragContext => {
  const context = useContext(RoleDragContext);

  if (context == undefined) {
    throw new Error("useRoleDrag must be used within a RoleDragProvider");
  }

  return context;
};

export { RoleDragProvider, useRoleDrag };
