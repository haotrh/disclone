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
import { useAppSelector } from "@hooks/redux";
import { UserService } from "@services/user.service";
import React from "react";
import { useForm } from "react-hook-form";

const EditEmail: React.FC = ({}) => {
  const { close } = useModal();
  const user = useAppSelector((state) => state.me.user);
  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<{
    email: string;
    password: string;
  }>({
    defaultValues: { email: user?.email },
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
      console.log(e.response.data);
      if (e.response?.data?.includes && e.response.data.includes("Password"))
        setError("password", { message: "Password does not match!" });
      else setError("email", { message: "Email is already registered" });
    }
  });

  return (
    <ModalFormContainer>
      <ModalCloseButton />
      <div className="text-center mb-6">
        <ModalFormHeader center>Enter an email address</ModalFormHeader>
        <ModalFormDescription>
          Enter a new email address and your existing password.
        </ModalFormDescription>
      </div>
      <ModalFormContent>
        <div>
          <Input
            error={errors.email?.message}
            {...register("email")}
            label="Email"
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

export default EditEmail;
