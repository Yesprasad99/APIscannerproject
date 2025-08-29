// src/api.ts
type ListParams = { q?: string; limit?: number; offset?: string | null };
type ListResponse<T> = { items: T[]; offset: string | null; total?: number };

async function http<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
  if (!res.ok) throw new Error(await res.text().catch(() => `HTTP ${res.status}`));
  return res.json() as Promise<T>;
}

export type ApiItem = {
  id: string;
  name: string;
  category?: string;
  description?: string;
  website?: string;
};

export async function listApis(params: ListParams) {
  const q = params.q ? `&q=${encodeURIComponent(params.q)}` : "";
  const off = params.offset ? `&offset=${encodeURIComponent(params.offset)}` : "";
  const limit = params.limit ?? 20;
  return http<ListResponse<ApiItem>>(`/api/list?limit=${limit}${q}${off}`);
}
