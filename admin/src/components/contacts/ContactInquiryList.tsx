import { cn } from "@/lib/utils";
import type { ContactSubmission } from "@/types/contact.types";
import {
  formatSubmittedDate,
  getInquiryName,
  getInitials,
  getMessagePreview,
} from "@/utils/contact.utils";

import ContactStatusBadge from "./ContactStatusBadge";
import ContactTicketBadge from "./ContactTicketBadge";

type ContactInquiryListProps = {
  submissions: ContactSubmission[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export default function ContactInquiryList({
  submissions,
  selectedId,
  onSelect,
}: ContactInquiryListProps) {
  if (submissions.length === 0) {
    return null;
  }

  return (
    <ul className="space-y-2.5 p-3 sm:p-4">
      {submissions.map((item) => {
        const isSelected = item.id === selectedId;
        const name = getInquiryName(item);

        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelect(item.id)}
              className={cn(
                "group relative flex w-full cursor-pointer gap-0 overflow-hidden rounded-2xl border text-left transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-px",
                isSelected
                  ? "border-tab-active/35 bg-gradient-to-br from-tab-active/[0.1] via-white/[0.03] to-transparent shadow-[0_0_20px_rgb(237_31_36/0.1)]"
                  : "border-card-border bg-gradient-to-br from-white/[0.03] to-transparent hover:border-white/[0.14] hover:shadow-[0_8px_24px_rgb(0_0_0/0.22)]",
              )}
            >
              <div
                className={cn(
                  "w-1 shrink-0 self-stretch transition-colors",
                  isSelected
                    ? "bg-tab-active"
                    : "bg-sky-500/40 group-hover:bg-sky-400/70",
                )}
                aria-hidden
              />

              <div className="min-w-0 flex-1 px-3.5 py-3.5 sm:px-4">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ring-1 transition-colors",
                      isSelected
                        ? "bg-tab-active/15 text-tab-active ring-tab-active/30"
                        : "bg-white/[0.06] text-feature-text ring-white/[0.08] group-hover:bg-white/[0.08] group-hover:text-white group-hover:ring-white/15",
                    )}
                  >
                    {getInitials(name)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-white">{name}</p>
                      <span className="shrink-0 text-xs font-medium text-muted-text">
                        {formatSubmittedDate(item.createdAt)}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-secondary-text">{item.email}</p>
                    <p className="mt-2 line-clamp-1 text-xs leading-relaxed text-muted-text">
                      {getMessagePreview(item.message)}
                    </p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      <ContactTicketBadge ticketNumber={item.ticketNumber} />
                      <ContactStatusBadge status={item.status} className="min-w-0 px-2" />
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
