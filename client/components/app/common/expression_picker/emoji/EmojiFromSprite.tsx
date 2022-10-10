import EmojiRender from "@app/common/Emoji";
import { useAppSelector } from "@hooks/redux";
import { emojiSpriteSrc } from "@utils/emoji.util";
import { Emoji } from "types/server";

interface EmojiFromSpriteProps {
  emoji: Emoji;
  width?: number;
  height?: number;
}

const EmojiFromSprite = ({ emoji, width = 32, height = 32 }: EmojiFromSpriteProps) => {
  const { cols, rows } = useAppSelector((state) => state.emoji.sheet);

  if ("id" in emoji) {
    return <EmojiRender style={{ width, height }} emoji={emoji} />;
  }

  return (
    <div
      style={{
        width,
        height,
        backgroundImage: `url(${emojiSpriteSrc})`,
        backgroundSize: `${cols * 100}% ${rows * 100}%`,
        backgroundPosition: `${(emoji.x / 60) * 100}% ${(emoji.y / 60) * 100}%`,
      }}
    />
  );
};

export default EmojiFromSprite;
