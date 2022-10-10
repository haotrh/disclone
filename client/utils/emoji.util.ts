import { Emoji } from "types/server";

export const emojiSpriteSrc =
  "https://cdn.jsdelivr.net/npm/emoji-datasource-twitter@14.0.0/img/twitter/sheets-256/64.png";

export const getNativeEmojiSrc = (unified: string) => {
  return `https://cdn.jsdelivr.net/npm/emoji-datasource-twitter@14.0.0/img/twitter/64/${unified.toLocaleLowerCase()}.png`;
};

export const getCustomEmojiSrc = (id: string) => {
  return `https://ik.imagekit.io/disclone123/emojis/${id}.png`;
};

export const getEmojiSkin = (emoji: Emoji, skin: number): Emoji =>
  "skins" in emoji && skin !== 0 ? emoji.skins?.[skin - 1] ?? emoji : emoji;

export const getEmojiName = (emoji: Emoji) => emoji.altName ?? emoji.name;
export const getEmojiValue = (emoji: Emoji) =>
  "native" in emoji ? emoji.native : `<:${emoji.name}:${emoji.id}>`;
