// api/airtable.js

function setCORS(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

export default async function handler(req, res) {
  setCORS(res);

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  try {
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_TABLE_NAME; // can be table ID (tbl...)
    const token = process.env.AIRTABLE_API_KEY;

    if (!baseId || !tableName || !token) {
      return res.status(500).json({
        error: "Missing Airtable env vars",
        have: {
          AIRTABLE_BASE_ID: !!baseId,
          AIRTABLE_TABLE_NAME: !!tableName,
          AIRTABLE_API_KEY: !!token,
        },
      });
    }

    const max = Math.min(parseInt(req.query.max || "50", 10), 100);
    const url = new URL(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`);
    url.searchParams.set("pageSize", String(max));

    const r = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!r.ok) {
      const text = await r.text();
      return res.status(r.status).json({ error: "Airtable error", detail: text });
    }

    const data = await r.json();
    const rows = (data.records || []).map((rec) => ({ id: rec.id, fields: rec.fields }));

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({ count: rows.length, rows });
  } catch (e) {
    return res.status(500).json({ error: "Server error", message: String(e) });
  }
}
