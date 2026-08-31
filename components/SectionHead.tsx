"use client";

import { motion, useReducedMotion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function SectionHead({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className="mb-9"
      initial={reduced ? undefined : { opacity: 0, y: 18 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      <span className="mb-3.5 block font-mono text-[11px] tracking-[.18em] text-ink-2 uppercase">
        {eyebrow}
      </span>
      <h2 className="max-w-[26ch] font-display text-[clamp(25px,3.2vw,38px)] font-semibold tracking-[-.02em]">
        {title}
      </h2>
      {sub && <p className="mt-3.5 max-w-[62ch] text-[16.5px] text-ink-2">{sub}</p>}
    </motion.div>
  );
}

export function Jumpnav({ items }: { items: { href: string; label: string }[] }) {
  return (
    <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1.5">
      {items.map((i) => (
        <a
          key={i.href}
          href={i.href}
          className="whitespace-nowrap border-b border-transparent font-mono text-[11px] tracking-[.08em] text-ink-2 uppercase no-underline hover:border-ink hover:text-ink"
        >
          {i.label}
        </a>
      ))}
    </div>
  );
}

export function Kicker({ items }: { items: { label: string; dark?: boolean }[] }) {
  return (
    <div className="mb-5 flex gap-2.5">
      {items.map((i) => (
        <span
          key={i.label}
          className={`border px-2.5 py-1 font-mono text-[10.5px] tracking-[.14em] uppercase ${
            i.dark ? "border-ink bg-ink text-paper" : "border-ink"
          }`}
        >
          {i.label}
        </span>
      ))}
    </div>
  );
}
