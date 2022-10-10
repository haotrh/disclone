import { LayerModalTab, ModalRender } from "@app/common";
import LayerModalSideView from "@app/common/modal/layer_modal/LayerModalSideView";
import { IoLogOut } from "react-icons/io5";
import ApperanceSettings from "./appearance/AppearanceSettings";
import LogOutForm from "./LogOutForm";
import MyAccountSettings from "./my_account/MyAccountSettings";
import ProfileSettings from "./profile/ProfileSettings";
import VoiceSettings from "./voice_settings/VoiceSettings";

const UserSettings: React.FC = () => {
  return (
    <LayerModalSideView
      categories={[
        {
          categoryName: "USER SETTINGS",
          tabs: [
            { name: "My Account", content: <MyAccountSettings /> },
            { name: "User Profile", content: <ProfileSettings /> },
          ],
        },
        {
          categoryName: "APP SETTINGS",
          tabs: [
            { name: "Apperance", content: <ApperanceSettings /> },
            { name: "Voice & Video", content: <VoiceSettings /> },
          ],
        },
        {
          tabs: [
            {
              custom: true,
              name: (
                <ModalRender modal={<LogOutForm />}>
                  <LayerModalTab>
                    <div className="flex justify-between w-full items-center left-0 top-0">
                      <div>Log Out</div>
                      <IoLogOut />
                    </div>
                  </LayerModalTab>
                </ModalRender>
              ),
            },
          ],
        },
      ]}
    />
  );
};

export default UserSettings;
