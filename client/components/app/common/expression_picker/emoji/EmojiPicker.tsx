import { SearchInput } from "@app/common/input";
import { usePopover } from "@app/common/popover/PopoverContext";
import { useAppSelector } from "@hooks/redux";
import useLocalStorage from "@hooks/useLocalStorage";
import { selectEmojiCategoriesWithData } from "@store/selectors";
import _ from "lodash";
import React, { KeyboardEventHandler, ReactNode, useEffect, useMemo, useState } from "react";
import { AiFillFlag, AiFillHeart } from "react-icons/ai";
import { BsEmojiSmileFill } from "react-icons/bs";
import { FaCoffee, FaLeaf } from "react-icons/fa";
import { IoLogoGameControllerB } from "react-icons/io";
import { IoFastFood } from "react-icons/io5";
import { RiShip2Fill } from "react-icons/ri";
import { Transforms } from "slate";
import { useSlate } from "slate-react";
import { Emoji } from "types/server";
import EmojiCategoryContent from "./EmojiCategoryContent";
import EmojiCategoryNavbar from "./EmojiCategoryNavbar";
import { EmojiPickerProvider } from "./EmojiPickerContext";
import EmojiPickerSelected from "./EmojiPickerSelected";
import SkinPicker from "./SkinPicker";

export const nativeCategoryData: { [id: string]: { label: string; icon: ReactNode } } = {
  people: { label: "People", icon: <BsEmojiSmileFill /> },
  nature: { label: "Nature", icon: <FaLeaf /> },
  foods: { label: "Foods", icon: <IoFastFood /> },
  activity: { label: "Activities", icon: <IoLogoGameControllerB /> },
  places: { label: "Travel", icon: <RiShip2Fill /> },
  objects: { label: "Objects", icon: <FaCoffee /> },
  symbols: { label: "Symbols", icon: <AiFillHeart /> },
  flags: { label: "Flags", icon: <AiFillFlag /> },
};

const EmojiPicker = () => {
  const categoriesWithData = useAppSelector(selectEmojiCategoriesWithData);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji | null>(null);
  const [search, setSearch] = useState<string>("");
  const { close } = usePopover();
  const editor = useSlate();
  const [skin, setSkin] = useLocalStorage<number>("emojiPickerSkin", 0);
  const [collapsedCategories, setCollapsedCategories] = useLocalStorage<string[]>(
    "emojiPickerCollapsedCategories",
    []
  );
  const visibleEmojiCount = useMemo(
    () =>
      _.sumBy(categoriesWithData, (o) =>
        collapsedCategories.includes(o.id) ? 0 : o.emojis.length
      ),
    [categoriesWithData, collapsedCategories]
  );

  const handleClick = (emoji: Emoji) => {
    close();
    const value = "native" in emoji ? emoji.native : `<:${emoji.name}:${emoji.id}>`;
    Transforms.insertNodes(editor, [
      {
        type: "emoji",
        emoji,
        value,
        children: [{ text: "" }],
      },
      { text: "" },
    ]);
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  useEffect(() => {
    if (visibleEmojiCount === 0) {
      setSelectedEmoji(null);
      return;
    }
    if (selectedIndex > visibleEmojiCount - 1) {
      setSelectedIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleEmojiCount]);

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        if (selectedIndex === 0) return;
        setSelectedIndex(selectedIndex - 1);
        break;
      case "ArrowRight":
        e.preventDefault();
        if (selectedIndex === visibleEmojiCount - 1) return;
        setSelectedIndex(selectedIndex + 1);
        break;
      case "Enter":
        selectedEmoji && handleClick(selectedEmoji);
        break;
    }
  };

  return (
    <EmojiPickerProvider
      handleClick={handleClick}
      selectedIndex={selectedIndex}
      setSelectedIndex={setSelectedIndex}
      selectedEmoji={selectedEmoji}
      setSelectedEmoji={setSelectedEmoji}
      skin={skin}
      setSkin={setSkin}
      search={search}
      setSearch={setSearch}
      collapsedCategories={collapsedCategories}
      setCollapsedCategories={setCollapsedCategories}
    >
      <div className="flex-1 min-h-0 flex flex-col" onKeyDown={handleKeyDown}>
        <div className="flex gap-2 items-center p-4 pt-0 border-b border-background-tertiary">
          <SearchInput
            autoComplete="none"
            placeholder={
              selectedEmoji
                ? `:${selectedEmoji.altName ?? selectedEmoji.name}:`
                : "Find the perfect emoji"
            }
            search={search}
            setSearch={setSearch}
          />
          <SkinPicker />
        </div>
        <div className="flex-1 flex min-h-0 min-w-0">
          <div
            className="w-12 shrink-0 bg-background-tertiary min-h-0 overflow-y-auto no-scrollbar flex flex-col
      items-center gap-1 scroll-m-2 relative"
          >
            <EmojiCategoryNavbar />
          </div>
          <div className="flex-1 min-h-0 relative flex flex-col min-w-0">
            <EmojiCategoryContent />
            <EmojiPickerSelected />
          </div>
        </div>
      </div>
    </EmojiPickerProvider>
  );
};

export default React.memo(EmojiPicker);
