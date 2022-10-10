import { IconText } from "@app/common";
import { useAppSelector } from "@hooks/redux";
import { selectDmChannels } from "@store/selectors";
import _ from "lodash";
import { FaUserFriends } from "react-icons/fa";
import Sidebar from "../Sidebar";
import DirectMessageItem, { DirectMessagePlaceholder } from "./DirectMessageItem";
import HomeSidebarItem from "./HomeSidebarItem";
import SearchBar from "./SearchBar";

const HomeSidebar = () => {
  const dmChannels = useAppSelector(selectDmChannels);

  return (
    <Sidebar>
      <SearchBar />
      <ul className="space-y-0.5 pt-2">
        <HomeSidebarItem path="/channels/@me">
          <IconText icon={<FaUserFriends size={22} />} text="Friends" />
        </HomeSidebarItem>
        <h2
          className="flex justify-between h-[42px] items-center px-[18px] pt-2 text-[13px]
    text-channels-default font-semibold select-none hover:text-text-normal"
        >
          <span>DIRECT MESSAGES</span>
        </h2>
        {dmChannels.map((channel) => (
          <DirectMessageItem key={channel.id} channelId={channel.id} />
        ))}
        {_.isEmpty(dmChannels) && <DirectMessagePlaceholder />}
      </ul>
    </Sidebar>
  );
};

export default HomeSidebar;
