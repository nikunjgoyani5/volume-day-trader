import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import AuthLayout from "@/components/layouts/AuthLayout";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [success, setSuccess] = useState(false);

  const showFeedback = !token || success;

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter a new password for your admin account."
      hideHeader={showFeedback}
      footer={showFeedback ? null : undefined}
    >
      <ResetPasswordForm onSuccessChange={setSuccess} />
    </AuthLayout>
  );
}
