import { Clickable } from "@app/common";
import { UserService } from "@services/user.service";
import React from "react";
import { User } from "types/user";

interface FriendListItemContextMenuProps {
  user: User;
}

const FriendListItemContextMenu: React.FC<FriendListItemContextMenuProps> = ({ user }) => {
  return (
    <div className="p-2">
      <Clickable theme="primary" type="popover" className="row-button">
        Profile
      </Clickable>
      <Clickable theme="primary" type="popover" className="row-button">
        Message
      </Clickable>
      <Clickable theme="primary" type="popover" className="row-button">
        Call
      </Clickable>
      <Clickable theme="primary" type="popover" className="row-button">
        Add Note
      </Clickable>
      <div className="h-px bg-divider my-1" />
      <Clickable
        onClick={() => UserService.deleteRelationship(user.id)}
        theme="danger"
        type="popover"
        className="row-button"
      >
        Remove Friend
      </Clickable>
      <Clickable theme="danger" type="popover" className="row-button">
        Block
      </Clickable>
    </div>
  );
};

export default FriendListItemContextMenu;
