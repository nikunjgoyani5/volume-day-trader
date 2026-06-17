import { Link } from "react-router-dom";

import AppIcon from "@/components/ui/app-icon";
import RefreshButton from "@/components/ui/refresh-button";

type BlogPageToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
};

export default function BlogPageToolbar({
  search,
  onSearchChange,
  onRefresh,
  refreshing = false,
}: BlogPageToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-sm">
        <AppIcon
          name="search"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-text"
          strokeWidth={2}
        />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title, slug, or category..."
          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-secondary-text/70 outline-none transition-colors focus:border-tab-active/50 focus:ring-2 focus:ring-tab-active/20"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {onRefresh && (
          <RefreshButton refreshing={refreshing} onClick={onRefresh} />
        )}

        <Link
          to="/dashboard/blogs/create"
          className="blog-btn-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold no-underline"
        >
          <AppIcon name="sparkles" className="h-4 w-4" strokeWidth={2} />
          Create Blog
        </Link>
      </div>
    </div>
  );
}
