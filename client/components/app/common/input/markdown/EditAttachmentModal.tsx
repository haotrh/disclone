import {
  Checkbox,
  ModalCancelButton,
  ModalFormFooter,
  ModalFormContainer,
  ModalFormHeader,
  ModalFormContent,
  Input,
  Button,
} from "@app/common";
import { useModal } from "@app/common/modal/ModalContext";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { NewAttachment } from "./InputAttachment";

interface EditAttachmentModalProps {
  attachment: NewAttachment;
  onChange: (changes: NewAttachment) => any;
}

const EditAttachmentModal: React.FC<EditAttachmentModalProps> = ({ attachment, onChange }) => {
  const { close } = useModal();
  const { handleSubmit, register, control, reset } = useForm<NewAttachment>({
    defaultValues: attachment,
  });

  const handleChange = handleSubmit((data) => {
    onChange(data);
    close();
  });

  useEffect(() => {
    reset(attachment);
  }, [attachment, reset]);

  return (
    <ModalFormContainer>
      <ModalFormHeader>{attachment.fileName}</ModalFormHeader>
      <ModalFormContent>
        <div>
          <Input label="FILENAME" {...register("fileName")} />
        </div>
        <div>
          <Input label="DESCRIPTION (ALT TEXT)" {...register("description")} />
        </div>
        <div>
          <Controller
            control={control}
            name="spoiler"
            render={({ field: { onChange, value } }) => (
              <Checkbox defaultChecked={value} onChange={onChange} label="Mark as spoiler" />
            )}
          />
        </div>
      </ModalFormContent>
      <ModalFormFooter>
        <ModalCancelButton />
        <Button closeModal={true} onClick={handleChange} grow size="medium">
          Save
        </Button>
      </ModalFormFooter>
    </ModalFormContainer>
  );
};

export default EditAttachmentModal;
