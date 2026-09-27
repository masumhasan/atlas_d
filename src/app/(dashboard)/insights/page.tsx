"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Eye, Pencil, Trash2, BarChart3 } from "lucide-react";
import { ConfirmModal } from "@/src/components/ui/ConfirmModal";
import { InsightRowSkeleton } from "@/src/components/insights/InsightRowSkeleton";
import { Insight } from "@/src/lib/insights-data";
import { fetchInsightsFromApi, deleteInsightInApi } from "@/src/lib/insights-api";
import { useToast } from "@/src/components/ToastProvider";

const PAGE_SIZE = 6;

export default function InsightsPage() {
  const router = useRouter();
  const { success, error } = useToast();

  const [items, setItems] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [deleteItem, setDeleteItem] = useState<Insight | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await fetchInsightsFromApi();
      setItems(res.insights);
    } catch (err: any) {
      error(err.message || "Failed to load insights from backend");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "All" || item.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [items, search, status]);

  // useEffect(() => {
  //   setPage(1);
  // }, [search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-atlas-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-atlas-gold">
            Content Management
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl">Insights</h1>
          <p className="mt-1.5 text-sm text-atlas-textMuted">
            Create and manage LMCS insights and publications.
          </p>
        </div>

        <button
          onClick={() => router.push("/insights/create")}
          className="flex items-center justify-center gap-2 rounded-lg bg-atlas-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-atlas-bg"
        >
          <Plus className="size-4" />
          Create Insight
        </button>
      </div>

      <div className="rounded-xl border border-atlas-border bg-atlas-surface">
        <div className="flex flex-col gap-3 border-b border-atlas-border p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-atlas-textPlaceholder" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search insights..."
              className="w-full rounded-lg border border-atlas-border bg-atlas-bg py-2.5 pl-9 pr-4 text-sm outline-none focus:border-atlas-gold"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-atlas-border bg-atlas-bg px-3 py-2.5 text-sm outline-none focus:border-atlas-gold"
          >
            <option>All</option>
            <option>Published</option>
            <option>Draft</option>
          </select>
        </div>

        <div className="divide-y divide-atlas-border">
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <InsightRowSkeleton key={i} />
            ))}

          {!isLoading &&
            paginated.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 p-5 transition-colors hover:bg-atlas-bg sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <button
                  onClick={() => router.push(`/insights/${item.id}`)}
                  className="flex min-w-0 items-start gap-4 text-left"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-atlas-gold/10 text-atlas-gold">
                    <BarChart3 className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold hover:text-atlas-gold">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs text-atlas-textMuted">
                      {item.category} · {item.updatedAt}
                    </p>
                    <p className="mt-2 line-clamp-1 text-xs text-atlas-textMuted">
                      {item.excerpt}
                    </p>
                  </div>
                </button>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      item.status === "Published"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {item.status}
                  </span>

                  <div className="flex gap-1">
                    <button
                      onClick={() => router.push(`/insights/${item.id}`)}
                      className="rounded-lg p-2 text-atlas-textMuted hover:bg-atlas-gold/10 hover:text-atlas-gold"
                    >
                      <Eye className="size-4" />
                    </button>
                    <button
                      onClick={() =>
                        router.push(`/insights/${item.id}?mode=edit`)
                      }
                      className="rounded-lg p-2 text-atlas-textMuted hover:bg-atlas-gold/10 hover:text-atlas-gold"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      onClick={() => setDeleteItem(item)}
                      className="rounded-lg p-2 text-atlas-textMuted hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {!isLoading && !filtered.length && (
          <div className="px-6 py-16 text-center">
            <p className="text-sm font-semibold">No insights found</p>
            <p className="mt-1 text-xs text-atlas-textMuted">
              Try changing your search or filters.
            </p>
          </div>
        )}

        {!isLoading && filtered.length > 0 && (
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        )}
      </div>

      <ConfirmModal
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={async () => {
          if (deleteItem) {
            try {
              const token = localStorage.getItem("atlas_admin_token");
              await deleteInsightInApi(deleteItem.id, token);
              setItems((prev) => prev.filter((item) => item.id !== deleteItem.id));
              success("Insight deleted successfully.");
            } catch (err: any) {
              error(err.message || "Failed to delete insight");
            }
          }
          setDeleteItem(null);
        }}
        title="Delete Insight?"
        description={`"${deleteItem?.title}" will be permanently deleted.`}
        confirmText="Delete Insight"
      />
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between border-t border-atlas-border px-4 py-4 sm:px-6">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="rounded-lg border border-atlas-border px-3 py-1.5 text-xs font-semibold text-atlas-text disabled:opacity-40"
      >
        Previous
      </button>

      <div className="flex items-center gap-1">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`size-8 rounded-lg text-xs font-bold ${
              p === page
                ? "bg-atlas-gold text-atlas-bg"
                : "text-atlas-textMuted hover:bg-atlas-bg"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="rounded-lg border border-atlas-border px-3 py-1.5 text-xs font-semibold text-atlas-text disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
