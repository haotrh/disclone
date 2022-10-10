import {
  Button,
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
import { usernameValidation } from "@utils/validation";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const yupSchema = yup.object({
  username: usernameValidation,
});

const EditUsername: React.FC = ({}) => {
  const { close } = useModal();
  const user = useAppSelector((state) => state.me.user);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { isSubmitting, errors },
  } = useForm<{
    username: string;
    password: string;
  }>({
    resolver: yupResolver(yupSchema),
    defaultValues: { username: user?.username },
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
        <ModalFormHeader center>Change your username</ModalFormHeader>
        <ModalFormDescription>
          Enter a new username and your existing password.
        </ModalFormDescription>
      </div>
      <ModalFormContent>
        <div>
          <Input
            error={errors.username?.message}
            {...register("username")}
            suffixNode={
              <div className="flex border-l border-divider py-1 px-4 text-sm font-semibold opacity-50 cursor-not-allowed">
                #{user.discrimination}
              </div>
            }
            label="Username"
          />
        </div>
        <div>
          <Input
            error={errors.password?.message}
            {...register("password")}
            type="password"
            label="Current Password"
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

export default EditUsername;
