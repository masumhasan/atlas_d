"use client";

import {
  Mail,
  Phone,
  Building,
  Briefcase,
  Clock,
  FolderGit2,
  MessageSquare,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Modal } from "@/src/components/ui/Modal";
import { Inquiry, InquiryStatus } from "@/src/lib/inquiries-data";

type InquiryDetailModalProps = {
  inquiry: Inquiry | null;
  onClose: () => void;
  onApplyStatus: (status: InquiryStatus) => void;
  actionLoading?: boolean;
};

export function InquiryDetailModal({
  inquiry,
  onClose,
  onApplyStatus,
  actionLoading = false,
}: InquiryDetailModalProps) {
  if (!inquiry) return null;

  return (
    <Modal
      open={!!inquiry}
      onClose={onClose}
      title="Inquiry Details"
      size="lg"
    >
      <div className="max-h-[82vh] space-y-6 overflow-y-auto pr-1">
        {/* Header Block: Name, Status & Timestamp */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-atlas-border pb-4">
          <div>
            <h3 className="font-serif text-2xl font-medium text-atlas-text">
              {inquiry.name}
            </h3>
            {(inquiry.role || inquiry.organization) && (
              <p className="mt-1 text-xs text-atlas-textMuted">
                {inquiry.role}
                {inquiry.role && inquiry.organization && " at "}
                <span className="font-medium text-atlas-text">
                  {inquiry.organization}
                </span>
              </p>
            )}
            <p className="mt-2 flex items-center gap-1.5 text-xs text-atlas-textPlaceholder">
              <Clock className="size-3.5 text-atlas-gold" />
              {inquiry.date}
            </p>
          </div>

          <StatusBadge status={inquiry.status} />
        </div>

        {/* Inquiry Type Banner (Important) */}
        <div className="rounded-xl border border-atlas-gold/40 bg-atlas-gold/10 p-4">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-atlas-gold">
            <Sparkles className="size-3.5" />
            Inquiry Type
          </p>
          <p className="mt-1 font-serif text-lg font-semibold text-atlas-text">
            {inquiry.inquiryType || "General Inquiry"}
          </p>
          {inquiry.subject && inquiry.subject !== inquiry.inquiryType && (
            <p className="mt-0.5 text-xs text-atlas-textMuted">
              Subject: {inquiry.subject}
            </p>
          )}
        </div>

        {/* Contact Information */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
            Contact Information
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg border border-atlas-border bg-atlas-bg p-3">
              <Building className="size-4 shrink-0 text-atlas-gold" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase text-atlas-textPlaceholder">
                  Organization
                </p>
                <p className="truncate text-xs font-medium text-atlas-text">
                  {inquiry.organization || "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-atlas-border bg-atlas-bg p-3">
              <Briefcase className="size-4 shrink-0 text-atlas-gold" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase text-atlas-textPlaceholder">
                  Role / Title
                </p>
                <p className="truncate text-xs font-medium text-atlas-text">
                  {inquiry.role || "Not provided"}
                </p>
              </div>
            </div>

            <a
              href={`mailto:${inquiry.email}`}
              className="flex items-center gap-3 rounded-lg border border-atlas-border bg-atlas-bg p-3 transition hover:border-atlas-gold"
            >
              <Mail className="size-4 shrink-0 text-atlas-gold" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase text-atlas-textPlaceholder">
                  Work Email
                </p>
                <p className="truncate text-xs font-medium text-atlas-text">
                  {inquiry.email}
                </p>
              </div>
            </a>

            <div className="flex items-center gap-3 rounded-lg border border-atlas-border bg-atlas-bg p-3">
              <Phone className="size-4 shrink-0 text-atlas-gold" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase text-atlas-textPlaceholder">
                  Phone Number
                </p>
                {inquiry.phone ? (
                  <a
                    href={`tel:${inquiry.phone}`}
                    className="truncate text-xs font-medium text-atlas-text hover:text-atlas-gold"
                  >
                    {inquiry.phone}
                  </a>
                ) : (
                  <p className="text-xs text-atlas-textPlaceholder">Optional (Not provided)</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Project Information */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
            Project Information
          </p>
          <div className="space-y-3 rounded-lg border border-atlas-border bg-atlas-bg p-4">
            <div className="flex items-start gap-3">
              <FolderGit2 className="mt-0.5 size-4 shrink-0 text-atlas-gold" />
              <div>
                <p className="text-[10px] uppercase text-atlas-textPlaceholder">
                  Project / Initiative Name
                </p>
                <p className="font-serif text-sm font-medium text-atlas-text">
                  {inquiry.project || "Not specified"}
                </p>
              </div>
            </div>

            {inquiry.context && (
              <div className="border-t border-atlas-border/60 pt-3">
                <p className="text-[10px] uppercase tracking-wider text-atlas-textPlaceholder">
                  Brief Project Context
                </p>
                <p className="mt-1 text-xs leading-relaxed text-atlas-textMuted whitespace-pre-wrap">
                  {inquiry.context}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Message */}
        {inquiry.message && (
          <div className="space-y-2">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
              <MessageSquare className="size-3.5 text-atlas-gold" />
              Additional Message
            </p>
            <div className="rounded-lg border border-atlas-border bg-atlas-bg p-4">
              <p className="text-sm leading-relaxed text-atlas-text whitespace-pre-wrap">
                {inquiry.message}
              </p>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col gap-3 border-t border-atlas-border pt-4 sm:flex-row">
          {inquiry.status === "New" && (
            <button
              type="button"
              onClick={() => onApplyStatus("Read")}
              disabled={actionLoading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-atlas-gold py-2.5 text-xs font-bold uppercase tracking-wider text-atlas-bg transition hover:bg-atlas-goldLight disabled:opacity-50"
            >
              <CheckCircle2 className="size-4" />
              Mark as Read
            </button>
          )}

          {inquiry.status !== "Closed" ? (
            <button
              type="button"
              onClick={() => onApplyStatus("Closed")}
              disabled={actionLoading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-atlas-border py-2.5 text-xs font-bold uppercase tracking-wider text-atlas-text transition hover:bg-atlas-surface disabled:opacity-50"
            >
              <XCircle className="size-4" />
              Close Inquiry
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onApplyStatus("New")}
              disabled={actionLoading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-atlas-border py-2.5 text-xs font-bold uppercase tracking-wider text-atlas-text transition hover:bg-atlas-surface disabled:opacity-50"
            >
              <RotateCcw className="size-4" />
              Reopen Inquiry
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-atlas-border py-2.5 text-xs font-bold uppercase tracking-wider text-atlas-textMuted transition hover:bg-atlas-surface"
          >
            Dismiss
          </button>
        </div>
      </div>
    </Modal>
  );
}

function StatusBadge({ status }: { status: string }) {
  const classes: Record<string, string> = {
    New: "bg-atlas-gold/15 text-atlas-gold border-atlas-gold/30",
    Read: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    Closed: "bg-green-500/15 text-green-400 border-green-500/30",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${
        classes[status] || classes.New
      }`}
    >
      {status}
    </span>
  );
}
