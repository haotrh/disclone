import { Button, Input } from "@app/common";
import { RoundLoading } from "@components/common";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthBoxLayout from "@layouts/AuthBoxLayout";
import { emailValidation } from "@utils/validation";
import { AnimatePresence } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { NextPageWithLayout } from "./_app";

const loginSchema = yup.object({
  email: emailValidation,
  password: yup.string().required("This field is required"),
});

const Login: NextPageWithLayout = () => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    if (isSubmitting) {
      return;
    }
    clearErrors();

    try {
      const res: any = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (res.error) {
        setError("email", { message: "Login or password is invalid." });
        setError("password", { message: "Login or password is invalid." });
      }
    } catch (e) {
      setError("email", { message: "Login or password is invalid." });
      setError("password", { message: "Login or password is invalid." });
    }
  });

  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/channels/@me");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (status === "authenticated" || status === "loading") {
    return (
      <div className="flex-center my-24 max-h-full flex-col gap-10">
        <RoundLoading />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="text-[26px] text-gray-50 font-semibold text-center mb-2">
        Chào mừng trở lại!
      </div>
      <div className="text-center text-base mb-6 text-text-muted">
        Rất vui mừng khi được gặp lại bạn!
      </div>
      <div className="mb-5">
        <div className="space-y-3">
          <Input
            error={errors?.email?.message}
            label="EMAIL HOẶC SỐ ĐIỆN THOẠI"
            id="email"
            {...register("email")}
          />
          <Input
            error={errors?.password?.message}
            label="MẬT KHẨU"
            type="password"
            id="password"
            {...register("password")}
          />
        </div>
        <div className="mt-1">
          <Link href="/register">
            <a className="link text-sm">Quên mật khẩu?</a>
          </Link>
        </div>
      </div>
      <div className="mb-2">
        <Button
          type="submit"
          size="none"
          loading={isSubmitting}
          className="w-full h-10"
        >
          Đăng nhập
        </Button>
      </div>
      <div className="text-sm">
        <span className="text-gray-500">Cần một tài khoản?</span>{" "}
        <Link href="/register">
          <a className="link text-sm">Đăng ký</a>
        </Link>
      </div>
    </form>
  );
};

export default Login;

Login.getLayout = function getLayout(page: ReactElement) {
  return (
    <AnimatePresence exitBeforeEnter>
      <AuthBoxLayout title="Login" key="login">
        {page}
      </AuthBoxLayout>
    </AnimatePresence>
  );
};
