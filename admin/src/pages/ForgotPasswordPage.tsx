import { useState } from "react";

import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import AuthLayout from "@/components/layouts/AuthLayout";

export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);

  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="Enter your email and we will send you a link to reset your password."
      hideHeader={emailSent}
      footer={emailSent ? null : undefined}
    >
      <ForgotPasswordForm onSuccessChange={setEmailSent} />
    </AuthLayout>
  );
}
