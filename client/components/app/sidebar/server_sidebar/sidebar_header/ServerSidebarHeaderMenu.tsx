import { CreateCategoryForm, CreateChannelForm } from "@app/channel";
import { Divider, LayerModalRender, ModalRender } from "@app/common";
import PermissionWrapper from "@app/common/PermissionWrapper";
import { ServerSettings } from "@app/server";
import EditServerProfile from "@app/server/EditServerProfile";
import InviteForm from "@app/server/invite/InviteForm";
import LeaveServer from "@app/server/LeaveServer";
import { useAppSelector } from "@hooks/redux";
import { useChannel } from "@lib/contexts/ChannelContext";
import { selectMeMember } from "@store/selectors";
import { AiFillFolderAdd } from "react-icons/ai";
import { IoMdAddCircle, IoMdSettings } from "react-icons/io";
import { IoArrowBackCircle } from "react-icons/io5";
import { MdEdit, MdPersonAddAlt1 } from "react-icons/md";
import { Permissions } from "types/permissions";
import ServerSidebarHeaderMenuButton from "./ServerSidebarHeaderMenuButton";

const ServerSidebarHeaderMenu = () => {
  const { server } = useChannel();
  const meMember = useAppSelector((state) => selectMeMember(state, server?.id ?? ""));

  if (!meMember) {
    return null;
  }

  return (
    <div className="w-[220px] p-2">
      {/* Invite button */}
      <PermissionWrapper permissions={Permissions.CREATE_INVITE}>
        <ModalRender modal={<InviteForm />}>
          <ServerSidebarHeaderMenuButton
            className="text-indigo-400"
            text="Invite People"
            icon={<MdPersonAddAlt1 size={18} />}
          />
        </ModalRender>
      </PermissionWrapper>
      {/* Server Settings Button */}
      <PermissionWrapper
        permissions={[
          Permissions.MANAGE_ROLES,
          Permissions.MANAGE_EMOJIS_STICKERS,
          Permissions.MANAGE_SERVER,
        ]}
        some
      >
        <LayerModalRender modal={<ServerSettings />}>
          <ServerSidebarHeaderMenuButton text="Server Settings" icon={<IoMdSettings size={18} />} />
        </LayerModalRender>
      </PermissionWrapper>
      <PermissionWrapper permissions={Permissions.MANAGE_CHANNELS}>
        {/* Create Channel */}
        <ModalRender modal={<CreateChannelForm />}>
          <ServerSidebarHeaderMenuButton text="Create Channel" icon={<IoMdAddCircle size={19} />} />
        </ModalRender>
        {/* Create Category */}
        <ModalRender modal={<CreateCategoryForm />}>
          <ServerSidebarHeaderMenuButton
            text="Create Category"
            icon={<AiFillFolderAdd size={20} />}
          />
        </ModalRender>
      </PermissionWrapper>
      <PermissionWrapper
        permissions={[
          Permissions.CREATE_INVITE,
          Permissions.MANAGE_ROLES,
          Permissions.MANAGE_EMOJIS_STICKERS,
          Permissions.MANAGE_SERVER,
          Permissions.MANAGE_CHANNELS,
        ]}
        some
      >
        <Divider spacing="xs" />
      </PermissionWrapper>
      {/* Edit  Server Profile */}
      <LayerModalRender modal={<EditServerProfile member={meMember} />}>
        <ServerSidebarHeaderMenuButton text="Edit Server Profile" icon={<MdEdit size={18} />} />
      </LayerModalRender>
      {server && !server.owner && (
        <>
          <Divider spacing="xs" />
          <ModalRender modal={<LeaveServer server={server} />}>
            <ServerSidebarHeaderMenuButton
              theme="danger"
              text="Leave Server"
              icon={<IoArrowBackCircle size={18} />}
            />
          </ModalRender>
        </>
      )}
    </div>
  );
};

export default ServerSidebarHeaderMenu;
