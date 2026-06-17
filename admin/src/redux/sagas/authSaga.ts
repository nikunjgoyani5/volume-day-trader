import { call, put, takeLatest } from "redux-saga/effects";

import { authService } from "@/services/auth.service";
import {
  loginFailure,
  loginRequest,
  loginSuccess,
  logout,
  sessionHydrateFailure,
  sessionHydrateRequest,
  sessionHydrateSuccess,
} from "@/redux/slices/authSlice";
import {
  clearSession,
  getPersistedAuth,
  persistAuth,
  setRememberedLoginPrefs,
} from "@/utils/authStorage";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Login failed";
}

function* loginWorker(action: ReturnType<typeof loginRequest>) {
  const { rememberMe = false } = action.payload;

  try {
    const response: Awaited<ReturnType<typeof authService.login>> = yield call(
      authService.login,
      action.payload,
    );

    persistAuth(
      {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        user: response.user,
      },
      rememberMe,
    );

    setRememberedLoginPrefs(action.payload.email, rememberMe);

    yield put(loginSuccess(response.user));
  } catch (error: unknown) {
    yield put(loginFailure(getErrorMessage(error)));
  }
}

function* sessionHydrateWorker() {
  const persisted = getPersistedAuth();
  if (!persisted?.accessToken) {
    yield put(sessionHydrateFailure());
    return;
  }

  try {
    const user: Awaited<ReturnType<typeof authService.getMe>> = yield call(
      authService.getMe,
    );
    yield put(sessionHydrateSuccess(user));
  } catch {
    clearSession();
    yield put(logout());
    yield put(sessionHydrateFailure());
  }
}

export function* authSaga() {
  yield takeLatest(loginRequest.type, loginWorker);
  yield takeLatest(sessionHydrateRequest.type, sessionHydrateWorker);
}
