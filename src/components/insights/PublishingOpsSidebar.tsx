"use client";

import { useMemo } from "react";
import { Eye, Save } from "lucide-react";
import { InsightStatus } from "@/src/lib/insights-data";

type PublishingOpsSidebarProps = {
  status: InsightStatus;
  publishDate: string;
  author?: string;
  onStatusChange: (status: InsightStatus) => void;
  onPublishDateChange: (date: string) => void;
  onCommitPublish: () => void;
  onSaveDraft: () => void;
  onPreview: () => void;
};

export function PublishingOpsSidebar({
  status,
  publishDate,
  author,
  onStatusChange,
  onPublishDateChange,
  onCommitPublish,
  onSaveDraft,
  onPreview,
}: PublishingOpsSidebarProps) {
  const state = useMemo(() => {
    if (status === "Published") return { label: "Published", tone: "text-green-400" };
    if (publishDate) return { label: `Scheduled · ${publishDate}`, tone: "text-atlas-gold" };
    return { label: "Not yet published", tone: "text-atlas-textMuted" };
  }, [status, publishDate]);

  return (
    <div className="sticky top-6 space-y-5 rounded-xl border border-atlas-border bg-atlas-surface p-6">
      <h2 className="font-serif text-xl text-atlas-text">Publishing Ops</h2>

      <div>
        <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
          Document Status
        </label>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as InsightStatus)}
          className="w-full rounded-lg border border-atlas-border bg-atlas-bg px-3 py-2.5 text-sm text-atlas-text outline-none focus:border-atlas-gold"
        >
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
          Target Publication Date
        </label>
        <input
          type="text"
          value={publishDate}
          onChange={(e) => onPublishDateChange(e.target.value)}
          placeholder="e.g. Sep 15, 2024 or 2024-09-15"
          className="w-full rounded-lg border border-atlas-border bg-atlas-bg px-3 py-2.5 text-sm text-atlas-text outline-none focus:border-atlas-gold"
        />
      </div>

      <div className="space-y-2 border-t border-atlas-border pt-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-atlas-textMuted">State:</span>
          <span className={`font-semibold ${state.tone}`}>{state.label}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-atlas-textMuted">Author:</span>
          <span className="font-semibold text-atlas-text">{author || "Atlas Admin"}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onCommitPublish}
        className="w-full rounded-lg bg-atlas-gold py-3 text-xs font-bold uppercase tracking-wider text-atlas-bg hover:brightness-105"
      >
        Commit Publish
      </button>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onPreview}
          className="flex items-center justify-center gap-2 rounded-lg border border-atlas-border py-2.5 text-xs font-bold uppercase tracking-wider text-atlas-text hover:bg-atlas-bg"
        >
          <Eye className="size-3.5" />
          Preview
        </button>
        <button
          type="button"
          onClick={onSaveDraft}
          className="flex items-center justify-center gap-2 rounded-lg border border-atlas-border py-2.5 text-xs font-bold uppercase tracking-wider text-atlas-text hover:bg-atlas-bg"
        >
          <Save className="size-3.5" />
          Save Draft
        </button>
      </div>
    </div>
  );
}
