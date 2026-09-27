import {
  fetchPagesFromApi,
  updatePageInApi,
  togglePageVisibilityInApi,
} from "./api-client";
import { getToken } from "./auth";

export type PageItem = {
  id: string;
  title: string;
  slug: string;
  status: "Published" | "Hidden";
  updatedAt: string;
  author: string;
};

export const initialPages: PageItem[] = [
  {
    id: "home",
    title: "Home",
    slug: "/",
    status: "Published",
    updatedAt: "Today",
    author: "Atlas Admin",
  },
  {
    id: "how-lmcs-works",
    title: "How LMCS Works",
    slug: "/how-lmcs-works",
    status: "Published",
    updatedAt: "Yesterday",
    author: "Atlas Admin",
  },
  {
    id: "project-assessment",
    title: "Project Assessment",
    slug: "/project-assessment",
    status: "Published",
    updatedAt: "Aug 26, 2026",
    author: "Atlas Admin",
  },
  {
    id: "atlas",
    title: "ATLAS",
    slug: "/atlas",
    status: "Published",
    updatedAt: "Aug 24, 2026",
    author: "Atlas Admin",
  },
  {
    id: "project-drift",
    title: "Project Drift",
    slug: "/project-drift",
    status: "Published",
    updatedAt: "Aug 22, 2026",
    author: "Atlas Admin",
  },
  {
    id: "delivery-confidence",
    title: "Delivery Confidence",
    slug: "/delivery-confidence",
    status: "Published",
    updatedAt: "Aug 20, 2026",
    author: "Atlas Admin",
  },
  {
    id: "insights",
    title: "Insights",
    slug: "/insights",
    status: "Published",
    updatedAt: "Aug 18, 2026",
    author: "Atlas Admin",
  },
  {
    id: "about",
    title: "About",
    slug: "/about",
    status: "Published",
    updatedAt: "Aug 15, 2026",
    author: "Atlas Admin",
  },
];

export async function fetchPages(): Promise<PageItem[]> {
  try {
    return await fetchPagesFromApi();
  } catch (error) {
    console.error("[Pages] Failed to fetch from backend API, using fallback:", error);
    return initialPages;
  }
}

export async function updatePage(
  id: string,
  updates: { title?: string; slug?: string; status?: PageItem["status"] }
): Promise<{ success: boolean; message: string }> {
  const token = getToken();
  try {
    return await updatePageInApi(id, updates, token);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update page";
    return { success: false, message };
  }
}

export async function togglePageVisibility(
  id: string,
  status: PageItem["status"]
): Promise<{ success: boolean; message: string }> {
  const token = getToken();
  try {
    return await togglePageVisibilityInApi(id, status, token);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update visibility";
    return { success: false, message };
  }
}
