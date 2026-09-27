"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Eye, Pencil, FileText } from "lucide-react";
import { ToggleSwitch } from "@/src/components/ui/ToggleSwitch";
import { EditPageModal } from "@/src/components/pages/EditPageModal";
import { ViewPageModal } from "@/src/components/pages/ViewPageModal";
import {
  PageRowSkeletonRow,
  PageCardSkeleton,
} from "@/src/components/pages/PageRowSkeleton";
import {
  PageHeader,
  StatusBadge,
  ActionButton,
  EmptyState,
} from "@/src/components/pages/PageComponents";
import {
  fetchPages,
  updatePage,
  togglePageVisibility,
  PageItem,
} from "@/src/lib/pages-data";
import { useToast } from "@/src/components/ToastProvider";

export default function PagesPage() {
  const { success, error: showError } = useToast();

  const [pages, setPages] = useState<PageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [viewPage, setViewPage] = useState<PageItem | null>(null);
  const [editPage, setEditPage] = useState<PageItem | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPages().then((res) => {
      setPages(res);
      setIsLoading(false);
    });
  }, []);

  const filteredPages = useMemo(() => {
    return pages.filter((page) => {
      const matchesSearch =
        page.title.toLowerCase().includes(search.toLowerCase()) ||
        page.slug.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "All" || page.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [pages, search, status]);

  const applyUpdate = async (
    id: string,
    updates: { title: string; slug: string; status: PageItem["status"] },
  ) => {
    const res = await updatePage(id, updates);
    if (!res.success) {
      showError("Update Failed", res.message);
      return;
    }
    setPages((curr) =>
      curr.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: "Just now" } : p,
      ),
    );
    success("Page Updated", res.message);
    setEditPage(null);
  };

  const handleQuickToggle = async (page: PageItem, nextPublished: boolean) => {
    setTogglingId(page.id);
    const nextStatus: PageItem["status"] = nextPublished ? "Published" : "Hidden";
    setPages((curr) =>
      curr.map((p) =>
        p.id === page.id ? { ...p, status: nextStatus, updatedAt: "Just now" } : p,
      ),
    );

    try {
      const res = await togglePageVisibility(page.id, nextStatus);
      if (!res.success) {
        setPages((curr) =>
          curr.map((p) => (p.id === page.id ? { ...p, status: page.status } : p)),
        );
        showError("Update Failed", res.message);
        return;
      }
      success(
        nextPublished ? "Page Published" : "Page Hidden",
        `"${page.title}" is now ${nextStatus.toLowerCase()}.`,
      );
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Pages" description="Manage page names and publishing visibility." />

      <section className="rounded-xl border border-atlas-border bg-atlas-surface">
        <div className="flex flex-col gap-3 border-b border-atlas-border p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-atlas-textPlaceholder" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pages..."
              className="w-full rounded-lg border border-atlas-border bg-atlas-bg py-2.5 pl-9 pr-4 text-sm outline-none focus:border-atlas-gold"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-atlas-border bg-atlas-bg px-3 py-2.5 text-sm text-atlas-text outline-none focus:border-atlas-gold"
          >
            <option>All</option>
            <option>Published</option>
            <option>Hidden</option>
          </select>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-180">
            <thead>
              <tr className="border-b border-atlas-border text-left">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-atlas-textMuted">Page</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-atlas-textMuted">Visibility</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-atlas-textMuted">Updated</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-atlas-textMuted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <PageRowSkeletonRow key={i} />
                ))}
              {!isLoading &&
                filteredPages.map((page) => (
                  <tr key={page.id} className="border-b border-atlas-border last:border-0 hover:bg-atlas-bg">
                    <td className="px-6 py-4">
                      <button onClick={() => setViewPage(page)} className="text-left">
                        <p className="text-sm font-semibold text-atlas-text hover:text-atlas-gold">{page.title}</p>
                        <p className="mt-1 font-mono text-xs text-atlas-textMuted">{page.slug}</p>
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <ToggleSwitch
                          checked={page.status === "Published"}
                          onChange={(next) => handleQuickToggle(page, next)}
                          disabled={togglingId === page.id}
                          label={`Toggle visibility for ${page.title}`}
                        />
                        <StatusBadge status={page.status} />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-atlas-textMuted">{page.updatedAt}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">
                        <ActionButton title="View" onClick={() => setViewPage(page)}><Eye className="size-4" /></ActionButton>
                        <ActionButton title="Edit" onClick={() => setEditPage(page)}><Pencil className="size-4" /></ActionButton>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-atlas-border md:hidden">
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <PageCardSkeleton key={i} />
            ))}
          {!isLoading &&
            filteredPages.map((page) => (
              <div key={page.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <button onClick={() => setViewPage(page)} className="flex min-w-0 items-start gap-3 text-left">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-atlas-gold/10 text-atlas-gold">
                      <FileText className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{page.title}</p>
                      <p className="mt-1 truncate font-mono text-xs text-atlas-textMuted">{page.slug}</p>
                    </div>
                  </button>
                  <StatusBadge status={page.status} />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ToggleSwitch
                      checked={page.status === "Published"}
                      onChange={(next) => handleQuickToggle(page, next)}
                      disabled={togglingId === page.id}
                      label={`Toggle visibility for ${page.title}`}
                    />
                    <span className="text-xs text-atlas-textMuted">{page.updatedAt}</span>
                  </div>
                  <div className="flex gap-1">
                    <ActionButton title="View" onClick={() => setViewPage(page)}><Eye className="size-4" /></ActionButton>
                    <ActionButton title="Edit" onClick={() => setEditPage(page)}><Pencil className="size-4" /></ActionButton>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {!isLoading && filteredPages.length === 0 && (
          <EmptyState title="No pages found" description="Try changing your search or filter." />
        )}
      </section>

      <ViewPageModal
        page={viewPage}
        onClose={() => setViewPage(null)}
        onEdit={(p) => {
          setViewPage(null);
          setEditPage(p);
        }}
      />

      <EditPageModal
        page={editPage}
        onClose={() => setEditPage(null)}
        onSave={applyUpdate}
      />
    </div>
  );
}
