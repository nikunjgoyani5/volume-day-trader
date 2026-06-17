import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import GuestRoute from "@/components/auth/GuestRoute";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import AllBlogsPage from "@/pages/AllBlogsPage";
import ContactSubmissionsPage from "@/pages/ContactSubmissionsPage";
import CreateBlogPage from "@/pages/CreateBlogPage";
import EditBlogPage from "@/pages/EditBlogPage";
import ViewBlogPage from "@/pages/ViewBlogPage";
import DashboardPage from "@/pages/DashboardPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import LoginPage from "@/pages/LoginPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import { useAppSelector } from "@/redux/hooks";

function RootRedirect() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  return (
    <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route
              path="/dashboard/contacts"
              element={<ContactSubmissionsPage />}
            />
            <Route path="/dashboard/blogs" element={<AllBlogsPage />} />
            <Route
              path="/dashboard/blogs/create"
              element={<CreateBlogPage />}
            />
            <Route
              path="/dashboard/blogs/view/:blogId"
              element={<ViewBlogPage />}
            />
            <Route
              path="/dashboard/blogs/edit/:blogId"
              element={<EditBlogPage />}
            />
          </Route>
        </Route>

        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
