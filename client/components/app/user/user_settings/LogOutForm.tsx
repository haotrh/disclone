import {
  Button,
  ModalFormContainer,
  ModalFormContent,
  ModalFormDescription,
  ModalFormFooter,
  ModalFormHeader,
} from "@app/common";
import ModalCancelButton from "@app/common/modal/ModalCancelButton";
import { signOut } from "next-auth/react";

const LogOutForm = () => {
  return (
    <ModalFormContainer>
      <ModalFormHeader>Log Out</ModalFormHeader>
      <ModalFormContent>
        <ModalFormDescription>
          Are you sure you want to logout?
        </ModalFormDescription>
      </ModalFormContent>
      <ModalFormFooter>
        <ModalCancelButton />
        <Button
          theme="danger"
          grow
          size="medium"
          onClick={() => {
            signOut();
          }}
        >
          Log Out
        </Button>
      </ModalFormFooter>
    </ModalFormContainer>
  );
};

export default LogOutForm;
