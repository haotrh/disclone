import { Avatar, Label, ModalRender, NameWithNumber } from "@app/common";
import { useLayerModalTab } from "@app/common/modal/layer_modal/LayerModalTabContext";
import { Button } from "@components/app/common";
import React from "react";
import { User } from "types/user";
import EditEmail from "./EditEmail";
import EditUsername from "./EditUsername";
import EmailReveal from "./EmailReveal";

interface AccountProfileCardProps {
  user: User;
}

const AccountProfileCard: React.FC<AccountProfileCardProps> = ({ user }) => {
  const { setTab } = useLayerModalTab();

  return (
    <div className="bg-background-tertiary rounded-lg">
      <div className="h-[100px] bg-[#2c60a8] relative rounded-t-lg"></div>
      <div className="flex pl-[120px] p-4 relative">
        <div className="absolute left-4 -top-[40%] p-0 rounded-full border-8 border-background-tertiary">
          <Avatar noStatus user={user} size={80} />
        </div>
        <div className="flex-1 text-xl font-semibold">
          <NameWithNumber user={user} />
        </div>
        <div className="flex-shrink-0">
          <Button onClick={() => setTab([0, 1])} size="small" grow>
            Edit User Profile
          </Button>
        </div>
      </div>
      <div className="m-4 bg-background-secondary p-4 rounded-md space-y-6">
        <div className="flex-center-between">
          <div>
            <Label className="!mb-0">USERNAME</Label>
            <NameWithNumber user={user} />
          </div>
          <ModalRender modal={<EditUsername />}>
            <Button theme="secondary" size="small">
              Edit
            </Button>
          </ModalRender>
        </div>
        <div className="flex-center-between">
          <div>
            <Label className="!mb-0">Email</Label>
            <div className="text-header-primary">
              <EmailReveal email={user.email ?? ""} />
            </div>
          </div>
          <ModalRender modal={<EditEmail />}>
            <Button theme="secondary" size="small">
              Edit
            </Button>
          </ModalRender>
        </div>
      </div>
    </div>
  );
};

export default AccountProfileCard;
