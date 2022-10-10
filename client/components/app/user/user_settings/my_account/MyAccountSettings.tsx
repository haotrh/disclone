import {
  Avatar,
  Button,
  Divider,
  Label,
  LayerModalDescription,
  ModalRender,
  NameWithNumber,
} from "@app/common";
import LayerModalContent from "@app/common/modal/layer_modal/LayerModalContent";
import LayerModalHeader from "@app/common/modal/layer_modal/LayerModalHeader";
import { useAppSelector } from "@hooks/redux";
import AccountProfileCard from "./AccountProfileCard";
import DeleteAccount from "./DeleteAccount";
import UpdatePassword from "./UpdatePassword";

const MyAccountSettings = () => {
  const user = useAppSelector((state) => state.me.user);

  if (!user) {
    return null;
  }

  return (
    <LayerModalContent>
      <LayerModalHeader>My Account</LayerModalHeader>
      <AccountProfileCard user={user} />
      <Divider />
      <div className="flex gap-4 justify-between">
        <div className="space-y-4">
          <h3 className="text-header-primary text-[22px] font-semibold">
            Password and Authentication
          </h3>
          <LayerModalDescription></LayerModalDescription>
          <ModalRender modal={<UpdatePassword />}>
            <Button size="small" grow>
              Change Password
            </Button>
          </ModalRender>
        </div>
        <img className="min-h-0 select-none" src="/images/password.svg" />
      </div>
      <Divider />
      <div className="space-y-2">
        <Label>Account Removal</Label>
        <LayerModalDescription>
          Delete your account pernamently. This action cannot be undone.
        </LayerModalDescription>
        <ModalRender modal={<DeleteAccount />}>
          <Button size="small" grow theme="danger-outline">
            Delete Account
          </Button>
        </ModalRender>
      </div>
    </LayerModalContent>
  );
};

export default MyAccountSettings;
