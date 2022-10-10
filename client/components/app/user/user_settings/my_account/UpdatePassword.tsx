import {
  Button,
  Divider,
  Input,
  ModalCancelButton,
  ModalCloseButton,
  ModalFormContainer,
  ModalFormContent,
  ModalFormDescription,
  ModalFormFooter,
  ModalFormHeader,
} from "@app/common";
import { useModal } from "@app/common/modal/ModalContext";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppSelector } from "@hooks/redux";
import { UserService } from "@services/user.service";
import {
  confirmPasswordValidation,
  passwordValidation,
} from "@utils/validation";
import _ from "lodash";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const updatePasswordSchema = yup.object({
  newPassword: passwordValidation,
  confirmPassword: confirmPasswordValidation("newPassword"),
});

const UpdatePassword: React.FC = ({}) => {
  const { close } = useModal();
  const user = useAppSelector((state) => state.me.user);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { isSubmitting, errors },
  } = useForm<{
    password: string;
    newPassword: string;
    confirmPassword: string;
  }>({
    resolver: yupResolver(updatePasswordSchema),
  });

  if (!user) {
    return null;
  }

  const onSubmit = handleSubmit(async (data) => {
    try {
      clearErrors();
      await UserService.update(data);
      close();
    } catch (e: any) {
      setError("password", { message: "Password does not match!" });
    }
  });

  return (
    <ModalFormContainer>
      <ModalCloseButton />
      <div className="text-center mb-6">
        <ModalFormHeader center>Update your password</ModalFormHeader>
        <ModalFormDescription>
          Enter your current password and a new password.
        </ModalFormDescription>
      </div>
      <ModalFormContent>
        <div>
          <Input
            error={errors?.password?.message}
            {...register("password")}
            type="password"
            label="Current Password"
          />
        </div>
        <div>
          <Input
            error={errors?.newPassword?.message}
            {...register("newPassword")}
            type="password"
            label="New Password"
          />
        </div>
        <div>
          <Input
            error={errors?.confirmPassword?.message}
            {...register("confirmPassword")}
            type="password"
            label="Confirm New Password"
          />
        </div>
      </ModalFormContent>
      <ModalFormFooter>
        <ModalCancelButton />
        <Button size="medium" onClick={onSubmit} loading={isSubmitting}>
          Done
        </Button>
      </ModalFormFooter>
    </ModalFormContainer>
  );
};

export default UpdatePassword;
