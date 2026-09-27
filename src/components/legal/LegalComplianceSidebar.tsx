"use client";

import { Eye, Save, ShieldCheck } from "lucide-react";
import { LegalStatus } from "@/src/lib/legal-data";

type LegalComplianceSidebarProps = {
  status: LegalStatus;
  version: string;
  slug: string;
  effectiveDate: string;
  isSaving: boolean;
  onStatusChange: (status: LegalStatus) => void;
  onEffectiveDateChange: (date: string) => void;
  onVersionChange?: (version: string) => void;
  onCommitPublish: () => void;
  onSaveDraft: () => void;
  onPreview: () => void;
};

export function LegalComplianceSidebar({
  status,
  version,
  slug,
  effectiveDate,
  isSaving,
  onStatusChange,
  onEffectiveDateChange,
  onCommitPublish,
  onSaveDraft,
  onPreview,
}: LegalComplianceSidebarProps) {
  return (
    <div className="sticky top-6 space-y-5 rounded-xl border border-atlas-border bg-atlas-surface p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <ShieldCheck className="size-5 text-atlas-gold" />
        <h2 className="font-serif text-xl text-atlas-text">Compliance Ops</h2>
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
          Document Status
        </label>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as LegalStatus)}
          className="w-full rounded-lg border border-atlas-border bg-atlas-bg px-3 py-2.5 text-sm text-atlas-text outline-none focus:border-atlas-gold"
        >
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
          Effective Date
        </label>
        <input
          type="date"
          value={effectiveDate}
          onChange={(e) => onEffectiveDateChange(e.target.value)}
          className="w-full rounded-lg border border-atlas-border bg-atlas-bg px-3 py-2.5 text-sm text-atlas-text outline-none focus:border-atlas-gold"
        />
      </div>

      <div className="space-y-2 border-t border-atlas-border pt-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-atlas-textMuted">Version:</span>
          <span className="font-semibold text-atlas-text">{version}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-atlas-textMuted">Slug:</span>
          <span className="font-mono text-xs text-atlas-textPlaceholder">
            /legal/{slug}
          </span>
        </div>
      </div>

      <button
        type="button"
        disabled={isSaving}
        onClick={onCommitPublish}
        className="w-full rounded-lg bg-atlas-gold py-3 text-xs font-bold uppercase tracking-wider text-atlas-bg shadow-sm transition hover:bg-atlas-goldLight disabled:opacity-50"
      >
        {isSaving ? "Saving..." : "Commit Publish"}
      </button>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onPreview}
          className="flex items-center justify-center gap-2 rounded-lg border border-atlas-border py-2.5 text-xs font-bold uppercase tracking-wider text-atlas-text transition hover:bg-atlas-bg"
        >
          <Eye className="size-3.5" />
          Preview
        </button>
        <button
          type="button"
          disabled={isSaving}
          onClick={onSaveDraft}
          className="flex items-center justify-center gap-2 rounded-lg border border-atlas-border py-2.5 text-xs font-bold uppercase tracking-wider text-atlas-text transition hover:bg-atlas-bg disabled:opacity-50"
        >
          <Save className="size-3.5" />
          Save Draft
        </button>
      </div>
    </div>
  );
}
