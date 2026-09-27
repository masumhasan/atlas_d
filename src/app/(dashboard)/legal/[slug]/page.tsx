"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Pencil, ShieldCheck, Sparkles, Link2 } from "lucide-react";
import { LegalEditor } from "@/src/components/legal/LegalEditor";
import { getLegalDocBySlug, LegalDoc } from "@/src/lib/legal-data";
import { fetchLegalDocBySlugFromApi } from "@/src/lib/legal-api";

export default function LegalDetailPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();

  const [doc, setDoc] = useState<LegalDoc | null | undefined>(undefined);
  const [mode, setMode] = useState<"view" | "edit">(
    searchParams.get("mode") === "edit" ? "edit" : "view"
  );

  useEffect(() => {
    let isMounted = true;

    async function loadDoc() {
      try {
        const liveDoc = await fetchLegalDocBySlugFromApi(params.slug);
        if (isMounted && liveDoc) {
          setDoc(liveDoc);
          return;
        }
      } catch (err) {
        console.warn("[Dashboard Legal] Live fetch failed, using fallback:", err);
      }

      if (isMounted) {
        setDoc(getLegalDocBySlug(params.slug) ?? null);
      }
    }

    loadDoc();
    return () => {
      isMounted = false;
    };
  }, [params.slug]);

  if (doc === undefined) return <DetailSkeleton />;

  if (doc === null) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center">
        <p className="text-lg font-semibold">Document not found</p>
        <p className="mt-2 text-sm text-atlas-textMuted">
          This legal document does not exist or the link is incorrect.
        </p>
        <button
          onClick={() => router.push("/legal")}
          className="mt-6 rounded-lg bg-atlas-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-atlas-bg"
        >
          Back to Legal Content
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <button
        onClick={() => router.push("/legal")}
        className="flex items-center gap-2 text-sm text-atlas-textMuted hover:text-atlas-text"
      >
        <ArrowLeft className="size-4" />
        Back to Legal Content
      </button>

      <div className="flex flex-col gap-4 border-b border-atlas-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-atlas-gold">
            <ShieldCheck className="size-3.5" />
            Compliance &gt;{" "}
            {mode === "edit" ? "Edit Document" : "View Document"}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl">{doc.title}</h1>
          <p className="mt-1 font-mono text-xs text-atlas-textPlaceholder">
            /legal/{doc.slug}
          </p>
        </div>

        {mode === "view" && (
          <button
            onClick={() => setMode("edit")}
            className="flex items-center gap-2 rounded-lg bg-atlas-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-atlas-bg hover:bg-atlas-goldLight"
          >
            <Pencil className="size-4" />
            Edit Document
          </button>
        )}
      </div>

      {mode === "edit" ? (
        <LegalEditor
          doc={doc}
          onCancel={() => setMode("view")}
          onSaved={(updated) => {
            setDoc(updated);
            setMode("view");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main content display with indexes */}
          <div className="space-y-6 lg:col-span-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-atlas-gold/10 px-3 py-1 text-xs text-atlas-gold font-bold">
                {doc.version}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  doc.status === "Published"
                    ? "bg-green-500/10 text-green-400"
                    : "bg-amber-500/10 text-amber-400"
                }`}
              >
                {doc.status}
              </span>
              <span className="text-xs text-atlas-textMuted">
                &bull; {doc.sections.length} indexed sections
              </span>
            </div>

            {(doc.subtitle || doc.description) && (
              <p className="text-sm italic leading-relaxed text-atlas-textMuted">
                {doc.subtitle || doc.description}
              </p>
            )}

            {/* Render sections with indexed format */}
            <div className="divide-y divide-atlas-border space-y-6">
              {doc.sections.map((section) => (
                <div key={section.id} className="pt-6 first:pt-0 space-y-3">
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-3xl leading-none text-atlas-gold">
                      {section.n}
                    </span>
                    <h2 className="font-serif text-xl text-atlas-text">
                      {section.title}
                    </h2>
                  </div>

                  <div className="space-y-2">
                    {section.paragraphs.map((para, pIdx) => (
                      <p
                        key={pIdx}
                        className="text-sm leading-relaxed text-atlas-textMuted"
                      >
                        {para}
                      </p>
                    ))}
                  </div>

                  {section.highlight && (
                    <div className="mt-3 max-w-md rounded border border-atlas-border bg-atlas-surface p-3.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-atlas-gold flex items-center gap-1.5">
                        <Sparkles className="size-3" />
                        {section.highlight.label}
                      </p>
                      <p className="mt-1 text-sm text-atlas-text">
                        {section.highlight.value}
                      </p>
                    </div>
                  )}

                  {section.cta && (
                    <div className="mt-3">
                      <span className="inline-flex items-center gap-1.5 rounded border border-atlas-gold/50 px-3.5 py-1.5 text-xs font-semibold text-atlas-gold">
                        <Link2 className="size-3" />
                        {section.cta.label}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Ops Sidebar in view mode */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4 rounded-xl border border-atlas-border bg-atlas-surface p-6 text-sm">
              <h2 className="font-serif text-xl text-atlas-text">
                Compliance Ops
              </h2>
              <div className="flex items-center justify-between border-t border-atlas-border pt-4">
                <span className="text-atlas-textMuted">Status:</span>
                <span className="font-semibold text-atlas-text">
                  {doc.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-atlas-textMuted">Effective Date:</span>
                <span className="font-semibold text-atlas-text">
                  {doc.effectiveDate || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-atlas-textMuted">Version:</span>
                <span className="font-semibold text-atlas-text">
                  {doc.version}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-atlas-textMuted">Sections:</span>
                <span className="font-semibold text-atlas-text">
                  {doc.sections.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-atlas-textMuted">Last Updated:</span>
                <span className="font-semibold text-atlas-text">
                  {doc.updatedAt || "Recently"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="h-4 w-40 animate-pulse rounded bg-atlas-border" />
      <div className="h-10 w-80 animate-pulse rounded bg-atlas-border" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <div className="h-4 w-full animate-pulse rounded bg-atlas-border" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-atlas-border" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-atlas-border" />
        </div>
        <div className="h-64 w-full animate-pulse rounded-xl bg-atlas-border lg:col-span-1" />
      </div>
    </div>
  );
}
