import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAppSelector } from "@/redux/hooks";

export default function ProtectedRoute() {
  const { isAuthenticated, sessionChecked } = useAppSelector(
    (state) => state.auth,
  );
  const location = useLocation();

  if (!sessionChecked) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-page-bg text-sm text-secondary-text">
        Loading…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
