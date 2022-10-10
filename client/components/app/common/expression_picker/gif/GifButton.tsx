import { usePopover } from "@app/common/popover/PopoverContext";
import Tooltip from "@app/common/tooltip/Tooltip";
import useSendMessage from "@hooks/useSendMessage";
import classNames from "classnames";
import { motion, MotionProps, Variants } from "framer-motion";
import _ from "lodash";
import React, { HTMLProps, ReactNode, useMemo, useRef, useState } from "react";
import { AiOutlineStar } from "react-icons/ai";
import { GifCategory, GifObject } from "types/gif.type";
import { useGifPicker } from "./GifPickerContext";

interface GifButtonProps extends HTMLProps<HTMLDivElement> {
  category?: GifCategory;
  categoryIcon?: ReactNode;
  gif?: GifObject;
  customOnclick?: () => any;
  favorite?: boolean;
}

const GifButton: React.FC<GifButtonProps> = ({
  categoryIcon,
  customOnclick,
  category,
  gif,
  className,
  style,
  favorite,
  ...props
}) => {
  const { setSearch } = useGifPicker();
  const [loaded, setLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const randomBrightness = useMemo(() => _.random(0.9, 1.5), []);
  const handleSendMessage = useSendMessage();
  const { close } = usePopover();

  const handleClick = () => {
    if (customOnclick) {
      customOnclick();
      return;
    }
    if (category) {
      setSearch(category.name);
    }
    if (gif) {
      handleSendMessage({ content: gif.url });
      close();
    }
  };

  return (
    <div
      {...props}
      style={{ ...style, ...(!loaded && gif && { filter: `brightness(${randomBrightness})` }) }}
      className={classNames(
        className,
        "relative cursor-pointer rounded-lg flex-center transition-all overflow-hidden group",
        "w-full h-full",
        { "bg-black": category, "bg-primary brightness-90": gif }
      )}
    >
      <div
        onClick={handleClick}
        className={classNames(
          "absolute inset-0 transition-all ring-inset ring-0 hover:ring-2 ring-primary z-10",
          "rounded-lg text-white",
          {
            "flex-center gap-1 font-semibold": category,
            "bg-black/40 hover:bg-black/70": category && !favorite,
            "bg-[hsla(235,85.6%,64.7%,0.8)] hover:bg-[hsla(235,85.6%,64.7%,0.95)]": favorite,
          }
        )}
      >
        {categoryIcon}
        <div>{category?.name}</div>
      </div>
      {category && (
        <img
          ref={imageRef}
          className={classNames("w-full h-full object-cover relative z-0")}
          src={category.src ?? gif?.gif_src}
          alt={category?.name}
        />
      )}
      {gif && (
        <>
          <Tooltip content="Add to Favorites">
            <div
              className="absolute top-0 right-0 text-white z-20 p-2 -translate-y-2
            opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-150"
            >
              <AiOutlineStar size={22} />
            </div>
          </Tooltip>
          <video
            onLoadedData={() => setLoaded(true)}
            className={classNames("w-full h-full object-cover relative z-0", {
              invisible: !loaded,
            })}
            width={gif.width}
            height={gif.height}
            src={gif.src}
            autoPlay
            loop
            playsInline
            preload="auto"
          />
        </>
      )}
    </div>
  );
};

export default React.memo(GifButton);
