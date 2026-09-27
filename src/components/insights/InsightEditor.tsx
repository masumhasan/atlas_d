"use client";

import { useRef, useState } from "react";
import { Upload, AlertTriangle } from "lucide-react";
import { useToast } from "@/src/components/ToastProvider";
import { CATEGORIES, Insight, InsightStatus, InsightSection } from "@/src/lib/insights-data";
import { uploadMediaToCloudinary } from "@/src/lib/insights-api";
import { SectionBlockEditor } from "./SectionBlockEditor";
import { InsightPreviewModal } from "./InsightPreviewModal";
import { PublishingOpsSidebar } from "./PublishingOpsSidebar";
import Image from "next/image";

type InsightEditorProps = {
  mode: "create" | "edit";
  initialData?: Insight;
  onSaved?: (insight: Insight, action: "draft" | "publish") => void;
  onCancel?: () => void;
};

export function InsightEditor({
  mode,
  initialData,
  onSaved,
  onCancel,
}: InsightEditorProps) {
  const { success, error } = useToast();
  const token = typeof window !== "undefined" ? localStorage.getItem("atlas_admin_token") : null;

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [category, setCategory] = useState(initialData?.category ?? initialData?.tag ?? CATEGORIES[0]);
  const [breadcrumb, setBreadcrumb] = useState(initialData?.breadcrumb ?? `Archive / ${category}`);
  const [readTime, setReadTime] = useState(initialData?.readTime ?? "8 min read");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [intro, setIntro] = useState(initialData?.intro ?? "");
  const [status, setStatus] = useState<InsightStatus>(initialData?.status ?? "Draft");
  const [publishDate, setPublishDate] = useState(initialData?.publishDate ?? "");
  const [featuredAsset, setFeaturedAsset] = useState<string | undefined>(initialData?.featuredAsset);
  const [isUploadingAsset, setIsUploadingAsset] = useState(false);

  const [sections, setSections] = useState<InsightSection[]>(() => {
    if (initialData?.body && initialData.body.length > 0) return initialData.body;
    return [
      {
        heading: "Overview & Strategic Analysis",
        content: [{ type: "paragraph", text: initialData?.content ?? "" }],
      },
    ];
  });

  const [isSaved, setIsSaved] = useState(mode === "edit");
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const markDirty = () => setIsSaved(false);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    markDirty();
    if (mode === "create" && !slug) {
      setSlug(val.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, ""));
    }
  };

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    setBreadcrumb(`Archive / ${val}`);
    markDirty();
  };

  const handleAssetUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingAsset(true);
      const res = await uploadMediaToCloudinary(file, "insights", token);
      setFeaturedAsset(res.url);
      markDirty();
      success("Asset uploaded to Cloudinary (/lmcsatlas/insights/)");
    } catch (err: any) {
      error(err.message || "Failed to upload asset");
    } finally {
      setIsUploadingAsset(false);
    }
  };

  const buildPayload = (nextStatus: InsightStatus): Insight => ({
    id: initialData?.id ?? `insight-${Date.now()}`,
    slug: slug.trim() || undefined,
    title: title.trim() || "Untitled Insight",
    category,
    tag: category,
    breadcrumb,
    status: nextStatus,
    author: initialData?.author ?? "Atlas Admin",
    updatedAt: "Just now",
    publishDate: publishDate || undefined,
    readTime,
    excerpt,
    intro: intro || excerpt,
    featuredAsset,
    body: sections,
  });

  const handleSaveDraft = () => {
    if (!title.trim()) return error("Insight title is required.");
    setStatus("Draft");
    setIsSaved(true);
    onSaved?.(buildPayload("Draft"), "draft");
  };

  const handleCommitPublish = () => {
    if (!title.trim()) return error("Insight title is required.");
    setStatus("Published");
    setIsSaved(true);
    onSaved?.(buildPayload("Published"), "publish");
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Main column */}
      <div className="space-y-6 lg:col-span-2">
        {!isSaved && (
          <div className="flex items-center gap-3 rounded-lg border-l-2 border-amber-400 bg-atlas-surface px-4 py-3">
            <AlertTriangle className="size-4 shrink-0 text-amber-400" />
            <p className="text-sm text-atlas-textMuted">
              You have modifications that have not been saved to the database.
            </p>
          </div>
        )}

        <input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Enter Analytical Title..."
          className="w-full border-b border-atlas-border bg-transparent pb-3 font-serif text-3xl text-atlas-text placeholder:text-atlas-textPlaceholder focus:border-atlas-gold focus:outline-none sm:text-4xl"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
              Primary Taxonomy
            </label>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full rounded-lg border border-atlas-border bg-atlas-bg px-3 py-2 text-sm text-atlas-text outline-none focus:border-atlas-gold"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
              URL Slug
            </label>
            <input
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                markDirty();
              }}
              placeholder="the-illusion-of-control"
              className="w-full rounded-lg border border-atlas-border bg-atlas-bg px-3 py-2 text-sm text-atlas-text outline-none focus:border-atlas-gold"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
              Estimated Read Time
            </label>
            <input
              value={readTime}
              onChange={(e) => {
                setReadTime(e.target.value);
                markDirty();
              }}
              placeholder="9 min read"
              className="w-full rounded-lg border border-atlas-border bg-atlas-bg px-3 py-2 text-sm text-atlas-text outline-none focus:border-atlas-gold"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
            Featured Asset (Cloudinary: /lmcsatlas/insights/)
          </label>
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-atlas-border bg-atlas-bg">
            {featuredAsset ? (
              <Image
                src={featuredAsset}
                alt="Featured asset"
                fill
                unoptimized
                className="object-cover opacity-85"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 bg-linear-to-br from-atlas-surface to-atlas-bg" />
            )}

            <button
              type="button"
              disabled={isUploadingAsset}
              onClick={() => fileInputRef.current?.click()}
              className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 rounded-lg bg-atlas-bg/90 px-6 py-4 text-xs font-bold uppercase tracking-wider text-atlas-text backdrop-blur hover:bg-atlas-surface border border-atlas-border"
            >
              <Upload className="size-5 text-atlas-gold" />
              {isUploadingAsset ? "Uploading to Cloudinary..." : "Replace Asset"}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAssetUpload}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
            Executive Summary / Excerpt
          </label>
          <textarea
            rows={2}
            value={excerpt}
            onChange={(e) => {
              setExcerpt(e.target.value);
              markDirty();
            }}
            placeholder="Brief synopsis for index cards and preview..."
            className="w-full resize-y rounded-lg border border-atlas-border bg-atlas-bg px-4 py-2.5 text-sm text-atlas-text outline-none placeholder:text-atlas-textPlaceholder focus:border-atlas-gold"
          />
        </div>

        <SectionBlockEditor
          sections={sections}
          onChange={(newSections) => {
            setSections(newSections);
            markDirty();
          }}
          token={token}
        />

        {onCancel && (
          <div className="flex justify-end border-t border-atlas-border pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-atlas-border px-5 py-2.5 text-sm font-semibold text-atlas-text hover:bg-atlas-surface"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1">
        <PublishingOpsSidebar
          status={status}
          publishDate={publishDate}
          author={initialData?.author}
          onStatusChange={(s) => { setStatus(s); markDirty(); }}
          onPublishDateChange={(d) => { setPublishDate(d); markDirty(); }}
          onCommitPublish={handleCommitPublish}
          onSaveDraft={handleSaveDraft}
          onPreview={() => setPreviewOpen(true)}
        />
      </div>

      <InsightPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        insight={{ title, slug, category, breadcrumb, readTime, publishDate, excerpt, intro, featuredAsset, body: sections }}
      />
    </div>
  );
}
