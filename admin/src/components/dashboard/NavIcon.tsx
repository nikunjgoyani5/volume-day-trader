import AppIcon, { type AppIconName } from "@/components/ui/app-icon";
import type { NavIconName } from "@/constants/dashboard.nav";

type NavIconProps = {
  name: NavIconName;
  className?: string;
};

const NAV_ICON_MAP: Record<NavIconName, AppIconName> = {
  dashboard: "layout-grid",
  mail: "mail",
  "blog-content": "newspaper",
  document: "document",
  sparkles: "sparkles",
};

export default function NavIcon({ name, className = "h-5 w-5" }: NavIconProps) {
  return <AppIcon name={NAV_ICON_MAP[name]} className={className} />;
}
