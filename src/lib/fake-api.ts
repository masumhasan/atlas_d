import { dummyDashboardData, dummySettings, dummyUser } from "./dummy-data";
import { AdminUser, DashboardData, SiteSettings } from "@/src/types";
import { PasswordChangePayload, ApiResult } from "@/src/types";

import { fetchDashboardDataFromApi } from "./api-client";
import { getToken } from "./auth";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchDashboardData(): Promise<DashboardData> {
  try {
    const token = getToken();
    return await fetchDashboardDataFromApi(token);
  } catch (error) {
    console.error("[Dashboard] Failed to fetch live data from backend:", error);
    return dummyDashboardData;
  }
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  await wait(800);
  return dummySettings;
}

import { loginAdmin } from "./api-client";

export type LoginPayload = { email: string; password: string };
export type LoginResponse = {
  success: boolean;
  message: string;
  user?: AdminUser;
  token?: string;
};

export async function loginRequest({
  email,
  password,
}: LoginPayload): Promise<LoginResponse> {
  try {
    const result = await loginAdmin({ email, password });
    return {
      success: true,
      message: "Signed in successfully.",
      user: result.user,
      token: result.token,
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Authentication failed.",
    };
  }
}

export type UpdateSettingsResponse = {
  success: boolean;
  message: string;
  data?: SiteSettings;
};

export async function updateSiteSettings(
  payload: SiteSettings,
): Promise<UpdateSettingsResponse> {
  await wait(1000);

  if (!payload.publicContactEmail.includes("@lmcs")) {
    return { success: false, message: "Invalid institutional email format" };
  }

  return {
    success: true,
    message: "Settings updated successfully.",
    data: payload,
  };
}

export async function updatePassword(
  payload: PasswordChangePayload,
): Promise<ApiResult> {
  await new Promise((r) => setTimeout(r, 900));

  if (payload.currentPassword.length < 4) {
    return { success: false, message: "Current password is incorrect." };
  }

  return { success: true, message: "Your password has been updated." };
}
