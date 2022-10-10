import classNames from "classnames";
import _ from "lodash";
import React, { ReactNode } from "react";
import EmojiPicker from "./emoji/EmojiPicker";
import { ExpressionTab } from "./ExpressionPicker";
import { useExpressionPicker } from "./ExpressionPickerContext";
import GifPicker from "./gif/GifPicker";

interface ExpressionPickerWrapperProps {
  tabOnly?: ExpressionTab;
}

interface ExpressionTabButtonProps {
  children?: ReactNode;
  tab: ExpressionTab;
}

const ExpressionTabButton: React.FC<ExpressionTabButtonProps> = ({ children, tab }) => {
  const { tab: currentTab, setTab } = useExpressionPicker();

  return (
    <button
      className={classNames("text-base font-semibold px-2 py-0.5", {
        "text-header-primary rounded bg-background-modifier-active": tab === currentTab,
        "text-header-secondary hover:text-header-primary": tab !== currentTab,
      })}
      onClick={() => {
        setTab(tab);
      }}
    >
      {children}
    </button>
  );
};

const ExpressionPickerWrapper: React.FC<ExpressionPickerWrapperProps> = React.memo(
  ({ tabOnly }) => {
    const { tab } = useExpressionPicker();

    return (
      <div
        className={classNames(
          "w-[432px] bg-background-secondary shadow-md shadow-background-secondary-alt",
          "rounded-lg flex flex-col border border-background-secondary-alt",
          { "h-[444px]": !tabOnly, "h-[380px] pt-4": tabOnly }
        )}
      >
        {_.isUndefined(tabOnly) && (
          <nav className="p-4 pb-1 flex gap-2 mb-2">
            <ExpressionTabButton tab="gif">GIFs</ExpressionTabButton>
            <ExpressionTabButton tab="emoji">Emoji</ExpressionTabButton>
          </nav>
        )}
        {((tab === "emoji" && !tabOnly) || tabOnly === "emoji") && <EmojiPicker />}
        {((tab === "gif" && !tabOnly) || tabOnly === "gif") && <GifPicker />}
      </div>
    );
  }
);

ExpressionPickerWrapper.displayName = "ExpressionPickerWrapper";

export default ExpressionPickerWrapper;
