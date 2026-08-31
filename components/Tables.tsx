/** The plain workhorse key/value table — label left, mono value right. */
export function Kv({ rows }: { rows: { k: string; v: React.ReactNode; hl?: boolean }[] }) {
  return (
    <table className="w-full border-collapse font-mono text-[13px]">
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className={r.hl ? "bg-ink text-paper" : ""}>
            <td className="border-b border-paper-2 py-2.5 pr-2 pl-2.5 font-body text-[15.5px]">
              {r.k}
            </td>
            <td className="border-b border-paper-2 py-2.5 pr-2.5 pl-2 text-right">{r.v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export type Col = { label: string; align?: "left" | "right" };

/** A wider data table — numeric columns, right-aligned, a bold first column. */
export function WideTable({
  columns,
  rows,
  className = "",
}: {
  columns: Col[];
  rows: { cells: React.ReactNode[]; hl?: boolean; dim?: boolean }[];
  className?: string;
}) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full border-collapse font-mono text-[12.5px] tabular-nums">
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th
                key={i}
                className={`whitespace-nowrap border-b border-ink pb-2.5 text-[10.5px] font-medium tracking-[.12em] text-ink-3 uppercase ${
                  i === 0 || c.align === "left" ? "pr-3 pl-2.5 text-left" : "px-3 text-right"
                }`}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className={r.hl ? "bg-ink text-paper" : r.dim ? "text-ink-3" : ""}>
              {r.cells.map((cell, ci) => (
                <td
                  key={ci}
                  className={`border-b border-paper-2 py-3 ${
                    ci === 0
                      ? "pr-3 pl-2.5 text-left font-body text-[15px]"
                      : "px-3 text-right whitespace-nowrap"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
