import { Clickable, Popover } from "@app/common";
import { UserService } from "@services/user.service";
import { IoMdMore } from "react-icons/io";
import { User } from "types/user";

interface FriendListMoreButtonProps {
  user: User;
}

const FriendListMoreButton: React.FC<FriendListMoreButtonProps> = ({ user }) => {
  return (
    <Popover
      followCursor={true}
      placement="bottom-start"
      content={
        <div className="p-2">
          <Clickable type="popover" theme="primary" className="row-button">
            Start Video Call
          </Clickable>
          <Clickable type="popover" theme="primary" className="row-button">
            Start Voice Call
          </Clickable>
          <Clickable
            onClick={() => UserService.deleteRelationship(user.id)}
            theme="danger"
            className="row-button"
            type="popover"
          >
            Remove Friend
          </Clickable>
        </div>
      }
    >
      <Clickable theme="row" className="hover:text-header-primary">
        <IoMdMore size={22} />
      </Clickable>
    </Popover>
  );
};

export default FriendListMoreButton;
