import { Avatar } from "@app/common/avatar_status";
import { Clickable } from "@app/common/button";
import Divider from "@app/common/Divider";
import EmojiFromSprite from "@app/common/expression_picker/emoji/EmojiFromSprite";
import MemberNameWithColor from "@app/common/MemberNameWithColor";
import { useChannel } from "@contexts/ChannelContext";
import { useAppSelector } from "@hooks/redux";
import { selectAllEmojiData, selectMembers } from "@store/selectors";
import { searchText } from "@utils/common.util";
import { getEmojiValue } from "@utils/emoji.util";
import { usernameWithDiscrimination } from "@utils/members";
import _ from "lodash";
import React, {
  KeyboardEvent,
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Editor, Range, Transforms } from "slate";
import { useFocused, useSlate } from "slate-react";
import { Emoji, Member } from "types/server";
import { ELEMENT_EMOJI, ELEMENT_MENTION, InlineElement } from "types/slate.types";
import Label from "../Label";

type AutoCompleteType = "mention" | "emoji";

interface AutoCompleteItem {
  title: string;
  regex: RegExp;
  type: AutoCompleteType;
}

interface Row {
  icon?: ReactNode;
  primary: ReactNode;
  secondary?: ReactNode;
  node: InlineElement;
  id: string;
}

const autoCompleteList: AutoCompleteItem[] = [
  { title: "Members", type: "mention", regex: /^(@)(\w*)$/ },
  { title: "Emoji", type: "emoji", regex: /^(:)(\S{2,})$/ },
];

interface MarkdownAutocompleteProps {
  handleKeyDownRef: MutableRefObject<(e: KeyboardEvent<HTMLDivElement>) => boolean>;
}

const MarkdownAutocomplete: React.FC<MarkdownAutocompleteProps> = React.memo(
  ({ handleKeyDownRef }) => {
    const editor = useSlate();
    const [metadata, setMetadata] = useState<AutoCompleteItem | null>(null);
    const [target, setTarget] = useState<Range | null>();
    const [index, setIndex] = useState(0);
    const { server } = useChannel();
    const members = useAppSelector((state) => selectMembers(state, server?.id ?? ""));
    const { emojiList } = useAppSelector(selectAllEmojiData);
    const [match, setMatch] = useState<RegExpMatchArray | null>(null);
    const isFocused = useFocused();

    const rows: (Row | null)[] = useMemo(() => {
      if (metadata && match) {
        const search = match[2];
        switch (metadata.type) {
          case "mention":
            let resultMembers: Member[] = [];
            for (const member of members) {
              if (searchText(search, member.nick ?? member.user.username)) {
                resultMembers.push(member);
              }
              if (resultMembers.length === 10) break;
            }
            const rows: (Row | null)[] = resultMembers.map((member) => ({
              icon: <Avatar size={24} user={member} />,
              primary: <MemberNameWithColor serverId={server?.id} member={member} />,
              secondary: usernameWithDiscrimination(member.user),
              node: {
                type: ELEMENT_MENTION,
                children: [{ text: "" }],
                mentionId: member.user.id,
                value: `<@${member.user.id}>`,
              },
              id: member.user.id,
            }));
            if (rows.length < 10) {
              const everyoneRow: Row = {
                primary: "@everyone",
                secondary: "Notify everyone who has permission to view this channel",
                node: {
                  type: ELEMENT_MENTION,
                  children: [{ text: "" }],
                  mentionId: "@everyone",
                  value: "@everyone",
                },
                id: "@everyone",
              };
              rows.push(null);
              rows.push(everyoneRow);
            }
            return rows;
          case "emoji":
            let resultEmojis: Emoji[] = [];
            for (const emoji of emojiList) {
              if (searchText(search, emoji?.altName ?? emoji.name)) {
                resultEmojis.push(emoji);
              }
              if (resultEmojis.length === 10) break;
            }
            return resultEmojis.map<Row>((emoji) => ({
              icon: <EmojiFromSprite height={24} width={24} emoji={emoji} />,
              primary: emoji.fullName,
              node: {
                type: ELEMENT_EMOJI,
                children: [{ text: "" }],
                emoji,
                value: getEmojiValue(emoji),
              },
              id: emoji.fullName ?? emoji.name,
            }));
        }
      }
      return [];
    }, [metadata, match, members, server?.id, emojiList]);

    useEffect(() => {
      const { selection } = editor;

      if (selection && Range.isCollapsed(selection) && isFocused) {
        const [start] = Range.edges(selection);
        const wordBefore = start.offset !== 0 && Editor.before(editor, start, { unit: "word" });
        const before = wordBefore
          ? Editor.before(editor, wordBefore) ?? Editor.before(editor, start, { unit: "character" })
          : undefined;
        const charBefore = before
          ? Editor.before(editor, before, { unit: "character" })
          : undefined;
        const charBeforeRange = charBefore && Editor.range(editor, charBefore, before);
        const charBeforeText = charBeforeRange && Editor.string(editor, charBeforeRange);
        const range = before && Editor.range(editor, before, start);
        const text = range && Editor.string(editor, range);

        if (text && (!charBeforeText || charBeforeText.match(/\s/))) {
          for (const autoCompleteItem of autoCompleteList) {
            const match = text.match(autoCompleteItem.regex);
            if (match) {
              setTarget(range);
              setMatch(match);
              setIndex(0);
              setMetadata(autoCompleteItem);
              return;
            }
          }
        }
      }

      setTarget(null);
      setMetadata(null);
      setMatch(null);
      setIndex(0);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editor.selection, isFocused]);

    const handleClick = useCallback(() => {
      const node = rows[index]?.node;
      if (target && node) {
        const path = target.anchor.path;
        Transforms.insertNodes(editor, [node, { text: "" }], { at: target });
        editor.selection = {
          anchor: { path: [path[0], path[1] + 2], offset: 0 },
          focus: { path: [path[0], path[1] + 2], offset: 0 },
        };
      }
    }, [rows, index, target, editor]);

    useEffect(() => {
      if (metadata) {
        const handleKeyDown = (e: KeyboardEvent) => {
          switch (e.key) {
            case "ArrowDown":
              e.preventDefault();
              setIndex((index) => (index === rows.length - 1 ? index : index + 1));
              break;
            case "ArrowUp":
              e.preventDefault();
              setIndex((index) => (index === 0 ? index : index - 1));
              break;
            case "Enter":
              e.preventDefault();
              handleClick();
              break;
          }
          return false;
        };
        handleKeyDownRef.current = (e: KeyboardEvent<HTMLDivElement>) => handleKeyDown(e);
        return () => {
          handleKeyDownRef.current = () => true;
        };
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rows.length, handleClick, metadata]);

    if (!metadata || _.isEmpty(rows)) {
      return null;
    }

    return (
      <div
        onMouseDown={(e) => e.preventDefault()}
        className="w-full max-h-[480px] absolute left-0 bottom-[calc(100%+8px)] bg-background-secondary
      shadow border-[0.5px] pb-2 border-background-floating shadow-background-secondary-alt rounded-md"
      >
        <Label className="p-2 !mb-0">
          {metadata.title}
          {match && match[2] && (
            <>
              {" "}
              matching <span className="normal-case text-header-primary">{match[0]}</span>
            </>
          )}
        </Label>
        {rows.map((row, i) =>
          !row ? (
            <Divider key={i} spacing="small" className="mx-4" />
          ) : (
            <div onClick={handleClick} key={row.id} className="px-2">
              <Clickable
                onClick={handleClick}
                onMouseEnter={() => setIndex(i)}
                onMouseLeave={() => setIndex(-1)}
                clickSelected
                selected={i === index}
                className="px-2 h-8"
                bg
              >
                <div key={row.id} className="flex-center-between w-full text-header-primary">
                  <div className="flex items-center gap-2">
                    {row.icon}
                    <div>{row.primary}</div>
                  </div>
                  {row.secondary && (
                    <div className="text-[13px] text-interactive-normal font-normal">
                      {row.secondary}
                    </div>
                  )}
                </div>
              </Clickable>
            </div>
          )
        )}
      </div>
    );
  }
);

MarkdownAutocomplete.displayName = "MarkdownAutocomplete";

export default MarkdownAutocomplete;
