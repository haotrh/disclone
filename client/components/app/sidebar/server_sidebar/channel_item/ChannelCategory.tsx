import { ChannelSettings, CreateChannelForm } from "@app/channel";
import { Clickable, Divider, LayerModalRender, ModalRender, Popover, Tooltip } from "@app/common";
import PermissionWrapper from "@app/common/PermissionWrapper";
import { useAppDispatch } from "@lib/hooks/redux";
import { updateChannel } from "@lib/store/slices/channels.slice";
import classNames from "classnames";
import { FiCheck } from "react-icons/fi";
import { IoChevronDownOutline } from "react-icons/io5";
import { MdAdd } from "react-icons/md";
import { Channel } from "types/channel";
import { Permissions } from "types/permissions";
import { ChannelState } from "types/store.interfaces";

const CreateChannelButton = ({ category }: { category: ChannelState }) => {
  return (
    <PermissionWrapper permissions={Permissions.MANAGE_CHANNELS}>
      <ModalRender modal={<CreateChannelForm category={category} />}>
        <Tooltip content="Create channel">
          <Clickable>
            <MdAdd size={20} />
          </Clickable>
        </Tooltip>
      </ModalRender>
    </PermissionWrapper>
  );
};

interface ChannelCategoryProps {
  channel: ChannelState;
}

const ChannelCategory: React.FC<ChannelCategoryProps> = ({ channel }) => {
  const dispatch = useAppDispatch();

  const handleCollapse = () => {
    dispatch(updateChannel({ ...channel, collapsed: !channel.collapsed }));
  };

  return (
    <Popover
      content={
        <PermissionWrapper permissions={Permissions.MANAGE_CHANNELS}>
          <div className="p-2">
            <Clickable
              bg
              theme="primary"
              onClick={handleCollapse}
              type="popover"
              noClosePopover
              className="group"
            >
              <div>Collapse Category</div>
              <div
                className={classNames("rounded-sm", {
                  "bg-primary text-white group-hover:bg-white group-hover:text-primary":
                    channel.collapsed,
                  "border border-text-normal": !channel.collapsed,
                })}
              >
                <div className={classNames({ invisible: !channel.collapsed })}>
                  <FiCheck />
                </div>
              </div>
            </Clickable>
            <LayerModalRender modal={<ChannelSettings channel={channel} />}>
              <Clickable bg theme="primary" type="popover">
                Edit Category
              </Clickable>
            </LayerModalRender>
            <Divider spacing="xs" />
            <Clickable bg theme="danger" type="popover">
              Delete Category
            </Clickable>
          </div>
        </PermissionWrapper>
      }
      isContextMenu
      followCursor
      placement="right-start"
    >
      <Clickable
        theme="channel"
        draggable={true}
        onClick={handleCollapse}
        className="text-[13px] !font-semibold pt-2 mt-2 pl-0 pr-1.5 flex -ml-1 justify-between items-center mb-0.5 uppercase"
      >
        <div className="flex items-center">
          <span
            className={classNames("mr-0.5 text-[10px] transition-transform", {
              "-rotate-90": channel.collapsed,
            })}
          >
            <IoChevronDownOutline />
          </span>
          {channel.name}
        </div>
        <CreateChannelButton category={channel} />
      </Clickable>
    </Popover>
  );
};

export default ChannelCategory;
