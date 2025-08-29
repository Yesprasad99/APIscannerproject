import { useEffect, useMemo, useRef, useState } from "react";
import { listApis, ApiItem } from "../api";
import ErrorBox from "./ErrorBox"; // you already have this

export default function ApiList() {
  const [items, setItems] = useState<ApiItem[]>([]);
  const [q, setQ] = useState("");
  const [offset, setOffset] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  // simple debounce for search input
  const [debouncedQ, setDebouncedQ] = useState("");
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setDebouncedQ(q), 300);
    return () => window.clearTimeout(timer.current);
  }, [q]);

  // initial + on search
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await listApis({ q: debouncedQ, limit: 20, offset: null });
        if (!alive) return;
        setItems(res.items);
        setOffset(res.offset ?? null);
      } catch (e) {
        if (!alive) return;
        setError(e);
        setItems([]);
        setOffset(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [debouncedQ]);

  const hasResults = items.length > 0;
  const canLoadMore = offset !== null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search APIs..."
          className="w-full rounded-xl border p-2"
        />
      </div>

      {error && (
        <div className="p-3">
          <ErrorBox message={(error as Error)?.message || String(error)} />
        </div>
      )}

      {loading && !hasResults && (
        <div className="p-6 text-sm opacity-70">Loading…</div>
      )}

      {!loading && !error && !hasResults && (
        <div className="p-6 text-sm opacity-70">
          No results{debouncedQ ? ` for “${debouncedQ}”` : ""}. Try a different search.
        </div>
      )}

      {hasResults && (
        <table className="w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left text-sm opacity-70">
              <th className="px-2 py-1">Name</th>
              <th className="px-2 py-1">Category</th>
              <th className="px-2 py-1">Description</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="bg-white/50 hover:bg-white rounded-xl">
                <td className="px-2 py-2 font-medium">
                  <a className="underline" href={it.website} target="_blank" rel="noreferrer">
                    {it.name}
                  </a>
                </td>
                <td className="px-2 py-2">{it.category || "—"}</td>
                <td className="px-2 py-2">{it.description || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {hasResults && (
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs opacity-70">
            Showing {items.length}{debouncedQ ? ` for “${debouncedQ}”` : ""}
          </div>

          {canLoadMore && (
            <button
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                setError(null);
                try {
                  const res = await listApis({ q: debouncedQ, limit: 20, offset });
                  setItems((prev) => prev.concat(res.items));
                  setOffset(res.offset ?? null);
                } catch (e) {
                  setError(e);
                } finally {
                  setLoading(false);
                }
              }}
              className="rounded-xl border px-3 py-2 text-sm disabled:opacity-50"
            >
              {loading ? "Loading…" : "Load more"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
