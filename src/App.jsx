// src/App.jsx
import { useEffect, useState } from "react";
import { fetchAPIs } from "./airtable";
import "./styles.css";

export default function App() {
  const [rows, setRows] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchAPIs();  // <-- pulls from Airtable
        if (alive) setRows(data);
      } catch (e) {
        console.error("Airtable fetch failed:", e);
        if (alive) setError(e.message || "Failed to load Airtable data");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <div className="container">
      <h1 className="page-title">AI APIs</h1>
      <p className="page-sub">Compare pricing, latency, and free tiers across providers.</p>

      <div className="card">
        <div className="controls">
          <select className="select"><option>All Providers</option></select>
          <select className="select"><option>All Categories</option></select>
          <select className="select"><option>Free Tier (Any)</option></select>
          <input className="input" placeholder="Search…" />
        </div>

        {/* Show fetch error ABOVE the table */}
        {error && <div className="alert error">Error: {error}</div>}

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>API Name</th>
                <th>Provider</th>
                <th>Category</th>
                <th>Pricing</th>
                <th>Unit</th>
                <th>Free Tier</th>
                <th>Latency</th>
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

              {!isLoading && !error && rows.map((r) => (
                <tr key={r.id}>
                  <td><strong>{r.apiName || "—"}</strong></td>
                  <td>{r.provider || "—"}</td>
                  <td><span className="chip">{r.category || "—"}</span></td>
                  <td className="right">{r.price == null ? "—" : `$${r.price.toFixed(2)}`}</td>
                  <td>{r.unit || "—"}</td>
                  <td>{r.freeTier || "None"}</td>
                  <td>{r.latency == null ? "—" : `≈${Math.round(r.latency)} ms`}</td>
                  <td>{r.docsUrl
                    ? <a className="link" href={r.docsUrl} target="_blank" rel="noopener">Docs</a>
                    : <span className="muted">—</span>}</td>
                  <td className="muted">{r.notes || "—"}</td>
                </tr>
              ))}

              {!isLoading && !error && rows.length === 0 && (
                <tr><td colSpan={9}><div className="empty">No rows found in Airtable.</div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
