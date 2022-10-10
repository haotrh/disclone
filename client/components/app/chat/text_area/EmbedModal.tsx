import {
  Button,
  Checkbox,
  Input,
  Label,
  ModalCancelButton,
  ModalCloseButton,
  ModalFormContainer,
  ModalFormContent,
  ModalFormFooter,
  ModalFormHeader,
  Tooltip,
} from "@app/common";
import ColorPickerButton from "@app/common/color_picker/ColorPickerButton";
import Textarea from "@app/common/input/Textarea";
import { useModal } from "@app/common/modal/ModalContext";
import { useChannel } from "@contexts/ChannelContext";
import { useAppSelector } from "@hooks/redux";
import { decimalToRgb, hexToHSL } from "@utils/colors";
import { isEmptyDeep } from "@utils/common.util";
import _ from "lodash";
import { useMemo, useState } from "react";
import { Controller, useFieldArray, useForm, useFormContext, useWatch } from "react-hook-form";
import {
  AiFillEye,
  AiFillEyeInvisible,
  AiOutlineColumnHeight,
  AiOutlineColumnWidth,
  AiOutlineLink,
  AiOutlineTag,
  AiOutlineUser,
} from "react-icons/ai";
import { BsTextLeft } from "react-icons/bs";
import { MdClose, MdTitle } from "react-icons/md";
import { Embed, MessageType } from "types/message";
import ChatMessage from "../content/ChatMessage";
import { NewMessageData } from "./ChatForm";

const EmbedModal = () => {
  const { close } = useModal();
  const { channel } = useChannel();
  const me = useAppSelector((state) => state.me.user);
  const chatEmbed = useWatch<NewMessageData>({ name: "embed" }) as Embed;
  const { setValue } = useFormContext<NewMessageData>();
  const { register, watch, control } = useForm<Embed>({ defaultValues: chatEmbed });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });
  const [preview, setPreview] = useState(false);
  const embed = watch();
  const isEmpty = useMemo(() => isEmptyDeep(_.omit(embed, "color")), [embed]);
  const isAdded = useMemo(() => isEmptyDeep(_.omit(chatEmbed, "color")), [chatEmbed]);

  const handleSendEmbed = () => {
    setValue("embed", embed, { shouldDirty: true });
    close();
  };

  const handleRemoveEmbed = () => {
    setValue("embed", undefined, { shouldDirty: true });
    close();
  };

  return (
    <ModalFormContainer className="max-[600px] !w-full">
      <ModalCloseButton />
      <ModalFormHeader center className="flex-center">
        <div className="relative">
          Embed Editor
          <span className="absolute left-full top-0 h-full flex-center px-2">
            <Tooltip content={!preview ? "Preview" : "Edit"} placement="right">
              <Button onClick={() => setPreview(!preview)} theme="blank">
                {!preview ? <AiFillEye size={24} /> : <AiFillEyeInvisible size={24} />}
              </Button>
            </Tooltip>
          </span>
        </div>
      </ModalFormHeader>
      <ModalFormContent>
        {preview ? (
          <ChatMessage
            readOnly
            groupStart
            message={{
              content: "My embed card! :smile:",
              embeds: [embed],
              author: me?.id ?? "",
              id: "embedTest",
              channelId: channel?.id ?? "",
              createdAt: new Date(),
              type: MessageType.DEFAULT,
            }}
          />
        ) : (
          <div className="w-full flex rounded overflow-hidden bg-background-secondary">
            <div className="w-1" style={{ backgroundColor: decimalToRgb(embed.color ?? 0) }} />
            <div className="flex-1 min-w-0 py-2 px-4 flex text-sm font-medium">
              <div className="flex-1 min-w-0 space-y-2">
                <div className="space-y-2">
                  <Label>Author</Label>
                  <Input
                    prefixNode={<AiOutlineTag />}
                    {...register("author.name")}
                    placeholder="Name"
                  />
                  <Input
                    prefixNode={<AiOutlineLink />}
                    {...register("author.url")}
                    placeholder="Link"
                  />
                  <Input
                    prefixNode={<AiOutlineUser />}
                    {...register("author.iconUrl")}
                    placeholder="Avatar"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Provider</Label>
                  <Input
                    prefixNode={<AiOutlineTag />}
                    {...register("provider.name")}
                    placeholder="Name"
                  />
                  <Input
                    prefixNode={<AiOutlineLink />}
                    {...register("provider.url")}
                    placeholder="Link"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input prefixNode={<MdTitle />} {...register("title")} placeholder="Title" />
                  <Input prefixNode={<AiOutlineLink />} {...register("url")} placeholder="Link" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    prefixNode={<BsTextLeft />}
                    {...register("description")}
                    maxRows={5}
                    placeholder="Description"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fields</Label>
                  {fields.map((field, i) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <Input {...register(`fields.${i}.name`)} placeholder="Name" />
                      <Input {...register(`fields.${i}.value`)} placeholder="Value" />
                      <Controller
                        control={control}
                        name={`fields.${i}.inline`}
                        render={({ field: { value, onChange } }) => (
                          <Tooltip content="Inline">
                            <div>
                              <Checkbox onChange={onChange} defaultChecked={value} />
                            </div>
                          </Tooltip>
                        )}
                      />
                      <Button theme="blank" onClick={() => remove(i)}>
                        <MdClose />
                      </Button>
                    </div>
                  ))}
                  <Button
                    onClick={() => append({ name: "", value: "", inline: false })}
                    theme="blank"
                  >
                    + Add Field
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Image</Label>
                  <Input
                    prefixNode={<AiOutlineLink />}
                    {...register("image.url")}
                    placeholder="Link"
                  />
                  <Input
                    prefixNode={<AiOutlineColumnWidth />}
                    {...register("image.width")}
                    placeholder="Width"
                  />
                  <Input
                    prefixNode={<AiOutlineColumnHeight />}
                    {...register("image.height")}
                    placeholder="Height"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Video</Label>
                  <Input
                    prefixNode={<AiOutlineLink />}
                    {...register("video.url")}
                    placeholder="Link"
                  />
                  <Input
                    prefixNode={<AiOutlineColumnWidth />}
                    {...register("video.width")}
                    placeholder="Width"
                  />
                  <Input
                    prefixNode={<AiOutlineColumnHeight />}
                    {...register("video.height")}
                    placeholder="Height"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Footer</Label>
                  <Input {...register("footer.text")} placeholder="Text" />
                  <Input {...register("footer.iconUrl")} placeholder="Icon" />
                </div>
                <div className="space-y-2">
                  <Label>Timestamp</Label>
                  <Input type="date" {...register("timestamp")} placeholder="URL" />
                </div>
              </div>
              <div className="ml-4 w-28 h-28 space-y-2">
                <div className="space-y-2">
                  <Label>Thumbnail</Label>
                  <Input
                    prefixNode={<AiOutlineLink />}
                    {...register("thumbnail.url")}
                    placeholder="Link"
                  />
                  <Input
                    prefixNode={<AiOutlineColumnWidth />}
                    {...register("thumbnail.width")}
                    placeholder="Width"
                  />
                  <Input
                    prefixNode={<AiOutlineColumnHeight />}
                    {...register("thumbnail.height")}
                    placeholder="Height"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <Controller
                    control={control}
                    name="color"
                    render={({ field: { onChange, value } }) => (
                      <ColorPickerButton
                        defaultValues={value ? hexToHSL("#" + value.toString(16)) : undefined}
                        onChange={(hex, number) => onChange(number)}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </ModalFormContent>
      <ModalFormFooter>
        <ModalCancelButton />
        {!isAdded && (
          <Button onClick={handleRemoveEmbed} theme="secondary" grow size="medium">
            Remove Embed
          </Button>
        )}
        <Button disabled={isEmpty} onClick={handleSendEmbed} grow size="medium">
          {!isAdded ? "Update Embed" : "Add Embed"}
        </Button>
      </ModalFormFooter>
    </ModalFormContainer>
  );
};

export default EmbedModal;
