export type InsightStatus = "Published" | "Draft";

export type InsightContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "quote"; quote: string; attribution: string }
  | { type: "image"; src: string; caption?: string };

export type InsightSection = {
  heading: string;
  content: InsightContentBlock[];
};

export type Insight = {
  id: string;
  slug?: string;
  title: string;
  category: string;
  tag?: string;
  status: InsightStatus;
  author: string;
  updatedAt: string;
  publishDate?: string;
  readTime?: string;
  breadcrumb?: string;
  excerpt: string;
  intro?: string;
  content?: string;
  featuredAsset?: string;
  body?: InsightSection[];
};

export const CATEGORIES = [
  "Governance",
  "Leadership",
  "Project Drift",
  "Delivery Confidence",
  "Forensic Analysis",
  "Readiness",
  "Analysis",
  "Strategy",
  "Operations",
  "Technology",
  "Risk",
];

export const insightsData: Insight[] = [
  {
    id: "insight-1",
    title: "Understanding Organizational Drift",
    category: "Strategy",
    status: "Published",
    author: "Atlas Admin",
    updatedAt: "Today",
    publishDate: "2026-08-31",
    excerpt: "A practical look at identifying early organizational drift.",
    content:
      "The structural integrity of our recent delivery models suggests a minor drift in operational confidence. This insight examines the early indicators leadership teams should monitor before drift becomes systemic risk.",
  },
  {
    id: "insight-2",
    title: "The Cost of Schedule Pressure",
    category: "Operations",
    status: "Published",
    author: "Atlas Admin",
    updatedAt: "Aug 23, 2026",
    publishDate: "2026-08-23",
    excerpt: "How schedule pressure can create hidden operational risks.",
    content:
      "Compressed timelines rarely stay contained to the schedule itself. This piece traces how deadline pressure quietly migrates into quality, safety, and morale, and what leaders can do to intercept it early.",
  },
  {
    id: "insight-3",
    title: "Building Better Decision Systems",
    category: "Leadership",
    status: "Draft",
    author: "Atlas Admin",
    updatedAt: "Aug 20, 2026",
    excerpt: "A framework for improving executive decision-making.",
    content:
      "Most decision failures are process failures in disguise. We outline a lightweight framework executive teams can use to pressure-test high-stakes calls before they're made.",
  },
  {
    id: "insight-4",
    title: "Technology Debt as a Governance Risk",
    category: "Technology",
    status: "Draft",
    author: "Atlas Admin",
    updatedAt: "Aug 18, 2026",
    excerpt: "Why aging systems belong on the risk register, not just the backlog.",
    content:
      "Technology debt is too often treated as an engineering concern rather than a governance one. This insight reframes legacy system risk in terms boards can act on.",
  },
  {
    id: "insight-5",
    title: "Third-Party Risk in Complex Supply Chains",
    category: "Risk",
    status: "Published",
    author: "Atlas Admin",
    updatedAt: "Aug 15, 2026",
    publishDate: "2026-08-15",
    excerpt: "Mapping exposure beyond your direct vendors.",
    content:
      "Direct vendor audits miss the risk sitting two or three tiers removed. We walk through a mapping exercise that surfaces hidden dependency risk across a supply network.",
  },
  {
    id: "insight-6",
    title: "Board Oversight in Volatile Markets",
    category: "Governance",
    status: "Published",
    author: "Atlas Admin",
    updatedAt: "Aug 12, 2026",
    publishDate: "2026-08-12",
    excerpt: "What effective oversight looks like when conditions shift quickly.",
    content:
      "Volatility exposes the gap between governance on paper and governance in practice. This insight identifies the oversight habits that hold up under pressure.",
  },
  {
    id: "insight-7",
    title: "Rethinking Succession Planning",
    category: "Leadership",
    status: "Draft",
    author: "Atlas Admin",
    updatedAt: "Aug 10, 2026",
    excerpt: "Succession as a continuous discipline, not an annual exercise.",
    content:
      "Succession plans built once a year are usually stale within a quarter. We propose a continuous approach that keeps the bench genuinely ready.",
  },
  {
    id: "insight-8",
    title: "Operational Resilience After Disruption",
    category: "Operations",
    status: "Published",
    author: "Atlas Admin",
    updatedAt: "Aug 6, 2026",
    publishDate: "2026-08-06",
    excerpt: "Turning post-incident reviews into durable resilience.",
    content:
      "Most post-incident reviews produce a document, not a change. This insight covers how to convert lessons learned into resilience that survives the next disruption.",
  },
  {
    id: "insight-9",
    title: "AI Adoption Without Losing Control",
    category: "Technology",
    status: "Draft",
    author: "Atlas Admin",
    updatedAt: "Aug 3, 2026",
    excerpt: "Balancing speed of adoption with institutional control.",
    content:
      "Rapid AI adoption creates real advantage, but also real exposure when controls lag behind rollout. We outline a pragmatic sequencing for adopting responsibly.",
  },
  {
    id: "insight-10",
    title: "The Real Cost of Slow Decisions",
    category: "Strategy",
    status: "Published",
    author: "Atlas Admin",
    updatedAt: "Jul 29, 2026",
    publishDate: "2026-07-29",
    excerpt: "Quantifying the drag of indecision on execution.",
    content:
      "Slow decisions carry a cost that rarely shows up on a P&L line but shows up everywhere else. This piece attempts to quantify it and make the case for faster, well-structured calls.",
  },
  {
    id: "insight-11",
    title: "Crisis Communication Under Pressure",
    category: "Leadership",
    status: "Published",
    author: "Atlas Admin",
    updatedAt: "Jul 22, 2026",
    publishDate: "2026-07-22",
    excerpt: "What separates composed leaders from reactive ones.",
    content:
      "Crisis communication is rehearsed rarely and judged harshly. We break down the habits that keep leaders credible when it matters most.",
  },
  {
    id: "insight-12",
    title: "Regulatory Complexity as Strategic Signal",
    category: "Governance",
    status: "Draft",
    author: "Atlas Admin",
    updatedAt: "Jul 18, 2026",
    excerpt: "Reading regulatory shifts before they become mandates.",
    content:
      "By the time a regulation lands, the signal has been visible for months. This insight covers how to read early regulatory signal as a strategic input.",
  },
  {
    id: "insight-13",
    title: "Vendor Concentration Risk Revisited",
    category: "Risk",
    status: "Published",
    author: "Atlas Admin",
    updatedAt: "Jul 14, 2026",
    publishDate: "2026-07-14",
    excerpt: "Why single-vendor dependence keeps resurfacing as a blind spot.",
    content:
      "Vendor concentration risk is well understood in theory and poorly managed in practice. We look at why the same blind spot keeps recurring across sectors.",
  },
  {
    id: "insight-14",
    title: "Designing Incentives That Hold Up",
    category: "Strategy",
    status: "Draft",
    author: "Atlas Admin",
    updatedAt: "Jul 9, 2026",
    excerpt: "Incentive design that survives contact with reality.",
    content:
      "Incentive structures often work perfectly in the design room and fail immediately in the field. This insight covers a stress-testing approach for incentive design.",
  },
  {
    id: "insight-15",
    title: "Operational Metrics Leadership Actually Uses",
    category: "Operations",
    status: "Published",
    author: "Atlas Admin",
    updatedAt: "Jul 2, 2026",
    publishDate: "2026-07-02",
    excerpt: "Cutting dashboard noise down to signal.",
    content:
      "Most operational dashboards are built for completeness, not decision-making. We outline a smaller set of metrics leadership teams actually act on.",
  },
];

export function getInsightById(id: string) {
  return insightsData.find((item) => item.id === id);
}