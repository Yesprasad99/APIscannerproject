// Tiny wrapper around your backend API
type ListParams = { q?: string; limit?: number; offset?: string | null };
type ListResponse<T> = { items: T[]; offset: string | null; total?: number };

async function http<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { headers: { "Content-Type": "application/json" }, ...init });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function listApis(params: ListParams) {
  const q = params.q ? encodeURIComponent(params.q) : "";
  const limit = params.limit ?? 20;
  const off = params.offset ? `&offset=${encodeURIComponent(params.offset)}` : "";
  const qs = `?limit=${limit}${q ? `&q=${q}` : ""}${off}`;
  return http<ListResponse<ApiItem>>(`/api/list${qs}`);
}

export async function getApi(id: string) {
  return http<ApiItem>(`/api/get/${encodeURIComponent(id)}`);
}

// Example type — match to your backend shape
export type ApiItem = {
  id: string;
  name: string;
  category?: string;
  description?: string;
  website?: string;
};
