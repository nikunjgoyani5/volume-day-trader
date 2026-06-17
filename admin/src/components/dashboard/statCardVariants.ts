export type StatCardVariant = "sky" | "amber" | "emerald" | "violet";

export const STAT_CARD_VARIANT_ORDER: StatCardVariant[] = [
  "sky",
  "amber",
  "emerald",
  "violet",
];

export const STAT_CARD_VARIANT_STYLES: Record<
  StatCardVariant,
  { card: string; iconWrap: string; value: string }
> = {
  sky: {
    card: "border-sky-500/25 bg-gradient-to-br from-sky-500/[0.12] via-white/[0.02] to-transparent hover:border-sky-500/40",
    iconWrap: "bg-sky-500/15 text-sky-300 ring-sky-500/25",
    value: "text-sky-100",
  },
  amber: {
    card: "border-amber-500/25 bg-gradient-to-br from-amber-500/[0.12] via-white/[0.02] to-transparent hover:border-amber-500/40",
    iconWrap: "bg-amber-500/15 text-amber-300 ring-amber-500/25",
    value: "text-amber-100",
  },
  emerald: {
    card: "border-emerald-500/25 bg-gradient-to-br from-emerald-500/[0.12] via-white/[0.02] to-transparent hover:border-emerald-500/40",
    iconWrap: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/25",
    value: "text-emerald-100",
  },
  violet: {
    card: "border-violet-500/25 bg-gradient-to-br from-violet-500/[0.12] via-white/[0.02] to-transparent hover:border-violet-500/40",
    iconWrap: "bg-violet-500/15 text-violet-300 ring-violet-500/25",
    value: "text-violet-100",
  },
};

export function resolveStatCardVariant(
  variant: StatCardVariant | undefined,
  index: number,
): StatCardVariant {
  return variant ?? STAT_CARD_VARIANT_ORDER[index % STAT_CARD_VARIANT_ORDER.length];
}
