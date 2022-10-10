export const base64Matcher =
  /^data:image\/(?:gif|png|jpeg|bmp|webp|svg\+xml)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/;

export const MENTION_REGEX = /(@everyone)|<@(\w+)>/;
export const CUSTOM_EMOJI_REGEX = /<:([\w-]+):(\w+)>/;
export const LINK_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
