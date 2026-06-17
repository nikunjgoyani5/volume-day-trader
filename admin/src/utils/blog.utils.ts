import type { BlogPost } from "@/types/blog.types";

export function extractTitleFromHtml(content: string): string | null {
  const match = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
  if (!match?.[1]) return null;
  return match[1].replace(/<[^>]+>/g, "").trim() || null;
}

export function slugifyTitle(title: string): string {
  let base = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!base) base = `post-${Math.random().toString(36).substring(2, 7)}`;
  return base;
}

export function formatBlogDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) return "Today";

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatBlogDateTime(iso: string): string {
  const date = new Date(iso);
  const datePart = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timePart = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${datePart} ${timePart}`;
}

export function formatRelativeTimeAgo(iso: string): string {
  const date = new Date(iso);
  const now = Date.now();
  const diffMs = now - date.getTime();

  if (Number.isNaN(diffMs) || diffMs < 0) return "just now";

  const diffMinutes = Math.floor(diffMs / 60_000);
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) {
    return diffMinutes === 1 ? "1 min ago" : `${diffMinutes} mins ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return formatBlogDate(iso);
}

export function computeBlogStats(posts: BlogPost[]) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  return {
    thisMonth: posts.filter((p) => new Date(p.createdAt) >= monthStart).length,
  };
}
