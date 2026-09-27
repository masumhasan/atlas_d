export type AdminUser = {
  id?: string;
  name?: string;
  email: string;
  role: string;
};

// export type SiteSettings = {
//   websiteName: string;
//   websiteStatus: string;
//   defaultContentVisibility: string;
//   unreleasedContent: string;
//   publicContactEmail: string;
//   publicPhone: string;
// };

export type PageStatus = "published" | "draft" | "hidden";

export type StatTrend = "up" | "down" | "flat";

export type DashboardStat = {
  id: string;
  label: string;
  value: number;
  delta: string;
  trend: StatTrend;
  detail: string;
};

export type ContentType =
  | "Page"
  | "Insight"
  | "Legal"
  | "Case Study"
  | "Report";

export type ContentStatus = "published" | "draft" | "hidden" | "archived";

export type RecentChangeAction =
  | "Published"
  | "Updated"
  | "Drafted"
  | "Archived";

export type RecentChange = {
  id: string;
  title: string;
  type: ContentType;
  status: ContentStatus;
  action: RecentChangeAction;
  updatedAt: string;
  updatedBy: string;
  summary: string;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type RecentChangesResponse = {
  data: RecentChange[];
  pagination: Pagination;
};

export type DashboardData = {
  stats: DashboardStat[];
  recentChanges: RecentChangesResponse;
};

export type SiteSettings = {
  websiteName: string;
  websiteStatus: "Active" | "Maintenance" | "Offline";
  defaultContentVisibility: "Public" | "Private";
  unreleasedContent: "Hidden from Public" | "Visible to Public";
  publicContactEmail: string;
  publicPhone: string;
  tagline?: string;
  timezone?: string;
};

export type PasswordChangePayload = {
  currentPassword: string;
  newPassword: string;
};

export type ApiResult = { success: boolean; message: string };
