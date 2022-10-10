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
} from "@app/common";
import { useModal } from "@app/common/modal/ModalContext";
import { useChannel } from "@lib/contexts/ChannelContext";
import { ChannelService } from "@lib/services/channel.service";
import _ from "lodash";
import { useState } from "react";

const CreateCategoryForm = () => {
  const { server } = useChannel();
  const { close } = useModal();

  const [channelName, setChannelName] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    try {
      await ChannelService.createCategory(server?.id ?? "", channelName);
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
      <ModalFormHeader>Create Category</ModalFormHeader>
      <ModalFormContent>
        <div>
          <Label>CATEGORY NAME</Label>
          <Input
            value={channelName}
            onChange={(e) => setChannelName((e.target as HTMLInputElement).value)}
            placeholder="New Category"
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
          Create Category
        </Button>
      </ModalFormFooter>
    </ModalFormContainer>
  );
};

export default CreateCategoryForm;
