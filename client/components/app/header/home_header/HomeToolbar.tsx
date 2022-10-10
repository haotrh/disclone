import HelpButton from "../toolbar/HelpButton";
import InboxButton from "../toolbar/InboxButton";
import ToolbarContainer from "../toolbar/ToolbarContainer";

const HomeToolbar = () => {
  return (
    <ToolbarContainer>
      <InboxButton />
      <HelpButton />
    </ToolbarContainer>
  );
};

export default HomeToolbar;
