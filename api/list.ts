import type { VercelRequest, VercelResponse } from '@vercel/node';
import { APIS } from './data';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const q = (req.query.q as string) || "";
  const limit = Math.min(parseInt(String(req.query.limit || 20), 10), 50);
  const cursor = (req.query.offset as string) || null;

  const rows = APIS
    .filter(r => !q || r.name.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const start = cursor ? parseInt(Buffer.from(cursor, "base64").toString("utf8"), 10) : 0;
  const slice = rows.slice(start, start + limit);
  const nextStart = start + slice.length;
  const offset = nextStart < rows.length ? Buffer.from(String(nextStart)).toString("base64") : null;

  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ items: slice, offset, total: rows.length });
}
