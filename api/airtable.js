// api/airtable.js
export default async function handler(req, res) {
  try {
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_TABLE_NAME;
    const token = process.env.AIRTABLE_API_KEY;

    if (!baseId || !tableName || !token) {
      return res.status(500).json({ error: "Missing Airtable env vars" });
    }

    const url = new URL(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`);
    url.searchParams.set("pageSize", "10");

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: "Airtable error", detail: text });
    }

    const data = await response.json();
    const rows = data.records.map((rec) => ({
      id: rec.id,
      fields: rec.fields,
    }));

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({ count: rows.length, rows });
  } catch (err) {
    return res.status(500).json({ error: "Server error", message: String(err) });
  }
}

