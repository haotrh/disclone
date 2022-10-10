import { ModalCloseButton, ModalFormContainer } from "@app/common";
import { TabProvider } from "@lib/contexts/TabContext";
import { useState } from "react";
import InviteLink from "./InviteLink";
import InviteLinkSetting from "./InviteLinkSetting";

export type InviteFormTab = "view" | "create";

const InviteForm = () => {
  const [tab, setTab] = useState<InviteFormTab>("view");

  return (
    <TabProvider tab={tab} setTab={setTab}>
      <ModalFormContainer>
        <ModalCloseButton />
        {tab === "view" ? <InviteLink /> : <InviteLinkSetting />}
      </ModalFormContainer>
    </TabProvider>
  );
};

export default InviteForm;
