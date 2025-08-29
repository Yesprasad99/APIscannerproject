import { useEffect, useRef, useState } from "react";
import { listApis, ApiItem } from "../api";
import ErrorBox from "./ErrorBox";

export default function ApiListWithLoadMore() {
  const [items, setItems] = useState<ApiItem[]>([]);
  const [offset, setOffset] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  // debounce search
  const [debouncedQ, setDebouncedQ] = useState("");
  const t = useRef<number | undefined>(undefined);
  useEffect(() => {
    window.clearTimeout(t.current);
    t.current = window.setTimeout(() => setDebouncedQ(q), 300);
    return () => window.clearTimeout(t.current);
  }, [q]);

  // load first page / on search
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
    return () => {
      alive = false;
    };
  }, [debouncedQ]);

  // load more
  const loadMore = async () => {
    if (!offset || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await listApis({ q: debouncedQ, limit: 20, offset });
      setItems((prev) => prev.concat(res.items));
      setOffset(res.offset ?? nul
