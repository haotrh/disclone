import { Button, Input, Label, SearchSelect } from "@app/common";
import { RoundLoading } from "@components/common";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthBoxLayout from "@layouts/AuthBoxLayout";
import { UserService } from "@lib/services/user.service";
import {
  emailValidation,
  passwordValidation,
  usernameValidation,
} from "@utils/validation";
import { AnimatePresence } from "framer-motion";
import _ from "lodash";
import moment from "moment";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { NextPageWithLayout } from "./_app";

const registerSchema = yup.object({
  email: emailValidation,
  username: usernameValidation,
  password: passwordValidation,
  day: yup.string().required(),
  month: yup.string().required(),
  year: yup.string().required(),
  dob: yup.date().typeError("Vui lòng nhập ngày sinh hợp lệ"),
});

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  day: number;
  month: number;
  year: number;
  dob: Date;
}

const Register: NextPageWithLayout = () => {
  const {
    control,
    register,
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitting },
    getValues,
    setValue,
    setError,
  } = useForm<RegisterData>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    if (isSubmitting) {
      return;
    }
    clearErrors();

    const { day, month, year, ...registerData } = data;

    try {
      await UserService.register(registerData);
      await signIn("credentials", {
        email: registerData.email,
        password: registerData.password,
        redirect: false,
      });
    } catch (e: any) {
      setError("email", { message: "Email is already registered" });
    }
  });

  const onDateChange = (value: any, onChange: any) => {
    onChange(value);
    const { day, month, year } = getValues();
    const date = moment(`${month}/${day}/${year}`, "MM/DD/yyyy");
    setValue("dob", date.toDate(), { shouldValidate: true });
  };

  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/channels/@me");
    }
  }, [status]);

  if (status === "authenticated" || status === "loading") {
    return (
      <div className="flex-center my-24 max-h-full flex-col gap-10">
        <RoundLoading />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-[420px]">
      <div className="text-2xl text-gray-50 font-semibold text-center mb-2">
        Tạo tài khoản
      </div>
      <div className="mb-5 space-y-3">
        <Input
          error={errors?.email?.message}
          {...register("email")}
          label="EMAIL"
          id="email"
        />
        <Input
          error={errors?.username?.message}
          {...register("username")}
          label="TÊN ĐĂNG NHẬP"
          id="username"
        />
        <Input
          error={errors?.password?.message}
          {...register("password")}
          label="MẬT KHẨU"
          id="password"
          type="password"
        />
        <div>
          <Label>NGÀY SINH</Label>
          <div className="grid grid-cols-3 gap-4">
            {/* day select */}
            <Controller
              control={control}
              name="day"
              render={({ field: { onChange } }) => (
                <SearchSelect
                  onChange={(v) => onDateChange(v, onChange)}
                  options={_.range(31).map((i) => ({
                    label: (i + 1).toString(),
                    value: (i + 1).toString().padStart(2, "0"),
                  }))}
                />
              )}
            />
            {/* month select */}
            <Controller
              control={control}
              name="month"
              render={({ field: { onChange } }) => (
                <SearchSelect
                  onChange={(v) => onDateChange(v, onChange)}
                  options={_.range(12).map((i) => ({
                    label: "tháng " + (i + 1),
                    value: (i + 1).toString().padStart(2, "0"),
                  }))}
                />
              )}
            />
            {/* year select */}
            <Controller
              control={control}
              name="year"
              render={({ field: { onChange } }) => (
                <SearchSelect
                  onChange={(v) => onDateChange(v, onChange)}
                  options={_.range(1900, 2015)
                    .reverse()
                    .map((i) => ({
                      label: (i + 1).toString(),
                      value: (i + 1).toString(),
                    }))}
                />
              )}
            />
          </div>
          {errors.dob && (
            <div className="text-red-500 text-sm mt-1">
              {errors.dob.message}
            </div>
          )}
        </div>
      </div>
      <div className="mb-2">
        <Button
          size="none"
          type="submit"
          loading={isSubmitting}
          className="w-full h-10"
        >
          Tiếp tục
        </Button>
      </div>
      <div className="text-sm">
        <Link href="/login">
          <a className="link">Đã có tài khoản?</a>
        </Link>
      </div>
    </form>
  );
};

export default Register;

Register.getLayout = function getLayout(page: ReactElement) {
  return (
    <AnimatePresence exitBeforeEnter>
      <AuthBoxLayout title="Register" key="register">
        {page}
      </AuthBoxLayout>
    </AnimatePresence>
  );
};
