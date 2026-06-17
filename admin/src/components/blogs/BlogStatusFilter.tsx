import type { BlogStatus } from "@/types/blog.types";
import { BLOG_STATUS_LABELS } from "@/utils/blogStatus.utils";
import { cn } from "@/lib/utils";

export type BlogStatusFilterValue = "all" | BlogStatus;

type BlogStatusFilterProps = {
  value: BlogStatusFilterValue;
  onChange: (value: BlogStatusFilterValue) => void;
  counts: {
    all: number;
    draft: number;
    published: number;
    archived: number;
  };
};

const FILTERS: { value: BlogStatusFilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "draft", label: BLOG_STATUS_LABELS.draft },
  { value: "published", label: BLOG_STATUS_LABELS.published },
  { value: "archived", label: BLOG_STATUS_LABELS.archived },
];

export default function BlogStatusFilter({
  value,
  onChange,
  counts,
}: BlogStatusFilterProps) {
  return (
    <div
      className="blog-status-filter"
      role="tablist"
      aria-label="Filter blogs by status"
    >
      {FILTERS.map((filter) => {
        const isActive = value === filter.value;
        const count = counts[filter.value];

        return (
          <button
            key={filter.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(filter.value)}
            className={cn(
              "blog-status-filter__btn",
              isActive && "blog-status-filter__btn--active",
            )}
          >
            <span>{filter.label}</span>
            <span className="blog-status-filter__count">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
