import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import type { BlogStatus } from "@/types/blog.types";
import {
  formatBlogDateTime,
  formatRelativeTimeAgo,
} from "@/utils/blog.utils";
import { BLOG_STATUS_LABELS } from "@/utils/blogStatus.utils";

const STATUS_DOT: Record<BlogStatus, string> = {
  draft: "bg-amber-400/80",
  published: "bg-emerald-400/80",
  archived: "bg-slate-400/70",
};

type BlogEditStatusMetaProps = {
  status: BlogStatus;
  updatedAt: string;
  className?: string;
};

export default function BlogEditStatusMeta({
  status,
  updatedAt,
  className,
}: BlogEditStatusMetaProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (status !== "draft") return;

    const id = window.setInterval(() => {
      setTick((value) => value + 1);
    }, 60_000);

    return () => window.clearInterval(id);
  }, [status]);

  const timestampLine = useMemo(() => {
    if (status === "draft") {
      return `Last saved: ${formatRelativeTimeAgo(updatedAt)}`;
    }

    return `Last updated: ${formatBlogDateTime(updatedAt)}`;
  }, [status, updatedAt, tick]);

  return (
    <div className={cn("min-w-0 text-right", className)}>
      <div className="flex items-center justify-end gap-1 text-[11px] font-normal text-muted-text">
        <span
          aria-hidden
          className={cn("h-1.5 w-1.5 shrink-0 rounded-full", STATUS_DOT[status])}
        />
        <span>{BLOG_STATUS_LABELS[status]}</span>
      </div>
      <p className="mt-px text-[10px] leading-snug text-dim-text">{timestampLine}</p>
    </div>
  );
}
