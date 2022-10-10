import { useAppSelector } from "@hooks/redux";
import { selectEmojiByText } from "@store/selectors";
import { getCustomEmojiSrc, getNativeEmojiSrc } from "@utils/emoji.util";
import classNames from "classnames";
import _ from "lodash";
import React, { CSSProperties, ReactNode, useMemo } from "react";
import { Emoji } from "types/server";
import Tooltip from "./tooltip/Tooltip";

interface EmojiRenderProps {
  children?: ReactNode;
  emoji: Emoji;
  big?: boolean;
  className?: string;
  tooltip?: boolean;
  style?: CSSProperties;
}

const EmojiRender: React.FC<EmojiRenderProps> = React.memo(
  ({ emoji, className, big, style, tooltip = false }) => {
    const src = useMemo(() => {
      if ("id" in emoji) {
        return getCustomEmojiSrc(emoji.id);
      } else {
        return getNativeEmojiSrc(emoji.unified);
      }
    }, [emoji]);

    return (
      <Tooltip content={emoji.fullName} visible={tooltip}>
        <img
          src={src}
          style={style}
          alt={_.isString(emoji) ? emoji : emoji.name}
          className={classNames(
            className,
            "object-contain align-bottom -indent-[9999px] inline-block",
            { "w-5 h-5": !big, "w-7 h-7": big }
          )}
        />
      </Tooltip>
    );
  }
);

EmojiRender.displayName = "EmojiRender";

export default EmojiRender;

interface EmojiRenderByStringProps extends Omit<EmojiRenderProps, "emoji"> {
  text: string;
}

export const EmojiRenderByString: React.FC<EmojiRenderByStringProps> = React.memo(
  ({ text, ...props }) => {
    const emoji = useAppSelector((state) => selectEmojiByText(state, text));
    if (!emoji) {
      return <>{text}</>;
    }
    return <EmojiRender emoji={emoji} {...props} />;
  }
);

EmojiRenderByString.displayName = "EmojiRenderByString";
