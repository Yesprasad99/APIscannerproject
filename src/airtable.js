// src/airtable.js
export async function fetchAPIs() {
  const res = await fetch("/api/airtable");
  if (!res.ok) throw new Error(`Proxy error ${res.status}: ${await res.text()}`);
  const { records } = await res.json();

  const seen = new Set();
  return records
    .map(r => {
      const f = r.fields || {};
      return {
        id: r.id,
        apiName: f["API Name"],
        provider: f["Provider"],
        category: f["Category"],
        price: parseFloat(String(f["Pricing"] || "").replace(/[^0-9.]/g, "")) || 0,
        unit: f["Unit"],
        freeTier: f["Free Tier"],
        latency: parseInt(String(f["Latency"] || "").replace(/[^0-9]/g, "")) || null,
        docsUrl: f["Link"],
        notes: f["Notes"],
      };
    })
    .filter(r => !seen.has(r.apiName) && seen.add(r.apiName));
}
