"use client";

import { Modal } from "@/src/components/ui/Modal";
import { Insight } from "@/src/lib/insights-data";
import Image from "next/image";

type InsightPreviewModalProps = {
  open: boolean;
  onClose: () => void;
  insight: Partial<Insight>;
};

export function InsightPreviewModal({
  open,
  onClose,
  insight,
}: InsightPreviewModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Insight Preview"
      size="lg"
    >
      <div className="max-h-[80vh] overflow-y-auto pr-2 space-y-6">
        {/* Header Metadata */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-atlas-gold">
            {insight.breadcrumb || `Archive / ${insight.category || "Insights"}`}
          </p>
          <h1 className="mt-2 font-serif text-2xl sm:text-3xl text-atlas-text">
            {insight.title || "Untitled Insight"}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-atlas-textMuted">
            {insight.intro || insight.excerpt}
          </p>
          <div className="mt-4 flex items-center gap-3 text-xs text-atlas-textMuted">
            <span>{insight.publishDate || "Date TBD"}</span>
            <span>•</span>
            <span>{insight.readTime || "5 min read"}</span>
            <span>•</span>
            <span className="text-atlas-gold">{insight.category}</span>
          </div>
        </div>

        {/* Featured Image */}
        {insight.featuredAsset && (
          <div className="relative aspect-16/7 w-full overflow-hidden rounded-lg border border-atlas-border">
            <Image
              src={insight.featuredAsset}
              alt={insight.title || "Featured asset"}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        )}

        {/* Sections */}
        {insight.body && insight.body.length > 0 ? (
          <div className="space-y-8 pt-4">
            {insight.body.map((section, sIdx) => (
              <div key={sIdx} className="space-y-4">
                <h2 className="font-serif text-xl text-atlas-text border-b border-atlas-border pb-2">
                  {section.heading}
                </h2>
                <div className="space-y-4">
                  {section.content.map((block, bIdx) => {
                    if (block.type === "paragraph") {
                      return (
                        <p
                          key={bIdx}
                          className="text-sm leading-7 text-atlas-textMuted"
                        >
                          {block.text}
                        </p>
                      );
                    }
                    if (block.type === "quote") {
                      return (
                        <blockquote
                          key={bIdx}
                          className="my-4 border-y border-atlas-border/80 py-4 text-center"
                        >
                          <p className="font-serif text-lg italic text-amber-200">
                            &ldquo;{block.quote}&rdquo;
                          </p>
                          {block.attribution && (
                            <cite className="mt-2 block text-xs font-semibold uppercase tracking-wider text-atlas-textMuted not-italic">
                              {block.attribution}
                            </cite>
                          )}
                        </blockquote>
                      );
                    }
                    if (block.type === "image") {
                      return (
                        <figure key={bIdx} className="my-4 space-y-2">
                          {block.src && (
                            <div className="relative aspect-video max-h-56 w-full overflow-hidden rounded border border-atlas-border">
                              <Image
                                src={block.src}
                                alt={block.caption || "Illustration"}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            </div>
                          )}
                          {block.caption && (
                            <figcaption className="text-center text-xs text-atlas-textMuted">
                              {block.caption}
                            </figcaption>
                          )}
                        </figure>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-atlas-text">
            {insight.content || "No content provided yet."}
          </p>
        )}
      </div>
    </Modal>
  );
}
