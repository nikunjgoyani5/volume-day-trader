import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { ApiError } from "@/api/http.client";
import PageHeader from "@/components/dashboard/PageHeader";
import ContactDetailsPanel from "@/components/contacts/ContactDetailsPanel";
import ContactEmptyState from "@/components/contacts/ContactEmptyState";
import ContactInquiryList from "@/components/contacts/ContactInquiryList";
import ContactPageToolbar from "@/components/contacts/ContactPageToolbar";
import StatsCards from "@/components/dashboard/StatsCards";
import AppIcon from "@/components/ui/app-icon";
import { inquiryService } from "@/services/inquiry.service";
import type { ContactSubmission, InquiryDateFilter, InquiryStatus, InquiryStatusFilter } from "@/types/contact.types";
import {
  computeContactStats,
  filterSubmissions,
} from "@/utils/contact.utils";

const INQUIRY_POLL_INTERVAL_MS = 30_000;

type LoadOptions = {
  silent?: boolean;
};

export default function ContactSubmissionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const inquiryFromUrl = searchParams.get("inquiry");

  const [inquiries, setInquiries] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<InquiryDateFilter>("all");
  const [statusFilter, setStatusFilter] = useState<InquiryStatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(inquiryFromUrl);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const loadInquiries = useCallback(async (options: LoadOptions = {}) => {
    const { silent = false } = options;

    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
      setError(null);
    }

    try {
      const data = await inquiryService.listInquiries();
      setInquiries(data);
      setError(null);
      setSelectedId((current) => {
        const urlId = new URLSearchParams(window.location.search).get("inquiry");
        if (urlId && data.some((item) => item.id === urlId)) {
          return urlId;
        }
        if (current && data.some((item) => item.id === current)) {
          return current;
        }
        return data[0]?.id ?? null;
      });
    } catch (err) {
      if (!silent) {
        const message =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Failed to load inquiries";
        setError(message);
        setInquiries([]);
        setSelectedId(null);
      }
    } finally {
      if (silent) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void loadInquiries();
  }, [loadInquiries]);

  useEffect(() => {
    if (!inquiryFromUrl) return;
    setSelectedId(inquiryFromUrl);
    if (window.matchMedia("(max-width: 1023px)").matches) {
      setMobileDrawerOpen(true);
    }
  }, [inquiryFromUrl]);

  useEffect(() => {
    const poll = () => {
      if (document.visibilityState === "visible") {
        void loadInquiries({ silent: true });
      }
    };

    const intervalId = window.setInterval(poll, INQUIRY_POLL_INTERVAL_MS);
    const onFocus = () => void loadInquiries({ silent: true });

    window.addEventListener("focus", onFocus);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
    };
  }, [loadInquiries]);

  const filtered = useMemo(
    () => filterSubmissions(inquiries, search, dateFilter, statusFilter),
    [inquiries, search, dateFilter, statusFilter],
  );

  const stats = useMemo(() => computeContactStats(inquiries), [inquiries]);

  const selected = useMemo(() => {
    if (selectedId) {
      const match = inquiries.find((item) => item.id === selectedId);
      if (match) return match;
    }
    return filtered[0] ?? null;
  }, [inquiries, filtered, selectedId]);

  const statCards = [
    { label: "Total Inquiries", value: stats.total, icon: "chat" as const },
    { label: "Open", value: stats.open, icon: "mail" as const },
    { label: "Responded", value: stats.responded, icon: "check-circle" as const },
    { label: "Resolved", value: stats.resolved, icon: "check" as const },
  ];

  const handleStatusChange = async (status: InquiryStatus) => {
    if (!selected) return;

    setUpdatingStatus(true);
    try {
      const updated = await inquiryService.updateInquiryStatus(selected.id, status);
      setInquiries((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to update inquiry status";
      setError(message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setSearchParams({ inquiry: id }, { replace: true });
    setMobileDrawerOpen(true);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contact-inquiries.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const pageHeader = (
    <PageHeader
      title="Contact Inquiries"
      description="Review and manage user inquiries."
    />
  );

  const toolbar = (
    <ContactPageToolbar
      search={search}
      onSearchChange={setSearch}
      dateFilter={dateFilter}
      onFilterChange={setDateFilter}
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
      onExport={handleExport}
      onRefresh={() => void loadInquiries({ silent: true })}
      refreshing={refreshing}
    />
  );

  if (loading && inquiries.length === 0) {
    return (
      <div className="space-y-6">
        {pageHeader}
        {toolbar}
        <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-3 text-sm text-secondary-text">
            <svg
              className="h-5 w-5 animate-spin text-secondary-text"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading inquiries...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        {pageHeader}
        {toolbar}
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <p className="text-sm text-red-300">{error}</p>
          <button
            type="button"
            onClick={() => void loadInquiries()}
            className="mt-4 cursor-pointer rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-white/20 hover:bg-white/[0.08]"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (inquiries.length === 0) {
    return (
      <div className="space-y-6">
        {pageHeader}
        {toolbar}
        <ContactEmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {pageHeader}
      {toolbar}

      <StatsCards stats={statCards} />

      <div className="grid min-h-[560px] gap-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] shadow-[0_8px_40px_rgb(0_0_0/0.25)] backdrop-blur-sm lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
        <div className="flex max-h-[70vh] flex-col border-b border-white/[0.08] lg:max-h-[calc(100vh-16rem)] lg:border-b-0 lg:border-r">
          <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-4 py-3.5">
            <div>
              <p className="text-sm font-semibold text-white">Inbox</p>
              <p className="text-xs text-muted-text">
                {filtered.length} {filtered.length === 1 ? "message" : "messages"}
              </p>
            </div>
            {selected && (
              <span className="hidden rounded-lg border border-white/[0.1] bg-white/[0.04] px-2 py-1 text-xs font-semibold uppercase tracking-wide text-secondary-text sm:inline">
                Viewing
              </span>
            )}
          </div>

          <div className="theme-scroll min-h-0 flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-muted-text">
                  <AppIcon name="search" className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <p className="mt-4 text-sm text-secondary-text">No inquiries match your search or filter.</p>
              </div>
            ) : (
              <ContactInquiryList
                submissions={filtered}
                selectedId={selected?.id ?? null}
                onSelect={handleSelect}
              />
            )}
          </div>
        </div>

        <div className="hidden min-h-[440px] lg:block">
          {selected ? (
            <ContactDetailsPanel
              submission={selected}
              updatingStatus={updatingStatus}
              onStatusChange={handleStatusChange}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-8 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-muted-text">
                <AppIcon name="mail" className="h-7 w-7" strokeWidth={1.5} />
              </div>
              <p className="mt-4 text-sm font-medium text-white">Select a message</p>
              <p className="mt-1 max-w-xs text-xs text-muted-text">
                Choose an inquiry from the inbox to read the full message and contact details.
              </p>
            </div>
          )}
        </div>
      </div>

      {mobileDrawerOpen && selected && (
        <>
          <button
            type="button"
            aria-label="Close details"
            className="fixed inset-0 z-40 cursor-pointer bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="contact-drawer-enter fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-white/[0.08] bg-[#050505] shadow-[-8px_0_40px_rgba(0,0,0,0.5)] lg:hidden">
            <ContactDetailsPanel
              submission={selected}
              onClose={() => setMobileDrawerOpen(false)}
              showClose
              updatingStatus={updatingStatus}
              onStatusChange={handleStatusChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
