type Cell = "yes" | "part" | "no";

const CELL_STYLE: Record<Cell, string> = {
  yes: "bg-s5 text-paper",
  part: "bg-s3 text-ink",
  no: "text-ink-3",
};

export function Ladder({
  columns,
  rows,
}: {
  columns: [string, string];
  rows: { harm: string; n?: string; cells: [{ v: Cell; t: string }, { v: Cell; t: string }] }[];
}) {
  return (
    <div className="mt-6 border border-ink">
      <div className="grid grid-cols-[1fr_128px_128px] border-b border-ink max-md:grid-cols-[1fr_84px_84px]">
        <div />
        <div className="p-3 text-center font-mono text-[10px] tracking-[.13em] text-ink-3 uppercase">
          {columns[0]}
        </div>
        <div className="p-3 text-center font-mono text-[10px] tracking-[.13em] text-ink-3 uppercase">
          {columns[1]}
        </div>
      </div>
      {rows.map((r) => (
        <div
          key={r.harm}
          className="grid grid-cols-[1fr_128px_128px] border-b border-paper-2 last:border-0 max-md:grid-cols-[1fr_84px_84px]"
        >
          <div className="flex items-center gap-3 p-3.5 text-[15.5px]">
            {r.harm}
            {r.n && <span className="font-mono text-[11px] text-ink-3">{r.n}</span>}
          </div>
          {r.cells.map((c, i) => (
            <div
              key={i}
              className={`flex items-center justify-center border-l border-paper-2 p-3.5 font-mono text-[12px] max-md:p-2.5 max-md:text-[10.5px] ${CELL_STYLE[c.v]}`}
            >
              {c.t}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
