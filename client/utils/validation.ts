import * as yup from "yup";

export const passwordValidation = yup
  .string()
  .min(6, "Must be 6 or more in length.")
  .matches(/[a-z]+/, "Password is too weak or common to use")
  .matches(/\d+/, "Password is too weak or common to use")
  .required("Your new password cannot be empty");

export const confirmPasswordValidation = (passwordField: string) =>
  yup.string().oneOf([yup.ref(passwordField), null], "Passwords do not match!");

export const emailValidation = yup
  .string()
  .required("This field is required")
  .email("Invalid email address");

export const usernameValidation = yup
  .string()
  .min(2, "Must between 2 and 32 in length")
  .max(32, "Must between 2 and 32 in length")
  .required("This field is required");
