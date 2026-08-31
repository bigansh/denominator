"use client";

import { Fragment, useMemo, useState } from "react";
import type { Country, TOIRaw } from "@/lib/toi";
import { rampColor } from "@/lib/ramp";

type SortKey = keyof Country;

export function CountryTable({ countries, raw }: { countries: Country[]; raw: TOIRaw }) {
  const [q, setQ] = useState("");
  const [region, setRegion] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("TOI");
  const [sortDir, setSortDir] = useState<1 | -1>(-1);
  const [openRow, setOpenRow] = useState<string | null>(null);

  const regions = useMemo(
    () => [...new Set(countries.map((c) => c.region))].sort(),
    [countries],
  );

  const rows = useMemo(() => {
    const t = q.toLowerCase();
    const r = countries.filter(
      (c) => c.country.toLowerCase().includes(t) && (!region || c.region === region),
    );
    r.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string" && typeof bv === "string") {
        return sortDir * av.localeCompare(bv);
      }
      return sortDir * ((av as number) - (bv as number));
    });
    return r;
  }, [countries, q, region, sortKey, sortDir]);

  function toggleSort(k: SortKey) {
    if (sortKey === k) {
      setSortDir((d) => (d === 1 ? -1 : 1) as 1 | -1);
    } else {
      setSortKey(k);
      setSortDir(k === "country" || k === "region" ? 1 : -1);
    }
  }

  const HEAD: { k: SortKey; label: string }[] = [
    { k: "Rank", label: "#" },
    { k: "country", label: "Country" },
    { k: "region", label: "Region" },
    { k: "pop1019_m", label: "Teens m" },
    { k: "LifeScore", label: "Life" },
    { k: "FutureScore", label: "Future" },
    { k: "TOI", label: "Index" },
    { k: "Percentile", label: "Ctry pct" },
    { k: "pop_pct", label: "Pop pct" },
  ];

  const HIDE_ON_MOBILE = new Set(["region", "pop1019_m", "LifeScore", "FutureScore", "Percentile"]);

  return (
    <div>
      <div className="mb-4.5 flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Search country"
          aria-label="Search country"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="border border-rule bg-paper px-2.5 py-2 font-mono text-[12.5px] text-ink"
        />
        <select
          aria-label="Filter by region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="border border-rule bg-paper px-2.5 py-2 font-mono text-[12.5px] text-ink"
        >
          <option value="">All regions</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <span className="font-mono text-[11px] tracking-[.18em] text-ink-2 uppercase">
          {rows.length} of {countries.length}
        </span>
      </div>

      <div className="overflow-x-auto border-t border-ink">
        <table className="w-full min-w-max border-collapse font-mono text-[13px]">
          <thead>
            <tr>
              {HEAD.map((h) => (
                <th
                  key={h.k}
                  onClick={() => toggleSort(h.k)}
                  className={`cursor-pointer border-b border-rule py-3 px-2.5 text-right text-[10px] font-medium tracking-[.1em] text-ink-2 uppercase whitespace-nowrap ${
                    h.k === "country" || h.k === "Rank" ? "text-left" : ""
                  } ${HIDE_ON_MOBILE.has(h.k) ? "max-md:hidden" : ""}`}
                >
                  {h.label}
                  {sortKey === h.k && (sortDir === 1 ? " ▲" : " ▼")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => {
              const isIndia = c.country === "India";
              const isOpen = openRow === c.country;
              return (
                <Fragment key={c.country}>
                  <tr
                    onClick={() => setOpenRow(isOpen ? null : c.country)}
                    className={`cursor-pointer ${isIndia ? "bg-ink font-semibold text-paper" : "hover:bg-paper-2"}`}
                  >
                    <td className="border-b border-paper-2 py-2.5 px-2.5 text-left whitespace-nowrap">
                      <span
                        className={`mr-1.5 inline-block w-2.5 text-[9px] text-ink-3 transition-transform ${isOpen ? "rotate-90" : ""}`}
                      >
                        ▶
                      </span>
                      {c.Rank}
                    </td>
                    <td className="border-b border-paper-2 py-2.5 px-2.5 text-left font-body text-[15px] whitespace-nowrap">
                      <span
                        className="mr-1.5 inline-block h-[11px] w-[34px] align-[-1px]"
                        style={{ background: rampColor(c.TOI) }}
                      />
                      {c.country}
                    </td>
                    <td className={`border-b border-paper-2 py-2.5 px-2.5 text-right whitespace-nowrap max-md:hidden`}>
                      {c.region}
                    </td>
                    <td className={`border-b border-paper-2 py-2.5 px-2.5 text-right whitespace-nowrap max-md:hidden`}>
                      {c.pop1019_m.toFixed(1)}
                    </td>
                    <td className={`border-b border-paper-2 py-2.5 px-2.5 text-right whitespace-nowrap max-md:hidden`}>
                      {c.LifeScore.toFixed(1)}
                    </td>
                    <td className={`border-b border-paper-2 py-2.5 px-2.5 text-right whitespace-nowrap max-md:hidden`}>
                      {c.FutureScore.toFixed(1)}
                    </td>
                    <td className="border-b border-paper-2 py-2.5 px-2.5 text-right whitespace-nowrap">
                      <b>{c.TOI.toFixed(1)}</b>
                    </td>
                    <td className={`border-b border-paper-2 py-2.5 px-2.5 text-right whitespace-nowrap max-md:hidden`}>
                      {c.Percentile.toFixed(1)}
                    </td>
                    <td className="border-b border-paper-2 py-2.5 px-2.5 text-right whitespace-nowrap">
                      {c.pop_pct.toFixed(1)}
                    </td>
                  </tr>
                  {isOpen && (
                    <tr className="border-b border-rule">
                      <td colSpan={9} className="p-0">
                        <RowDetail c={c} raw={raw} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RowDetail({ c, raw }: { c: Country; raw: TOIRaw }) {
  const obs = raw.observations?.[c.country] || {};
  const byDim: Record<string, string[]> = {};
  Object.keys(raw.indicators).forEach((id) => {
    const dim = raw.indicators[id].dimension;
    (byDim[dim] = byDim[dim] || []).push(id);
  });

  const agg: { rl: string; rv: string }[] = [
    { rl: "Region", rv: c.region },
    { rl: "Teens (m)", rv: c.pop1019_m.toFixed(1) },
    { rl: "Life score", rv: c.LifeScore.toFixed(1) },
    { rl: "Future score", rv: c.FutureScore.toFixed(1) },
    { rl: "Country pct", rv: c.Percentile.toFixed(1) },
    { rl: "Population pct", rv: c.pop_pct.toFixed(1) },
    {
      rl: "Aggregate score",
      rv:
        c.toiLow != null
          ? `${c.TOI.toFixed(1)} [${c.toiLow.toFixed(1)}–${c.toiHigh!.toFixed(1)}]`
          : c.TOI.toFixed(1),
    },
  ];

  return (
    <div className="bg-paper-2 px-2.5 pt-4.5 pb-5">
      <div className="mb-3.5 flex flex-wrap gap-6 border-b border-ink pb-3.5">
        {agg.map((a) => (
          <div key={a.rl}>
            <span className="mb-0.5 block font-mono text-[9px] tracking-[.12em] text-ink-2 uppercase">{a.rl}</span>
            <span className="font-display text-[19px] font-semibold">{a.rv}</span>
          </div>
        ))}
      </div>
      {Object.keys(raw.dimensions).map((d) => {
        const dim = raw.dimensions[d];
        const ids = byDim[d] || [];
        if (!ids.length) return null;
        return (
          <div key={d}>
            <div className="mt-4 mb-1.5 font-display text-[13px] font-semibold tracking-[-.01em] first:mt-0">
              {dim.label}
              <span className="ml-2 font-mono text-[9.5px] font-normal tracking-[.06em] text-ink-3">
                {dim.weight} pts
              </span>
            </div>
            {ids.map((id) => {
              const m = raw.indicators[id];
              const o = obs[id];
              if (!o) return null;
              const hasBand = o.low != null && o.high != null && o.low !== o.high;
              return (
                <div
                  key={id}
                  className="grid grid-cols-[minmax(140px,1.4fr)_minmax(120px,1fr)_30px_minmax(140px,1.3fr)] items-baseline gap-3 border-b border-rule py-1.5 text-[12px] max-md:grid-cols-[1fr_90px_24px]"
                >
                  <span>{m.label}</span>
                  <span className="text-right font-mono tabular-nums">
                    {o.value} <small className="text-ink-3">{m.unit}</small>
                    {hasBand && (
                      <small className="text-ink-3">
                        {" "}
                        [{o.low}–{o.high}]
                      </small>
                    )}
                  </span>
                  <span
                    className={`self-center border py-px text-center font-mono text-[9px] ${
                      o.tier === "C" ? "border-s2 text-s2" : "border-ink-3 text-ink-3"
                    }`}
                  >
                    {o.tier}
                  </span>
                  <span className="font-mono text-[10px] leading-normal text-ink-2 max-md:col-span-full">
                    {o.source}
                  </span>
                  {o.note && (
                    <span className="col-span-full mt-0.5 font-body text-[11.5px] text-ink-3 italic">
                      {o.note}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
      <p className="mt-3.5 font-mono text-[10.5px] leading-relaxed tracking-[.03em] text-ink-3">
        Index = 0.5 × Life Score + 0.5 × Future Score.
        {c.toiLow != null &&
          " The bracketed range is the published band across every indicator's sourced low/high value."}
        {" "}Tier A = counted/undisputed · B = measured with comparability limits · C = perceptual or modelled.
      </p>
    </div>
  );
}
