import { selectEmojiByText, selectEmojiRegexByShortcode } from "@store/selectors";
import { store } from "@store/store";
import _ from "lodash";
import { Descendant, Editor, Element, Node, Point, Range, Text, Transforms } from "slate";
import {
  ELEMENT_BLOCKQUOTE,
  ELEMENT_EMOJI,
  ELEMENT_MENTION,
  ELEMENT_PARAGRAPH,
  InlineElement,
  inlineElements,
  MentionElement,
  voidElements,
} from "types/slate.types";
import { MENTION_REGEX } from "./regex";

export const serialize = (nodes: Descendant[]): string =>
  nodes
    .map((n: Node) => {
      if (Element.isElement(n)) {
        let nodeText = n.type === "blockquote" ? "> " : "";
        const nodeToString = (n: Node) => {
          if (Element.isElement(n)) {
            if (_.includes(inlineElements, n.type)) {
              return (n as InlineElement).value ?? "";
            }
          }
          if (Text.isText(n)) {
            return n.text;
          }
          return "";
        };
        n.children.forEach((child) => {
          nodeText += nodeToString(child);
        });
        return nodeText;
      }
      return Node.string(n);
    })
    .join("\n");

export const deserialize = (value: string): Descendant[] =>
  value.split("\n").map((text) => ({ type: "paragraph", children: [{ text }] }));

export const withTransforms = (editor: Editor) => {
  const { normalizeNode, deleteBackward, isInline, isVoid } = editor;

  editor.isInline = (element) => {
    return _.includes(inlineElements, element.type) || isInline(element);
  };

  editor.isVoid = (element) => {
    return _.includes(voidElements, element.type) || isVoid(element);
  };

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    //Transform blockquote
    if (Element.isElement(node) && node.type === ELEMENT_PARAGRAPH) {
      const nodeText = Node.string(node);
      if (nodeText.match(/^(>) (.|\n)*/)) {
        //Delete syntax
        Transforms.delete(editor, {
          at: Editor.start(editor, path),
          distance: 1,
          unit: "word",
        });
        //Delete space char
        Transforms.delete(editor, {
          at: Editor.start(editor, path),
          distance: 1,
          unit: "character",
        });
        Transforms.setNodes(editor, { type: ELEMENT_BLOCKQUOTE }, { at: path });
      }
    }

    //Transform inline block
    if (Text.isText(node)) {
      // MENTION MATCHING
      let match: RegExpExecArray | null = MENTION_REGEX.exec(node.text);
      if (match) {
        const startIndex = match.index;
        const endIndex = startIndex + match[0].length;
        const range: Range = {
          anchor: { path, offset: startIndex },
          focus: { path, offset: endIndex },
        };
        const node: MentionElement = {
          children: [{ text: "" }],
          type: ELEMENT_MENTION,
          mentionId: match[2] ?? match[1],
          value: match[0],
        };
        Transforms.insertNodes(editor, [node, { text: "" }], { at: range });
        editor.selection = {
          anchor: { path: [path[0], path[1] + 2], offset: 0 },
          focus: { path: [path[0], path[1] + 2], offset: 0 },
        };
        return;
      }
      // EMOJI MATCHING
      const emojiRegex = selectEmojiRegexByShortcode(store.getState());
      match = null;
      while ((match = emojiRegex.exec(node.text)) !== null) {
        let node: InlineElement | null = null;
        const text = match[0];
        const emojiData = selectEmojiByText(store.getState(), text);
        if (emojiData) {
          const value =
            "native" in emojiData ? emojiData.native : `<:${emojiData.name}:${emojiData.id}>`;
          node = {
            type: ELEMENT_EMOJI,
            children: [{ text: "" }],
            value,
            emoji: emojiData,
          };
          const startIndex = match.index;
          const endIndex = startIndex + match[0].length;
          const range: Range = {
            anchor: { path, offset: startIndex },
            focus: { path, offset: endIndex },
          };

          if (node) {
            Transforms.insertNodes(editor, [node, { text: "" }], { at: range });
            editor.selection = {
              anchor: { path: [path[0], path[1] + 2], offset: 0 },
              focus: { path: [path[0], path[1] + 2], offset: 0 },
            };
            return;
          }
          break;
        }
      }
    }
    normalizeNode(entry);
  };

  editor.deleteBackward = (...args) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const match = Editor.above(editor, {
        match: (n) => Editor.isBlock(editor, n),
      });

      if (match) {
        const [block, path] = match;
        const start = Editor.start(editor, path);

        if (
          !Editor.isEditor(block) &&
          Element.isElement(block) &&
          block.type !== "paragraph" &&
          Point.equals(selection.anchor, start)
        ) {
          Transforms.setNodes(editor, { type: "paragraph" });

          if (block.type === "blockquote") {
            Transforms.unwrapNodes(editor, {
              match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === "blockquote",
              split: true,
            });
          }

          return;
        }
      }

      deleteBackward(...args);
    }
  };

  editor.deleteFragment = () => {
    const { selection } = editor;

    if (selection && Range.isExpanded(selection)) {
      Transforms.delete(editor, { hanging: true });
    }
  };

  return editor;
};
