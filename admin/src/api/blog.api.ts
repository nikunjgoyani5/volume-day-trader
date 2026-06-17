import { BLOG_API_PREFIX } from "@/api/config";
import { apiFormRequest, apiRequest } from "@/api/http.client";
import type {
  ApiBlog,
  BlogListParams,
  BlogListResponse,
  BlogStatsResponse,
  CreateBlogPayload,
  DeleteBlogResponse,
  GenerateImageRequest,
  GenerateImageResponse,
  UpdateBlogPayload,
  UpdateBlogStatusPayload,
} from "@/types/blog.types";
import { getPersistedAuth } from "@/utils/authStorage";

function getToken(): string {
  const session = getPersistedAuth();
  if (!session?.accessToken) {
    throw new Error("Not authenticated");
  }
  return session.accessToken;
}

function buildQuery(params: BlogListParams): string {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  if (params.search?.trim()) search.set("search", params.search.trim());
  if (params.status) search.set("status", params.status);
  if (params.sortBy) search.set("sortBy", params.sortBy);
  if (params.sortOrder) search.set("sortOrder", params.sortOrder);
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

function appendPayloadToFormData(
  formData: FormData,
  payload: Record<string, unknown>,
) {
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });
}

export const blogApi = {
  list(params: BlogListParams = {}) {
    return apiRequest<BlogListResponse>(
      `${BLOG_API_PREFIX}${buildQuery(params)}`,
      { token: getToken() },
    );
  },

  getByIdentifier(identifier: string) {
    return apiRequest<ApiBlog>(
      `${BLOG_API_PREFIX}/${encodeURIComponent(identifier)}`,
      { token: getToken() },
    );
  },

  create(payload: CreateBlogPayload) {
    return apiRequest<ApiBlog>(BLOG_API_PREFIX, {
      method: "POST",
      body: payload,
      token: getToken(),
    });
  },

  createWithFormData(payload: CreateBlogPayload, file: File) {
    const formData = new FormData();
    appendPayloadToFormData(formData, payload as Record<string, unknown>);
    formData.append("coverImage", file);
    return apiFormRequest<ApiBlog>(BLOG_API_PREFIX, formData, {
      token: getToken(),
    });
  },

  update(identifier: string, payload: UpdateBlogPayload) {
    return apiRequest<ApiBlog>(
      `${BLOG_API_PREFIX}/${encodeURIComponent(identifier)}`,
      { method: "PATCH", body: payload, token: getToken() },
    );
  },

  updateWithFormData(
    identifier: string,
    payload: UpdateBlogPayload,
    file: File,
  ) {
    const formData = new FormData();
    appendPayloadToFormData(formData, payload);
    formData.append("coverImage", file);
    return apiFormRequest<ApiBlog>(
      `${BLOG_API_PREFIX}/${encodeURIComponent(identifier)}`,
      formData,
      { method: "PATCH", token: getToken() },
    );
  },

  delete(identifier: string) {
    return apiRequest<DeleteBlogResponse>(
      `${BLOG_API_PREFIX}/${encodeURIComponent(identifier)}`,
      { method: "DELETE", token: getToken() },
    );
  },

  updateStatus(identifier: string, payload: UpdateBlogStatusPayload) {
    return apiRequest<ApiBlog>(
      `${BLOG_API_PREFIX}/${encodeURIComponent(identifier)}/status`,
      { method: "PATCH", body: payload, token: getToken() },
    );
  },

  getStats() {
    return apiRequest<BlogStatsResponse>(`${BLOG_API_PREFIX}/stats`, {
      token: getToken(),
    });
  },

  generateContent(prompt: string, targetWordCount?: number) {
    return apiRequest<{ content: string }>(`${BLOG_API_PREFIX}/generate`, {
      method: "POST",
      body: { prompt, targetWordCount },
      token: getToken(),
    });
  },

  generateImage(body: GenerateImageRequest) {
    return apiRequest<GenerateImageResponse>(
      `${BLOG_API_PREFIX}/generate-image`,
      {
        method: "POST",
        body,
        token: getToken(),
      },
    );
  },
};
