import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useSearchParams } from "react-router-dom";

import { ApiError } from "@/api/http.client";
import AuthFeedbackCard from "@/components/auth/AuthFeedbackCard";
import AuthFormAlert from "@/components/auth/AuthFormAlert";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/schemas/auth.schema";
import { authService } from "@/services/auth.service";
import {
  AUTH_BUTTON_CLASS,
  AUTH_LINK_CLASS,
  getAuthInputClassName,
} from "@/styles/auth.styles";

type ResetPasswordFormProps = {
  onSuccessChange?: (success: boolean) => void;
};

export default function ResetPasswordForm({
  onSuccessChange,
}: ResetPasswordFormProps) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const emailFromLink = searchParams.get("email") ?? "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token || !emailFromLink) return;

    setApiError(null);

    try {
      await authService.resetPassword({
        email: emailFromLink,
        token,
        newPassword: data.password,
      });
      setSubmitted(true);
      onSuccessChange?.(true);
    } catch (error: unknown) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Unable to reset password. Please try again.";
      setApiError(message);
    }
  };

  if (!token || !emailFromLink) {
    return (
      <AuthFeedbackCard
        variant="warning"
        title="Link expired"
        description="This password reset link is invalid or has expired."
        hint="Request a new link and we'll email you fresh instructions."
      >
        <Link
          to="/forgot-password"
          className={`${AUTH_BUTTON_CLASS} block text-center`}
        >
          Request New Link
        </Link>

        <p className="text-center">
          <Link to="/login" className={AUTH_LINK_CLASS}>
            ← Back to Sign In
          </Link>
        </p>
      </AuthFeedbackCard>
    );
  }

  if (submitted) {
    return (
      <AuthFeedbackCard
        variant="success"
        title="Password updated"
        description="Your new password is ready. Sign in to continue to the admin dashboard."
      >
        <Link to="/login" className={`${AUTH_BUTTON_CLASS} block text-center`}>
          Sign In
        </Link>
      </AuthFeedbackCard>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {apiError && <AuthFormAlert message={apiError} />}

      <p className="rounded-xl border border-btn-border/80 bg-[#050024]/50 px-4 py-3 text-sm text-secondary-text">
        Resetting password for{" "}
        <span className="font-medium text-white">{emailFromLink}</span>
      </p>

      <div>
        <label
          htmlFor="new-password"
          className="mb-2 block text-sm font-medium text-secondary-text"
        >
          New Password
        </label>

        <div className="relative">
          <input
            id="new-password"
            {...register("password")}
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Enter new password"
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
          <p className="mt-1.5 text-sm text-tab-active">
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirm-password"
          className="mb-2 block text-sm font-medium text-secondary-text"
        >
          Confirm Password
        </label>

        <div className="relative">
          <input
            id="confirm-password"
            {...register("confirmPassword")}
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Confirm new password"
            className={getAuthInputClassName(
              Boolean(errors.confirmPassword),
              "pr-16",
            )}
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-sm font-medium text-secondary-text transition-colors hover:text-white"
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>

        {errors.confirmPassword && (
          <p className="mt-1.5 text-sm text-tab-active">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={AUTH_BUTTON_CLASS}
      >
        {isSubmitting ? "Updating..." : "Reset Password"}
      </button>

      <p className="text-center">
        <Link to="/login" className={AUTH_LINK_CLASS}>
          ← Back to Sign In
        </Link>
      </p>
    </form>
  );
}
