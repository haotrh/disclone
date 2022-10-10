import { useAppSelector } from "@hooks/redux";
import { useTab } from "@lib/contexts/TabContext";
import { selectRelationships } from "@store/selectors";
import { searchText } from "@utils/common.util";
import { AnimatePresence } from "framer-motion";
import _ from "lodash";
import { HomeTabType } from "pages/channels/@me";
import { ChangeEvent, useMemo, useState } from "react";
import SimpleBar from "simplebar-react";
import { RelationshipType } from "types/user";
import HomeSearchBar from "../HomeSearchBar";
import FriendListItem from "./FriendListItem";
import FriendPendingItem from "./FriendPendingItem";

const FriendList = () => {
  const { tab } = useTab<HomeTabType>();
  const [search, setSearch] = useState("");
  const relationships = useAppSelector((state) =>
    selectRelationships(
      state,
      tab === "online" || tab === "all"
        ? RelationshipType.FRIEND
        : tab === "pending"
        ? [RelationshipType.INCOMING, RelationshipType.OUTGOING]
        : RelationshipType.BLOCK
    )
  );
  const filteredRelationships = useMemo(
    () =>
      relationships
        .filter((relationship) => searchText(search, relationship.user.username))
        .filter((relationship) =>
          tab === "online" ? relationship.user?.status === "online" : true
        ),
    [relationships, search, tab]
  );

  return (
    <div className="h-full flex flex-col">
      <HomeSearchBar
        value={search}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        placeholder="Search"
      />
      <h4 className="mx-7 my-3 text-[13px] font-semibold text-header-secondary">
        {tab === "online" && "ONLINE"}
        {tab === "all" && "ALL FRIENDS"}
        {tab === "pending" && "PENDING"} — {filteredRelationships.length}
      </h4>
      {_.isEmpty(filteredRelationships) ? (
        <div className="flex-center flex-1 select-none text-text-muted">
          Wumpus looked, but couldn&apos;t find anyone with that name.
        </div>
      ) : (
        <SimpleBar className="flex-1 min-h-0">
          <ul className="px-5 flex flex-col-reverse">
            <AnimatePresence initial={false}>
              {filteredRelationships.map((relationship) =>
                tab === "pending" ? (
                  <FriendPendingItem relationship={relationship} />
                ) : (
                  <FriendListItem key={relationship.id} user={relationship.user} />
                )
              )}
            </AnimatePresence>
          </ul>
        </SimpleBar>
      )}
    </div>
  );
};

export default FriendList;
