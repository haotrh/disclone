import EmojiRender from "@app/common/Emoji";
import React from "react";
import { useEmojiPicker } from "./EmojiPickerContext";

interface EmojiPickerSelectedProps {}

const EmojiPickerSelected: React.FC<EmojiPickerSelectedProps> = ({}) => {
  const { selectedEmoji } = useEmojiPicker();

  return (
    <div className="h-12 bg-background-secondary-alt w-full flex items-center px-4 gap-2">
      {selectedEmoji && (
        <>
          <EmojiRender big emoji={selectedEmoji} />
          <div className="flex-1 select-none text-base font-semibold">{selectedEmoji.fullName}</div>
        </>
      )}
    </div>
  );
};

export default EmojiPickerSelected;
