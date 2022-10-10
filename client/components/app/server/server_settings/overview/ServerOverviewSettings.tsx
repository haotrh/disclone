import {
  Button,
  Divider,
  Input,
  Label,
  LayerModalContent,
  LayerModalDescription,
  LayerModalHeader,
  LayerModalNoticeChanges,
} from "@app/common";
import SelectImageButton from "@app/common/button/SelectImageButton";
import ImageFileInput from "@app/common/input/ImageFileInput";
import PermissionWrapper from "@app/common/PermissionWrapper";
import { useChannel } from "@lib/contexts/ChannelContext";
import { useAppDispatch } from "@lib/hooks/redux";
import { ServerService } from "@lib/services/server.service";
import { updateServer } from "@lib/store/slices/servers.slice";
import serverShortname from "@utils/serverShortname";
import imageCompression from "browser-image-compression";
import classNames from "classnames";
import React, { useMemo } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { BiImageAdd } from "react-icons/bi";
import { Permissions } from "types/permissions";
import SystemMessageChannelSettings from "./SystemMessageChannelSettings";

const ServerOverviewSettings: React.FC = ({}) => {
  const { server } = useChannel();
  const dispatch = useAppDispatch();

  const defaultValues = useMemo(() => {
    return {
      icon: server?.icon ?? "",
      name: server?.name ?? "",
      systemChannel: server?.systemChannelId ?? "",
      splash: server?.splash ?? "",
    };
  }, [server?.icon, server?.name, server?.systemChannelId, server?.splash]);

  const methods = useForm<{
    icon: string | null;
    name: string;
    systemChannel: string;
    splash?: string | null;
  }>({
    defaultValues,
  });

  const newIcon = methods.watch("icon");
  const splash = methods.watch("splash");

  const onSubmit = methods.handleSubmit(async (data) => {
    if (!server) return;
    try {
      const newServer = (await ServerService.updateServer(server.id, data)).data;
      dispatch(updateServer({ id: server.id, ...newServer }));
      methods.setValue("icon", newServer.icon);
    } catch (e: any) {
      console.log(e?.response || e);
    }
  });

  return (
    <PermissionWrapper permissions={Permissions.MANAGE_SERVER}>
      {(hasPermission) => (
        <FormProvider {...methods}>
          <LayerModalContent>
            <LayerModalHeader>Server Overview</LayerModalHeader>
            <div className="flex gap-4">
              <div className="flex-1 flex gap-4">
                <div className="flex-center p-2 flex-col">
                  <div
                    className={classNames("-mt-1 mb-2 relative group", {
                      "cursor-not-allowed pointer-events-none": !hasPermission,
                    })}
                  >
                    <div
                      style={{
                        backgroundImage: `url(${newIcon?.toString()})`,
                        backgroundSize: "100% 100%",
                      }}
                      className="pointer-events-none w-[100px] h-[100px] bg-center rounded-full
                    bg-primary flex-center text-4xl font-medium text-white bg-no-repeat"
                    >
                      {!newIcon && server && serverShortname(server?.name)}
                    </div>
                    <div
                      className="absolute top-0 left-0 inset-0 bg-black text-white rounded-full invisible group-hover:visible flex-center
                   p-5 text-center font-bold text-[13px] leading-4 bg-opacity-40"
                    >
                      Change Icon
                    </div>
                    <div className="absolute top-0 right-0 rounded-full p-1 bg-text-normal text-interactive-muted flex-center shadow-md">
                      <BiImageAdd size={20} />
                    </div>
                    <Controller
                      control={methods.control}
                      name="icon"
                      render={({ field: { onChange } }) => (
                        <ImageFileInput
                          onChange={async (base64, file, type) => {
                            if (type?.includes("gif")) {
                              const compressedFile = await imageCompression(file, {
                                maxSizeMB: 1,
                                maxWidthOrHeight: 512,
                              });
                              onChange(await imageCompression.getDataUrlFromFile(compressedFile));
                            } else {
                              onChange(base64);
                            }
                          }}
                        />
                      )}
                    />
                  </div>
                  {newIcon ? (
                    <Controller
                      name="icon"
                      control={methods.control}
                      render={({ field: { onChange } }) => (
                        <Button
                          onClick={() => {
                            onChange(null);
                          }}
                          theme="blank"
                          className="text-sm !font-semibold p-2"
                        >
                          Remove
                        </Button>
                      )}
                    />
                  ) : (
                    <div className="text-[10px] text-text-muted">
                      Minimum Size: <span className="font-semibold text-normal">128x128</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-header-secondary pt-1 mb-4">
                    We recommend an image of at least 512x512 for the server.
                  </div>
                  <div>
                    <Controller
                      name="icon"
                      control={methods.control}
                      render={({ field: { onChange } }) => (
                        <SelectImageButton
                          disabled={!hasPermission}
                          cropProps={{ round: true }}
                          theme="secondary-outline"
                          onChange={onChange}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <Input
                  disabled={!hasPermission}
                  label="SERVER NAME"
                  {...methods.register("name")}
                  defaultValue={server?.name}
                />
              </div>
            </div>
            <Divider spacing="small" />
            <SystemMessageChannelSettings disabled={!hasPermission} />
            <Divider spacing="small" />
            <div className="flex gap-6">
              <div className="flex-1 space-y-4">
                <Label>Server Banner Background</Label>
                <LayerModalDescription>
                  This image will display at the top of your channels list.
                </LayerModalDescription>
                <LayerModalDescription>
                  The recommended minimum size is 960x540 and recommended aspect ratio is 16:9.
                </LayerModalDescription>
                <Controller
                  control={methods.control}
                  name="splash"
                  render={({ field: { value, onChange } }) => (
                    <div className="flex">
                      <SelectImageButton
                        disabled={!hasPermission}
                        cropProps={{ ratio: 1.77 }}
                        size="medium"
                        theme="success"
                        onChange={onChange}
                      >
                        Upload Banner
                      </SelectImageButton>
                      {value && (
                        <Button grow size="medium" theme="blank" onClick={() => onChange(null)}>
                          Remove Banner
                        </Button>
                      )}
                    </div>
                  )}
                />
              </div>
              <div className="flex-1 bg-[#4f545c] rounded relative overflow-hidden">
                <img className="w-full" src={splash ?? ""} alt="" />
              </div>
            </div>
            <Divider spacing="large" />
            <div className="select-none flex-center">
              <img src="/images/settings-2.svg" alt="" />
            </div>
          </LayerModalContent>
          <LayerModalNoticeChanges onSubmit={onSubmit} defaultValues={defaultValues} />
        </FormProvider>
      )}
    </PermissionWrapper>
  );
};

export default ServerOverviewSettings;
