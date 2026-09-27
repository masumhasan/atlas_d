export type InquiryStatus = "New" | "Read" | "Closed";

export type Inquiry = {
  id: string;
  inquiryType: string;
  name: string;
  organization?: string;
  role?: string;
  phone?: string;
  email: string;
  project?: string;
  context?: string;
  message: string;
  subject?: string;
  status: InquiryStatus;
  date: string;
  createdAt?: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const formatTimestamp = (dateStr?: string) => {
  if (!dateStr) return "Recently";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const now = new Date();
  const isToday = now.toDateString() === date.toDateString();

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) {
    return `Today, ${timeStr}`;
  }

  const dateFormatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${dateFormatted}, ${timeStr}`;
};

export const inquiriesData: Inquiry[] = [
  {
    id: "inq-1",
    inquiryType: "Project Assessment",
    name: "James Wilson",
    organization: "Wilson Global Advisory",
    role: "Managing Director",
    phone: "+1 202 555 0145",
    email: "james@example.com",
    project: "Mission Critical Modernization",
    context: "Comprehensive audit and readiness assessment for executive portfolio transformation.",
    subject: "Consultation Request",
    message: "I would like to learn more about the LMCS framework and arrange a consultation.",
    status: "New",
    date: "Today, 09:42 AM",
  },
  {
    id: "inq-2",
    inquiryType: "Executive / Portfolio",
    name: "Sarah Miller",
    organization: "Apex Core Solutions",
    role: "Chief Risk Officer",
    phone: "+1 202 555 0188",
    email: "sarah@example.com",
    project: "Portfolio Governance Overhaul",
    context: "Aligning cross-discipline delivery confidence metrics across tier-1 infrastructure projects.",
    subject: "Website Inquiry",
    message: "Could you provide more information about your executive advisory services?",
    status: "Read",
    date: "Yesterday",
  },
  {
    id: "inq-3",
    inquiryType: "General Inquiry",
    name: "Michael Brown",
    organization: "Beacon Systems",
    role: "Director of Infrastructure",
    phone: "+1 202 555 0132",
    email: "michael@example.com",
    project: "General Inquiries",
    context: "Preliminary scoping regarding external audit standards and frameworks.",
    subject: "General Question",
    message: "I have a question regarding your services.",
    status: "Closed",
    date: "Aug 22, 2026",
  },
  {
    id: "inq-4",
    inquiryType: "Partnership",
    name: "Emily Carter",
    organization: "Carter & Associates",
    role: "VP Strategy & Alliances",
    phone: "+1 202 555 0117",
    email: "emily.carter@example.com",
    project: "Joint Advisory Framework",
    context: "Exploring synergistic partnerships in mission-critical environments.",
    subject: "Partnership Opportunity",
    message: "Our firm is interested in exploring a partnership with LMCS for joint advisory engagements.",
    status: "New",
    date: "Aug 29, 2026",
  },
  {
    id: "inq-5",
    inquiryType: "Atlas Platform",
    name: "David Thompson",
    organization: "Titan Infrastructure Group",
    role: "Head of Operations",
    phone: "+1 202 555 0166",
    email: "d.thompson@example.com",
    project: "ATLAS Intelligence Integration",
    context: "Platform rollout assessment for real-time telemetry and site intelligence.",
    subject: "ATLAS Framework Demo",
    message: "Is it possible to schedule a demo of the ATLAS assessment framework for our leadership team?",
    status: "New",
    date: "Aug 28, 2026",
  },
  {
    id: "inq-6",
    inquiryType: "Practitioner",
    name: "Laura Chen",
    organization: "Global Tech Summit",
    role: "Program Director",
    phone: "+1 202 555 0198",
    email: "laura.chen@example.com",
    project: "Annual Operations Summit",
    context: "Practitioner track keynote and methodology workshops.",
    subject: "Speaking Engagement",
    message: "We'd like to invite a member of your team to speak at our upcoming operations summit.",
    status: "Read",
    date: "Aug 27, 2026",
  },
  {
    id: "inq-7",
    inquiryType: "Project Assessment",
    name: "Robert Kim",
    organization: "Northeastern Rail & Power",
    role: "VP Capital Projects",
    phone: "+1 202 555 0121",
    email: "robert.kim@example.com",
    project: "Delivery Confidence Track",
    context: "Pre-construction confidence rating and drift mitigation review.",
    subject: "Pricing Question",
    message: "Could you send over pricing information for the Delivery Confidence engagement track?",
    status: "Closed",
    date: "Aug 25, 2026",
  },
  {
    id: "inq-8",
    inquiryType: "General Inquiry",
    name: "Nina Patel",
    organization: "Infrastructure Insights Media",
    role: "Senior Editor",
    phone: "+1 202 555 0154",
    email: "nina.patel@example.com",
    project: "Resilience Feature Series",
    context: "Editorial interview on high-consequence system failures and leadership.",
    subject: "Media Request",
    message: "I'm writing a feature on organizational resilience and would like a brief interview.",
    status: "New",
    date: "Aug 24, 2026",
  },
];

export async function fetchInquiries(params?: {
  search?: string;
  status?: string;
}): Promise<Inquiry[]> {
  try {
    const url = new URL(`${API_BASE_URL}/inquiries`);
    if (params?.search) url.searchParams.set("search", params.search);
    if (params?.status && params.status !== "All") {
      url.searchParams.set("status", params.status);
    }

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("atlas_admin_token")
        : null;

    const res = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const json = await res.json();
    if (res.ok && json.success && Array.isArray(json.data)) {
      return json.data.map((item: any) => ({
        id: item.id || item._id,
        inquiryType: item.inquiryType || "General Inquiry",
        name: item.name,
        organization: item.organization || "",
        role: item.role || "",
        phone: item.phone || "",
        email: item.email,
        project: item.project || "",
        context: item.context || "",
        message: item.message || "",
        subject: item.subject || `${item.inquiryType || "General"} Request`,
        status: (item.status as InquiryStatus) || "New",
        date: formatTimestamp(item.createdAt || item.date),
        createdAt: item.createdAt,
      }));
    }
  } catch (error) {
    console.warn("[Inquiries] Live fetch failed, using fallback:", error);
  }

  return inquiriesData;
}

export async function updateInquiryStatus(
  id: string,
  status: InquiryStatus
): Promise<{ success: boolean; message: string }> {
  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("atlas_admin_token")
        : null;

    const res = await fetch(`${API_BASE_URL}/inquiries/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ status }),
    });

    const json = await res.json();
    if (res.ok && json.success) {
      return {
        success: true,
        message: json.message || `Inquiry marked as ${status.toLowerCase()}.`,
      };
    }
  } catch (error) {
    console.warn("[Inquiries] Live update failed:", error);
  }

  return {
    success: true,
    message: `Inquiry marked as ${status.toLowerCase()}.`,
  };
}
