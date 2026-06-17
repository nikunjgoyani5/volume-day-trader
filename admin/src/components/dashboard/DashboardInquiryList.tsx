import { Link } from "react-router-dom";

import ContactStatusBadge from "@/components/contacts/ContactStatusBadge";
import type { ContactSubmission } from "@/types/contact.types";
import {
  formatSubmittedDate,
  getInquiryName,
  getInitials,
} from "@/utils/contact.utils";

type DashboardInquiryListProps = {
  inquiries: ContactSubmission[];
};

export default function DashboardInquiryList({
  inquiries,
}: DashboardInquiryListProps) {
  return (
    <ul className="space-y-3">
      {inquiries.map((inquiry) => {
        const name = getInquiryName(inquiry);

        return (
          <li key={inquiry.id}>
            <Link
              to={`/dashboard/contacts?inquiry=${inquiry.id}`}
              className="group relative flex cursor-pointer gap-3 overflow-hidden rounded-2xl border border-card-border bg-gradient-to-br from-white/[0.03] to-transparent no-underline transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-px hover:border-white/[0.14] hover:shadow-[0_8px_24px_rgb(0_0_0/0.25)]"
            >
              <div
                className="w-1 shrink-0 self-stretch bg-sky-500/40 transition-colors group-hover:bg-sky-400/70"
                aria-hidden
              />

              <div className="flex min-w-0 flex-1 items-center gap-3 py-3.5 pr-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-sm font-semibold text-feature-text ring-1 ring-white/[0.08] transition-colors group-hover:bg-white/[0.08] group-hover:text-white group-hover:ring-white/15">
                  {getInitials(name)}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{name}</p>
                  <p className="mt-0.5 truncate text-xs text-secondary-text">
                    {inquiry.email}
                  </p>
                  <div className="mt-2">
                    <ContactStatusBadge
                      status={inquiry.status}
                      className="min-w-0 px-2"
                    />
                  </div>
                </div>

                <span className="shrink-0 text-xs font-medium text-muted-text">
                  {formatSubmittedDate(inquiry.createdAt)}
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
