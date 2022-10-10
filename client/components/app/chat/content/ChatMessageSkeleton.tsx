import _ from "lodash";
import React from "react";

const ChatMessageSkeleton = React.memo(() => (
  <div className="flex mt-4 pr-4">
    <div className="w-10 h-10 rounded-full bg-background-modifier-hover mr-3" />
    <div className="flex-1">
      <div
        style={{ width: _.random(60, 100) }}
        className="rounded-full h-5 bg-background-modifier-selected mb-2"
      />
      <div className="flex flex-wrap">
        {_.range(_.random(4, 24)).map((i) => (
          <div
            key={i}
            style={{ width: _.random(40, 100), opacity: _.random(0.5, 0.8) }}
            className="h-5 rounded-full bg-background-modifier-hover mr-1 mb-1"
          />
        ))}
      </div>
    </div>
  </div>
));

ChatMessageSkeleton.displayName = "ChatMessageSkeleton";

export default ChatMessageSkeleton;
