import { Insight, InsightStatus } from '@/src/lib/insights-data';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export type BackendInsight = {
  id: string;
  slug: string;
  title: string;
  tag: string;
  breadcrumb?: string;
  date?: string;
  readTime?: string;
  excerpt: string;
  intro?: string;
  image?: string;
  status: 'published' | 'draft';
  author: string;
  body?: Array<{
    heading: string;
    content: Array<
      | { type: 'paragraph'; text: string }
      | { type: 'quote'; quote: string; attribution: string }
      | { type: 'image'; src: string; caption?: string }
    >;
  }>;
  order?: number;
  createdAt: string;
  updatedAt: string;
};

export const transformBackendInsight = (item: BackendInsight): Insight => ({
  id: item.id,
  slug: item.slug,
  title: item.title,
  category: item.tag,
  tag: item.tag,
  breadcrumb: item.breadcrumb,
  status: item.status === 'published' ? 'Published' : 'Draft',
  author: item.author || 'Atlas Admin',
  updatedAt: new Date(item.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }),
  publishDate: item.date,
  readTime: item.readTime,
  excerpt: item.excerpt,
  intro: item.intro,
  featuredAsset: item.image,
  body: item.body,
  content:
    item.body && item.body.length > 0
      ? item.body
          .map((sec) =>
            `${sec.heading}\n` +
            sec.content
              .map((b) => {
                if (b.type === 'paragraph') return b.text;
                if (b.type === 'quote') return `> "${b.quote}" — ${b.attribution}`;
                if (b.type === 'image') return `![${b.caption || ''}](${b.src})`;
                return '';
              })
              .join('\n\n')
          )
          .join('\n\n')
      : item.excerpt || '',
});

export async function fetchInsightsFromApi(params?: {
  search?: string;
  status?: string;
  tag?: string;
  page?: number;
  limit?: number;
}): Promise<{ insights: Insight[]; total: number }> {
  const url = new URL(`${API_BASE_URL}/insights`);
  if (params?.search) url.searchParams.set('search', params.search);
  if (params?.status && params.status !== 'All')
    url.searchParams.set('status', params.status);
  if (params?.tag && params.tag !== 'All') url.searchParams.set('tag', params.tag);
  if (params?.page) url.searchParams.set('page', String(params.page));
  if (params?.limit) url.searchParams.set('limit', String(params.limit));

  const res = await fetch(url.toString(), { cache: 'no-store' });
  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to fetch insights');
  }

  const list: BackendInsight[] = json.data || [];
  return {
    insights: list.map(transformBackendInsight),
    total: json.meta?.total ?? list.length,
  };
}

export async function fetchInsightByIdFromApi(idOrSlug: string): Promise<Insight> {
  const res = await fetch(`${API_BASE_URL}/insights/${idOrSlug}`, {
    cache: 'no-store',
  });
  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to fetch insight');
  }

  return transformBackendInsight(json.data);
}

export async function createInsightInApi(
  data: Partial<Insight>,
  token?: string | null
): Promise<Insight> {
  const payload = {
    title: data.title,
    slug: data.slug,
    tag: data.category || data.tag || 'Strategy',
    breadcrumb: data.breadcrumb,
    date: data.publishDate,
    readTime: data.readTime,
    excerpt: data.excerpt,
    intro: data.intro,
    image: data.featuredAsset,
    status: (data.status || 'Draft').toLowerCase(),
    author: data.author || 'Atlas Admin',
    body: data.body,
  };

  const res = await fetch(`${API_BASE_URL}/insights`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to create insight');
  }

  return transformBackendInsight(json.data);
}

export async function updateInsightInApi(
  id: string,
  data: Partial<Insight>,
  token?: string | null
): Promise<Insight> {
  const payload: Record<string, unknown> = {};
  if (data.title !== undefined) payload.title = data.title;
  if (data.slug !== undefined) payload.slug = data.slug;
  if (data.category !== undefined || data.tag !== undefined)
    payload.tag = data.category || data.tag;
  if (data.breadcrumb !== undefined) payload.breadcrumb = data.breadcrumb;
  if (data.publishDate !== undefined) payload.date = data.publishDate;
  if (data.readTime !== undefined) payload.readTime = data.readTime;
  if (data.excerpt !== undefined) payload.excerpt = data.excerpt;
  if (data.intro !== undefined) payload.intro = data.intro;
  if (data.featuredAsset !== undefined) payload.image = data.featuredAsset;
  if (data.status !== undefined) payload.status = data.status.toLowerCase();
  if (data.body !== undefined) payload.body = data.body;

  const res = await fetch(`${API_BASE_URL}/insights/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to update insight');
  }

  return transformBackendInsight(json.data);
}

export async function deleteInsightInApi(
  id: string,
  token?: string | null
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/insights/${id}`, {
    method: 'DELETE',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to delete insight');
  }
}

export async function uploadMediaToCloudinary(
  file: File | Blob,
  folder = 'insights',
  token?: string | null
): Promise<{ url: string; publicId: string }> {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', folder);

  const res = await fetch(`${API_BASE_URL}/media/upload`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Image upload to Cloudinary failed');
  }

  return {
    url: json.data.url,
    publicId: json.data.publicId,
  };
}
