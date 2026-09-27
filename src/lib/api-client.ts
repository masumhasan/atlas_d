import { AdminUser, DashboardData } from "@/src/types";
import { PageItem } from "@/src/lib/pages-data";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export type LoginResult = {
  user: AdminUser;
  token: string;
};

export type BackendPage = {
  id: string;
  name: string;
  route: string;
  originalRoute?: string;
  visibility: "published" | "hidden" | "draft";
  slug?: string;
  order?: number;
  updatedBy?: string;
  updatedAt: string;
  createdAt: string;
};

function formatRelativeTime(dateStr: string): string {
  try {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 172800) return "Yesterday";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Authenticate admin against Atlas backend
 */
export async function loginAdmin(credentials: {
  email: string;
  password: string;
}): Promise<LoginResult> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    const errorMsg =
      data.error?.details?.[0]?.message ||
      data.message ||
      "Invalid credentials or login failed";
    throw new Error(errorMsg);
  }

  return data.data;
}

/**
 * Fetch authenticated user profile
 */
export async function fetchCurrentAdmin(token: string): Promise<AdminUser> {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to authenticate admin session");
  }

  return data.data;
}

/**
 * Notify backend on admin logout
 */
export async function logoutAdmin(token?: string | null): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
  } catch {
    // Non-blocking
  }
}

/**
 * Fetch all pages from backend
 */
export async function fetchPagesFromApi(): Promise<PageItem[]> {
  const res = await fetch(`${API_BASE_URL}/pages`, {
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch pages");
  }

  return json.data.map((item: BackendPage): PageItem => ({
    id: item.id,
    title: item.name,
    slug: item.route,
    status: item.visibility === "published" ? "Published" : "Hidden",
    updatedAt: formatRelativeTime(item.updatedAt),
    author: item.updatedBy || "Atlas Admin",
  }));
}

/**
 * Update page details (name, route, visibility)
 */
export async function updatePageInApi(
  id: string,
  payload: { title?: string; slug?: string; status?: PageItem["status"] },
  token?: string | null
): Promise<{ success: boolean; message: string }> {
  const body: Record<string, string> = {};
  if (payload.title) body.name = payload.title;
  if (payload.slug) body.route = payload.slug;
  if (payload.status) body.visibility = payload.status.toLowerCase();

  const res = await fetch(`${API_BASE_URL}/pages/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to update page");
  }

  return { success: true, message: json.message };
}

/**
 * Toggle page visibility
 */
export async function togglePageVisibilityInApi(
  id: string,
  status: PageItem["status"],
  token?: string | null
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE_URL}/pages/${id}/visibility`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ visibility: status.toLowerCase() }),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to update visibility");
  }

  return { success: true, message: json.message };
}

/**
 * Fetch real dashboard data from backend
 */
export async function fetchDashboardDataFromApi(
  token?: string | null
): Promise<DashboardData> {
  const res = await fetch(`${API_BASE_URL}/dashboard/stats`, {
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch dashboard statistics");
  }

  return json.data;
}
