import { Link } from "react-router-dom";

import BlogStatusBadge from "@/components/blogs/BlogStatusBadge";
import type { BlogPost } from "@/types/blog.types";

type BlogArchivedNoticeProps = {
  post: Pick<BlogPost, "id" | "title" | "slug">;
  onRestore: () => void;
  restoring?: boolean;
};

export default function BlogArchivedNotice({
  post,
  onRestore,
  restoring = false,
}: BlogArchivedNoticeProps) {
  return (
    <div className="blog-page-enter flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 text-center">
      <BlogStatusBadge status="archived" className="mb-4" />
      <h2 className="text-xl font-semibold text-white">{post.title}</h2>
      <p className="mt-2 max-w-md text-sm text-secondary-text">
        This blog is archived and cannot be edited. View the published content or
        restore it to make it live again.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          to={`/dashboard/blogs/view/${post.id}`}
          className="blog-btn-secondary no-underline"
        >
          View Blog
        </Link>
        <button
          type="button"
          onClick={onRestore}
          disabled={restoring}
          className="blog-btn-restore cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
          {restoring ? "Restoring..." : "Restore"}
        </button>
      </div>
      <p className="mt-4 text-xs text-muted-text">/{post.slug}</p>
    </div>
  );
}
