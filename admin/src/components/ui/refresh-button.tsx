import AppIcon from "@/components/ui/app-icon";
import { cn } from "@/lib/utils";

type RefreshButtonProps = {
  refreshing: boolean;
  onClick: () => void;
  className?: string;
};

export default function RefreshButton({
  refreshing,
  onClick,
  className,
}: RefreshButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={refreshing}
      aria-busy={refreshing}
      aria-label={refreshing ? "Refreshing data" : "Refresh data"}
      className={cn(
        "inline-flex min-w-[7.25rem] items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-white/15 hover:bg-white/[0.05]",
        refreshing
          ? "btn-refresh-loading cursor-not-allowed opacity-80"
          : "cursor-pointer",
        className,
      )}
    >
      <AppIcon name="refresh" className="h-4 w-4" strokeWidth={2} />
      Refresh
    </button>
  );
}
