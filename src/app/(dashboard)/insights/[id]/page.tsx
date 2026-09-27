"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { InsightEditor } from "@/src/components/insights/InsightEditor";
import { ConfirmModal } from "@/src/components/ui/ConfirmModal";
import { Insight } from "@/src/lib/insights-data";
import { fetchInsightByIdFromApi, updateInsightInApi, deleteInsightInApi } from "@/src/lib/insights-api";
import { useToast } from "@/src/components/ToastProvider";
import Image from "next/image";

export default function InsightDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { success, error } = useToast();

  const [insight, setInsight] = useState<Insight | null | undefined>(undefined);
  const [mode, setMode] = useState<"view" | "edit">(
    searchParams.get("mode") === "edit" ? "edit" : "view",
  );
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetchInsightByIdFromApi(params.id)
      .then((data) => {
        if (isMounted) setInsight(data);
      })
      .catch((err) => {
        console.error("Failed to load insight:", err);
        if (isMounted) setInsight(null);
      });
    return () => {
      isMounted = false;
    };
  }, [params.id]);

  if (insight === undefined) return <DetailSkeleton />;

  if (insight === null) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center">
        <p className="text-lg font-semibold">Insight not found</p>
        <p className="mt-2 text-sm text-atlas-textMuted">
          This insight may have been deleted or the link is incorrect.
        </p>
        <button
          onClick={() => router.push("/insights")}
          className="mt-6 rounded-lg bg-atlas-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-atlas-bg"
        >
          Back to Insights
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <button
        onClick={() => router.push("/insights")}
        className="flex items-center gap-2 text-sm text-atlas-textMuted hover:text-atlas-text"
      >
        <ArrowLeft className="size-4" />
        Back to Insights
      </button>

      <div className="flex flex-col gap-4 border-b border-atlas-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-atlas-gold">
            Insights &gt; {mode === "edit" ? "Edit Insight" : "View Insight"}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl">{insight.title}</h1>
        </div>

        {mode === "view" && (
          <div className="flex gap-2">
            <button
              onClick={() => setMode("edit")}
              className="flex items-center gap-2 rounded-lg bg-atlas-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-atlas-bg"
            >
              <Pencil className="size-4" />
              Edit Insight
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-2 rounded-lg border border-atlas-border px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-red-400"
            >
              <Trash2 className="size-4" />
              Delete
            </button>
          </div>
        )}
      </div>

      {mode === "edit" ? (
        <InsightEditor
          mode="edit"
          initialData={insight}
          onCancel={() => setMode("view")}
          onSaved={async (updated, action) => {
            try {
              const token = localStorage.getItem("atlas_admin_token");
              const saved = await updateInsightInApi(params.id, updated, token);
              setInsight(saved);
              setMode("view");
              success(action === "publish" ? "Insight published to website." : "Draft saved successfully.");
            } catch (err: any) {
              error(err.message || "Failed to update insight");
            }
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-atlas-gold/10 px-3 py-1 text-xs text-atlas-gold">
                {insight.category}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  insight.status === "Published"
                    ? "bg-green-500/10 text-green-400"
                    : "bg-amber-500/10 text-amber-400"
                }`}
              >
                {insight.status}
              </span>
            </div>

            {insight.featuredAsset && (
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-atlas-border">
                <Image
                  src={insight.featuredAsset}
                  alt={insight.title}
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                />
              </div>
            )}

            {insight.excerpt && (
              <p className="text-sm italic leading-7 text-atlas-textMuted">
                {insight.excerpt}
              </p>
            )}

            <p className="whitespace-pre-wrap text-sm leading-7 text-atlas-text">
              {insight.content ||
                "No content has been written for this insight yet."}
            </p>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4 rounded-xl border border-atlas-border bg-atlas-surface p-6 text-sm">
              <h2 className="font-serif text-xl text-atlas-text">
                Publishing Ops
              </h2>
              <div className="flex items-center justify-between border-t border-atlas-border pt-4">
                <span className="text-atlas-textMuted">Status:</span>
                <span className="font-semibold text-atlas-text">
                  {insight.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-atlas-textMuted">
                  Target Publication:
                </span>
                <span className="font-semibold text-atlas-text">
                  {insight.publishDate ?? "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-atlas-textMuted">Author:</span>
                <span className="font-semibold text-atlas-text">
                  {insight.author}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-atlas-textMuted">Last Updated:</span>
                <span className="font-semibold text-atlas-text">
                  {insight.updatedAt}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={async () => {
          try {
            const token = localStorage.getItem("atlas_admin_token");
            await deleteInsightInApi(params.id, token);
            success("Insight deleted successfully.");
            router.push("/insights");
          } catch (err: any) {
            error(err.message || "Failed to delete insight");
          }
        }}
        title="Delete Insight?"
        description={`"${insight.title}" will be permanently deleted.`}
        confirmText="Delete Insight"
      />
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="h-4 w-32 animate-pulse rounded bg-atlas-border" />
      <div className="h-10 w-96 animate-pulse rounded bg-atlas-border" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="h-64 w-full animate-pulse rounded-xl bg-atlas-border" />
          <div className="h-4 w-full animate-pulse rounded bg-atlas-border" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-atlas-border" />
        </div>
        <div className="h-64 w-full animate-pulse rounded-xl bg-atlas-border lg:col-span-1" />
      </div>
    </div>
  );
}
