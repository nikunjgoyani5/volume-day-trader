import { useDashboardHeaderActions } from "@/components/dashboard/DashboardHeaderActionsContext";
import AppIcon from "@/components/ui/app-icon";
import { useAuth } from "@/redux/hooks/useAuth";
import { formatAdminGreeting } from "@/utils/greeting.utils";

type DashboardHeaderProps = {
  onMenuClick: () => void;
};

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { user, logout } = useAuth();
  const { actions: headerActions } = useDashboardHeaderActions();
  const displayName = user?.name?.trim() || "Admin";
  const greeting = formatAdminGreeting(displayName);

  return (
    <header className="sticky top-0 z-30 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-card-border/80 bg-page-bg/80 px-4 py-3 backdrop-blur-md sm:gap-4 sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-btn-border text-secondary-text transition-colors hover:text-white lg:hidden"
        >
          <AppIcon name="menu" className="h-5 w-5" />
        </button>

        <p className="truncate text-xs font-normal text-white sm:text-sm">
          {greeting}
        </p>
      </div>

      {headerActions && (
        <div className="order-3 flex w-full shrink-0 justify-end sm:order-2 sm:w-auto">
          {headerActions}
        </div>
      )}

      <div className="order-2 flex shrink-0 items-center gap-2 sm:order-3 sm:gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-white">{displayName}</p>
          <p className="max-w-[12rem] truncate text-xs text-secondary-text">
            {user?.email}
          </p>
        </div>

        <div
          className="flex h-9 w-9 items-center justify-center rounded-full bg-tab-active/20 text-sm font-semibold text-tab-active ring-1 ring-tab-active/30 sm:h-10 sm:w-10"
          aria-hidden
        >
          {displayName.charAt(0).toUpperCase()}
        </div>

        <button
          type="button"
          onClick={logout}
          className="cursor-pointer rounded-full border border-btn-border px-3 py-2 text-xs font-medium text-secondary-text transition-colors hover:border-tab-active/50 hover:text-white sm:px-4 sm:text-sm"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
