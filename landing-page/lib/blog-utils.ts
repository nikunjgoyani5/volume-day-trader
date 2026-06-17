import type { BlogPost } from "@/lib/blogs-api";

export function getBlogCoverImage(post: BlogPost): string {
  return post.coverImage || post.featuredImage?.url || "";
}

export function formatBlogDate(
  value: string,
  locale = "en-US",
): string {
  return new Date(value).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getBlogExcerpt(content: string, maxLength = 180): string {
  const plain = stripHtml(content);
  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength).trimEnd()}…`;
}
