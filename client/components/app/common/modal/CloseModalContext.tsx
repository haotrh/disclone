import _, { uniqueId } from "lodash";
import React, { ReactNode, useContext, useEffect, useRef } from "react";

interface ICloseModalContext {
  addCloseCallback: (close: () => any) => string;
  removeCloseCallback: (id: string) => any;
}

export const CloseModalContext = React.createContext<ICloseModalContext>({} as ICloseModalContext);

type CloseModalProviderProps = { children: ReactNode };

const CloseModalProvider = ({ children }: CloseModalProviderProps) => {
  const closeCallbacks = useRef<{ id: string; close: () => boolean }[]>([]);

  const addCloseCallback = (close: () => any) => {
    const id = uniqueId();
    closeCallbacks.current.push({ id, close });
    return id;
  };

  const removeCloseCallback = (id: string) => {
    closeCallbacks.current = closeCallbacks.current.filter((callback) => callback.id !== id);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const closeCallback = closeCallbacks.current.pop();
        closeCallback && closeCallback.close();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <CloseModalContext.Provider value={{ addCloseCallback, removeCloseCallback }}>
      {children}
    </CloseModalContext.Provider>
  );
};

const useCloseModal = (): ICloseModalContext => {
  const context = useContext(CloseModalContext);

  return context;
};

export { CloseModalProvider, useCloseModal };
