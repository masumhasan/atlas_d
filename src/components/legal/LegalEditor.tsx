"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/src/components/ToastProvider";
import { LegalDoc, LegalSection, LegalStatus } from "@/src/lib/legal-data";
import { updateLegalDocInApi } from "@/src/lib/legal-api";
import { LegalSectionEditor } from "./LegalSectionEditor";
import { LegalComplianceSidebar } from "./LegalComplianceSidebar";
import { LegalPreviewModal } from "./LegalPreviewModal";

type LegalEditorProps = {
  doc: LegalDoc;
  onCancel?: () => void;
  onSaved?: (doc: LegalDoc) => void;
};

export function LegalEditor({ doc, onCancel, onSaved }: LegalEditorProps) {
  const { success, error } = useToast();

  const [title, setTitle] = useState(doc.title);
  const [description, setDescription] = useState(
    doc.subtitle || doc.description || ""
  );
  const [sections, setSections] = useState<LegalSection[]>(doc.sections || []);
  const [status, setStatus] = useState<LegalStatus>(doc.status);
  const [effectiveDate, setEffectiveDate] = useState(doc.effectiveDate ?? "");
  const [version, setVersion] = useState(doc.version);

  const [isSaved, setIsSaved] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const markDirty = () => setIsSaved(false);

  const bumpVersion = (current: string) => {
    const match = current.match(/v(\d+)\.(\d+)/i);
    if (!match) return "v1.1";
    return `v${match[1]}.${Number(match[2]) + 1}`;
  };

  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("atlas_admin_token");
    }
    return null;
  };

  const currentPreviewDoc: LegalDoc = {
    ...doc,
    title,
    description,
    subtitle: description,
    sections,
    status,
    effectiveDate: effectiveDate || undefined,
    version,
    updatedAt: "Just now",
  };

  const saveDocument = async (nextStatus: LegalStatus, nextVersion: string) => {
    setIsSaving(true);
    try {
      const token = getAuthToken();
      const updatedDoc = await updateLegalDocInApi(
        doc.slug,
        {
          title,
          description,
          subtitle: description,
          sections,
          status: nextStatus,
          effectiveDate,
          version: nextVersion,
        },
        token
      );

      setStatus(updatedDoc.status);
      setVersion(updatedDoc.version);
      setIsSaved(true);
      success(
        nextStatus === "Published"
          ? "Legal document published and synchronized successfully."
          : "Draft saved successfully."
      );
      onSaved?.(updatedDoc);
    } catch (err: any) {
      error(err.message || "Failed to update legal document.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    await saveDocument("Draft", version);
  };

  const handleCommitPublish = async () => {
    if (!title.trim()) {
      error("Document title is required.");
      return;
    }
    if (sections.length === 0) {
      error("At least one section is required to publish.");
      return;
    }
    const hasEmptySections = sections.some((s) => !s.title.trim());
    if (hasEmptySections) {
      error("All sections must have a title.");
      return;
    }

    const nextVer = bumpVersion(version);
    await saveDocument("Published", nextVer);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Left Column: Form and Section Editor */}
      <div className="space-y-6 lg:col-span-2">
        {!isSaved && (
          <div className="flex items-center gap-3 rounded-lg border-l-2 border-amber-400 bg-atlas-surface px-4 py-3">
            <AlertTriangle className="size-4 shrink-0 text-amber-400" />
            <p className="text-sm text-atlas-textMuted">
              You have modifications that have not been saved to the database.
            </p>
          </div>
        )}

        {/* Document Title & Subtitle */}
        <div className="space-y-4 rounded-xl border border-atlas-border bg-atlas-surface p-5">
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
              Document Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                markDirty();
              }}
              placeholder="e.g. Privacy Notice"
              className="w-full rounded-lg border border-atlas-border bg-atlas-bg px-4 py-2.5 font-serif text-lg text-atlas-text outline-none focus:border-atlas-gold"
            />
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
              Document Summary / Subtitle
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                markDirty();
              }}
              placeholder="Provide a brief introductory summary of this legal document..."
              className="w-full resize-y rounded-lg border border-atlas-border bg-atlas-bg px-4 py-2.5 text-sm text-atlas-text outline-none placeholder:text-atlas-textPlaceholder focus:border-atlas-gold"
            />
          </div>
        </div>

        {/* Section Block Editor with Indexes */}
        <div className="rounded-xl border border-atlas-border bg-atlas-surface p-5">
          <LegalSectionEditor
            sections={sections}
            onChange={(next) => {
              setSections(next);
              markDirty();
            }}
            onDirty={markDirty}
          />
        </div>

        {onCancel && (
          <div className="flex justify-end border-t border-atlas-border pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-atlas-border px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-atlas-text hover:bg-atlas-surface"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Right Column: Compliance Ops Card */}
      <div className="lg:col-span-1">
        <LegalComplianceSidebar
          status={status}
          version={version}
          slug={doc.slug}
          effectiveDate={effectiveDate}
          isSaving={isSaving}
          onStatusChange={(s) => {
            setStatus(s);
            markDirty();
          }}
          onEffectiveDateChange={(d) => {
            setEffectiveDate(d);
            markDirty();
          }}
          onCommitPublish={handleCommitPublish}
          onSaveDraft={handleSaveDraft}
          onPreview={() => setPreviewOpen(true)}
        />
      </div>

      {/* Live Preview Modal mirroring website design */}
      <LegalPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        doc={currentPreviewDoc}
      />
    </div>
  );
}
