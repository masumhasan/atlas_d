"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Eye, Inbox, Sparkles } from "lucide-react";
import { InquiryRowSkeleton } from "@/src/components/inquiries/InquiryRowSkeleton";
import { InquiryDetailModal } from "@/src/components/inquiries/InquiryDetailModal";
import { InquiryPagination } from "@/src/components/inquiries/InquiryPagination";
import {
  fetchInquiries,
  updateInquiryStatus,
  Inquiry,
  InquiryStatus,
} from "@/src/lib/inquiries-data";
import { useToast } from "@/src/components/ToastProvider";

const PAGE_SIZE = 6;

export default function InquiriesPage() {
  const { success, error: showError } = useToast();

  const [items, setItems] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    try {
      const data = await fetchInquiries();
      setItems(data);
    } catch (err) {
      console.warn("[Inquiries Page] Load error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const query = search.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        (item.inquiryType && item.inquiryType.toLowerCase().includes(query)) ||
        (item.project && item.project.toLowerCase().includes(query)) ||
        (item.organization && item.organization.toLowerCase().includes(query)) ||
        (item.message && item.message.toLowerCase().includes(query));
      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const counts = useMemo(
    () => ({
      New: items.filter((i) => i.status === "New").length,
      Read: items.filter((i) => i.status === "Read").length,
      Closed: items.filter((i) => i.status === "Closed").length,
    }),
    [items]
  );

  const applyStatus = async (status: InquiryStatus) => {
    if (!selected) return;

    setActionLoading(true);
    try {
      const res = await updateInquiryStatus(selected.id, status);
      if (!res.success) {
        showError("Update Failed", res.message);
        return;
      }

      setItems((current) =>
        current.map((item) =>
          item.id === selected.id ? { ...item, status } : item
        )
      );
      setSelected((prev) => (prev ? { ...prev, status } : prev));
      success("Status Updated", res.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-atlas-border pb-6">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-atlas-gold">
          Communications
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl">Inquiries</h1>
        <p className="mt-1.5 text-sm text-atlas-textMuted">
          Review and manage incoming website inquiries.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard label="New" value={counts.New} tone="text-atlas-gold" />
        <SummaryCard label="Read" value={counts.Read} tone="text-blue-400" />
        <SummaryCard label="Closed" value={counts.Closed} tone="text-green-400" />
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-atlas-textPlaceholder" />
          <input
            type="text"
            placeholder="Search inquiries by name, type, project, or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-atlas-border bg-atlas-surface py-2.5 pl-10 pr-4 text-sm text-atlas-text outline-none placeholder:text-atlas-textPlaceholder focus:border-atlas-gold"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-atlas-border bg-atlas-surface px-4 py-2.5 text-sm text-atlas-text outline-none focus:border-atlas-gold"
        >
          <option value="All">All Inquiries</option>
          <option value="New">New</option>
          <option value="Read">Read</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* Inquiries List Table */}
      <section className="overflow-hidden rounded-xl border border-atlas-border bg-atlas-surface">
        {isLoading && (
          <div className="divide-y divide-atlas-border">
            {Array.from({ length: 4 }).map((_, i) => (
              <InquiryRowSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Inbox className="size-12 text-atlas-textPlaceholder" />
            <p className="mt-4 font-serif text-lg text-atlas-text">No Inquiries Found</p>
            <p className="mt-1 text-xs text-atlas-textMuted">
              No incoming inquiries match your current search or status filter.
            </p>
          </div>
        )}

        {!isLoading && filtered.length > 0 && (
          <div className="divide-y divide-atlas-border">
            {paginated.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelected(item)}
                className="flex cursor-pointer flex-col gap-4 p-4 transition-colors hover:bg-atlas-bg sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-atlas-gold/10 font-serif text-xs font-bold text-atlas-gold">
                    {item.name
                      .split(" ")
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-serif text-base font-medium text-atlas-text">
                        {item.name}
                      </p>
                      <StatusBadge status={item.status} />
                      <span className="flex items-center gap-1 rounded bg-atlas-gold/10 px-2 py-0.5 text-[10px] font-semibold text-atlas-gold">
                        <Sparkles className="size-2.5" />
                        {item.inquiryType}
                      </span>
                    </div>

                    <p className="mt-1 truncate text-xs text-atlas-textMuted">
                      {item.project ? `Project: ${item.project}` : item.subject || item.message}
                      {item.organization && ` • ${item.organization}`}
                    </p>

                    <p className="mt-1 truncate text-xs text-atlas-textPlaceholder">
                      {item.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <span className="text-xs text-atlas-textPlaceholder">{item.date}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(item);
                    }}
                    className="flex items-center gap-1 text-xs font-semibold text-atlas-gold hover:underline"
                  >
                    <Eye className="size-3.5" /> View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filtered.length > 0 && (
          <InquiryPagination page={page} totalPages={totalPages} onChange={setPage} />
        )}
      </section>

      {/* Inquiry Detail Modal */}
      <InquiryDetailModal
        inquiry={selected}
        onClose={() => setSelected(null)}
        onApplyStatus={applyStatus}
        actionLoading={actionLoading}
      />
    </div>
  );
}

function SummaryCard({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-xl border border-atlas-border bg-atlas-surface p-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-atlas-textMuted">
        {label}
      </p>
      <p className={`mt-1 font-serif text-2xl ${tone}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const classes: Record<string, string> = {
    New: "bg-atlas-gold/10 text-atlas-gold",
    Read: "bg-blue-500/10 text-blue-400",
    Closed: "bg-green-500/10 text-green-400",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
        classes[status] || classes.New
      }`}
    >
      {status}
    </span>
  );
}

