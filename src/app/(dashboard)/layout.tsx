"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/src/components/layout/Sidebar";
import { Topbar } from "@/src/components/layout/Topbar";
import { getToken } from "@/src/lib/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
    } else {
      setIsAuthed(true);
    }
  }, [router]);

  if (isAuthed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-atlas-bg">
        <div className="size-6 animate-spin rounded-full border-2 border-atlas-gold border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-atlas-bg">
      {isSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[1px] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close navigation menu"
        />
      )}

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="min-h-screen lg:pl-60">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-[1600px]">{children}</div>
        </main>
      </div>
    </div>
  );
}