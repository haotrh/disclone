import emojiRegex from "emoji-regex";

export const UNICODE_EMOJI_REGEX = emojiRegex();
export const SHORTCODE_EMOJI_REGEX = /(?<!<):([^\s:]+?(?:::skin-tone-\d)?):/;
export const CUSTOM_EMOJI_REGEX = /<:([\w-]+):(\w+)>/;

export const EMOJI_REGEX = new RegExp(
  `${[
    CUSTOM_EMOJI_REGEX.source,
    `(${UNICODE_EMOJI_REGEX.source})`,
    `(${SHORTCODE_EMOJI_REGEX.source})`,
  ].join("|")}`
);

export const MENTION_REGEX = /(@everyone)|<@(\w+)>/;
export const BASE64_REGEX =
  /^data:image\/(?:gif|png|jpeg|bmp|webp|svg\+xml)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/;
