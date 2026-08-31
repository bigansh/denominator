export function Bar({
  label,
  value,
  pct,
  color,
  subject,
  median,
}: {
  label: string;
  value: React.ReactNode;
  pct: number;
  color: string;
  subject?: boolean;
  median?: number;
}) {
  return (
    <div className="mb-2.5 grid grid-cols-[minmax(110px,190px)_1fr_92px] items-center gap-4">
      <span className="font-mono text-[11.5px] tracking-[.04em] uppercase">{label}</span>
      <span
        className={`relative block h-[22px] bg-paper-2 ${subject ? "outline outline-2 -outline-offset-2 outline-paper" : ""}`}
      >
        <span
          className="block h-full"
          style={{ width: `${Math.max(pct, 0.8)}%`, background: color }}
        />
        {median != null && (
          <span
            className="absolute -top-[3px] -bottom-[3px] w-px bg-ink"
            style={{ left: `${median}%` }}
          />
        )}
      </span>
      <span className="whitespace-nowrap text-right font-mono text-[13px] tabular-nums">
        {value}
      </span>
    </div>
  );
}

type LedgerSeg = { n: number; label: string; bg: string; fg?: string };

export function Ledger({ segments }: { segments: LedgerSeg[] }) {
  const total = segments.reduce((a, s) => a + s.n, 0);
  return (
    <div>
      <div className="flex h-[60px] overflow-hidden border border-ink">
        {segments.map((s) => (
          <span
            key={s.label}
            className="flex items-center justify-center overflow-hidden font-mono text-[11.5px] tracking-[.05em] whitespace-nowrap"
            style={{ width: `${(s.n / total) * 100}%`, background: s.bg, color: s.fg }}
          >
            {s.n}
          </span>
        ))}
      </div>
      <div className="mt-3.5 flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-[11.5px] text-ink-2">
        {segments.map((s) => (
          <span key={s.label}>
            <span
              className="mr-1.5 inline-block h-2.5 w-2.5 align-middle"
              style={{ background: s.bg }}
            />
            <b className="font-medium text-ink">{s.n}</b> {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}
