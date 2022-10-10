import { Avatar, Button, Clickable, Label, Tooltip } from "@app/common";
import { useAppSelector } from "@hooks/redux";
import { UserService } from "@services/user.service";
import { AnimatePresence } from "framer-motion";
import _ from "lodash";
import React, { ChangeEvent, useMemo, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";
import SimpleBar from "simplebar-react";
import { RelationshipType, User } from "types/user";
import HomeSearchBar from "../HomeSearchBar";

const FriendPending = () => {
  const [search, setSearch] = useState("");
  const relationships = useAppSelector((state) => state.me.relationships);
  const pendingRelationships = useMemo(
    () =>
      relationships.filter(
        (relationship) =>
          relationship.type === RelationshipType.INCOMING ||
          relationship.type === RelationshipType.OUTGOING
      ),
    [relationships]
  );

  return (
    <div className="h-full flex flex-col">
      <HomeSearchBar
        value={search}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        placeholder="Search"
      />
      <h4 className="mx-7 my-3 text-[13px] font-semibold text-header-secondary">
        PENDING — {pendingRelationships.length}
      </h4>
      {_.isEmpty(pendingRelationships) ? (
        <div className="flex-center flex-1 select-none text-text-muted">
          There are no pending friend requests. Here&apos;s Wumpus for now.
        </div>
      ) : (
        <SimpleBar className="flex-1 min-h-0">
          <ul className="px-5 flex flex-col-reverse">
            <AnimatePresence initial={false}>
              {pendingRelationships.map((relationship) => (
                <li key={relationship.id} className="border-t border-divider mx-1.5">
                  <Clickable className="p-3 !rounded-lg -mx-2 flex group" bg>
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
                          {relationship.type === RelationshipType.INCOMING
                            ? "Incoming"
                            : "Outgoing"}{" "}
                          Friend Request
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
                  </Clickable>
                </li>
              ))}
            </AnimatePresence>
          </ul>
        </SimpleBar>
      )}
    </div>
  );
};

export default FriendPending;
