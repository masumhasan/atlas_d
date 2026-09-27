"use client";

import { useRouter } from "next/navigation";
import { clearSession, getToken } from "@/src/lib/auth";
import { logoutAdmin } from "@/src/lib/api-client";
import { ConfirmModal } from "@/src/components/ui/ConfirmModal";

export function LogoutModal({ onCancel }: { onCancel: () => void }) {
  const router = useRouter();

  const handleLogout = async () => {
    const token = getToken();
    await logoutAdmin(token);
    clearSession();
    router.replace("/login");
  };

  return (
    <ConfirmModal
      open
      onClose={onCancel}
      onConfirm={handleLogout}
      title="Log Out"
      description="Are you sure you want to log out of the Atlas Admin Panel?"
      confirmText="Log Out"
    />
  );
}
