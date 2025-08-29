const API = "https://api.airtable.com/v0";
const KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
const BASE = import.meta.env.VITE_AIRTABLE_BASE_ID;
const TABLE_NAME = import.meta.env.VITE_AIRTABLE_TABLE;
const TABLE_ID = import.meta.env.VITE_AIRTABLE_TABLE_ID;

export async function fetchAirtableRows() {
  const tablePath = TABLE_ID || encodeURIComponent(TABLE_NAME);
  const url = `${API}/${BASE}/${tablePath}?view=Grid%20view`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${KEY}` } });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Airtable error ${res.status}: ${text}`);
  }
  const data = await res.json();
  return data.records.map(r => ({
    id: r.id,
    apiName: r.fields["API Name"] ?? "",
    provider: r.fields["Provider"] ?? "",
    category: r.fields["Category"] ?? "",
    pricing: r.fields["Pricing"] ?? "",
    unit: r.fields["Unit"] ?? "",
    freeTier: r.fields["Free Tier"] ?? "",
  }));
}
