import { useChannel } from "@lib/contexts/ChannelContext";
import { FiAtSign } from "react-icons/fi";
import { ChannelType } from "types/channel";
import Header from "../Header";
import ChannelToolbar from "./ChannelToolbar";
import { AiOutlineNumber } from "react-icons/ai";

const ChannelHeader = () => {
  const { channel } = useChannel();

  return (
    <Header
      icon={
        channel?.type === ChannelType.DM ? <FiAtSign size={22} /> : <AiOutlineNumber size={22} />
      }
      toolbar={<ChannelToolbar />}
      name={channel?.type === ChannelType.DM ? channel.recipients[0].username : channel?.name}
    >
      {channel?.topic}
    </Header>
  );
};

export default ChannelHeader;
