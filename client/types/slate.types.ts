import { BaseEditor } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";
import { Emoji } from "./server";

export const ELEMENT_EMOJI = "emoji";
export const ELEMENT_MENTION = "mention";
export const ELEMENT_PARAGRAPH = "paragraph";
export const ELEMENT_BLOCKQUOTE = "blockquote";

export const blockElements = [ELEMENT_PARAGRAPH, ELEMENT_BLOCKQUOTE] as const;
export const inlineElements = [ELEMENT_EMOJI, ELEMENT_MENTION] as const;
export const voidElements = [ELEMENT_EMOJI, ELEMENT_MENTION] as const;

export type InlineElementType = typeof inlineElements[number];
export type ParagraphElement = { type: typeof ELEMENT_PARAGRAPH; children: CustomInlineChildren };
export type BlockquoteElement = { type: typeof ELEMENT_BLOCKQUOTE; children: CustomInlineChildren };
export type BlockElement = ParagraphElement | BlockquoteElement;
export interface EmojiElement {
  type: typeof ELEMENT_EMOJI;
  children: [EmptyText];
  emoji: Emoji;
  value: string;
}
export interface MentionElement {
  type: typeof ELEMENT_MENTION;
  children: [EmptyText];
  mentionId: string;
  value: string;
}
export type InlineElement = EmojiElement | MentionElement;
export type CustomElement = ParagraphElement | BlockquoteElement | EmojiElement | MentionElement;

export type EmptyText = {
  text: "";
};

export type FormattedText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  inlineCode?: boolean;
  codeBlock?: boolean;
  url?: boolean;
  syntax?: boolean;
  strike?: boolean;
  spoiler?: boolean;
};

export type CustomText = FormattedText;
export type CustomInlineElement = EmojiElement | MentionElement;
export type CustomInlineChild = CustomText | CustomInlineElement;
export type CustomInlineChildren = CustomInlineChild[];

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
