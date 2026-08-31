import Link from "next/link";

type Stat = { value: React.ReactNode; label: string };

export function CatalogueEntry({
  href,
  code,
  status,
  live,
  title,
  description,
  stats,
}: {
  href: string;
  code: React.ReactNode;
  status: string;
  live?: boolean;
  title: string;
  description: string;
  stats: Stat[];
}) {
  return (
    <Link
      href={href}
      className="grid grid-cols-1 items-start gap-4 border-b border-rule py-9 no-underline text-inherit hover:bg-paper-2 md:grid-cols-[118px_1fr_300px] md:gap-8"
    >
      <span className="pt-1 font-mono text-[11px] leading-relaxed tracking-[.12em] text-ink-2">
        {code}
      </span>
      <div>
        <span
          className={`mb-3.5 inline-block border px-2 py-[3px] font-mono text-[9.5px] tracking-[.13em] uppercase ${
            live
              ? "border-ink bg-ink text-paper"
              : "border-ink-2 text-ink-2"
          }`}
        >
          {status}
        </span>
        <h3 className="mb-3 text-[clamp(23px,2.7vw,31px)] font-display font-semibold tracking-[-.01em]">
          {title}
        </h3>
        <p className="max-w-[52ch] text-[16.5px] text-ink-2">{description}</p>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-4">
        {stats.map((s) => (
          <div key={s.label}>
            <span className="block font-display text-[29px] font-semibold leading-none tracking-[-.02em] tabular-nums">
              {s.value}
            </span>
            <span className="mt-1.5 block font-mono text-[9.5px] tracking-[.11em] text-ink-2 uppercase">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </Link>
  );
}
