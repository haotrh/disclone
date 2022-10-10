import React, { useState } from "react";
import { AiOutlineGif } from "react-icons/ai";
import { BsEmojiSmileFill } from "react-icons/bs";
import { Button } from "../button";
import GifIcon from "../icon/GifIcon";
import { Popover } from "../popover";
import ExpressionButton, { ExpressionEmojiButton } from "./ExpressionButton";
import { ExpressionPickerProvider } from "./ExpressionPickerContext";
import ExpressionPickerWrapper from "./ExpressPickerWrapper";

export type ExpressionTab = "gif" | "emoji" | null;

export interface ExpressionPickerProps {
  tabOnly?: ExpressionTab;
}

const ExpressionPicker: React.FC<ExpressionPickerProps> = ({ tabOnly }) => {
  const [tab, setTab] = useState<ExpressionTab>(null);

  return (
    <ExpressionPickerProvider tab={tab} setTab={setTab}>
      <Popover
        visible={Boolean(tab)}
        handleHide={() => setTab(null)}
        customStyling
        placement="top-end"
        content={<ExpressionPickerWrapper tabOnly={tabOnly} />}
      >
        <div className="flex items-center h-10 overflow-hidden">
          {(!tabOnly || tabOnly === "gif") && (
            <ExpressionButton targetTab={"gif"}>
              <GifIcon size={24} />
            </ExpressionButton>
          )}
          {(!tabOnly || tabOnly === "emoji") && <ExpressionEmojiButton />}
        </div>
      </Popover>
    </ExpressionPickerProvider>
  );
};

export default ExpressionPicker;
