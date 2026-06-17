import { cn } from "@/lib/utils";

type ContactTicketBadgeProps = {
  ticketNumber: string;
  className?: string;
};

export default function ContactTicketBadge({
  ticketNumber,
  className,
}: ContactTicketBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 font-mono text-xs font-medium uppercase tracking-wide text-secondary-text",
        className,
      )}
    >
      {ticketNumber}
    </span>
  );
}
