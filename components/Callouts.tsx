import { Reveal } from "./Reveal";

/** "What this page does not claim" — a bordered list, each item a hard boundary. */
export function ClaimBoundary({
  title,
  items,
}: {
  title: string;
  items: { strong: string; rest: string }[];
}) {
  return (
    <Reveal className="mt-8 border border-ink p-6">
      <span className="font-mono text-[11px] tracking-[.18em] text-ink-2 uppercase">
        {title}
      </span>
      <ul className="mt-3.5 list-none p-0">
        {items.map((it, i) => (
          <li
            key={i}
            className="relative max-w-[70ch] border-b border-paper-2 py-2.5 pl-5 text-[15.5px] text-ink-2 last:border-0"
          >
            <span className="absolute left-0 font-mono text-s1">—</span>
            <strong className="font-medium text-ink">{it.strong}</strong> {it.rest}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

/** A two-up headline stat comparison — left plain, right inverted. */
export function Duo({
  left,
  right,
}: {
  left: { eyebrow: string; big: React.ReactNode; cap: string };
  right: { eyebrow: string; big: React.ReactNode; cap: string };
}) {
  return (
    <Reveal className="mt-6 grid grid-cols-1 border border-ink md:grid-cols-2">
      <div className="border-b border-ink p-6 md:border-b-0 md:border-r">
        <span className="font-mono text-[11px] tracking-[.18em] text-ink-2 uppercase">
          {left.eyebrow}
        </span>
        <div className="my-2.5 font-display text-[clamp(36px,5.6vw,58px)] font-semibold leading-none tracking-[-.02em] tabular-nums">
          {left.big}
        </div>
        <p className="max-w-[34ch] text-[14.5px] text-ink-2">{left.cap}</p>
      </div>
      <div className="bg-ink p-6 text-paper">
        <span className="font-mono text-[11px] tracking-[.18em] text-paper-3 uppercase">
          {right.eyebrow}
        </span>
        <div className="my-2.5 font-display text-[clamp(36px,5.6vw,58px)] font-semibold leading-none tracking-[-.02em] tabular-nums">
          {right.big}
        </div>
        <p className="max-w-[34ch] text-[14.5px] text-paper-3">{right.cap}</p>
      </div>
    </Reveal>
  );
}

export function SrcNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3.5 max-w-[76ch] font-mono text-[11px] tracking-[.02em] text-ink-3">
      {children}
    </p>
  );
}
