"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  FileText,
  BarChart3,
  HelpCircle,
  Scale,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useState } from "react";
import { LogoutModal } from "./LogoutModal";

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/pages", label: "Pages", icon: FileText },
  { href: "/insights", label: "Insights", icon: BarChart3 },
  { href: "/inquiries", label: "Inquiries", icon: HelpCircle },
  { href: "/legal", label: "Legal Content", icon: Scale },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  
  const pathname = usePathname();
  const router = useRouter();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoClick = () => {
    onClose?.();

    if (pathname === "/dashboard") {
      window.location.reload();
      return;
    }

    router.push("/dashboard");
  };

  return (
    <>
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-60 flex-col
          border-r border-atlas-border bg-atlas-bg
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex items-center justify-between px-6 pb-6 pt-7">
          <button
            type="button"
            onClick={handleLogoClick}
            className="shrink-0 cursor-pointer font-serif text-2xl font-semibold tracking-[0.08em] text-cream transition-colors hover:text-gold"
            aria-label="LMCS Dashboard"
          >
            LMCS
          </button>

          <button
            onClick={onClose}
            className="rounded-md p-1 text-atlas-textMuted hover:bg-atlas-surface hover:text-atlas-text lg:hidden"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 rounded-md border-l-2 px-3 py-2.5
                  text-sm transition-colors
                  ${
                    isActive
                      ? "border-atlas-gold bg-atlas-goldDark/40 font-semibold text-atlas-gold"
                      : "border-transparent text-atlas-textMuted hover:bg-atlas-surface hover:text-atlas-text"
                  }
                `}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-atlas-border p-3">
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-atlas-textMuted transition-colors hover:bg-atlas-surface hover:text-atlas-text"
          >
            <LogOut className="size-4" />
            Log Out
          </button>
        </div>
      </aside>

      {showLogoutModal && (
        <LogoutModal onCancel={() => setShowLogoutModal(false)} />
      )}
    </>
  );
}
