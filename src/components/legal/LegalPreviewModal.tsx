"use client";

import { useState } from "react";
import { Modal } from "@/src/components/ui/Modal";
import { LegalDoc } from "@/src/lib/legal-data";

type LegalPreviewModalProps = {
  open: boolean;
  onClose: () => void;
  doc: LegalDoc;
};

export function LegalPreviewModal({
  open,
  onClose,
  doc,
}: LegalPreviewModalProps) {
  const [activeSectionId, setActiveSectionId] = useState(
    doc.sections[0]?.id || ""
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Live Preview: ${doc.title}`}
      size="lg"
    >
      <div className="max-h-[80vh] overflow-y-auto rounded-lg bg-atlas-bg text-atlas-text">
        {/* Document Hero */}
        <div className="border-b border-atlas-border bg-atlas-surface/60 px-6 py-10 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <span className="rounded-full bg-atlas-gold/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-atlas-gold">
              {doc.version}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                doc.status === "Published"
                  ? "bg-green-500/10 text-green-400"
                  : "bg-amber-500/10 text-amber-400"
              }`}
            >
              {doc.status}
            </span>
          </div>

          <h1 className="font-serif text-3xl font-medium text-cream sm:text-4xl">
            {doc.title}
          </h1>

          {(doc.subtitle || doc.description) && (
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-atlas-textMuted">
              {doc.subtitle || doc.description}
            </p>
          )}
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 gap-8 p-6 lg:grid-cols-[220px_1fr]">
          {/* Table of Contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-atlas-gold">
                Contents
              </p>
              <ul className="mt-4 space-y-1 border-l border-atlas-border">
                {doc.sections.map((section) => {
                  const isActive = activeSectionId === section.id;
                  return (
                    <li key={section.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSectionId(section.id);
                          const el = document.getElementById(
                            `preview-sec-${section.id}`
                          );
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }}
                        className={`block w-full border-l-2 py-1.5 pl-3 text-left text-xs transition-colors ${
                          isActive
                            ? "border-atlas-gold text-atlas-gold font-semibold"
                            : "border-transparent text-atlas-textMuted hover:text-atlas-text"
                        }`}
                      >
                        {section.n}. {section.shortTitle || section.title}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* Sections List */}
          <div className="divide-y divide-atlas-border space-y-8">
            {doc.sections.map((section) => (
              <div
                key={section.id}
                id={`preview-sec-${section.id}`}
                className="pt-6 first:pt-0"
              >
                {/* Heading */}
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-3xl leading-none text-atlas-gold sm:text-4xl">
                    {section.n}
                  </span>
                  <h2 className="font-serif text-xl text-cream sm:text-2xl">
                    {section.title}
                  </h2>
                </div>

                {/* Paragraphs */}
                <div className="mt-4 space-y-3">
                  {section.paragraphs.map((p, pIdx) => (
                    <p
                      key={pIdx}
                      className="text-sm leading-relaxed text-atlas-textMuted"
                    >
                      {p}
                    </p>
                  ))}
                </div>

                {/* Highlight */}
                {section.highlight && (
                  <div className="mt-4 max-w-md border border-atlas-border bg-atlas-surface p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-atlas-gold">
                      {section.highlight.label}
                    </p>
                    <p className="mt-1 text-sm text-cream">
                      {section.highlight.value}
                    </p>
                  </div>
                )}

                {/* CTA */}
                {section.cta && (
                  <div className="mt-5">
                    <span className="inline-block rounded border border-atlas-gold/60 px-4 py-2 text-xs font-semibold text-atlas-gold">
                      {section.cta.label}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
