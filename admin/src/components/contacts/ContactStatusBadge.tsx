import type { InquiryStatus } from "@/types/contact.types";
import { INQUIRY_STATUS_LABELS } from "@/utils/inquiryStatus.utils";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<
  InquiryStatus,
  { className: string; dot: string }
> = {
  open: {
    className:
      "bg-[rgba(245,158,11,0.12)] text-[#f59e0b] border-[rgba(245,158,11,0.25)]",
    dot: "🟡",
  },
  responded: {
    className:
      "bg-[rgba(56,189,248,0.12)] text-[#38bdf8] border-[rgba(56,189,248,0.25)]",
    dot: "🔵",
  },
  resolved: {
    className:
      "bg-[rgba(34,197,94,0.12)] text-[#22c55e] border-[rgba(34,197,94,0.25)]",
    dot: "🟢",
  },
};

type ContactStatusBadgeProps = {
  status: InquiryStatus;
  className?: string;
};

export default function ContactStatusBadge({
  status,
  className,
}: ContactStatusBadgeProps) {
  const style = STATUS_STYLES[status];

  return (
    <span
      className={cn(
        "inline-flex h-7 min-w-[96px] items-center justify-center gap-1.5 rounded-full border px-2.5 text-xs font-semibold",
        style.className,
        className,
      )}
    >
      <span aria-hidden className="text-xs leading-none">
        {style.dot}
      </span>
      {INQUIRY_STATUS_LABELS[status]}
    </span>
  );
}
