import { ChannelSettings } from "@app/channel";
import { Clickable, LayerModalRender, Tooltip } from "@app/common";
import PermissionWrapper from "@app/common/PermissionWrapper";
import { useChannel } from "@lib/contexts/ChannelContext";
import classNames from "classnames";
import { useRouter } from "next/router";
import React from "react";
import { AiOutlineNumber } from "react-icons/ai";
import { IoMdSettings } from "react-icons/io";
import { MdVolumeUp } from "react-icons/md";
import { ChannelType } from "types/channel";
import { Permissions } from "types/permissions";
import { ChannelState } from "types/store.interfaces";

interface ChannelButtonProps {
  channel: ChannelState;
  selected: boolean;
  isDragDisabled?: boolean;
}

const ChannelButton: React.FC<ChannelButtonProps> = ({ channel, selected, isDragDisabled }) => {
  const router = useRouter();

  const { server } = useChannel();

  const handleClick = () => {
    router.push(`/channels/${server?.id}/${channel.id}`);
  };

  return (
    <Clickable
      bg
      theme="channel"
      onClick={handleClick}
      selected={selected}
      className={classNames("px-2 py-1.5 flex items-center justify-between group mb-[3px]", {
        "opacity-30": isDragDisabled,
      })}
    >
      <div className="flex items-center space-x-2 text-xl">
        <div className="text-channels-default">
          {channel.type === ChannelType.SERVER_TEXT ? <AiOutlineNumber /> : <MdVolumeUp />}
        </div>
        <span className="leading-4 text-[16px]">{channel.name}</span>
      </div>
      <PermissionWrapper permissions={Permissions.MANAGE_CHANNELS}>
        <div
          className={classNames("items-center space-x-[6px] text-[15px]", {
            flex: selected,
            "group-hover:flex hidden": !selected,
          })}
        >
          <LayerModalRender modal={<ChannelSettings channel={channel} />}>
            <Tooltip content="Edit channel">
              <Clickable>
                <IoMdSettings />
              </Clickable>
            </Tooltip>
          </LayerModalRender>
        </div>
      </PermissionWrapper>
    </Clickable>
  );
};

export default ChannelButton;
