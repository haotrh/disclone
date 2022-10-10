import { useChannel } from "@lib/contexts/ChannelContext";
import { ChannelService } from "@lib/services/channel.service";
import { selectServerOrderChannels } from "@lib/store/selectors";
import { store } from "@lib/store/store";
import classNames from "classnames";
import _ from "lodash";
import React, { DragEvent, ReactElement, ReactNode, useMemo } from "react";
import { ChannelType } from "types/channel";
import { ChannelState } from "types/store.interfaces";
import { useChannelDrag } from "./ChannelDragContext";

interface ChannelDraggableProps {
  channel: ChannelState;
  children?: ReactNode;
  index: number;
}

type DragState = "before" | "after" | "none";

const ChannelDraggable: React.FC<ChannelDraggableProps> = ({ channel, children, index }) => {
  const { drag, setDrag, setTarget, target } = useChannelDrag();
  const { server } = useChannel();

  const isDragDisabled = useMemo(() => {
    return (
      drag && channel.type !== ChannelType.SERVER_CATEGORY && drag.channel.type !== channel.type
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drag]);

  const dragState = useMemo<DragState>(() => {
    if (drag?.channel && target?.channel && target.channel.id === channel.id) {
      return drag.index >= target.index ? "before" : "after";
    }
    return "none";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target?.channel, drag?.channel]);

  const onDragStart = (ev: DragEvent<HTMLDivElement>) => {
    ev.stopPropagation();
    if (drag?.channel?.id !== channel.id) setDrag({ index, channel });
  };

  const onDragOver = (ev: DragEvent<HTMLDivElement>) => {
    if (!isDragDisabled) {
      ev.stopPropagation();
      ev.preventDefault();

      if (target?.channel?.id !== channel.id) setTarget({ index, channel });
    }
  };

  const onDragEnd = () => {
    setDrag(undefined);
    setTarget(undefined);
  };

  const onDrop = async () => {
    if (drag && target && drag.index !== target.index) {
      let newChannelsPosition: {
        id: string;
        position: number;
        parent?: string | null;
      }[] = [];
      const allChannels = selectServerOrderChannels(store.getState(), channel.serverId ?? "");

      allChannels.splice(drag.index, 1);
      allChannels.splice(target.index, 0, drag.channel);

      newChannelsPosition = allChannels
        .filter((channel) => channel.type === drag.channel.type)
        .map((channel, index) => ({ ...channel, index }))
        .filter((channel) => channel.position !== channel.index || channel.id === drag.channel.id)
        .map((channel) => ({ id: channel.id, position: channel.index }));

      if (drag.channel.type !== ChannelType.SERVER_CATEGORY) {
        const dragChannelInNewPositionArr = newChannelsPosition.find(
          (channel) => channel.id === drag.channel.id
        );

        if (dragChannelInNewPositionArr) {
          const channelInTheSameNewCategory =
            drag.index < target.index ? target.channel : allChannels[target.index - 1];

          const newCategory = channelInTheSameNewCategory
            ? channelInTheSameNewCategory.type === ChannelType.SERVER_CATEGORY
              ? channelInTheSameNewCategory.id
              : channelInTheSameNewCategory.parentId
            : null;

          if (!_.isUndefined(newCategory) && drag.channel.parentId !== newCategory) {
            dragChannelInNewPositionArr.parent = newCategory;
          }
        }
      }

      try {
        server && ChannelService.updateChannelPositions(server.id, newChannelsPosition);
      } catch {}
    }
  };

  return (
    <div
      draggable={true}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
      className={classNames("mx-2 relative", {
        "mt-4": index === 0 && channel.type !== ChannelType.SERVER_CATEGORY,
      })}
    >
      {dragState !== "none" && (
        <div
          className={classNames(
            "absolute bottom-full left-0 w-full h-1 bg-green-600 rounded-full",
            {
              "top-full": dragState === "after",
              "bottom-full": dragState === "before",
            }
          )}
        />
      )}
      {React.cloneElement(children as ReactElement, {
        isDragDisabled,
      })}
    </div>
  );
};

export default React.memo(ChannelDraggable);
