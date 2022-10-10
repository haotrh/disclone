import {
  Button,
  Input,
  ModalCancelButton,
  ModalFormContainer,
  ModalFormContent,
  ModalFormFooter,
  ModalFormHeader,
} from "@app/common";
import { useModal } from "@app/common/modal/ModalContext";
import { useAppSelector } from "@hooks/redux";
import _ from "lodash";
import React from "react";

const DeleteAccount = () => {
  const isOwner = useAppSelector((state) =>
    _.values(state.servers).some((server) => server.owner)
  );
  const { close } = useModal();

  if (isOwner) {
    return (
      <ModalFormContainer>
        <ModalFormHeader>You Own Servers!</ModalFormHeader>
        <ModalFormContent>
          In order to delete or disable your account you must first transfer
          ownership of all servers that you own.
        </ModalFormContent>
        <ModalFormFooter>
          <Button size="medium" grow onClick={close}>
            Okay
          </Button>
        </ModalFormFooter>
      </ModalFormContainer>
    );
  }

  return (
    <ModalFormContainer>
      <ModalFormHeader>Delete Account</ModalFormHeader>
      <ModalFormContent>
        <div className="p-3 bg-amber-500 text-white rounded-md mb-6">
          Are you sure you want to delete your account? This will immediately
          log you out of your account and you will not be able to login again.
        </div>
        <div>
          <Input label="Password" type="password" />
        </div>
      </ModalFormContent>
      <ModalFormFooter>
        <ModalCancelButton />
        <Button size="medium" theme="danger" grow>
          Delete Account
        </Button>
      </ModalFormFooter>
    </ModalFormContainer>
  );
};

export default DeleteAccount;
