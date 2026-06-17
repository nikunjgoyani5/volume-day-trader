import type { ReactNode } from "react";

import AppIcon from "@/components/ui/app-icon";
import { cn } from "@/lib/utils";
import type { ContactSubmission, InquiryStatus } from "@/types/contact.types";
import {
  formatSubmittedDateTime,
  getInquiryName,
  getInitials,
} from "@/utils/contact.utils";

import ContactStatusActions from "./ContactStatusActions";
import ContactStatusBadge from "./ContactStatusBadge";
import ContactTicketBadge from "./ContactTicketBadge";

type ContactDetailsPanelProps = {
  submission: ContactSubmission;
  onClose?: () => void;
  showClose?: boolean;
  updatingStatus?: boolean;
  onStatusChange?: (status: InquiryStatus) => void;
};

function DetailTile({
  icon,
  label,
  children,
}: {
  icon: "mail" | "phone" | "calendar";
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-transparent p-3.5">
      <div className="flex items-center gap-2 text-muted-text">
        <AppIcon name={icon} className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <div className="mt-2 text-sm leading-snug text-white">{children}</div>
    </div>
  );
}

export default function ContactDetailsPanel({
  submission,
  onClose,
  showClose = false,
  updatingStatus = false,
  onStatusChange,
}: ContactDetailsPanelProps) {
  const name = getInquiryName(submission);
  const [datePart, timePart] = formatSubmittedDateTime(submission.createdAt).split("\n");

  return (
    <div className="contact-details-enter flex h-full flex-col bg-gradient-to-b from-white/[0.02] to-transparent">
      {showClose && onClose && (
        <div className="flex shrink-0 items-center justify-between border-b border-white/[0.08] px-4 py-3 lg:hidden">
          <h3 className="font-semibold text-white">Inquiry details</h3>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-2 text-secondary-text hover:bg-white/5 hover:text-white"
            aria-label="Close details"
          >
            <AppIcon name="x" className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
      )}

      <div className="shrink-0 border-b border-tab-active/10 bg-gradient-to-br from-tab-active/[0.08] via-transparent to-transparent px-5 py-5 sm:px-6">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-tab-active/15 text-lg font-bold text-tab-active ring-1 ring-tab-active/25">
            {getInitials(name)}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">{name}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <ContactTicketBadge ticketNumber={submission.ticketNumber} />
              <ContactStatusBadge status={submission.status} />
            </div>
          </div>
        </div>
      </div>

      <div className="shrink-0 px-5 py-4 sm:px-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <DetailTile icon="mail" label="Email">
            <a
              href={`mailto:${submission.email}`}
              className="block cursor-pointer break-all text-feature-text no-underline transition-colors hover:text-white hover:underline"
            >
              {submission.email}
            </a>
          </DetailTile>

          <DetailTile icon="phone" label="Phone">
            {submission.phone ? (
              <a
                href={`tel:${submission.phone.replace(/\s/g, "")}`}
                className="block cursor-pointer break-all text-feature-text no-underline transition-colors hover:text-white"
              >
                {submission.phone}
              </a>
            ) : (
              <span className="text-muted-text">Not provided</span>
            )}
          </DetailTile>

          <DetailTile icon="calendar" label="Submitted">
            <p className="text-sm">{datePart}</p>
            <p className="mt-0.5 text-xs text-secondary-text">{timePart}</p>
          </DetailTile>
        </div>
      </div>

      <section className="flex min-h-0 flex-1 flex-col px-5 pb-4 sm:px-6">
        <div className="mb-3 flex shrink-0 items-center gap-2">
          <AppIcon name="chat" className="h-4 w-4 text-muted-text" strokeWidth={1.75} />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-text">
            Message
          </h4>
        </div>
        <div
          className={cn(
            "theme-scroll min-h-[8rem] flex-1 overflow-y-auto rounded-2xl border border-white/[0.08]",
            "bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent p-5",
            "shadow-[inset_0_1px_0_rgb(255_255_255/0.04)]",
          )}
        >
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#e2e8f0]">
            {submission.message}
          </p>
        </div>
      </section>

      <div className="shrink-0 border-t border-white/[0.08] bg-black/20 p-4 sm:px-6">
        {onStatusChange ? (
          <div className="mb-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-text">
              Ticket status
            </p>
            <ContactStatusActions
              status={submission.status}
              updating={updatingStatus}
              onStatusChange={onStatusChange}
            />
          </div>
        ) : null}

        <a
          href={`mailto:${submission.email}?subject=Re: ${encodeURIComponent(submission.ticketNumber)}`}
          className="blog-btn-primary inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white no-underline sm:w-auto"
        >
          <AppIcon name="mail" className="h-4 w-4" strokeWidth={2} />
          Reply via Email
        </a>
      </div>
    </div>
  );
}
