import { Clickable } from "@app/common/button";
import { getTokenSyntax, markdownLanguage } from "@utils/prism";
import classNames from "classnames";
import React, { ReactNode, useCallback, useMemo } from "react";
import { Editor, Range, Transforms } from "slate";
import { useSlate } from "slate-react";

interface MarkdownToolbarButtonProps {
  icon?: ReactNode;
  active?: boolean;
  type: keyof typeof markdownLanguage;
}

const MarkdownToolbarButton: React.FC<MarkdownToolbarButtonProps> = ({ icon, active, type }) => {
  const editor = useSlate();

  const isActive: boolean = useMemo(() => {
    const selection = editor.selection;
    if (selection && !Range.isCollapsed(selection)) {
      const [start, end] = Range.edges(selection);
      const before = Editor.before(editor, start, { unit: "line" });
      const beforeRange = Editor.range(editor, start, before);
      const beforeText = Editor.string(editor, beforeRange);
      const beforeMatch = beforeText.match(/[_*~|`]*$/) ?? [""];
      const after = Editor.after(editor, end, { unit: "block" });
      const afterRange = Editor.range(editor, end, after);
      const afterText = Editor.string(editor, afterRange);
      const afterMatch = afterText.match(/^[_*~|`]*/) ?? [""];
      const selectText = Editor.string(editor, selection);
      const beforeSyntax = beforeMatch[0] + (selectText.match(/^[_*~|`]*/) ?? [""])[0];
      const afterSyntax = afterMatch[0] + (selectText.match(/[_*~|`]*$/) ?? [""])[0];
      if (type === "bold") {
        if (
          beforeSyntax.match(/^[~_|`]*(\*{2}|\*{3})[~_|`]*$/g) &&
          afterSyntax.match(/^[~_|`]*(\*{2}|\*{3})[~_|`]*$/g)
        )
          return true;
      } else if (type === "italic") {
        if (
          beforeSyntax.match(/^[~_|`]*(\*{1}|\*{3})[~_|`]*$/g) &&
          afterSyntax.match(/^[~_|`]*(\*{1}|\*{3})[~_|`]*$/g)
        )
          return true;
      } else if (type === "blockquote") {
        return false;
      } else {
        const typeSyntax = getTokenSyntax(type);
        const allSyntax = "*~_|`";
        const allSyntaxWithoutTypeSyntax = allSyntax.replace(typeSyntax[0], "");
        const syntaxRegex = new RegExp(
          `^[${allSyntaxWithoutTypeSyntax}]*(${typeSyntax[0].replace(/([*|])/, "\\$1")}{${
            typeSyntax.length
          }})[${allSyntaxWithoutTypeSyntax}]*$`,
          "g"
        );
        return Boolean(beforeSyntax.match(syntaxRegex) && afterSyntax.match(syntaxRegex));
      }
    }
    return false;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, editor.selection]);

  const handleClick = useCallback(() => {
    const selection = editor.selection;
    if (selection && !Range.isCollapsed(selection)) {
      const [start, end] = Range.edges(selection);
      if (type === "blockquote") {
        Transforms.setNodes(editor, { type: "blockquote" }, { at: selection });
        return;
      }
      const syntax = getTokenSyntax(type);
      Transforms.insertText(editor, syntax, { at: start, voids: true });
      Transforms.insertNodes(
        editor,
        { text: syntax },
        {
          at: { ...end, offset: end.offset + syntax.length },
          voids: true,
          hanging: true,
          select: false,
          mode: "highest",
        }
      );
      editor.selection = {
        anchor: { ...start, offset: start.offset + syntax.length },
        focus: { ...end, offset: end.offset + syntax.length },
      };
    }
  }, [editor, type]);

  return (
    <Clickable
      onClick={handleClick}
      className={classNames("p-2 !hover:text-header-primary !rounded-none", {
        "bg-background-secondary transition-colors !text-header-primary": isActive,
      })}
      bg
    >
      {icon}
    </Clickable>
  );
};

export default MarkdownToolbarButton;
