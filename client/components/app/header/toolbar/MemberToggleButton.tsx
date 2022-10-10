import { Button, Tooltip } from "@app/common";
import { useChannel } from "@contexts/ChannelContext";
import { useAppDispatch } from "@hooks/redux";
import { updateChannel } from "@store/slices/channels.slice";
import classNames from "classnames";
import React from "react";
import { MdPeopleAlt } from "react-icons/md";
import ToolbarButton from "./ToolbarButton";

const MemberToggleButton = () => {
  const { channel } = useChannel();
  const dispatch = useAppDispatch();

  const handleClick = () => {
    if (channel)
      dispatch(
        updateChannel({
          id: channel.id,
          serverId: channel.serverId as string,
          showMember: !channel.showMember,
        })
      );
  };

  return (
    <ToolbarButton
      className={classNames({ "!text-header-primary": channel?.showMember })}
      onClick={handleClick}
      tooltip={"Show Member List"}
    >
      <MdPeopleAlt size={24} />
    </ToolbarButton>
  );
};

export default MemberToggleButton;
