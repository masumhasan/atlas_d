import { LegalDoc, LegalSection, LegalStatus } from './legal-data';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export type BackendLegalDoc = {
  id?: string;
  _id?: string;
  slug: string;
  title: string;
  subtitle?: string;
  version: string;
  effectiveDate?: string;
  status: 'published' | 'draft';
  order?: number;
  sections?: LegalSection[];
  createdAt?: string;
  updatedAt?: string;
};

export const transformBackendLegalDoc = (item: BackendLegalDoc): LegalDoc => {
  const sections: LegalSection[] = (item.sections || []).map((sec, idx) => {
    const rawN = sec.n || String(idx + 1).padStart(2, '0');
    const n = String(rawN).padStart(2, '0');
    return {
      id: sec.id || n,
      n,
      title: sec.title || '',
      shortTitle: sec.shortTitle || sec.title || '',
      paragraphs: Array.isArray(sec.paragraphs) ? sec.paragraphs : [],
      highlight:
        sec.highlight && (sec.highlight.label || sec.highlight.value)
          ? {
              label: sec.highlight.label || '',
              value: sec.highlight.value || '',
            }
          : null,
      cta:
        sec.cta && sec.cta.label
          ? {
              label: sec.cta.label,
            }
          : null,
    };
  });

  const fullContent = sections
    .map((s) => `${s.n}. ${s.title}\n\n` + s.paragraphs.join('\n\n'))
    .join('\n\n---\n\n');

  const formattedDate = item.updatedAt
    ? new Date(item.updatedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently';

  return {
    id: item.id || item._id,
    slug: item.slug,
    title: item.title,
    description: item.subtitle || '',
    subtitle: item.subtitle || '',
    content: fullContent,
    status: item.status === 'published' ? 'Published' : 'Draft',
    version: item.version || 'v1.0',
    effectiveDate: item.effectiveDate || '',
    updatedAt: formattedDate,
    sections,
  };
};

export async function fetchLegalDocsFromApi(): Promise<LegalDoc[]> {
  const res = await fetch(`${API_BASE_URL}/legal`, { cache: 'no-store' });
  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to fetch legal documents');
  }

  const list: BackendLegalDoc[] = json.data || [];
  return list.map(transformBackendLegalDoc);
}

export async function fetchLegalDocBySlugFromApi(slug: string): Promise<LegalDoc> {
  const cleanSlug = encodeURIComponent(slug.trim().toLowerCase());
  const res = await fetch(`${API_BASE_URL}/legal/${cleanSlug}`, {
    cache: 'no-store',
  });
  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to fetch legal document');
  }

  return transformBackendLegalDoc(json.data);
}

export async function updateLegalDocInApi(
  slug: string,
  data: Partial<LegalDoc>,
  token?: string | null
): Promise<LegalDoc> {
  const cleanSlug = encodeURIComponent(slug.trim().toLowerCase());
  const payload: Record<string, unknown> = {};

  if (data.title !== undefined) payload.title = data.title;
  if (data.description !== undefined) payload.subtitle = data.description;
  if (data.subtitle !== undefined) payload.subtitle = data.subtitle;
  if (data.version !== undefined) payload.version = data.version;
  if (data.effectiveDate !== undefined) payload.effectiveDate = data.effectiveDate;
  if (data.status !== undefined) payload.status = data.status.toLowerCase();
  if (data.sections !== undefined) payload.sections = data.sections;

  const res = await fetch(`${API_BASE_URL}/legal/${cleanSlug}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to update legal document');
  }

  return transformBackendLegalDoc(json.data);
}
