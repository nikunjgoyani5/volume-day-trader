import type { BlogStatus } from "@/types/blog.types";

export function normalizeBlogStatus(status?: string | null): BlogStatus {
  if (status === "draft" || status === "published" || status === "archived") {
    return status;
  }
  return "published";
}

export const BLOG_STATUS_LABELS: Record<BlogStatus, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};
