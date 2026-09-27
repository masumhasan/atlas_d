"use client";

import { useRef } from "react";
import { Plus, Trash2, Quote, Image as ImageIcon, Type, Upload } from "lucide-react";
import { InsightSection, InsightContentBlock } from "@/src/lib/insights-data";
import { uploadMediaToCloudinary } from "@/src/lib/insights-api";
import Image from "next/image";

type SectionBlockEditorProps = {
  sections: InsightSection[];
  onChange: (sections: InsightSection[]) => void;
  token?: string | null;
};

export function SectionBlockEditor({
  sections,
  onChange,
  token,
}: SectionBlockEditorProps) {
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const updateHeading = (sIndex: number, heading: string) => {
    const next = [...sections];
    next[sIndex] = { ...next[sIndex], heading };
    onChange(next);
  };

  const addSection = () => {
    onChange([
      ...sections,
      {
        heading: `Section ${sections.length + 1}`,
        content: [{ type: "paragraph", text: "" }],
      },
    ]);
  };

  const removeSection = (sIndex: number) => {
    onChange(sections.filter((_, i) => i !== sIndex));
  };

  const addBlock = (sIndex: number, type: "paragraph" | "quote" | "image") => {
    const next = [...sections];
    const newBlock: InsightContentBlock =
      type === "paragraph"
        ? { type: "paragraph", text: "" }
        : type === "quote"
        ? { type: "quote", quote: "", attribution: "LMCS Governance Analysis" }
        : { type: "image", src: "", caption: "Fig 1: Operational analysis" };
    next[sIndex] = { ...next[sIndex], content: [...next[sIndex].content, newBlock] };
    onChange(next);
  };

  const updateBlock = (sIndex: number, bIndex: number, patch: Partial<InsightContentBlock>) => {
    const next = [...sections];
    const updatedContent = [...next[sIndex].content];
    updatedContent[bIndex] = { ...updatedContent[bIndex], ...patch } as InsightContentBlock;
    next[sIndex] = { ...next[sIndex], content: updatedContent };
    onChange(next);
  };

  const removeBlock = (sIndex: number, bIndex: number) => {
    const next = [...sections];
    next[sIndex] = { ...next[sIndex], content: next[sIndex].content.filter((_, i) => i !== bIndex) };
    onChange(next);
  };

  const handleFileUpload = async (
    sIndex: number,
    bIndex: number,
    file: File
  ) => {
    try {
      const res = await uploadMediaToCloudinary(file, "insights", token);
      updateBlock(sIndex, bIndex, { src: res.url });
    } catch (e: any) {
      alert(e.message || "Failed to upload image to Cloudinary");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
          Article Sections & Content Blocks ({sections.length})
        </label>
        <button
          type="button"
          onClick={addSection}
          className="flex items-center gap-1.5 rounded-lg border border-atlas-gold/40 px-3 py-1.5 text-xs font-semibold text-atlas-gold hover:bg-atlas-gold/10"
        >
          <Plus className="size-3.5" />
          Add Section
        </button>
      </div>

      {sections.map((section, sIndex) => (
        <div
          key={sIndex}
          className="rounded-xl border border-atlas-border bg-atlas-surface p-5 space-y-4"
        >
          {/* Section Header */}
          <div className="flex items-center justify-between gap-3 border-b border-atlas-border pb-3">
            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-atlas-gold">
                Section {sIndex + 1}
              </span>
              <input
                value={section.heading}
                onChange={(e) => updateHeading(sIndex, e.target.value)}
                placeholder="Section Heading (e.g. When Oversight Becomes Theatre)"
                className="w-full bg-transparent font-serif text-lg text-atlas-text outline-none placeholder:text-atlas-textPlaceholder"
              />
            </div>
            {sections.length > 1 && (
              <button
                type="button"
                onClick={() => removeSection(sIndex)}
                className="rounded-lg p-1.5 text-atlas-textMuted hover:bg-red-500/10 hover:text-red-400"
                title="Remove Section"
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </div>

          {/* Blocks */}
          <div className="space-y-3">
            {section.content.map((block, bIndex) => (
              <div
                key={bIndex}
                className="relative rounded-lg border border-atlas-border/70 bg-atlas-bg p-3.5 transition-colors hover:border-atlas-border"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-atlas-textMuted">
                    {block.type === "paragraph" && <Type className="size-3 text-atlas-gold" />}
                    {block.type === "quote" && <Quote className="size-3 text-amber-400" />}
                    {block.type === "image" && <ImageIcon className="size-3 text-blue-400" />}
                    {block.type} Block
                  </span>
                  <button
                    type="button"
                    onClick={() => removeBlock(sIndex, bIndex)}
                    className="text-atlas-textMuted hover:text-red-400"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>

                {/* Paragraph */}
                {block.type === "paragraph" && (
                  <textarea
                    rows={4}
                    value={block.text}
                    onChange={(e) =>
                      updateBlock(sIndex, bIndex, { text: e.target.value })
                    }
                    placeholder="Enter analytical paragraph text..."
                    className="w-full resize-y bg-transparent text-sm leading-6 text-atlas-text outline-none placeholder:text-atlas-textPlaceholder"
                  />
                )}

                {/* Quote */}
                {block.type === "quote" && (
                  <div className="space-y-2 border-l-2 border-atlas-gold pl-3 py-1">
                    <textarea
                      rows={2}
                      value={block.quote}
                      onChange={(e) =>
                        updateBlock(sIndex, bIndex, { quote: e.target.value })
                      }
                      placeholder="Enter callout quote (e.g. Governance is not the existence of oversight...)"
                      className="w-full resize-y bg-transparent font-serif text-sm italic text-amber-200 outline-none placeholder:text-atlas-textPlaceholder"
                    />
                    <input
                      type="text"
                      value={block.attribution}
                      onChange={(e) =>
                        updateBlock(sIndex, bIndex, { attribution: e.target.value })
                      }
                      placeholder="Attribution (e.g. LMCS GOVERNANCE ANALYSIS)"
                      className="w-full bg-transparent text-xs font-semibold uppercase tracking-wider text-atlas-textMuted outline-none placeholder:text-atlas-textPlaceholder"
                    />
                  </div>
                )}

                {/* In-Content Image */}
                {block.type === "image" && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={block.src}
                        onChange={(e) =>
                          updateBlock(sIndex, bIndex, { src: e.target.value })
                        }
                        placeholder="Image URL or upload to Cloudinary..."
                        className="flex-1 rounded-lg border border-atlas-border bg-atlas-surface px-3 py-1.5 text-xs text-atlas-text outline-none focus:border-atlas-gold"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[`${sIndex}-${bIndex}`]?.click()}
                        className="flex items-center gap-1.5 rounded-lg border border-atlas-border bg-atlas-surface px-3 py-1.5 text-xs font-semibold text-atlas-gold hover:border-atlas-gold"
                      >
                        <Upload className="size-3.5" />
                        Upload
                      </button>
                      <input
                        ref={(el) => {
                          fileInputRefs.current[`${sIndex}-${bIndex}`] = el;
                        }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(sIndex, bIndex, file);
                        }}
                      />
                    </div>

                    {block.src && (
                      <div className="relative aspect-video max-h-48 w-full overflow-hidden rounded border border-atlas-border">
                        <Image
                          src={block.src}
                          alt={block.caption || "Section image"}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    )}

                    <input
                      type="text"
                      value={block.caption || ""}
                      onChange={(e) =>
                        updateBlock(sIndex, bIndex, { caption: e.target.value })
                      }
                      placeholder="Image caption (e.g. Fig 1: Governance structures must connect...)"
                      className="w-full bg-transparent text-xs text-atlas-textMuted outline-none placeholder:text-atlas-textPlaceholder"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add block toolbar */}
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              onClick={() => addBlock(sIndex, "paragraph")}
              className="flex items-center gap-1.5 rounded-md border border-atlas-border bg-atlas-bg px-2.5 py-1 text-xs text-atlas-textMuted hover:border-atlas-gold hover:text-atlas-text"
            >
              <Type className="size-3 text-atlas-gold" />
              + Paragraph
            </button>
            <button
              type="button"
              onClick={() => addBlock(sIndex, "quote")}
              className="flex items-center gap-1.5 rounded-md border border-atlas-border bg-atlas-bg px-2.5 py-1 text-xs text-atlas-textMuted hover:border-atlas-gold hover:text-atlas-text"
            >
              <Quote className="size-3 text-amber-400" />
              + Quote
            </button>
            <button
              type="button"
              onClick={() => addBlock(sIndex, "image")}
              className="flex items-center gap-1.5 rounded-md border border-atlas-border bg-atlas-bg px-2.5 py-1 text-xs text-atlas-textMuted hover:border-atlas-gold hover:text-atlas-text"
            >
              <ImageIcon className="size-3 text-blue-400" />
              + In-Content Image
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
