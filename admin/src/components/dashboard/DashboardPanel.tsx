import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import AppIcon, { type AppIconName } from "@/components/ui/app-icon";
import { cn } from "@/lib/utils";

type DashboardPanelProps = {
  title: string;
  description?: string;
  icon?: AppIconName;
  action?: { label: string; to: string };
  children: ReactNode;
  className?: string;
};

export default function DashboardPanel({
  title,
  description,
  icon,
  action,
  children,
  className,
}: DashboardPanelProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] shadow-[0_0_0_1px_rgb(237_31_36/0.06)] backdrop-blur-md",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/[0.06] px-5 py-4 sm:px-6">
        <div className="flex min-w-0 items-start gap-3">
          {icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-tab-active/10 text-tab-active">
              <AppIcon name={icon} className="h-5 w-5" strokeWidth={1.75} />
            </div>
          )}
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-white">{title}</h2>
            {description && (
              <p className="mt-0.5 text-sm text-secondary-text">{description}</p>
            )}
          </div>
        </div>
        {action && (
          <Link
            to={action.to}
            className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.03] px-3.5 py-2 text-sm font-medium text-feature-text no-underline transition-colors hover:border-tab-active/40 hover:text-white"
          >
            {action.label}
            <AppIcon name="chevron-down" className="-rotate-90 h-3.5 w-3.5" strokeWidth={2} />
          </Link>
        )}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}
