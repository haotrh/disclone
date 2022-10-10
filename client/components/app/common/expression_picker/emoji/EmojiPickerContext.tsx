import React, { ReactNode, useContext } from "react";
import { Emoji } from "types/server";

interface IEmojiPickerContext {
  skin: number;
  setSkin: (skin: number) => any;
  selectedIndex: number;
  setSelectedIndex: (index: number) => any;
  selectedEmoji: Emoji | null;
  setSelectedEmoji: (emoji: Emoji | null) => any;
  search: string;
  setSearch: (skin: string) => any;
  collapsedCategories: string[];
  setCollapsedCategories: (collapsedCategories: string[]) => any;
  handleClick: (emoji: Emoji) => any;
}

export const EmojiPickerContext = React.createContext<IEmojiPickerContext>(
  {} as IEmojiPickerContext
);

type EmojiPickerProviderProps = { children: ReactNode } & IEmojiPickerContext;

const EmojiPickerProvider = ({ children, ...props }: EmojiPickerProviderProps) => {
  return <EmojiPickerContext.Provider value={props}>{children}</EmojiPickerContext.Provider>;
};

const useEmojiPicker = (): IEmojiPickerContext => {
  const context = useContext(EmojiPickerContext);

  if (context == undefined) {
    throw new Error("useEmojiPicker must be used within a EmojiPickerProvider");
  }

  return context;
};

export { EmojiPickerProvider, useEmojiPicker };
