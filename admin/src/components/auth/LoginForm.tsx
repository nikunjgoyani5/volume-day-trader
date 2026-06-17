import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";

import AuthFormAlert from "@/components/auth/AuthFormAlert";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginRequest } from "@/redux/slices/authSlice";
import { loginSchema, type LoginFormValues } from "@/schemas/auth.schema";
import {
  AUTH_BUTTON_CLASS,
  AUTH_LINK_CLASS,
  getAuthInputClassName,
} from "@/styles/auth.styles";
import { getRememberedLoginPrefs } from "@/utils/authStorage";

const rememberedPrefs = getRememberedLoginPrefs();

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const { loading, error: authError } = useAppSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitted },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      email: rememberedPrefs.email,
      password: "",
      rememberMe: rememberedPrefs.rememberMe,
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    dispatch(
      loginRequest({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      }),
    );
  };

  const showFormError =
    isSubmitted && !isValid && Object.keys(errors).length > 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {authError && <AuthFormAlert message={authError} />}

      {showFormError && !authError && (
        <AuthFormAlert message="Please fix the errors below to continue." />
      )}

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-secondary-text"
        >
          Email Address
        </label>

        <input
          id="email"
          {...register("email")}
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={getAuthInputClassName(Boolean(errors.email))}
        />

        {errors.email && (
          <p
            id="email-error"
            role="alert"
            className="mt-1.5 text-sm text-tab-active"
          >
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-secondary-text"
        >
          Password
        </label>

        <div className="relative">
          <input
            id="password"
            {...register("password")}
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            className={getAuthInputClassName(Boolean(errors.password), "pr-16")}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-sm font-medium text-secondary-text transition-colors hover:text-white"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {errors.password && (
          <p
            id="password-error"
            role="alert"
            className="mt-1.5 text-sm text-tab-active"
          >
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-feature-text">
          <input
            type="checkbox"
            {...register("rememberMe")}
            className="h-4 w-4 rounded border-btn-border bg-[#050024] accent-tab-active"
          />
          <span>Remember me</span>
        </label>

        <Link to="/forgot-password" className={AUTH_LINK_CLASS}>
          Forgot Password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={AUTH_BUTTON_CLASS}
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}
