import EmojiRender from "@app/common/Emoji";
import { useAppSelector } from "@hooks/redux";
import useOnClickOutside from "@hooks/useOnClickOutside";
import { selectAllEmojiData } from "@store/selectors";
import { getEmojiSkin } from "@utils/emoji.util";
import classNames from "classnames";
import _ from "lodash";
import { useMemo, useRef, useState } from "react";
import { StandardEmoji } from "types/server";
import { useEmojiPicker } from "./EmojiPickerContext";

const SkinPicker = () => {
  const emojiData = useAppSelector(selectAllEmojiData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const clapEmoji = useMemo(() => emojiData.emojiNameMapping["clap"] as StandardEmoji, []);
  const { skin, setSkin } = useEmojiPicker();
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => setExpanded(false));

  return (
    <div className={classNames("w-8 h-8 relative z-20")}>
      <div
        ref={ref}
        className={classNames(
          "absolute top-0 left-0 overflow-hidden transition-all flex flex-col rounded border -m-px",
          {
            "h-[194px] border-background-tertiary bg-background-secondary-alt": expanded,
            "h-8 border-transparent": !expanded,
          }
        )}
      >
        {_.range(0, 6).map((i) => (
          <div
            key={i}
            className={classNames("p-1 w-8 h-8 cursor-pointer", {
              "-order-1": skin === i,
              "hover:bg-background-modifier-hover transition-all opacity-100 duration-300":
                expanded,
              "opacity-0": !expanded && skin !== i,
            })}
            onClick={() => {
              expanded && skin !== i && setSkin(i);
              setExpanded(!expanded);
            }}
          >
            <EmojiRender
              className={classNames("!w-full !h-full")}
              emoji={getEmojiSkin(clapEmoji, i)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkinPicker;
