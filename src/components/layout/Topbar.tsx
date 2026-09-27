"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { clearSession, getUser, getToken } from "@/src/lib/auth";
import { logoutAdmin } from "@/src/lib/api-client";
import { AdminUser } from "@/src/types";
import { ConfirmModal } from "../ui/ConfirmModal";

type TopbarProps = {
  onMenuClick: () => void;
};

export function Topbar({ onMenuClick }: TopbarProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    setCurrentUser(getUser());
  }, []);

  const logout = async () => {
    const token = getToken();
    await logoutAdmin(token);
    clearSession();
    router.replace("/login");
  };

  const displayName = currentUser?.name || currentUser?.email || "Atlas Admin";
  const initials =
    displayName
      .split(/[\s@]+/)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join("") || "AD";

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-atlas-border bg-atlas-bg/95 px-4 backdrop-blur sm:px-6 lg:px-8">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-atlas-textMuted hover:bg-atlas-surface hover:text-atlas-text lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>

        <div className="ml-auto flex items-center gap-1 sm:gap-3">
          <div className="relative">
            <button
              onClick={() => setShowProfile((v) => !v)}
              className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-atlas-surface"
            >
              <div className="flex size-8 items-center justify-center rounded-full bg-atlas-surface3 text-[11px] font-bold text-atlas-textMuted">
                {initials}
              </div>

              <div className="hidden text-left md:block">
                <p className="max-w-[150px] truncate text-xs font-semibold text-atlas-text">
                  {displayName}
                </p>
                <p className="text-[10px] capitalize text-atlas-textMuted">
                  {currentUser?.role || "Administrator"}
                </p>
              </div>
            </button>

            {showProfile && (
              <div className="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-xl border border-atlas-border bg-atlas-surface shadow-2xl">
                <button
                  onClick={() => {
                    setShowProfile(false);
                    router.push("/settings");
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-atlas-textMuted hover:bg-atlas-bg hover:text-atlas-text"
                >
                  <User className="size-4" />
                  Profile
                </button>

                <button
                  onClick={() => {
                    setShowProfile(false);
                    router.push("/settings");
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-atlas-textMuted hover:bg-atlas-bg hover:text-atlas-text"
                >
                  <Settings className="size-4" />
                  Settings
                </button>

                <button
                  onClick={() => {
                    setShowLogoutConfirm(true);
                    setShowProfile(false);
                  }}
                  className="flex w-full items-center gap-3 border-t border-atlas-border px-4 py-3 text-sm text-red-300 hover:bg-red-500/10"
                >
                  <LogOut className="size-4" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <ConfirmModal
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={logout}
        title="Log Out?"
        description="Are you sure you want to log out of your administrator account?"
        confirmText="Log Out"
      />
    </>
  );
}
