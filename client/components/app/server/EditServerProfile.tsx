import {
  Button,
  Divider,
  Input,
  Label,
  LayerModalContent,
  LayerModalDescription,
  LayerModalHeader,
  LayerModalNoticeChanges,
  MarkdownInput,
} from "@app/common";
import SelectImageButton from "@app/common/button/SelectImageButton";
import Textarea from "@app/common/input/Textarea";
import ProfileInfo from "@app/user/ProfileInfo";
import { useChannel } from "@contexts/ChannelContext";
import { ServerService } from "@services/server.service";
import serverShortname from "@utils/serverShortname";
import _ from "lodash";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Member } from "types/server";

interface EditServerProfileProps {
  member: Member;
}

const EditServerProfile: React.FC<EditServerProfileProps> = ({ member }) => {
  const { server } = useChannel();
  const methods = useForm<Member>({ defaultValues: member });

  const memberForm = methods.watch();

  const onSubmit = methods.handleSubmit(async (data) => {
    server && (await ServerService.updateMeMember(server.id, _.omit(data, "user")));
  });

  return (
    <FormProvider {...methods}>
      <LayerModalContent containerClassName="justify-center">
        <LayerModalHeader>Server Profile</LayerModalHeader>
        <div className="text-sm">
          <span className="bg-background-secondary-alt px-1 rounded inline-block">
            {serverShortname(server?.name ?? "")}
          </span>{" "}
          {server?.name}
        </div>
        <Divider />
        <div className="flex gap-5">
          <div className="flex-1">
            <Input
              {...methods.register("nick")}
              placeholder={member.user.username}
              label="Nickname"
            />
            <Divider spacing="medium" />
            <div>
              <Label>Avatar</Label>
              <Controller
                name="avatar"
                control={methods.control}
                render={({ field: { value, onChange } }) => (
                  <div className="flex">
                    <SelectImageButton cropProps={{ round: true }} size="small" onChange={onChange}>
                      Change Avatar
                    </SelectImageButton>
                    {value && (
                      <Button onClick={() => onChange(null)} size="small" grow theme="blank">
                        Remove Avatar
                      </Button>
                    )}
                  </div>
                )}
              />
            </div>
            <Divider spacing="medium" />
            <div className="space-y-2">
              <Label>Profile Banner</Label>
              <LayerModalDescription>
                We recommend an image of at least 600x240. You can upload PNG, JPG, or an animated
                GIF under 10 MB.
              </LayerModalDescription>

              <Controller
                name="banner"
                control={methods.control}
                render={({ field: { value, onChange } }) => (
                  <div className="flex">
                    <SelectImageButton cropProps={{ ratio: 2.5 }} size="small" onChange={onChange}>
                      Change Banner
                    </SelectImageButton>
                    {value && (
                      <Button onClick={() => onChange(null)} size="small" grow theme="blank">
                        Remove Banner
                      </Button>
                    )}
                  </div>
                )}
              />
            </div>
            <Divider spacing="medium" />
            <div>
              <Controller
                control={methods.control}
                name="bio"
                render={({ field: { value, onChange } }) => (
                  <Textarea label="About Me" markdown value={value} onChange={onChange} />
                )}
              />
            </div>
          </div>
          <div className="flex-1">
            <Label>Preview for {server?.name}</Label>
            <ProfileInfo member={memberForm} />
          </div>
        </div>
      </LayerModalContent>
      <LayerModalNoticeChanges defaultValues={member} onSubmit={onSubmit} />
    </FormProvider>
  );
};

export default EditServerProfile;
