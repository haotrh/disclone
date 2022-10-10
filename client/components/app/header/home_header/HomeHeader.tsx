import { useTab } from "@lib/contexts/TabContext";
import classNames from "classnames";
import { HomeTabType } from "pages/channels/@me";
import { FaUserFriends } from "react-icons/fa";
import Header from "../Header";
import HomeTabButton from "./HomeTabButton";
import HomeToolbar from "./HomeToolbar";

const HomeHeader = () => {
  const { tab } = useTab<HomeTabType>();

  return (
    <Header
      icon={<FaUserFriends size={26} />}
      toolbar={<HomeToolbar />}
      name="Friends"
    >
      <div className="flex gap-4">
        <HomeTabButton targetTab="online">Online</HomeTabButton>
        <HomeTabButton targetTab="all">All</HomeTabButton>
        <HomeTabButton targetTab="pending">Pending</HomeTabButton>
        <HomeTabButton
          targetTab="add_friend"
          className={classNames("px-2 rounded", {
            "bg-green-0 text-white": tab !== "add_friend",
            "text-green-0 hover:bg-background-modifier-hover":
              tab === "add_friend",
          })}
        >
          Add Friend
        </HomeTabButton>
      </div>
    </Header>
  );
};

export default HomeHeader;
