import { Button } from "@app/common/button";
import EmojiRender from "@app/common/Emoji";
import { useChannel } from "@contexts/ChannelContext";
import { markdownLanguage } from "@utils/prism";
import { deserialize, serialize, withTransforms } from "@utils/slate.util";
import classNames from "classnames";
import _ from "lodash";
import Prism, { Token } from "prismjs";
import { KeyboardEvent, useCallback, useEffect, useMemo, useRef } from "react";
import { IoMdAddCircle } from "react-icons/io";
import {
  BaseRange,
  createEditor,
  Descendant,
  Editor,
  Element as SlateElement,
  Location,
  Node,
  NodeEntry,
  Point,
  Range,
  Transforms,
} from "slate";
import { withHistory } from "slate-history";
import { Editable, RenderElementProps, RenderLeafProps, Slate, withReact } from "slate-react";
import { EditableProps } from "slate-react/dist/components/editable";
import {
  blockElements,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_EMOJI,
  ELEMENT_MENTION,
  ELEMENT_PARAGRAPH,
} from "types/slate.types";
import ExpressionPicker, { ExpressionPickerProps } from "../../expression_picker/ExpressionPicker";
import InputAttachmentList from "./InputAttachmentList";
import MarkdownAutocomplete from "./MarkdownAutocomplete";
import MarkdownToolbar from "./MarkdownToolbar";
import Mention from "./Mention";

function resetNodes(
  editor: Editor,
  options: {
    nodes?: Descendant[];
    at?: Location;
  } = {}
): void {
  const children = [...editor.children];
  children.forEach((node) => editor.apply({ type: "remove_node", path: [0], node }));
  if (options.nodes) {
    const nodes = Node.isNode(options.nodes) ? [options.nodes] : options.nodes;
    nodes.forEach((node, i) => editor.apply({ type: "insert_node", path: [i], node: node }));
  }
  const point = options.at && Point.isPoint(options.at) ? options.at : Editor.end(editor, []);
  if (point) {
    Transforms.select(editor, point);
  }
}

export interface MarkdownInputProps extends Omit<EditableProps, "onChange"> {
  onChange?: (value: string) => any;
  value?: string;
  onAddFiles?: (files: FileList) => any;
  expressionProps?: ExpressionPickerProps;
  withEmbed?: boolean;
  withAttachment?: boolean;
  customRelative?: boolean;
}

const MarkdownInput: React.FC<MarkdownInputProps> = ({
  onChange,
  value,
  onAddFiles,
  withEmbed,
  expressionProps,
  withAttachment,
  customRelative,
  onKeyDown,
  ...props
}) => {
  const initialValue: Descendant[] = useMemo(
    () => [{ type: ELEMENT_PARAGRAPH, children: [{ text: "" }] }],
    []
  );

  const ref = useRef<HTMLDivElement>(null);
  const handleKeyDownRef = useRef((e: KeyboardEvent<HTMLDivElement>) => true);
  const editor = useMemo(() => withTransforms(withHistory(withReact(createEditor()))), []);
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, []);
  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, []);
  const decorate = useCallback(([node, path]: NodeEntry) => {
    if (SlateElement.isElement(node) && _.includes(blockElements, node.type)) {
      const ranges: BaseRange[] = [];

      const getLength = (token: Token | string): number => {
        if (_.isString(token)) {
          return token.length;
        } else if (_.isString(token.content)) {
          return token.content.length;
        } else {
          return (token.content as Token[]).reduce((l, t) => l + getLength(t), 0);
        }
      };

      const nodeTextArr = node.children.map((child) =>
        _.isEmpty(Node.string(child)) ? " " : Node.string(child)
      );
      const getStringArrayIndex = (index: number): number => {
        let arrIndex = 0;
        while (arrIndex !== nodeTextArr.length) {
          if (nodeTextArr.slice(0, arrIndex + 1).join("").length >= index) {
            return arrIndex;
          }
          arrIndex++;
        }
        return 0;
      };

      const nodeFullText = nodeTextArr.join("");
      const tokens = Prism.tokenize(nodeFullText, markdownLanguage);
      let start = 0;

      const getStartOffset = (startIndex: number, arrIndex: number) => {
        return (
          nodeTextArr[arrIndex].length -
          (nodeTextArr.slice(0, arrIndex + 1).join("").length - startIndex)
        );
      };
      const getEndOffset = (endIndex: number, arrIndex: number) => {
        return endIndex - nodeTextArr.slice(0, arrIndex).join("").length;
      };

      const addToken = (token: Token | string) => {
        const length = getLength(token);
        const end = start + length;

        const startIndexInArr = getStringArrayIndex(start);
        const endIndexInArr = getStringArrayIndex(end);

        const matchRanges: Range[] = [];

        if (startIndexInArr !== endIndexInArr) {
          for (let i = startIndexInArr; i <= endIndexInArr; i++) {
            if (i === endIndexInArr) {
              matchRanges.push({
                anchor: { path: [path[0], i], offset: 0 },
                focus: { path: [path[0], i], offset: getEndOffset(end, endIndexInArr) },
              });
            } else {
              matchRanges.push({
                anchor: { path: [path[0], i], offset: getStartOffset(start, startIndexInArr) },
                focus: { path: [path[0], i], offset: nodeTextArr[i].length },
              });
            }
          }
        } else {
          matchRanges.push({
            anchor: {
              path: [path[0], startIndexInArr],
              offset: getStartOffset(start, startIndexInArr),
            },
            focus: { path: [path[0], endIndexInArr], offset: getEndOffset(end, endIndexInArr) },
          });
        }
        if (typeof token !== "string") {
          if (token.type) {
            matchRanges.forEach((range) => (range[token.type] = true));
          }
          ranges.push(...matchRanges);
          if (token.content) {
            if (_.isArray(token.content)) {
              token.content.forEach((token) => addToken(token));
            } else if (typeof token.content !== "string") {
              addToken(token.content);
            }
          }
        }
        start = end;
      };

      tokens.forEach((token) => addToken(token));
      return ranges;
    }
    return [];
  }, []);

  useEffect(() => {
    if (value !== serialize(editor.children)) {
      resetNodes(editor, {
        nodes: value ? deserialize(value) : initialValue,
        at: value ? editor.selection?.anchor : undefined,
      });
    }
  }, [value, editor, initialValue]);

  return (
    <Slate
      editor={editor}
      onChange={(value) => {
        onChange && onChange(serialize(value));
      }}
      value={initialValue}
    >
      <div className={!customRelative ? "relative" : ""} ref={ref}>
        {withAttachment && <InputAttachmentList />}
        <div
          className="flex items-start max-h-[200px]
      overflow-y-auto custom-scrollbar px-1"
        >
          <MarkdownAutocomplete handleKeyDownRef={handleKeyDownRef} />
          {onAddFiles && (
            <Button theme="blank" className="h-10 flex-center sticky top-0 px-2">
              <IoMdAddCircle size={24} />
              <input
                type="file"
                multiple
                className="absolute inset-0 opacity-0"
                onChange={(e) => {
                  if (e.target.files) {
                    onAddFiles(e.target.files);
                    e.target.value = "";
                  }
                }}
              />
            </Button>
          )}
          <div className={classNames("flex-1 flex items-center min-h-[40px] min-w-0 px-2")}>
            <MarkdownToolbar />
            <Editable
              onKeyDown={(e) => {
                if (handleKeyDownRef.current(e)) {
                  onKeyDown && onKeyDown(e);
                }
              }}
              renderLeaf={renderLeaf}
              renderElement={renderElement}
              decorate={decorate}
              style={{ minHeight: 40 }}
              className="placeholder:text-text-muted cursor-text break-words flex-1 min-w-0 py-2.5"
              spellCheck={false}
              autoComplete="new-password"
              autoCorrect="new-password"
              {...props}
            />
          </div>
          <div className="flex-center sticky top-0">
            <ExpressionPicker {...expressionProps} />
          </div>
        </div>
      </div>
    </Slate>
  );
};

const Element = ({ attributes, children, element }: RenderElementProps) => {
  const { server } = useChannel();

  switch (element.type) {
    case ELEMENT_BLOCKQUOTE:
      return (
        <div {...attributes} className="flex">
          <span contentEditable={false} className="w-1 bg-interactive-muted flex-shrink-0" />
          <blockquote className="pl-3 pr-2 min-w-0 whitespace-pre-wrap">{children}</blockquote>
        </div>
      );
    case ELEMENT_EMOJI:
      return (
        <span contentEditable={false} {...attributes} className="cursor-default inline-block">
          {element.emoji && <EmojiRender emoji={element.emoji} />}
          {children}
        </span>
      );
    case ELEMENT_MENTION:
      return (
        <span
          contentEditable={false}
          {...attributes}
          className="inline-block select-none cursor-default"
        >
          <Mention
            showNotfoundAsUnknown
            readOnly
            serverId={server?.id ?? ""}
            userId={element.mentionId}
          />
          {children}
        </span>
      );
    default:
      return <div {...attributes}>{children}</div>;
  }
};

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  return (
    <span
      {...attributes}
      className={classNames({
        italic: leaf.italic && !leaf.syntax,
        "font-bold": leaf.bold && !leaf.syntax,
        underline: leaf.underline && !leaf.syntax,
        "line-through": leaf.strike && !leaf.syntax,
        "link cursor-text hover:no-underline": leaf.url && !leaf.syntax,
        "bg-background-secondary": leaf.inlineCode,
        "px-[3px] bg-white/10": leaf.spoiler && !leaf.syntax,
        "text-header-secondary text-[85%] code": leaf.codeBlock && !leaf.syntax,
        "text-text-muted": leaf.syntax,
      })}
    >
      {children}
    </span>
  );
};

export default MarkdownInput;
