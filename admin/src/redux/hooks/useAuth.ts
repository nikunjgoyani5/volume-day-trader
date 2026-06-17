import { useCallback } from "react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginRequest, logout } from "@/redux/slices/authSlice";
import type { LoginPayload } from "@/types/auth.types";
import { clearSession } from "@/utils/authStorage";

export function useAuth() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const login = useCallback(
    (payload: LoginPayload) => {
      dispatch(loginRequest(payload));
    },
    [dispatch],
  );

  const signOut = useCallback(() => {
    clearSession();
    dispatch(logout());
  }, [dispatch]);

  return {
    user: auth.user,
    loading: auth.loading,
    error: auth.error,
    isAuthenticated: auth.isAuthenticated,
    login,
    logout: signOut,
  };
}
