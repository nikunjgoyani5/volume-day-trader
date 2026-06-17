import { Link } from "react-router-dom";
import type { ReactNode } from "react";

import AppIcon from "@/components/ui/app-icon";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  className?: string;
  backTo?: string;
  backLabel?: string;
  actions?: ReactNode;
};

export default function PageHeader({
  title,
  description,
  className,
  backTo,
  backLabel = "Go back",
  actions,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        {backTo && (
          <Link
            to={backTo}
            aria-label={backLabel}
            className="mt-0.5 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.03] text-secondary-text no-underline transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
          >
            <AppIcon name="chevron-down" className="h-5 w-5 rotate-90" strokeWidth={2} />
          </Link>
        )}
        <div className="min-w-0 space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h1>
          {description && (
            <p className="max-w-2xl text-base text-secondary-text">{description}</p>
          )}
        </div>
      </div>

      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
