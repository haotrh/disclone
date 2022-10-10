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
import MarkdownShortcutsExample from "@app/common/input/markdown/MarkdownInput";
import Textarea from "@app/common/input/Textarea";
import ProfileInfo from "@app/user/ProfileInfo";
import { useAppSelector } from "@hooks/redux";
import { UserService } from "@services/user.service";
import _ from "lodash";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { User } from "types/user";

const ProfileSettings = () => {
  const user = useAppSelector((state) => state.me.user);
  const methods = useForm<User>({ defaultValues: user });
  const userForm = methods.watch();

  const onSubmit = methods.handleSubmit(async (data) => {
    await UserService.update(_.pick(data, ["avatar", "banner", "bio"]));
  });

  if (!user) return null;

  return (
    <FormProvider {...methods}>
      <LayerModalContent>
        <LayerModalHeader>Profile</LayerModalHeader>
        <Divider />
        <div className="flex gap-5">
          <div className="flex-1 min-w-0">
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
                      <Button onClick={() => onChange(null)} size="medium" grow theme="blank">
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
                      <Button onClick={() => onChange(null)} size="medium" grow theme="blank">
                        Remove Banner
                      </Button>
                    )}
                  </div>
                )}
              />
            </div>
            <Divider spacing="medium" />
            <Controller
              name="bio"
              control={methods.control}
              render={({ field: { value, onChange } }) => (
                <Textarea markdown label="About Me" value={value} onChange={onChange} />
                // <Textarea
                //   maxLength={190}
                //   minRows={6}
                //   label="About Me"
                //   value={value}
                //   onChange={(e) => {
                //     onChange(e.target.value);
                //   }}
                // />
              )}
            />
            <Divider />
          </div>
          <div className="flex-1 min-w-0">
            <Label>Preview</Label>
            <ProfileInfo user={userForm} />
          </div>
        </div>
      </LayerModalContent>
      <LayerModalNoticeChanges defaultValues={user} onSubmit={onSubmit} />
    </FormProvider>
  );
};

export default ProfileSettings;
