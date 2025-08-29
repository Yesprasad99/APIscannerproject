// api/airtable.js
export default async function handler(req, res) {
  const KEY   = process.env.AIRTABLE_API_KEY;   // ✅ matches your Vercel var
  const BASE  = process.env.AIRTABLE_BASE_ID;
  const TABLE = process.env.AIRTABLE_TABLE_ID;
  const VIEW  = process.env.AIRTABLE_VIEW;

  if (!KEY || !BASE || !TABLE) {
    return res.status(500).json({ error: "Missing Airtable env vars on server" });
  }

  const url = new URL(`https://api.airtable.com/v0/${BASE}/${TABLE}`);
  if (VIEW) url.searchParams.set("view", VIEW);

  const r = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${KEY}` }
  });

  const text = await r.text();
  if (!r.ok) return res.status(r.status).send(text);

  // Cache for 5 minutes
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(204).end();

  return res.status(200).send(text);
}
