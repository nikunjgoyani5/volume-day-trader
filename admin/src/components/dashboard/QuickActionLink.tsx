import { Link } from "react-router-dom";

import AppIcon, { type AppIconName } from "@/components/ui/app-icon";

type QuickActionLinkProps = {
  to: string;
  icon: AppIconName;
  title: string;
  description: string;
};

export default function QuickActionLink({
  to,
  icon,
  title,
  description,
}: QuickActionLinkProps) {
  return (
    <Link
      to={to}
      className="group flex cursor-pointer items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 no-underline transition-[border-color,background-color] duration-200 hover:border-white/[0.14] hover:bg-white/[0.04]"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-secondary-text transition-colors group-hover:border-tab-active/20 group-hover:text-tab-active">
        <AppIcon name={icon} className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-0.5 text-xs text-secondary-text">{description}</p>
      </div>
      <AppIcon
        name="chevron-down"
        className="h-4 w-4 shrink-0 -rotate-90 text-muted-text transition-colors group-hover:text-white"
        strokeWidth={2}
      />
    </Link>
  );
}
