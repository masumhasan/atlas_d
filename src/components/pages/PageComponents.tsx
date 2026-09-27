"use client";

import React from "react";
import { MoreHorizontal } from "lucide-react";

export function PageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-atlas-border pb-6">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-atlas-gold">
        Content Management
      </p>
      <h1 className="font-serif text-3xl text-atlas-text sm:text-4xl">
        {title}
      </h1>
      <p className="mt-1.5 text-sm text-atlas-textMuted">{description}</p>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const published = status === "Published";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${
        published
          ? "bg-green-500/10 text-green-400"
          : "bg-amber-500/10 text-amber-400"
      }`}
    >
      {status}
    </span>
  );
}

export function ActionButton({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="rounded-lg p-2 text-atlas-textMuted transition-colors hover:bg-atlas-gold/10 hover:text-atlas-gold"
    >
      {children}
    </button>
  );
}

export function InfoRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-atlas-textMuted">
        {label}
      </p>
      <p className={`mt-1 text-sm text-atlas-text ${mono ? "font-mono" : ""}`}>
        {value}
      </p>
    </div>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="px-6 py-16 text-center">
      <MoreHorizontal className="mx-auto size-7 text-atlas-textPlaceholder" />
      <p className="mt-3 text-sm font-semibold">{title}</p>
      <p className="mt-1 text-xs text-atlas-textMuted">{description}</p>
    </div>
  );
}
