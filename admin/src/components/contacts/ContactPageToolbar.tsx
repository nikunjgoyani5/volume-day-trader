import SelectDropdown from "@/components/ui/select-dropdown";
import AppIcon from "@/components/ui/app-icon";
import RefreshButton from "@/components/ui/refresh-button";
import type { InquiryDateFilter, InquiryStatusFilter } from "@/types/contact.types";

const DATE_FILTER_OPTIONS: { value: InquiryDateFilter; label: string }[] = [
  { value: "all", label: "All time" },
  { value: "today", label: "Today" },
  { value: "week", label: "Last 7 days" },
];

const STATUS_FILTER_OPTIONS: { value: InquiryStatusFilter; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "open", label: "Open" },
  { value: "responded", label: "Responded" },
  { value: "resolved", label: "Resolved" },
];

type ContactPageToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  dateFilter: InquiryDateFilter;
  onFilterChange: (value: InquiryDateFilter) => void;
  statusFilter: InquiryStatusFilter;
  onStatusFilterChange: (value: InquiryStatusFilter) => void;
  onExport: () => void;
  onRefresh: () => void;
  refreshing?: boolean;
};

export default function ContactPageToolbar({
  search,
  onSearchChange,
  dateFilter,
  onFilterChange,
  statusFilter,
  onStatusFilterChange,
  onExport,
  onRefresh,
  refreshing = false,
}: ContactPageToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
      <div className="relative w-full sm:max-w-xs">
        <AppIcon
          name="search"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-text"
          strokeWidth={2}
        />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, email, ticket..."
          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-secondary-text/70 outline-none transition-colors focus:border-white/20 focus:ring-2 focus:ring-white/10"
        />
      </div>

      <div className="flex gap-2">
        <SelectDropdown
          value={statusFilter}
          options={STATUS_FILTER_OPTIONS}
          onChange={onStatusFilterChange}
          ariaLabel="Filter inquiries by status"
          className="min-w-[9.5rem]"
        />

        <SelectDropdown
          value={dateFilter}
          options={DATE_FILTER_OPTIONS}
          onChange={onFilterChange}
          ariaLabel="Filter inquiries by date"
          className="min-w-[9.5rem]"
        />

        <RefreshButton refreshing={refreshing} onClick={onRefresh} />

        <button
          type="button"
          onClick={onExport}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-white/15 hover:bg-white/[0.05]"
        >
          <AppIcon name="download" className="h-4 w-4" strokeWidth={2} />
          Export
        </button>
      </div>
    </div>
  );
}
