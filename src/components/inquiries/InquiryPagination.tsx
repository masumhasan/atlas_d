"use client";

type InquiryPaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export function InquiryPagination({
  page,
  totalPages,
  onChange,
}: InquiryPaginationProps) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between border-t border-atlas-border px-4 py-3.5 sm:px-6">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="rounded-lg border border-atlas-border px-3 py-1 text-xs font-semibold text-atlas-text disabled:opacity-30"
      >
        Previous
      </button>

      <div className="flex items-center gap-1">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`size-7 rounded-lg text-xs font-bold ${
              p === page ? "bg-atlas-gold text-atlas-bg" : "text-atlas-textMuted hover:bg-atlas-bg"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="rounded-lg border border-atlas-border px-3 py-1 text-xs font-semibold text-atlas-text disabled:opacity-30"
      >
        Next
      </button>
    </div>
  );
}
