"use client";

import { Modal } from "@/src/components/ui/Modal";
import { InfoRow } from "./PageComponents";
import { PageItem } from "@/src/lib/pages-data";

export function ViewPageModal({
  page,
  onClose,
  onEdit,
}: {
  page: PageItem | null;
  onClose: () => void;
  onEdit: (page: PageItem) => void;
}) {
  if (!page) return null;

  return (
    <Modal open={!!page} onClose={onClose} title={page.title ?? "Page Details"}>
      <div className="space-y-5">
        <InfoRow label="Title" value={page.title} />
        <InfoRow label="Route" value={page.slug} mono />
        <InfoRow label="Visibility" value={page.status} />
        <InfoRow label="Author" value={page.author} />
        <InfoRow label="Last Updated" value={page.updatedAt} />

        <button
          onClick={() => onEdit(page)}
          className="w-full rounded-lg bg-atlas-gold py-3 text-sm font-bold text-atlas-bg hover:bg-atlas-goldLight"
        >
          Edit Page
        </button>
      </div>
    </Modal>
  );
}
