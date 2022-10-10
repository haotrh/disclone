import React, { ReactNode, useContext } from "react";
import { GifObject } from "types/gif.type";
import { GifTab } from "./GifPicker";

interface IGifPickerContext {
  search: string;
  setSearch: (skin: string) => any;
  tab: GifTab;
  setTab: (tab: GifTab) => any;
  setSearchList: (list: GifObject[] | null) => any;
  debouncedSearch: string;
}

export const GifPickerContext = React.createContext<IGifPickerContext>({} as IGifPickerContext);

type GifPickerProviderProps = { children: ReactNode } & IGifPickerContext;

const GifPickerProvider = ({ children, ...props }: GifPickerProviderProps) => {
  return <GifPickerContext.Provider value={props}>{children}</GifPickerContext.Provider>;
};

const useGifPicker = (): IGifPickerContext => {
  const context = useContext(GifPickerContext);

  if (context == undefined) {
    throw new Error("useGifPicker must be used within a GifPickerProvider");
  }

  return context;
};

export { GifPickerProvider, useGifPicker };
