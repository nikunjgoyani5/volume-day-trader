import type { InquiryStatus } from "@/types/contact.types";

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  open: "Open",
  responded: "Responded",
  resolved: "Resolved",
};

export function normalizeInquiryStatus(
  value: string | undefined | null,
): InquiryStatus {
  if (value === "responded" || value === "resolved") {
    return value;
  }
  return "open";
}
