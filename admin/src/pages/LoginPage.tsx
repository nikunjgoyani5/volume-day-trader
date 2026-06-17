import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import LoginForm from "@/components/auth/LoginForm";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useAppSelector } from "@/redux/hooks";

export default function LoginPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your admin account to continue."
    >
      <LoginForm />
    </AuthLayout>
  );
}
