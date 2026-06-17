import type { ApiErrorResponse, FieldError } from "@/types/api.types";

export class ApiError extends Error {
  status: number;
  fieldErrors: FieldError[];

  constructor(
    message: string,
    status: number,
    fieldErrors: FieldError[] = [],
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
  signal?: AbortSignal;
};

function extractApiErrorMessage(
  data: ApiErrorResponse & { error?: string; details?: string },
  statusText: string,
): string {
  if (data.errors?.[0]?.message) return data.errors[0].message;
  return data.error ?? data.message ?? data.details ?? statusText ?? "Request failed";
}

export async function apiRequest<T>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, token, signal } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: "include",
    signal,
  });

  const data = (await response.json().catch(() => ({}))) as T &
    ApiErrorResponse & { error?: string; details?: string };

  if (!response.ok) {
    throw new ApiError(
      extractApiErrorMessage(data, response.statusText),
      response.status,
      data.errors ?? [],
    );
  }

  return data as T;
}

/** Multipart upload (do not set Content-Type; browser sets boundary). */
export async function apiFormRequest<T>(
  url: string,
  formData: FormData,
  options: { method?: string; token?: string | null } = {},
): Promise<T> {
  const { method = "POST", token } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: formData,
    credentials: "include",
  });

  const data = (await response.json().catch(() => ({}))) as T &
    ApiErrorResponse & { error?: string; details?: string };

  if (!response.ok) {
    throw new ApiError(
      extractApiErrorMessage(data, response.statusText),
      response.status,
      data.errors ?? [],
    );
  }

  return data as T;
}
