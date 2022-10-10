import { Avatar, Clickable, Tooltip } from "@app/common";
import { UserService } from "@services/user.service";
import React from "react";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";
import { Relationship, RelationshipType } from "types/user";
import UserListItem from "./UserListItem";

interface FriendPendingItemProps {
  relationship: Relationship;
}

const FriendPendingItem: React.FC<FriendPendingItemProps> = ({ relationship }) => {
  return (
    <UserListItem>
      <div className="flex gap-2 flex-1">
        <Avatar noStatus user={relationship.user} />
        <div>
          <div className="text-header-primary font-semibold">
            {relationship.user.username}
            <span className="font-medium text-header-secondary text-sm invisible group-hover:visible">
              #{relationship.user.discrimination}
            </span>
          </div>
          <div className="text-xs font-medium text-text-muted">
            {relationship.type === RelationshipType.INCOMING ? "Incoming" : "Outgoing"} Friend
            Request
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 flex items-center gap-2">
        {relationship.type === RelationshipType.INCOMING && (
          <Tooltip content="Accept">
            <Clickable
              theme="row"
              className="hover:text-button-success-normal"
              onClick={() => UserService.updateRelationship(relationship.id)}
            >
              <IoMdCheckmark size={22} />
            </Clickable>
          </Tooltip>
        )}
        <Tooltip content="Cancel">
          <Clickable
            theme="row"
            onClick={() => UserService.deleteRelationship(relationship.id)}
            className="hover:text-button-danger-normal"
          >
            <IoMdClose size={22} />
          </Clickable>
        </Tooltip>
      </div>
    </UserListItem>
  );
};

export default FriendPendingItem;
