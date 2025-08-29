// src/App.jsx
import { useEffect, useMemo, useState } from "react";
import { fetchAPIs } from "./airtable";
import ErrorBox from "./components/ErrorBox";
import "./styles.css";

export default function App() {
  const [rows, setRows] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [q, setQ] = useState("");
  const [provider, setProvider] = useState("All");
  const [category, setCategory] = useState("All");
  const [freeOnly, setFreeOnly] = useState(false);

  const [sortKey, setSortKey] = useState("apiName");
  const [sortDir, setSortDir] = useState("asc");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAPIs();
        if (alive) setRows(data);
      } catch (e) {
        console.error(e);
        if (alive) setError(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const providers = useMemo(() => {
    const set = new Set(rows.map(r => r.provider).filter(Boolean));
    return ["All", ...Array.from(set).sort()];
  }, [rows]);

  const categories = useMemo(() => {
    const set = new Set(rows.map(r => r.category).filter(Boolean));
    return ["All", ...Array.from(set).sort()];
  }, [rows]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const isFree = (ft) => !!ft && !/none|n\/a/i.test(ft);

    return rows.filter(r => {
      if (provider !== "All" && r.provider !== provider) return false;
      if (category !== "All" && r.category !== category) return false;
      if (freeOnly && !isFree(r.freeTier)) return false;

      if (!needle) return true;
      const hay = `${r.apiName || ""} ${r.provider || ""} ${r.category || ""} ${r.notes || ""}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [rows, provider, category, freeOnly, q]);

  const sorted = useMemo(() => {
    const dir = sortDir === "asc" ? 1 : -1;
    const data = [...filtered];
    return data.sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (typeof va === "number" && typeof vb === "number") {
        return (va - vb) * dir;
      }
      return String(va ?? "").localeCompare(String(vb ?? "")) * dir;
    });
  }, [filtered, sortKey, sortDir]);

  const onSort = (key) => {
    if (key === sortKey) setSortDir(d => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };
  const caret = (key) => (sortKey === key ? (sortDir === "asc" ? " ▲" : " ▼") : "");

  return (
    <div className="container">
      <h1 className="page-title">AI APIs</h1>
      <p className="page-sub">Compare pricing, latency, and free tiers across providers.</p>

      <div className="card">
        {/* Controls */}
        <div className="controls">
          <select className="select" value={provider} onChange={(e) => setProvider(e.target.value)}>
            {providers.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            className="select"
            value={freeOnly ? "Free only" : "Free Tier (Any)"}
            onChange={(e) => setFreeOnly(e.target.value === "Free only")}
          >
            <option>Free Tier (Any)</option>
            <option>Free only</option>
          </select>
          <input
            className="input"
            placeholder="Search…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        {/* 🔴 Clean error banner */}
        {error && <ErrorBox message={error.message || String(error)} />}

        {/* Table */}
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th onClick={() => onSort("apiName")} style={{cursor:"pointer"}}>API Name{caret("apiName")}</th>
                <th onClick={() => onSort("provider")} style={{cursor:"pointer"}}>Provider{caret("provider")}</th>
                <th onClick={() => onSort("category")} style={{cursor:"pointer"}}>Category{caret("category")}</th>
                <th onClick={() => onSort("price")} style={{cursor:"pointer"}}>Pricing{caret("price")}</th>
                <th>Unit</th>
                <th>Free Tier</th>
                <th onClick={() => onSort("latency")} style={{cursor:"pointer"}}>Latency{caret("latency")}</th>
                <th>Link</th>
                <th>Notes</th>
              </tr>
            </thead>

            <tbody>
              {isLoading && [...Array(6)].map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 9 }).map((__, j) => (
                    <td key={j}><div className="skel" /></td>
                  ))}
                </tr>
              ))}

              {!isLoading && !error && sorted.map(r => {
                const hasLink = !!r.docsUrl;
                const onRowClick = () => { if (hasLink) window.open(r.docsUrl, "_blank", "noopener"); };
                return (
                  <tr key={r.id} className={hasLink ? "clickable-row" : ""} onClick={onRowClick}>
                    <td><strong>{r.apiName || "—"}</strong></td>
                    <td>{r.provider || "—"}</td>
                    <td><span className="chip">{r.category || "—"}</span></td>
                    <td className="right">{r.price == null ? "—" : `$${r.price.toFixed(2)}`}</td>
                    <td>{r.unit || "—"}</td>
                    <td>{r.freeTier || "None"}</td>
                    <td>{r.latency == null ? "—" : `≈${Math.round(r.latency)} ms`}</td>
                    <td>
                      {hasLink ? (
                        <a className="link" href={r.docsUrl} target="_blank" rel="noopener" onClick={(e)=>e.stopPropagation()}>
                          Docs
                        </a>
                      ) : <span className="muted">—</span>}
                    </td>
                    <td className="muted">{r.notes || "—"}</td>
                  </tr>
                );
              })}

              {!isLoading && !error && sorted.length === 0 && (
                <tr><td colSpan={9}><div className="empty">No matching results.</div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* If you prefer to use SmartTable instead of the custom table above:
import DataTable from "./components/SmartTable";
...
<DataTable data={rows} columns={columns} error={error} />
*/
