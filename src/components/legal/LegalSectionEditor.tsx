"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { LegalSection } from "@/src/lib/legal-data";
import { LegalSectionItem } from "./LegalSectionItem";

type LegalSectionEditorProps = {
  sections: LegalSection[];
  onChange: (sections: LegalSection[]) => void;
  onDirty: () => void;
};

export function LegalSectionEditor({
  sections,
  onChange,
  onDirty,
}: LegalSectionEditorProps) {
  const [expandedIndices, setExpandedIndices] = useState<Record<number, boolean>>({
    0: true,
  });

  const toggleExpand = (index: number) => {
    setExpandedIndices((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const recomputeIndexes = (list: LegalSection[]): LegalSection[] =>
    list.map((sec, idx) => {
      const n = String(idx + 1).padStart(2, "0");
      return {
        ...sec,
        id: sec.id || n,
        n,
      };
    });

  const handleAddSection = () => {
    const nextN = String(sections.length + 1).padStart(2, "0");
    const newSection: LegalSection = {
      id: nextN,
      n: nextN,
      title: `New Section ${nextN}`,
      shortTitle: `Section ${nextN}`,
      paragraphs: ["Write section paragraph here..."],
    };
    const next = [...sections, newSection];
    onChange(next);
    setExpandedIndices((prev) => ({ ...prev, [sections.length]: true }));
    onDirty();
  };

  const handleDeleteSection = (index: number) => {
    if (sections.length <= 1) return;
    const next = sections.filter((_, i) => i !== index);
    onChange(recomputeIndexes(next));
    onDirty();
  };

  const handleMoveSection = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    const next = [...sections];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    onChange(recomputeIndexes(next));
    onDirty();
  };

  const handleUpdateSection = (index: number, patch: Partial<LegalSection>) => {
    const next = [...sections];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-atlas-border pb-3">
        <div>
          <h3 className="font-serif text-lg text-atlas-text">Document Sections &amp; Indexes</h3>
          <p className="text-xs text-atlas-textMuted">
            Manage numbered legal sections with index navigation and callout blocks.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddSection}
          className="flex items-center gap-1.5 rounded-lg bg-atlas-gold/15 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-atlas-gold hover:bg-atlas-gold/25"
        >
          <Plus className="size-3.5" />
          Add Section
        </button>
      </div>

      <div className="space-y-3">
        {sections.map((section, idx) => (
          <LegalSectionItem
            key={section.id || idx}
            section={section}
            index={idx}
            totalSections={sections.length}
            isExpanded={Boolean(expandedIndices[idx])}
            onToggleExpand={() => toggleExpand(idx)}
            onMoveUp={() => handleMoveSection(idx, "up")}
            onMoveDown={() => handleMoveSection(idx, "down")}
            onDelete={() => handleDeleteSection(idx)}
            onUpdate={(patch) => handleUpdateSection(idx, patch)}
            onDirty={onDirty}
          />
        ))}
      </div>
    </div>
  );
}
