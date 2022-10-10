import Divider from "@app/common/Divider";
import { usePopover } from "@app/common/popover/PopoverContext";
import { Tooltip } from "@app/common/tooltip";
import { useAppSelector } from "@hooks/redux";
import { selectEmojiCategories } from "@store/selectors";
import { EmojiCategory } from "@store/slices/emoji.slice";
import serverShortname from "@utils/serverShortname";
import classNames from "classnames";
import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import Scroll from "react-scroll";
import { nativeCategoryData } from "./EmojiPicker";

interface CategoryButtonProps {
  category: EmojiCategory;
  children: (isActive: boolean) => ReactNode;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ category, children }) => {
  const [isActive, setIsActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);
  const { isOpen } = usePopover();

  useEffect(() => {
    if (isOpen) {
      setMount(true);
      return () => setMount(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isActive && ref.current) {
      setTimeout(() => ref.current?.scrollIntoView({ inline: "end", behavior: "smooth" }), 0);
    }
  }, [isActive]);

  if (!mount || !isOpen) {
    return (
      <Scroll.Link
        key="temp"
        to={`emojiCategory${category.id}`}
        containerId="emojiContainer"
        className="first:pt-2 last:pb-2"
      >
        <div ref={ref}>{children(isActive)}</div>
      </Scroll.Link>
    );
  }

  return (
    <Scroll.Link
      spy={true}
      to={`emojiCategory${category.id}`}
      containerId="emojiContainer"
      onSetActive={() => setIsActive(true)}
      onSetInactive={() => setIsActive(false)}
      className="first:pt-2 last:pb-2"
    >
      <div ref={ref}>{children(isActive)}</div>
    </Scroll.Link>
  );
};

interface NativeCategoryButtonProps {
  category: EmojiCategory;
}

const NativeCategoryButton: React.FC<NativeCategoryButtonProps> = ({ category }) => {
  return (
    <CategoryButton key={category.id} category={category}>
      {(isActive) => (
        <div
          className={classNames("text-[21px] cursor-pointer p-1.5 rounded", {
            "bg-background-secondary text-header-primary": isActive,
            "hover:bg-background-secondary text-header-secondary hover:text-header-primary":
              !isActive,
          })}
        >
          {nativeCategoryData[category.id].icon}
        </div>
      )}
    </CategoryButton>
  );
};

interface ServerCategoryButtonProps {
  category: EmojiCategory;
}

const ServerCategoryButton: React.FC<ServerCategoryButtonProps> = ({ category }) => {
  const server = useAppSelector((state) => state.servers[category.id]);
  if (!server) return null;

  return (
    <CategoryButton category={category}>
      {(isActive) => (
        <Tooltip content={server.name} placement="right">
          <div
            className={classNames(
              "w-8 h-8 text-xs bg-background-primary transition-all",
              "cursor-pointer select-none flex-center rounded-[16px] overflow-hidden",
              {
                "!rounded-md": isActive,
                "hover:rounded-md": !isActive,
              }
            )}
          >
            {server.icon ? (
              <img className="w-full h-full" alt="" src={server.icon} />
            ) : (
              <span className="w-full overflow-ellipsis overflow-hidden text-center">
                {serverShortname(server.name)}
              </span>
            )}
          </div>
        </Tooltip>
      )}
    </CategoryButton>
  );
};

const EmojiCategoryNavbar = () => {
  const categories = useAppSelector(selectEmojiCategories);
  const dividerIndex = useMemo(
    () => categories.filter((category) => category.server).length - 1,
    [categories]
  );

  return (
    <>
      {categories.map((category, i) => (
        <React.Fragment key={category.id}>
          {category.server ? (
            <ServerCategoryButton category={category} />
          ) : (
            <NativeCategoryButton category={category} />
          )}
          {i === dividerIndex && <Divider spacing="xs" className="w-6" />}
        </React.Fragment>
      ))}
    </>
  );
};

export default React.memo(EmojiCategoryNavbar);
