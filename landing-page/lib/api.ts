export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:5000/api";

export function getApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalizedPath}`;
}

export type SubmitInquiryPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

export type SubmitInquiryResponse = {
  message: string;
  ticketNumber: string;
  inquiry: {
    id: string;
    ticketNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
  };
};

export async function submitInquiry(
  payload: SubmitInquiryPayload
): Promise<SubmitInquiryResponse> {
  const res = await fetch(getApiUrl("/inquiries"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      typeof data.error === "string" ? data.error : "Failed to submit inquiry"
    );
  }

  return data as SubmitInquiryResponse;
}
