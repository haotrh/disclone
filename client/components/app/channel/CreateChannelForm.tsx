import {
  Button,
  Input,
  Label,
  ModalCancelButton,
  ModalCloseButton,
  ModalFormContainer,
  ModalFormContent,
  ModalFormFooter,
  ModalFormHeader,
  RadioButton,
} from "@app/common";
import { useModal } from "@app/common/modal/ModalContext";
import { useChannel } from "@lib/contexts/ChannelContext";
import { ChannelService } from "@lib/services/channel.service";
import _ from "lodash";
import { useState } from "react";
import { AiOutlineNumber } from "react-icons/ai";
import { MdVolumeUp } from "react-icons/md";
import { Channel, ChannelType } from "types/channel";
import { ChannelState } from "types/store.interfaces";

type NewChannelType = ChannelType.SERVER_TEXT | ChannelType.SERVER_VOICE;

const CreateChannelForm = ({ category }: { category?: ChannelState }) => {
  const { server } = useChannel();

  const { close } = useModal();

  const [channelType, setChannelType] = useState<NewChannelType>(ChannelType.SERVER_TEXT);
  const [channelName, setChannelName] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    try {
      await ChannelService.createChannel(server?.id ?? "", {
        name: channelName,
        isPrivate: false,
        parentId: category ? category.id : undefined,
        type: channelType,
      });
      close();
    } catch (e: any) {
      console.log(e?.response ?? e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalFormContainer>
      <ModalCloseButton />
      <ModalFormHeader>
        Create Channel
        {category && (
          <div className="text-xs font-medium text-header-secondary">in {category.name}</div>
        )}
      </ModalFormHeader>
      <ModalFormContent>
        <div className="space-y-2 mb-6">
          <RadioButton
            icon={<AiOutlineNumber size={22} />}
            radioCirclePosition="right"
            description="Send messages, images, GIFs, emoji, and more"
            name="Text"
            onClick={() => setChannelType(ChannelType.SERVER_TEXT)}
            selected={channelType === ChannelType.SERVER_TEXT}
          />
          <RadioButton
            icon={<MdVolumeUp size={22} />}
            radioCirclePosition="right"
            description="Hang out together with voice, video, and screen share"
            name="Voice"
            onClick={() => setChannelType(ChannelType.SERVER_VOICE)}
            selected={channelType === ChannelType.SERVER_VOICE}
          />
        </div>
        <div>
          <Label>CHANNEL NAME</Label>
          <Input
            value={channelName}
            onChange={(e) => setChannelName((e.target as HTMLInputElement).value)}
            prefixNode={<div className="text-xl">#</div>}
            placeholder="new-channel"
          />
        </div>
      </ModalFormContent>
      <ModalFormFooter>
        <ModalCancelButton />
        <Button
          onClick={onSubmit}
          disabled={_.isEmpty(channelName)}
          loading={loading}
          grow
          size="medium"
        >
          Create Channel
        </Button>
      </ModalFormFooter>
    </ModalFormContainer>
  );
};

export default CreateChannelForm;
