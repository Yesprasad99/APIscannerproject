// /api/search.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

const AIRTABLE_API = "https://api.airtable.com/v0";
const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const table = (req.query.table as string) || "APIs";
    const q = (req.query.q as string)?.trim() || "";
    const view = (req.query.view as string) || "Grid view";
    const pageSize = Math.min(parseInt(String(req.query.pageSize || 20)), 50);

    // Simple case-insensitive match over a few fields
    const fields = ["Name", "Category", "Description"];
    const ors = fields.map(f => `FIND(LOWER("${q.replace(/"/g, '\\"')}"), LOWER({${f}}))`);
    const formula = q ? `OR(${ors.join(",")})` : "TRUE()";

    const url = new URL(`${AIRTABLE_API}/${AIRTABLE_BASE_ID}/${encodeURIComponent(table)}`);
    url.searchParams.set("filterByFormula", formula);
    url.searchParams.set("pageSize", String(pageSize));
    url.searchParams.set("view", view);

    const r = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
    });
    if (!r.ok) {
      const text = await r.text();
      return res.status(r.status).json({ error: text });
    }
    const json = await r.json();

    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    res.status(200).json(json);
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "Unknown error" });
  }
}
