import { authApi } from "@/api/auth.api";
import type {
  ForgotPasswordFormValues,
  LoginFormValues,
} from "@/schemas/auth.schema";
import type { LoginPayload, LoginResponse, User } from "@/types/auth.types";
import { getPersistedAuth } from "@/utils/authStorage";

function toLoginFormValues(
  values: LoginFormValues | LoginPayload,
): LoginFormValues {
  if ("rememberMe" in values && typeof values.rememberMe === "boolean") {
    return values as LoginFormValues;
  }

  const payload = values as LoginPayload;
  return {
    email: payload.email,
    password: payload.password,
    rememberMe: payload.rememberMe ?? false,
  };
}

async function resolveUser(
  token: string,
  partial: User | null,
  email: string,
): Promise<User> {
  if (partial?.email) {
    return partial;
  }

  if (!token) {
    return {
      id: "admin",
      email,
      name: email.split("@")[0] || "Admin",
    };
  }

  return authApi.getMe(token);
}

export const authService = {
  async login(values: LoginFormValues | LoginPayload): Promise<LoginResponse> {
    const formValues = toLoginFormValues(values);
    const result = await authApi.login(formValues);
    const user = await resolveUser(
      result.token,
      result.user,
      formValues.email,
    );

    return {
      accessToken: result.token,
      refreshToken: "",
      user,
    };
  },

  async getMe(): Promise<User> {
    const session = getPersistedAuth();
    if (!session?.accessToken) {
      throw new Error("Not authenticated");
    }
    return authApi.getMe(session.accessToken);
  },

  async forgotPassword(values: ForgotPasswordFormValues): Promise<string> {
    const result = await authApi.forgotPassword(values);
    return result.message ?? "If an account exists, a reset link has been sent.";
  },

  async resetPassword(payload: {
    email: string;
    token: string;
    newPassword: string;
  }): Promise<string> {
    const result = await authApi.resetPassword(payload);
    return result.message ?? "Password updated successfully.";
  },
};
