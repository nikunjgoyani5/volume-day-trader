/** Base URL for API requests. Empty string = same origin (use Vite proxy in dev). */
export const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(
  /\/$/,
  "",
);

export const AUTH_API_PREFIX = `${API_BASE_URL}/api/auth`;
export const INQUIRY_API_PREFIX = `${API_BASE_URL}/api/inquiries`;
/** Admin blog CRUD and AI generation */
export const BLOG_API_PREFIX = `${API_BASE_URL}/api/admin/blogs`;
