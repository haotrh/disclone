import EmojiRender from "@app/common/Emoji";
import { useAppSelector } from "@hooks/redux";
import { selectAllEmojiData, selectEmojiCategoriesWithData } from "@store/selectors";
import { EmojiCategory } from "@store/slices/emoji.slice";
import { searchArray, searchText } from "@utils/common.util";
import { getEmojiSkin } from "@utils/emoji.util";
import serverShortname from "@utils/serverShortname";
import classNames from "classnames";
import _ from "lodash";
import React, { HTMLProps, useEffect, useMemo, useRef } from "react";
import { BiChevronDown } from "react-icons/bi";
import Scroll from "react-scroll";
import ViewportList, { ViewportListRef } from "react-viewport-list";
import { Emoji } from "types/server";
import EmojiFromSprite from "./EmojiFromSprite";
import { nativeCategoryData } from "./EmojiPicker";
import { useEmojiPicker } from "./EmojiPickerContext";

interface EmojiButtonProps extends HTMLProps<HTMLDivElement> {
  emoji: Emoji;
  index: number;
}

const EmojiButton: React.FC<EmojiButtonProps> = ({ index, emoji, ...props }) => {
  const { selectedIndex, skin, setSelectedIndex, handleClick, setSelectedEmoji } = useEmojiPicker();
  const emojiSkin = useMemo(() => getEmojiSkin(emoji, skin), [emoji, skin]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (index === selectedIndex) {
      setSelectedEmoji(emojiSkin);
    }
  }, [selectedIndex, index, setSelectedEmoji, emojiSkin]);

  return (
    <div
      ref={ref}
      className={classNames("flex-shrink-0 p-1 cursor-pointer rounded-md w-10 h-10", {
        "bg-background-accent": index === selectedIndex,
      })}
      {...props}
      onMouseEnter={() => setSelectedIndex(index)}
      onClick={() => handleClick(emojiSkin)}
    >
      {"native" in emojiSkin ? (
        <EmojiFromSprite emoji={emojiSkin} />
      ) : (
        <EmojiRender className="!w-full !h-full" emoji={emojiSkin} />
      )}
    </div>
  );
};

interface EmojiCategorySectionProps {
  category: Omit<EmojiCategory, "emojis"> & { emojis: Emoji[] };
  viewportRef:
    | React.MutableRefObject<HTMLElement | null>
    | React.RefObject<HTMLElement | null>
    | undefined;
  startIndex: number;
}

const EmojiCategorySection: React.FC<EmojiCategorySectionProps> = React.memo(
  ({ category, viewportRef, startIndex }) => {
    const { collapsedCategories, setCollapsedCategories } = useEmojiPicker();
    const server = useAppSelector((state) => state.servers[category.id]);
    const isCollapsed = useMemo(
      () => collapsedCategories.includes(category.id),
      [collapsedCategories, category]
    );

    const handleCollapse = () => {
      if (isCollapsed) {
        setCollapsedCategories(
          collapsedCategories.filter((collapsedCategory) => collapsedCategory !== category.id)
        );
      } else {
        setCollapsedCategories([...collapsedCategories, category.id]);
      }
    };

    return (
      <div>
        <Scroll.Element name={`emojiCategory${category.id}`}>
          <div className="sticky top-0 bg-background-secondary py-1.5 flex items-center">
            <div
              onClick={handleCollapse}
              className="text-[13px] flex min-w-0 items-center text-header-secondary hover:text-header-primary
        gap-1.5 select-none cursor-pointer"
            >
              <div className="w-4 h-4 flex-shrink-0 flex-center rounded overflow-hidden bg-background-primary">
                {server ? (
                  server?.icon ? (
                    <img src={server.icon} alt={server.name + " icon"} />
                  ) : (
                    <span className="w-full overflow-ellipsis overflow-hidden p-px text-center">
                      {serverShortname(server.name)}
                    </span>
                  )
                ) : (
                  nativeCategoryData[category.id].icon
                )}
              </div>
              <div className="font-semibold uppercase whitespace-nowrap overflow-hidden min-w-0 flex-1 overflow-ellipsis">
                {server ? server.name : nativeCategoryData[category.id].label}
              </div>
              <div
                className={classNames("transition-all", {
                  "-rotate-90": isCollapsed,
                  "rotate-0": !isCollapsed,
                })}
              >
                <BiChevronDown size={18} />
              </div>
            </div>
          </div>
          {!isCollapsed && (
            <ViewportList
              items={_.chunk(category.emojis, 9)}
              fixed
              itemMinSize={40}
              viewportRef={viewportRef}
            >
              {(chunk, chunkIndex) => (
                <ul
                  role="row"
                  aria-rowindex={chunkIndex}
                  key={category.id + "_" + chunkIndex}
                  className="flex"
                >
                  {chunk.map((emoji, emojiIndex) => (
                    <li
                      role="grid-cell"
                      aria-rowindex={chunkIndex}
                      aria-colindex={emojiIndex}
                      key={"id" in emoji ? emoji.id : emoji.name}
                    >
                      <EmojiButton
                        index={startIndex + (chunkIndex * 9 + emojiIndex)}
                        emoji={emoji}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </ViewportList>
          )}
        </Scroll.Element>
      </div>
    );
  }
);

EmojiCategorySection.displayName = "EmojiCategorySection";

const EmojiCategoryContent = () => {
  const { search, collapsedCategories } = useEmojiPicker();
  const { emojiList } = useAppSelector(selectAllEmojiData);
  const emojiKeywords = useAppSelector((state) => state.emoji.keywords);
  const categoriesWithData = useAppSelector(selectEmojiCategoriesWithData);
  const ref = useRef<HTMLDivElement>(null);
  const searchedEmojis = useMemo(
    () =>
      emojiList.filter(
        (emoji) =>
          searchText(search, emoji.name) ||
          (emoji.altName && searchText(search, emoji.altName)) ||
          (emojiKeywords[emoji.name] && searchArray(search, emojiKeywords[emoji.name]))
      ),
    [emojiList, search, emojiKeywords]
  );
  const listRef = useRef<ViewportListRef>(null);

  return (
    <div
      ref={ref}
      tabIndex={-1}
      id="emojiContainer"
      className="flex-1 min-h-0 min-w-0 px-2 custom-scrollbar overflow-y-auto relative scroll-mt-9"
    >
      {search ? (
        <ViewportList
          ref={listRef}
          viewportRef={ref}
          overscan={9}
          items={_.chunk(searchedEmojis, 9)}
          itemMinSize={40}
        >
          {(chunk, chunkIndex) => (
            <ul key={search + chunkIndex} className="flex scroll-mt-9">
              {chunk.map((emoji, emojiIndex) => (
                <li key={"id" in emoji ? emoji.id : emoji.name}>
                  <EmojiButton index={chunkIndex * 9 + emojiIndex} emoji={emoji} />
                </li>
              ))}
            </ul>
          )}
        </ViewportList>
      ) : (
        categoriesWithData.map((category, i) => (
          <EmojiCategorySection
            startIndex={_.sumBy(categoriesWithData.slice(0, i), (o) =>
              collapsedCategories.includes(o.id) ? 0 : o.emojis.length
            )}
            key={category.id}
            category={category}
            viewportRef={ref}
          />
        ))
      )}
    </div>
  );
};

export default React.memo(EmojiCategoryContent);
