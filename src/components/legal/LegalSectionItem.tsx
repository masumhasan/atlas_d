"use client";

import {
  ChevronDown,
  ChevronUp,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Link2,
  Plus,
} from "lucide-react";
import { LegalSection } from "@/src/lib/legal-data";

type LegalSectionItemProps = {
  section: LegalSection;
  index: number;
  totalSections: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onUpdate: (patch: Partial<LegalSection>) => void;
  onDirty: () => void;
};

export function LegalSectionItem({
  section,
  index,
  totalSections,
  isExpanded,
  onToggleExpand,
  onMoveUp,
  onMoveDown,
  onDelete,
  onUpdate,
  onDirty,
}: LegalSectionItemProps) {
  const handleParaChange = (pIdx: number, val: string) => {
    const paras = [...section.paragraphs];
    paras[pIdx] = val;
    onUpdate({ paragraphs: paras });
    onDirty();
  };

  const handleAddPara = () => {
    onUpdate({ paragraphs: [...section.paragraphs, ""] });
    onDirty();
  };

  const handleDeletePara = (pIdx: number) => {
    if (section.paragraphs.length <= 1) return;
    onUpdate({ paragraphs: section.paragraphs.filter((_, i) => i !== pIdx) });
    onDirty();
  };

  return (
    <div className="rounded-xl border border-atlas-border bg-atlas-surface transition-all">
      {/* Section Header Accordion Bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <div
          className="flex flex-1 cursor-pointer items-center gap-3"
          onClick={onToggleExpand}
        >
          <span className="flex size-7 items-center justify-center rounded bg-atlas-gold/10 font-serif text-xs font-bold text-atlas-gold">
            {section.n}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-serif text-sm font-semibold text-atlas-text">
              {section.title || "Untitled Section"}
            </p>
            <p className="truncate text-[11px] text-atlas-textMuted">
              Sidebar TOC: {section.shortTitle || section.title} &bull; {section.paragraphs.length} paragraph(s)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={index === 0}
            onClick={onMoveUp}
            className="rounded p-1 text-atlas-textMuted hover:bg-atlas-bg hover:text-atlas-text disabled:opacity-30"
            title="Move section up"
          >
            <ArrowUp className="size-3.5" />
          </button>
          <button
            type="button"
            disabled={index === totalSections - 1}
            onClick={onMoveDown}
            className="rounded p-1 text-atlas-textMuted hover:bg-atlas-bg hover:text-atlas-text disabled:opacity-30"
            title="Move section down"
          >
            <ArrowDown className="size-3.5" />
          </button>
          <button
            type="button"
            disabled={totalSections <= 1}
            onClick={onDelete}
            className="rounded p-1 text-red-400 hover:bg-red-500/10 disabled:opacity-30"
            title="Delete section"
          >
            <Trash2 className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={onToggleExpand}
            className="rounded p-1 text-atlas-textMuted hover:bg-atlas-bg hover:text-atlas-text"
          >
            {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Section Body */}
      {isExpanded && (
        <div className="space-y-4 border-t border-atlas-border p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
                Section Heading Title
              </label>
              <input
                type="text"
                value={section.title}
                onChange={(e) => {
                  onUpdate({ title: e.target.value });
                  onDirty();
                }}
                placeholder="e.g. Information We Collect"
                className="w-full rounded-lg border border-atlas-border bg-atlas-bg px-3 py-2 text-sm text-atlas-text outline-none focus:border-atlas-gold"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
                Sidebar Index Title (Contents TOC)
              </label>
              <input
                type="text"
                value={section.shortTitle}
                onChange={(e) => {
                  onUpdate({ shortTitle: e.target.value });
                  onDirty();
                }}
                placeholder="e.g. Information We Collect"
                className="w-full rounded-lg border border-atlas-border bg-atlas-bg px-3 py-2 text-sm text-atlas-text outline-none focus:border-atlas-gold"
              />
            </div>
          </div>

          {/* Paragraphs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
                Section Paragraphs
              </label>
              <button
                type="button"
                onClick={handleAddPara}
                className="flex items-center gap-1 text-[11px] font-semibold text-atlas-gold hover:underline"
              >
                <Plus className="size-3" /> Add Paragraph
              </button>
            </div>

            {section.paragraphs.map((para, pIdx) => (
              <div key={pIdx} className="space-y-1 rounded-lg border border-atlas-border bg-atlas-bg p-2.5">
                <div className="flex items-center justify-between text-[11px] text-atlas-textPlaceholder">
                  <span>Paragraph {pIdx + 1}</span>
                  {section.paragraphs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeletePara(pIdx)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <textarea
                  rows={3}
                  value={para}
                  onChange={(e) => handleParaChange(pIdx, e.target.value)}
                  placeholder="Write paragraph text..."
                  className="w-full resize-y rounded border border-atlas-border/50 bg-atlas-surface px-3 py-2 text-sm leading-relaxed text-atlas-text outline-none focus:border-atlas-gold"
                />
              </div>
            ))}
          </div>

          {/* Optional Highlight Box */}
          <div className="rounded-lg border border-atlas-border/70 bg-atlas-bg p-3">
            <label className="flex items-center gap-2 text-xs font-semibold text-atlas-text">
              <input
                type="checkbox"
                checked={Boolean(section.highlight)}
                onChange={(e) => {
                  onUpdate({
                    highlight: e.target.checked
                      ? { label: "Legal Department", value: "legal@lmcs-advisory.com" }
                      : null,
                  });
                  onDirty();
                }}
                className="rounded border-atlas-border accent-atlas-gold"
              />
              <Sparkles className="size-3.5 text-atlas-gold" />
              Include Highlight Box (Callout Card)
            </label>

            {section.highlight && (
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-wider text-atlas-textMuted">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    value={section.highlight.label}
                    onChange={(e) => {
                      onUpdate({
                        highlight: { ...section.highlight!, label: e.target.value },
                      });
                      onDirty();
                    }}
                    placeholder="e.g. Legal Department"
                    className="w-full rounded border border-atlas-border bg-atlas-surface px-3 py-1.5 text-xs text-atlas-text outline-none focus:border-atlas-gold"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-wider text-atlas-textMuted">
                    Highlight Text / Value
                  </label>
                  <input
                    type="text"
                    value={section.highlight.value}
                    onChange={(e) => {
                      onUpdate({
                        highlight: { ...section.highlight!, value: e.target.value },
                      });
                      onDirty();
                    }}
                    placeholder="e.g. legal@lmcs-advisory.com"
                    className="w-full rounded border border-atlas-border bg-atlas-surface px-3 py-1.5 text-xs text-atlas-text outline-none focus:border-atlas-gold"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Optional CTA Button */}
          <div className="rounded-lg border border-atlas-border/70 bg-atlas-bg p-3">
            <label className="flex items-center gap-2 text-xs font-semibold text-atlas-text">
              <input
                type="checkbox"
                checked={Boolean(section.cta)}
                onChange={(e) => {
                  onUpdate({
                    cta: e.target.checked ? { label: "Contact Accessibility Team" } : null,
                  });
                  onDirty();
                }}
                className="rounded border-atlas-border accent-atlas-gold"
              />
              <Link2 className="size-3.5 text-atlas-gold" />
              Include Action Button (CTA Button)
            </label>

            {section.cta && (
              <div className="mt-3">
                <label className="mb-1 block text-[10px] uppercase tracking-wider text-atlas-textMuted">
                  Button Text (Links to /contact)
                </label>
                <input
                  type="text"
                  value={section.cta.label}
                  onChange={(e) => {
                    onUpdate({ cta: { label: e.target.value } });
                    onDirty();
                  }}
                  placeholder="e.g. Contact Accessibility Team"
                  className="w-full rounded border border-atlas-border bg-atlas-surface px-3 py-1.5 text-xs text-atlas-text outline-none focus:border-atlas-gold"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
