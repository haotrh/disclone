import { Divider, Input, LayerModalContent, LayerModalNoticeChanges } from "@app/common";
import Textarea from "@app/common/input/Textarea";
import { useAppDispatch } from "@hooks/redux";
import { ChannelService } from "@services/channel.service";
import { updateChannel } from "@store/slices/channels.slice";
import { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useChannelSettings } from "./ChannelSettingsContext";

const ChannelOverviewSettings = () => {
  const { channel } = useChannelSettings();
  const dispatch = useAppDispatch();

  const defaultValues = useMemo(() => {
    return { topic: channel.topic, name: channel.name };
  }, [channel.topic, channel.name]);

  const methods = useForm<{
    name: string;
    topic: string;
  }>({
    defaultValues,
  });

  const onSubmit = methods.handleSubmit(async (data) => {
    try {
      const newChannel = (await ChannelService.updateChannel(channel.id, data)).data;
      dispatch(updateChannel(newChannel));
    } catch (e: any) {
      console.log(e?.response || e);
    }
  });

  return (
    <FormProvider {...methods}>
      <LayerModalContent>
        <h2 className="uppercase text-header-primary font-semibold text-[17px]">Overview</h2>
        <div>
          <Input {...methods.register("name")} label="Channel Name" />
        </div>
        <Divider spacing="medium" />
        <div>
          <Textarea
            {...methods.register("topic")}
            placeholder="Let everyone know how to use this channel!"
            maxLength={1024}
            label="Channel Topic"
          />
        </div>
        <Divider spacing="medium" />
        <div className="flex-center select-none">
          <img src="/images/settings-2.svg" alt="" />
        </div>
      </LayerModalContent>
      <LayerModalNoticeChanges onSubmit={onSubmit} defaultValues={defaultValues} />
    </FormProvider>
  );
};

export default ChannelOverviewSettings;
