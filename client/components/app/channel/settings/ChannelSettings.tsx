import { LayerModalSideView, LayerModalTab, ModalRender } from "@app/common";
import { IoTrash } from "react-icons/io5";
import { ChannelState } from "types/store.interfaces";
import DeleteChannelForm from "../DeleteChannelForm";
import ChannelOverviewSettings from "./ChannelOverviewSettings";
import { ChannelSettingsProvider } from "./ChannelSettingsContext";
import ChannelPermissionsSettings from "./permissions/ChannelPermissionsSettings";

interface ChannelSettingsProps {
  channel: ChannelState;
}

const ChannelSettings: React.FC<ChannelSettingsProps> = ({ channel }) => {
  return (
    <ChannelSettingsProvider channel={channel}>
      <LayerModalSideView
        categories={[
          {
            categoryName: `#${channel.name}`,
            tabs: [
              {
                name: "Overview",
                content: <ChannelOverviewSettings />,
              },
              // {
              //   name: "Permissions",
              //   content: <ChannelPermissionsSettings />,
              // },
            ],
          },
          {
            tabs: [
              {
                custom: true,
                name: (
                  <ModalRender modal={<DeleteChannelForm channel={channel} />}>
                    <LayerModalTab>
                      <div className="flex justify-between w-full items-center left-0 top-0">
                        <div>Delete Channel</div>
                        <IoTrash />
                      </div>
                    </LayerModalTab>
                  </ModalRender>
                ),
              },
            ],
          },
        ]}
      />
    </ChannelSettingsProvider>
  );
};

export default ChannelSettings;
