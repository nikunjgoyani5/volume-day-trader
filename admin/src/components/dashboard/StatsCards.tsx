import AppIcon, { type AppIconName } from "@/components/ui/app-icon";
import { cn } from "@/lib/utils";

import {
  resolveStatCardVariant,
  STAT_CARD_VARIANT_STYLES,
  type StatCardVariant,
} from "./statCardVariants";

export type StatCardItem = {
  label: string;
  value: string | number;
  icon: AppIconName;
  hint?: string;
  variant?: StatCardVariant;
};

type StatsCardsProps = {
  stats: StatCardItem[];
  columns?: 2 | 4;
  className?: string;
};

export default function StatsCards({
  stats,
  columns = 4,
  className,
}: StatsCardsProps) {
  return (
    <div
      className={cn(
        "grid gap-4",
        columns === 2 ? "grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-4",
        className,
      )}
    >
      {stats.map((stat, index) => {
        const variant = resolveStatCardVariant(stat.variant, index);
        const styles = STAT_CARD_VARIANT_STYLES[variant];

        return (
          <div
            key={stat.label}
            className={cn(
              "flex min-h-[7.25rem] flex-col justify-between rounded-2xl border p-5 transition-[border-color,box-shadow] duration-200 hover:shadow-[0_8px_28px_rgb(0_0_0/0.22)]",
              styles.card,
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary-text">
                {stat.label}
              </p>
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1",
                  styles.iconWrap,
                )}
              >
                <AppIcon name={stat.icon} className="h-4 w-4" strokeWidth={1.75} />
              </div>
            </div>
            <div>
              <p className={cn("text-3xl font-bold leading-none", styles.value)}>
                {stat.value}
              </p>
              {stat.hint && (
                <p className="mt-2 text-xs font-medium text-secondary-text">{stat.hint}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
