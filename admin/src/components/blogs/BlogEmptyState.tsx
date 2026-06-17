import { Link } from "react-router-dom";

import AppIcon from "@/components/ui/app-icon";

export default function BlogEmptyState() {
  return (
    <div className="blog-page-enter blog-glass-card flex min-h-[320px] flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-tab-active/30 bg-tab-active/10">
        <AppIcon name="document" className="h-8 w-8 text-tab-active" strokeWidth={1.5} />
      </div>
      <h2 className="text-xl font-semibold text-white">No blog posts yet</h2>
      <p className="mt-2 max-w-md text-sm text-secondary-text">
        Start sharing content for your traders. Create your first blog post to
        see it listed here.
      </p>
      <Link
        to="/dashboard/blogs/create"
        className="blog-btn-primary mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold no-underline"
      >
        <AppIcon name="sparkles" className="h-4 w-4" strokeWidth={2} />
        Create Blog
      </Link>
    </div>
  );
}
