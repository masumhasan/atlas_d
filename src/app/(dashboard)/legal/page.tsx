"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, FileText, ShieldCheck } from "lucide-react";
import { legalData, LegalDoc } from "@/src/lib/legal-data";
import { fetchLegalDocsFromApi } from "@/src/lib/legal-api";

export default function LegalContentPage() {
  const router = useRouter();
  const [items, setItems] = useState<LegalDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDocuments() {
      try {
        const liveDocs = await fetchLegalDocsFromApi();
        if (isMounted && liveDocs.length > 0) {
          setItems(liveDocs);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn("[Dashboard Legal] Live fetch failed, using fallback:", err);
      }

      if (isMounted) {
        setItems(legalData);
        setIsLoading(false);
      }
    }

    loadDocuments();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-atlas-border pb-6">
        <p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-atlas-gold">
          <ShieldCheck className="size-3.5" />
          Compliance
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl">Legal Content</h1>
        <p className="mt-1.5 text-sm text-atlas-textMuted">
          Manage the legal and policy documents published on the LMCS website.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => <LegalCardSkeleton key={i} />)}

        {!isLoading &&
          items.map((doc) => (
            <div
              key={doc.slug}
              className="flex flex-col rounded-xl border border-atlas-border bg-atlas-surface p-5 transition-colors hover:border-atlas-gold/30 sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-atlas-gold/10 text-atlas-gold">
                  <FileText className="size-5" />
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-atlas-gold/10 px-2.5 py-0.5 text-[10px] font-bold text-atlas-gold">
                    {doc.sections?.length ?? 0} Sections
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      doc.status === "Published"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>
              </div>

              <h2 className="mt-5 font-serif text-xl">{doc.title}</h2>

              <p className="mt-2 flex-1 text-sm leading-6 text-atlas-textMuted">
                {doc.subtitle || doc.description}
              </p>

              <div className="mt-4 flex items-center justify-between text-xs text-atlas-textPlaceholder">
                <span>Version {doc.version}</span>
                <span>Updated {doc.updatedAt}</span>
              </div>

              <p className="mt-1 font-mono text-[11px] text-atlas-textPlaceholder">
                /legal/{doc.slug}
              </p>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => router.push(`/legal/${doc.slug}`)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-atlas-border py-2.5 text-xs font-semibold hover:bg-atlas-bg"
                >
                  <Eye className="size-4" />
                  View
                </button>

                <button
                  onClick={() => router.push(`/legal/${doc.slug}?mode=edit`)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-atlas-gold py-2.5 text-xs font-bold text-atlas-bg hover:bg-atlas-goldLight"
                >
                  <Pencil className="size-4" />
                  Edit
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function LegalCardSkeleton() {
  return (
    <div className="rounded-xl border border-atlas-border bg-atlas-surface p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="size-10 animate-pulse rounded-lg bg-atlas-border" />
        <div className="h-5 w-20 animate-pulse rounded-full bg-atlas-border" />
      </div>
      <div className="mt-5 h-6 w-40 animate-pulse rounded bg-atlas-border" />
      <div className="mt-3 space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-atlas-border" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-atlas-border" />
      </div>
      <div className="mt-5 flex gap-2">
        <div className="h-9 flex-1 animate-pulse rounded-lg bg-atlas-border" />
        <div className="h-9 flex-1 animate-pulse rounded-lg bg-atlas-border" />
      </div>
    </div>
  );
}