import Tooltip from "@app/common/tooltip/Tooltip";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AiFillEye,
  AiOutlineBold,
  AiOutlineItalic,
  AiOutlineStrikethrough,
  AiOutlineUnderline
} from "react-icons/ai";
import { BsCode } from "react-icons/bs";
import { MdFormatQuote } from "react-icons/md";
import { Editor, Range } from "slate";
import { useFocused, useSlate } from "slate-react";
import MarkdownToolbarButton from "./MarkdownToolbarButton";

const MarkdownToolbar = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);
  const mouseDown = useRef(false);
  const editor = useSlate();
  const inFocus = useFocused();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateElementPosition = useCallback(
    debounce((rect: DOMRect, el: HTMLDivElement) => {
      if (mouseDown.current) {
        updateElementPosition(rect, el);
        return;
      }
      el.style.top = `${rect.top}px`;
      el.style.left = `${rect.left}px`;
      el.style.width = `${rect.width}px`;
      setShow(true);
    }, 10),
    []
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const domSelection = window.getSelection();
    if (domSelection && domSelection.rangeCount >= 1) {
      const el = ref.current;
      const { selection } = editor;
      if (!el) {
        return;
      }
      if (
        !selection ||
        !inFocus ||
        Range.isCollapsed(selection) ||
        Editor.string(editor, selection) === ""
      ) {
        setShow(false);
        el.removeAttribute("style");
        return;
      }
      const domRange = domSelection.getRangeAt(0);
      const rect = domRange.getBoundingClientRect();
      updateElementPosition(rect, el);
    }
  }, [editor.selection]);

  useEffect(() => {
    const handleMouseDown = () => (mouseDown.current = true);
    const handleMouseUp = () => (mouseDown.current = false);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <Tooltip
      grow
      noPadding
      arrow={true}
      interactive={true}
      visible={show && inFocus}
      animation={false}
      content={
        <div onMouseDown={(e) => e.preventDefault()} className="flex relative z-10">
          <MarkdownToolbarButton icon={<AiOutlineBold size={20} />} type="bold" />
          <MarkdownToolbarButton icon={<AiOutlineItalic size={20} />} type="italic" />
          <MarkdownToolbarButton icon={<AiOutlineUnderline size={20} />} type="underline" />
          <MarkdownToolbarButton icon={<AiOutlineStrikethrough size={20} />} type="strike" />
          <div className="bg-divider w-0.5 my-1.5 mx-2" />
          <MarkdownToolbarButton icon={<MdFormatQuote size={20} />} type="blockquote" />
          <MarkdownToolbarButton icon={<BsCode size={20} />} type="inlineCode" />
          <MarkdownToolbarButton icon={<AiFillEye size={20} />} type="spoiler" />
        </div>
      }
    >
      <div className="markdown fixed" ref={ref}></div>
    </Tooltip>
  );
};

export default MarkdownToolbar;
