import { Divider, LayerModalSideView, LayerModalTab, ModalRender } from "@app/common";
import PermissionWrapper from "@app/common/PermissionWrapper";
import { IoTrash } from "react-icons/io5";
import { Permissions } from "types/permissions";
import DeleteServerForm from "../DeleteServerForm";
import ServerEmojiSettings from "./emoji/ServerEmojiSettings";
import ServerInviteSettings from "./invites/ServerInviteSettings";
import MemberSettings from "./members/ServerMemberSettings";
import ServerOverviewSettings from "./overview/ServerOverviewSettings";
import ServerRolesSettings from "./roles/ServerRolesSettings";

const ServerSettings: React.FC = () => {
  return (
    <LayerModalSideView
      categories={[
        {
          categoryName: "SERVER SETTINGS",
          tabs: [
            { name: "Overview", content: <ServerOverviewSettings /> },
            {
              name: "Roles",
              content: <ServerRolesSettings />,
              permissions: Permissions.MANAGE_ROLES,
            },
            {
              name: "Emoji",
              content: <ServerEmojiSettings />,
              permissions: Permissions.MANAGE_EMOJIS_STICKERS,
            },
          ],
        },
        {
          categoryName: "USER MANAGEMENT",
          tabs: [
            { name: "Members", content: <MemberSettings /> },
            {
              name: "Invites",
              content: <ServerInviteSettings />,
              permissions: Permissions.CREATE_INVITE,
            },
            {
              custom: true,
              name: (
                <PermissionWrapper owner>
                  <Divider />
                  <ModalRender modal={<DeleteServerForm />}>
                    <LayerModalTab>
                      <div className="flex justify-between w-full items-center left-0 top-0">
                        <div>Delete Server</div>
                        <IoTrash />
                      </div>
                    </LayerModalTab>
                  </ModalRender>
                </PermissionWrapper>
              ),
            },
          ],
        },
      ]}
    />
  );
};

export default ServerSettings;
