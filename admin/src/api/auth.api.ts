import { AUTH_API_PREFIX } from "@/api/config";
import { apiRequest } from "@/api/http.client";
import type {
  ForgotPasswordFormValues,
  LoginFormValues,
} from "@/schemas/auth.schema";
import type { User } from "@/types/auth.types";

export { ApiError as AuthApiError } from "@/api/http.client";

type LoginApiResponse = {
  success?: boolean;
  message?: string;
  token?: string;
  accessToken?: string;
  user?: ApiUser;
};

type ApiUser = {
  id?: string | number;
  _id?: string;
  email?: string;
  name?: string;
  fullName?: string;
};

type MeApiResponse = {
  user?: ApiUser;
} & ApiUser;

type MessageApiResponse = {
  success?: boolean;
  message?: string;
};

export function mapApiUser(raw: ApiUser, fallbackEmail?: string): User {
  const id = String(raw.id ?? raw._id ?? "admin");
  const email = raw.email ?? fallbackEmail ?? "";
  const name =
    raw.name ?? raw.fullName ?? (email ? email.split("@")[0] : "Admin");

  return { id, email, name };
}

function pickToken(data: LoginApiResponse): string {
  return data.token ?? data.accessToken ?? "";
}

export const authApi = {
  async login(values: LoginFormValues): Promise<{
    token: string;
    user: User | null;
    message?: string;
  }> {
    const data = await apiRequest<LoginApiResponse>(`${AUTH_API_PREFIX}/login`, {
      method: "POST",
      body: {
        email: values.email.trim().toLowerCase(),
        password: values.password,
        rememberMe: values.rememberMe,
      },
    });

    const token = pickToken(data);
    const user = data.user
      ? mapApiUser(data.user, values.email)
      : null;

    return { token, user, message: data.message };
  },

  async getMe(token: string): Promise<User> {
    const data = await apiRequest<MeApiResponse>(`${AUTH_API_PREFIX}/me`, {
      token,
    });

    const raw = data.user ?? data;
    return mapApiUser(raw);
  },

  async forgotPassword(
    values: ForgotPasswordFormValues,
  ): Promise<MessageApiResponse> {
    return apiRequest<MessageApiResponse>(
      `${AUTH_API_PREFIX}/forgot-password`,
      {
        method: "POST",
        body: { email: values.email.trim().toLowerCase() },
      },
    );
  },

  async resetPassword(payload: {
    email: string;
    token: string;
    newPassword: string;
  }): Promise<MessageApiResponse> {
    return apiRequest<MessageApiResponse>(
      `${AUTH_API_PREFIX}/reset-password`,
      {
        method: "POST",
        body: {
          email: payload.email.trim().toLowerCase(),
          token: payload.token,
          newPassword: payload.newPassword,
        },
      },
    );
  },
};
