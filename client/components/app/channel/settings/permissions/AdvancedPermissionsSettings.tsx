import { Divider } from "@app/common";
import React from "react";
import { Channel } from "types/channel";
import { useChannelSettings } from "../ChannelSettingsContext";

const AdvancedPermissionsSettings: React.FC = ({}) => {
  const { channel } = useChannelSettings();

  return (
    <div className="flex gap-4">
      <div className="w-1/4">
        asdasd
        <Divider />
      </div>
      <div className="flex-1">
        <div>asd</div>
        <div>asd</div>
        <div>asd</div>
        <div>asd</div>
        <div>asd</div>
        <div>asd</div>
        <div>asd</div>
        <div>asd</div>
        <div>asd</div>
        <div>asd</div>
        <div>asd</div>
        <div>asd</div>
        <div>asd</div>
        <div>asd</div>
        <div>asd</div>
        <div>asd</div>
        <div>asd</div>
        <div>asd</div>
        <div>asd</div>
        <div>asd</div>
      </div>
    </div>
  );
};

export default AdvancedPermissionsSettings;
