// src/components/SmartTable.jsx
import React, { useMemo, useState } from "react";
import ErrorBox from "./ErrorBox";

/**
 * Reusable DataTable with:
 * - Global search
 * - Click-to-sort (ASC/DESC/NONE)
 * - Optional custom cell renderers
 * - Lightweight styling
 */
export default function DataTable({
  data = [],
  columns = [],
  initialSort = { key: "", dir: null }, // dir: "asc" | "desc" | null
  searchPlaceholder = "Search…",
  className = "",
  error = null, // 👈 accept error from parent
}) {
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState(initialSort.key || "");
  const [sortDir, setSortDir] = useState(initialSort.dir ?? null);

  function cycleSort(key) {
    if (key !== sortKey) {
      setSortKey(key);
      setSortDir("asc");
      return;
    }
    if (sortDir === "asc") setSortDir("desc");
    else if (sortDir === "desc") setSortDir(null);
    else setSortDir("asc");
  }

  const filtered = useMemo(() => {
    if (!q.trim()) return data;
    const needle = q.toLowerCase();
    return data.filter((row) =>
      columns.some((c) => {
        const v =
          typeof c.render === "function"
            ? ""
            : String(row[c.key] ?? "").toLowerCase();
        return v.includes(needle);
      })
    );
  }, [q, data, columns]);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    const head = [...filtered];
    head.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];

      const an = Number(av);
      const bn = Number(bv);
      const aIsNum = !Number.isNaN(an);
      const bIsNum = !Number.isNaN(bn);
      let cmp = 0;

      if (aIsNum && bIsNum) cmp = an - bn;
      else
        cmp = String(av ?? "").localeCompare(
          String(bv ?? ""),
          undefined,
          { sensitivity: "base", numeric: true }
        );

      return sortDir === "asc" ? cmp : -cmp;
    });
    return head;
  }, [filtered, sortKey, sortDir]);

  return (
    <div className={`rounded-xl border shadow-sm bg-white ${className}`}>
      {/* Toolbar */}
      <div className="p-3 border-b flex items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full sm:max-w-xs border rounded px-3 py-2"
        />
        {sortKey && (
          <div className="text-sm text-gray-500">
            Sorted by <b>{columns.find((c) => c.key === sortKey)?.header}</b> ({sortDir})
          </div>
        )}
      </div>

      {/* 🔴 Error (clean box, above table) */}
      {error && (
        <div className="p-3">
          <ErrorBox message={error.message || String(error)} />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50 sticky top-0">
            <tr className="text-left text-gray-700">
              {columns.map((c) => {
                const sortable = c.sortable;
                const isActive = sortKey === c.key && sortDir;
                return (
                  <th
                    key={c.key}
                    onClick={sortable ? () => cycleSort(c.key) : undefined}
                    className={`px-4 py-3 border-b font-semibold whitespace-nowrap ${
                      sortable ? "cursor-pointer select-none" : ""
                    }`}
                  >
                    <span className="inline-flex items-center gap-1">
                      {c.header}
                      {sortable && (
                        <span className="text-xs text-gray-500">
                          {isActive ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                        </span>
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr key={row.id ?? i} className="hover:bg-gray-50">
                {columns.map((c) => {
                  const raw = row[c.key];
                  const content =
                    typeof c.render === "function" ? c.render(row) : raw;
                  const align =
                    c.align === "right"
                      ? "text-right"
                      : c.align === "center"
                      ? "text-center"
                      : "text-left";
                  return (
                    <td
                      key={c.key}
                      className={`px-4 py-3 border-b align-middle ${align}`}
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))}
            {!sorted.length && (
              <tr>
                <td className="px-4 py-6 text-gray-500" colSpan={columns.length}>
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
