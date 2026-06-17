import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { LoginPayload, User } from "@/types/auth.types";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  sessionChecked: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  sessionChecked: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest(state, _action: PayloadAction<LoginPayload>) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<User>) {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.sessionChecked = true;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    sessionHydrateRequest(state) {
      state.loading = true;
    },
    sessionHydrateSuccess(state, action: PayloadAction<User>) {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.sessionChecked = true;
    },
    sessionHydrateFailure(state) {
      state.loading = false;
      state.sessionChecked = true;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.sessionChecked = true;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  sessionHydrateRequest,
  sessionHydrateSuccess,
  sessionHydrateFailure,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
