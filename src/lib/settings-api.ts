// FILE PATH: atlas_d/src/lib/settings-api.ts

import { getToken } from "./auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export type PublicContactSettings = {
  publicContactEmail: string;
  publicPhone: string;
};

export async function fetchSettingsFromApi(): Promise<PublicContactSettings> {
  try {
    const token = getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/settings`, {
      method: "GET",
      headers,
    });

    const data = await res.json();
    if (res.ok && data.success && data.data) {
      return {
        publicContactEmail: data.data.publicContactEmail || "admin@lmcs.com",
        publicPhone: data.data.publicPhone || "+1 (555) 019-2837",
      };
    }
  } catch (err) {
    console.error("[Settings] Error fetching settings from backend:", err);
  }

  return {
    publicContactEmail: "admin@lmcs.com",
    publicPhone: "+1 (555) 019-2837",
  };
}

export async function updateSettingsInApi(
  payload: PublicContactSettings
): Promise<{ success: boolean; message: string; data?: PublicContactSettings }> {
  try {
    const token = getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/settings`, {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        success: false,
        message: data.message || "Failed to update settings",
      };
    }

    return {
      success: true,
      message: data.message || "Settings updated successfully.",
      data: {
        publicContactEmail: data.data.publicContactEmail,
        publicPhone: data.data.publicPhone,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to communicate with backend server",
    };
  }
}
