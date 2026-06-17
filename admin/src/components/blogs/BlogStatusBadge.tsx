import type { BlogStatus } from "@/types/blog.types";
import { BLOG_STATUS_LABELS } from "@/utils/blogStatus.utils";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<
  BlogStatus,
  { className: string; dot: string }
> = {
  published: {
    className:
      "bg-[rgba(34,197,94,0.12)] text-[#22c55e] border-[rgba(34,197,94,0.25)]",
    dot: "🟢",
  },
  draft: {
    className:
      "bg-[rgba(245,158,11,0.12)] text-[#f59e0b] border-[rgba(245,158,11,0.25)]",
    dot: "🟡",
  },
  archived: {
    className:
      "bg-[rgba(148,163,184,0.12)] text-secondary-text border-[rgba(148,163,184,0.25)]",
    dot: "⚫",
  },
};

type BlogStatusBadgeProps = {
  status: BlogStatus;
  className?: string;
};

export default function BlogStatusBadge({
  status,
  className,
}: BlogStatusBadgeProps) {
  const style = STATUS_STYLES[status];

  return (
    <span
      className={cn(
        "inline-flex h-7 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 text-xs font-semibold",
        style.className,
        className,
      )}
    >
      <span aria-hidden className="text-xs leading-none">
        {style.dot}
      </span>
      {BLOG_STATUS_LABELS[status]}
    </span>
  );
}
