import { INQUIRY_API_PREFIX } from "@/api/config";
import { apiRequest } from "@/api/http.client";
import type { InquiryStatus } from "@/types/contact.types";

export { ApiError as InquiryApiError } from "@/api/http.client";

export type ApiInquiry = {
  _id?: string;
  id?: string;
  ticketNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
  status?: InquiryStatus;
  respondedAt?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

type ListInquiriesResponse = {
  count: number;
  inquiries: ApiInquiry[];
};

export const inquiryApi = {
  listInquiries(token: string) {
    return apiRequest<ListInquiriesResponse>(INQUIRY_API_PREFIX, { token });
  },

  updateInquiryStatus(token: string, id: string, status: InquiryStatus) {
    return apiRequest<ApiInquiry>(`${INQUIRY_API_PREFIX}/${id}/status`, {
      method: "PATCH",
      body: { status },
      token,
    });
  },
};
