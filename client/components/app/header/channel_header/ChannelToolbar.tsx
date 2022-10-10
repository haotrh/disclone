import { useChannel } from "@contexts/ChannelContext";
import ChannelSearch from "../toolbar/ChannelSearch";
import HelpButton from "../toolbar/HelpButton";
import InboxButton from "../toolbar/InboxButton";
import MemberToggleButton from "../toolbar/MemberToggleButton";
import PinShowButton from "../toolbar/PinShowButton";
import ToolbarContainer from "../toolbar/ToolbarContainer";

const ChannelToolbar = () => {
  const { server } = useChannel();

  return (
    <ToolbarContainer>
      <PinShowButton />
      {server && <MemberToggleButton />}
      {server && <ChannelSearch />}
      <InboxButton />
      <HelpButton />
    </ToolbarContainer>
  );
};

export default ChannelToolbar;
