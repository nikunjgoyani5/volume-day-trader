import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";

import { ApiError } from "@/api/http.client";
import AuthFeedbackCard from "@/components/auth/AuthFeedbackCard";
import AuthFormAlert from "@/components/auth/AuthFormAlert";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/schemas/auth.schema";
import { authService } from "@/services/auth.service";
import {
  AUTH_BUTTON_CLASS,
  AUTH_INPUT_CLASS,
  AUTH_LINK_CLASS,
} from "@/styles/auth.styles";

type ForgotPasswordFormProps = {
  onSuccessChange?: (success: boolean) => void;
};

export default function ForgotPasswordForm({
  onSuccessChange,
}: ForgotPasswordFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);

  const setSuccess = (value: boolean) => {
    setSubmitted(value);
    onSuccessChange?.(value);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setApiError(null);

    try {
      await authService.forgotPassword(data);
      setSubmittedEmail(data.email);
      setSuccess(true);
    } catch (error: unknown) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Unable to send reset link. Please try again.";
      setApiError(message);
    }
  };

  if (submitted) {
    return (
      <AuthFeedbackCard
        variant="success"
        title="Check your inbox"
        description="If an account exists for this email, we'll send password reset instructions shortly."
        email={submittedEmail}
        hint="Check your spam folder if you don't see it within a few minutes."
      >
        <Link to="/login" className={`${AUTH_BUTTON_CLASS} block text-center`}>
          Back to Sign In
        </Link>

        <p className="text-center text-sm text-secondary-text">
          Didn't receive an email?{" "}
          <button
            type="button"
            onClick={() => setSuccess(false)}
            className={AUTH_LINK_CLASS}
          >
            Try again
          </button>
        </p>
      </AuthFeedbackCard>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {apiError && <AuthFormAlert message={apiError} />}

      <div>
        <label
          htmlFor="reset-email"
          className="mb-2 block text-sm font-medium text-secondary-text"
        >
          Email Address
        </label>

        <input
          id="reset-email"
          {...register("email")}
          type="email"
          autoComplete="email"
          placeholder="Enter your admin email"
          className={AUTH_INPUT_CLASS}
        />

        {errors.email && (
          <p className="mt-1.5 text-sm text-tab-active">
            {errors.email.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={AUTH_BUTTON_CLASS}
      >
        {isSubmitting ? "Sending..." : "Send Reset Link"}
      </button>

      <p className="text-center">
        <Link to="/login" className={AUTH_LINK_CLASS}>
          ← Back to Sign In
        </Link>
      </p>
    </form>
  );
}
