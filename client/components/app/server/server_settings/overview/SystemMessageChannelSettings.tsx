import { Label, LayerModalDescription, Select } from "@app/common";
import { useChannel } from "@contexts/ChannelContext";
import { useAppSelector } from "@hooks/redux";
import { selectTextChannels } from "@store/selectors";
import React from "react";
import { Controller } from "react-hook-form";

interface SystemMessageChannelSettingsProps {
  disabled?: boolean;
}

const SystemMessageChannelSettings: React.FC<SystemMessageChannelSettingsProps> = ({
  disabled,
}) => {
  const { server } = useChannel();
  const channels = useAppSelector((state) => selectTextChannels(state, server?.id ?? ""));

  return (
    <div className="space-y-2">
      <Label>System Message Channel</Label>
      <Controller
        name="systemChannel"
        render={({ field: { onChange, value } }) => (
          <Select
            disabled={disabled}
            defaultValue={value}
            onChange={onChange}
            maxHeight={240}
            options={channels.map((channel) => ({
              label: channel.name,
              value: channel.id,
            }))}
          />
        )}
      />
      <LayerModalDescription>
        This is the channel we send system event messages to. These can be turned off at any time.
      </LayerModalDescription>
    </div>
  );
};

export default SystemMessageChannelSettings;
