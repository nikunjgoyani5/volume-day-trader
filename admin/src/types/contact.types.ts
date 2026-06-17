export type InquiryStatus = "open" | "responded" | "resolved";

/** Contact inquiry as returned by GET /api/inquiries */
export type ContactSubmission = {
  id: string;
  ticketNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  status: InquiryStatus;
  respondedAt?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type InquiryDateFilter = "all" | "today" | "week";
export type InquiryStatusFilter = "all" | InquiryStatus;
