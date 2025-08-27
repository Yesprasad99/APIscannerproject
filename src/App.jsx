import { useEffect, useState } from "react";

export default function App() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/airtable?max=50");
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = await r.json();
        setRows(data.rows || []);
      } catch (e) {
        setErr(String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main style={{ maxWidth: 1000, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1 style={{ marginBottom: 8 }}>API Scanner — Live from Airtable</h1>
      <p style={{ color: "#666", marginBottom: 20 }}>
        Showing {rows.length} APIs from your Airtable base.
      </p>

      {loading && <p>Loading…</p>}
      {err && <p style={{ color: "crimson" }}>Error: {err}</p>}

      {!loading && !err && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["API Name", "Provider", "Category", "Pricing", "Unit", "Free Tier", "Latency", "Link"].map(h => (
                <th key={h} style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => {
              const f = r.fields || {};
              return (
                <tr key={r.id}>
                  <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{f["API Name"]}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{f["Provider"]}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{f["Category"]}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{f["Pricing"]}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{f["Unit"]}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{f["Free Tier"]}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{f["Latency"]}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                    {f["Link"] ? <a href={f["Link"]} target="_blank" rel="noreferrer">Docs</a> : ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </main>
  );
}
