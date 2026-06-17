import AppIcon, { type AppIconName } from "@/components/ui/app-icon";
import { cn } from "@/lib/utils";

import {
  resolveStatCardVariant,
  STAT_CARD_VARIANT_STYLES,
  type StatCardVariant,
} from "./statCardVariants";

export type MessageStatItem = {
  label: string;
  value: string | number;
  icon: AppIconName;
  variant?: StatCardVariant;
};

type MessageSummaryCardsProps = {
  stats: MessageStatItem[];
};

export default function MessageSummaryCards({ stats }: MessageSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, index) => {
        const variant = resolveStatCardVariant(stat.variant, index);
        const styles = STAT_CARD_VARIANT_STYLES[variant];

        return (
          <div
            key={stat.label}
            className={`flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-3 ring-1 ring-inset ring-white/[0.04]`}
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${styles.iconWrap}`}
            >
              <AppIcon name={stat.icon} className="h-4 w-4" strokeWidth={1.75} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold uppercase tracking-wide text-muted-text">
                {stat.label}
              </p>
              <p className={cn("mt-0.5 text-xl font-bold leading-none", styles.value)}>
                {stat.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
