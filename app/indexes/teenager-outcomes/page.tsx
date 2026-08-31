import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SectionHead, Jumpnav } from "@/components/SectionHead";
import { Duo } from "@/components/Callouts";
import { Kv } from "@/components/Tables";
import { Bar } from "@/components/Bars";
import { RibbonChart } from "@/components/RibbonChart";
import { CountryTable } from "@/components/CountryTable";
import { getTOIData } from "@/lib/data";
import { parseCountries } from "@/lib/toi";
import { rampColor } from "@/lib/ramp";

export const metadata: Metadata = {
  title: "Teenager Outcomes Index",
  description:
    "125 countries, 18 indicators, 1.24 billion adolescents. Scored per country and per teenager — the two answers disagree.",
};

const JUMPNAV = [
  { href: "#build", label: "Construction" },
  { href: "#method", label: "Method" },
  { href: "#sources", label: "Sources & limits" },
  { href: "#contested", label: "Contested" },
  { href: "#table", label: "All 125" },
  { href: "#thesis", label: "India, two rankings" },
  { href: "#india", label: "The India case" },
  { href: "#ledger", label: "The ledger" },
  { href: "#within", label: "Within India" },
  { href: "#contribute", label: "Contribute" },
];

const DIMENSIONS = [
  ["Education & learning", 25, "Future", "Completion · learning outcome · youth literacy"],
  ["Health & survival", 15, "Life", "Under-5 mortality · adolescent fertility · stunting"],
  ["Mental & social wellbeing", 15, "Life", "Suicide mortality · life evaluation"],
  ["Safety & protection", 15, "Life", "Homicide · child marriage · child labour"],
  ["Economic future", 15, "Future", "Youth NEET · youth unemployment · NEET gender gap"],
  ["Digital & opportunity", 10, "Future", "Internet use · mobile broadband"],
  ["Living environment", 5, "Life", "Basic water · electricity"],
] as const;

const DIM_BAR_ORDER: [string, string][] = [
  ["living", "Living env."],
  ["safety", "Safety"],
  ["health", "Health"],
  ["education", "Education"],
  ["digital", "Digital"],
  ["mental", "Mental & social"],
  ["economic", "Economic"],
];

const FUTURE_BREAKDOWN = [
  ["Lower-sec completion", 14.9, 17.5],
  ["Youth literacy", 11.4, 12.5],
  ["Learning outcome", 6.7, 20.0],
  ["Internet use", 9.0, 14.0],
  ["Mobile broadband", 3.3, 6.0],
  ["Youth unemployment", 3.6, 7.5],
  ["Youth NEET", 0.4, 15.0],
  ["NEET gender gap", 0.0, 7.5],
] as const;

const SENSITIVITY = [
  ["Baseline", "35.5", "81"],
  ["Equal dimension weights", "34.7", "82"],
  ["Economic 15→25, Education 25→15", "27.4", "91"],
  ["Economic 15→5, Education 25→35", "39.5", "76"],
  ["Mental dimension dropped", "38.7", "77"],
  ["Life Score only", "35.5", "81"],
  ["Future Score only", "35.5", "81"],
  ["No winsorisation", "37.9", "78"],
  ["Z-score normalisation", "35.5", "81"],
] as const;

const CLAIM = [
  ["Better than 25% of world teens", "top 80%", "202m"],
  ["Better than 40%", "top 50%", "126m"],
  ["Better than 50%", "top 30%", "76m"],
  ["Better than 60%", "top 15%", "38m"],
  ["Better than 70%", "top 5%", "13m"],
  ["Better than 75%", "nobody", "0"],
] as const;

export default function TeenagerOutcomes() {
  const raw = getTOIData();
  const countries = parseCountries(raw);
  const india = countries.find((c) => c.country === "India")!;
  const totalPop = raw.meta.adolescents_millions;

  const below = countries.filter((c) => c.TOI < india.TOI).sort((a, b) => b.pop1019_m - a.pop1019_m);
  const above = countries.filter((c) => c.TOI > india.TOI).sort((a, b) => b.pop1019_m - a.pop1019_m);
  const cumRows = (list: Country[], restLabel: string, restCountries: number, restPop: number, restPct: string) => {
    let cum = 0;
    const top = list.slice(0, 10).map((c) => {
      cum += c.pop1019_m;
      return { k: c.country, v: `${c.pop1019_m.toFixed(0)}m`, pct: `${((cum / totalPop) * 100).toFixed(1)}%` };
    });
    return [...top, { k: `+ ${restCountries} more countries`, v: `${restPop}m`, pct: `${restPct}%` }];
  };
  const belowPct = ((below.reduce((s, c) => s + c.pop1019_m, 0) / totalPop) * 100).toFixed(1);
  const abovePct = ((above.reduce((s, c) => s + c.pop1019_m, 0) / totalPop) * 100).toFixed(1);
  const belowPop = below.reduce((s, c) => s + c.pop1019_m, 0);
  const abovePop = above.reduce((s, c) => s + c.pop1019_m, 0);

  return (
    <>
      <Header />
      <main>
        <div className="mx-auto max-w-[1180px] px-gut pt-[clamp(44px,7.5vw,80px)] pb-10">
          <h1 className="max-w-[16ch] font-display text-[clamp(34px,6vw,68px)] font-semibold leading-[1.05] tracking-[-.02em]">
            A billion teenagers, sorted by{" "}
            <span className="underline decoration-s2 decoration-[3px] underline-offset-[8px]">
              what happens to them
            </span>
            .
          </h1>
          <p className="mt-5 max-w-[56ch] text-[clamp(17px,1.9vw,20px)] font-light text-ink-2">
            Eighteen indicators, seven dimensions, 125 countries — counted
            twice, once per country and once per teenager. The two answers
            disagree.
          </p>
          <Jumpnav items={JUMPNAV} />
          <RibbonChart countries={countries} />
        </div>

        <section id="build" className="border-t border-rule py-sec">
          <div className="mx-auto max-w-[1180px] px-gut">
            <SectionHead
              eyebrow="Construction"
              title="Seven dimensions, split evenly between now and next"
              sub="Four dimensions measure adolescence itself — 50 points. Three measure the launchpad into adulthood — the other 50."
            />
            <table className="w-full max-w-[820px] border-collapse text-[14.5px]">
              <thead>
                <tr>
                  <th className="border-b border-ink py-2.5 px-3.5 text-left font-mono text-[10px] font-medium tracking-[.1em] text-ink-2 uppercase">Dimension</th>
                  <th className="w-[70px] border-b border-ink py-2.5 px-3.5 text-right font-mono text-[10px] font-medium tracking-[.1em] text-ink-2 uppercase">Points</th>
                  <th className="border-b border-ink py-2.5 px-3.5 text-left font-mono text-[10px] font-medium tracking-[.1em] text-ink-2 uppercase">Indicators</th>
                </tr>
              </thead>
              <tbody>
                {DIMENSIONS.map(([name, w, block, ind]) => (
                  <tr key={name}>
                    <td className="border-b border-paper-2 py-3.5 pr-3.5 pl-0 font-body text-[16px]">
                      {name}
                      <span className="ml-2 border border-ink-3 px-1.5 py-0.5 align-[1px] font-mono text-[9.5px] tracking-[.08em] text-ink-3 uppercase">
                        {block}
                      </span>
                    </td>
                    <td className="border-b border-paper-2 py-3.5 px-3.5 text-right font-display text-[19px] font-semibold tabular-nums">
                      {w}
                    </td>
                    <td className="border-b border-paper-2 py-3.5 px-3.5 font-mono text-[13.5px] text-ink-2">
                      {ind}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-5 text-[15.5px] text-ink-2">
              Index = 0.5 × Life Score + 0.5 × Future Score.
            </p>
          </div>
        </section>

        <section id="method" className="border-t border-rule py-sec">
          <div className="mx-auto max-w-[1180px] px-gut">
            <SectionHead eyebrow="Method" title="How a score gets computed" />
            <div className="grid grid-cols-1 gap-11 md:grid-cols-2">
              <div>
                <p className="max-w-[60ch] text-[15.5px] text-ink-2">
                  Each indicator is clipped at the 5th and 95th percentile,
                  rescaled 0–100, inverted where lower is better. The
                  bounds are frozen, so a low/high run moves a country
                  against a fixed scale, not the scale itself.
                </p>
                <Kv
                  rows={[
                    { k: "positive indicator", v: <span className="font-mono">100 × (clip(x) − p05) / (p95 − p05)</span> },
                    { k: "negative indicator", v: <span className="font-mono">100 × (p95 − clip(x)) / (p95 − p05)</span> },
                  ]}
                />
                <p className="mt-4.5 max-w-[60ch] text-[15.5px] text-ink-2">
                  Indicators roll into seven dimensions by fixed weights,
                  above. Dimensions split into <strong>Life Score</strong>{" "}
                  (health, mental, safety, living) and{" "}
                  <strong>Future Score</strong> (education, economic,
                  digital), each 50 points, averaged evenly — a
                  comfortable present can&rsquo;t hide a poor launchpad.
                </p>
                <p className="mt-3.5 max-w-[60ch] text-[15.5px] text-ink-2">
                  Every observation carries a low/high value. The index
                  runs three times — central, most-favourable,
                  least-favourable — and publishes the spread as a band.
                  That&rsquo;s how a{" "}
                  <a href="#contested" className="border-b border-rule hover:border-ink">
                    contested indicator
                  </a>{" "}
                  gets handled: dropping it hides a judgement; staying
                  silent claims a precision the data doesn&rsquo;t have.
                </p>
                <p className="mt-3.5 max-w-[60ch] text-[15.5px] text-ink-2">
                  Two percentiles are published for every country: one
                  country, one vote; one teenager, one vote — worked
                  through with{" "}
                  <a href="#thesis" className="border-b border-rule hover:border-ink">
                    India as the example
                  </a>
                  , below. Full derivation in{" "}
                  <a
                    href="https://github.com/bigansh/denominator/blob/master/indexes/teenager-outcomes/docs/METHODOLOGY.md"
                    className="border-b border-rule hover:border-ink"
                  >
                    the methodology doc ↗
                  </a>
                  .
                </p>
              </div>
              <div>
                <h3 className="mb-2.5 font-display text-[20px] font-semibold">Sensitivity</h3>
                <p className="mb-3.5 max-w-[50ch] text-[15px] text-ink-2">
                  India&rsquo;s country percentile under nine alternative
                  specifications.
                </p>
                <Kv rows={SENSITIVITY.map(([k, toi, rank]) => ({ k, v: `${toi} · rank ${rank}`, hl: k === "Baseline" }))} />
                <p className="mt-3.5 text-[15px] text-ink-2">
                  Range 27–40, point estimate 35–36 — not an artefact of
                  weight choices.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="sources" className="border-t border-rule py-sec">
          <div className="mx-auto max-w-[1180px] px-gut">
            <SectionHead eyebrow="Sources & limits" title="What's measured, modelled, missing" />
            <p className="max-w-[68ch] text-[15.5px] text-ink-2">
              Every one of the 2,250 observations behind this index carries
              a source and a confidence tier. Open any row in{" "}
              <a href="#table" className="border-b border-rule hover:border-ink">
                the country table
              </a>{" "}
              to see its sources.
            </p>
            <div className="mt-4.5 grid grid-cols-1 gap-px border border-rule bg-rule md:grid-cols-3">
              {[
                ["A", "Physically counted or measured, nationally sourced, not seriously disputed — under-5 mortality, stunting, electricity access, homicide."],
                ["B", "Measured, but with real comparability problems across countries — youth NEET, child labour, learning outcomes, mobile broadband."],
                ["C", "Perceptual or modelled — the Cantril life evaluation, and any indicator imputed rather than observed."],
              ].map(([t, m]) => (
                <div key={t} className="bg-paper p-4.5">
                  <div className="font-display text-[26px] font-semibold">{t}</div>
                  <div className="mt-1.5 text-[14px] leading-snug text-ink-2">{m}</div>
                </div>
              ))}
            </div>
            <p className="mt-5 max-w-[72ch] text-[14.5px] text-ink-2">
              Sources are organisation-level today — UN IGME, UNICEF/WHO/World
              Bank JME, WHO Global Health Estimates and NCRB for India,
              UNODC, ILO/UNICEF, WHO/UNICEF JMP, World Bank/IEA, UNESCO UIS,
              Altinok, Angrist &amp; Patrinos via World Bank HLO, ILOSTAT,
              ITU, and the World Happiness Report — correctly attributed
              but not yet a specific series ID and access date on every
              row. See{" "}
              <a href="#contribute" className="border-b border-rule hover:border-ink">
                Contribute
              </a>
              .
            </p>
            <p className="mt-3.5 max-w-[72ch] text-[14.5px] text-ink-2">
              Mental &amp; social wellbeing is the weakest dimension —
              suicide mortality and adult life evaluation are both proxies,
              and no adolescent-specific mental-health series has global
              coverage. Internet and electricity access are population-level
              proxies, not adolescent-specific. Within-India gradients,
              further down, are encoded from published NFHS-5 and PLFS
              patterns, not a microdata reanalysis.
            </p>
            <p className="mt-3.5 max-w-[72ch] text-[14.5px] text-ink-2">
              Sample covers {(totalPop / 1000).toFixed(2)}bn adolescents,
              about 95% of the world&rsquo;s 10–19 population, in{" "}
              {raw.meta.countries} of 194 countries — a complete row is
              required, so partial coverage means exclusion, not
              imputation. Full schema in{" "}
              <a
                href="https://github.com/bigansh/denominator/blob/master/indexes/teenager-outcomes/docs/DATA_DICTIONARY.md"
                className="border-b border-rule hover:border-ink"
              >
                the data dictionary ↗
              </a>
              .
            </p>
          </div>
        </section>

        <section id="contested" className="border-t border-rule py-sec">
          <div className="mx-auto max-w-[1180px] px-gut">
            <SectionHead eyebrow="Contested" title="Four indicators, argued in the open" />
            <p className="mb-3 max-w-[72ch] text-[15.5px] text-ink-2">
              A contested indicator is a reason to publish a range, not a
              reason to drop it. Dropping it silently smuggles in a
              judgement — usually the loudest one. Full policy in{" "}
              <a
                href="https://github.com/bigansh/denominator/blob/master/indexes/teenager-outcomes/docs/CONTESTED.md"
                className="border-b border-rule hover:border-ink"
              >
                the contested-indicators policy ↗
              </a>
              .
            </p>

            <ContestedCase title="Life evaluation (Cantril ladder)" tier="C">
              <p>
                India scores far below its income level on this single
                Gallup World Poll question — an adult measure, not an
                adolescent one. Handled with a ±20% band spanning WHR
                2024–2026 (4.054–4.536).
              </p>
              <Kv
                rows={[
                  { k: "Central, as published", v: "55.6 · rank 81" },
                  { k: "Ladder forced to sample median", v: "57.8 · rank 80" },
                  { k: "Ladder deleted entirely", v: "56.0 · rank 85" },
                ]}
              />
              <p className="mt-2.5 text-[13.5px] text-ink-2">
                Deleting the indicator makes India&rsquo;s rank{" "}
                <em>worse</em>, not better — the conclusion survives the
                dispute.
              </p>
            </ContestedCase>

            <ContestedCase title="Stunting prevalence" tier="A">
              <p>
                The Government of India has rejected the Global Hunger
                Index and cites Poshan Tracker administrative data
                instead. This index doesn&rsquo;t use GHI — it uses
                NFHS-5 directly, India&rsquo;s own probability-sample
                survey. A ±6% band spans the residual disagreement.
              </p>
            </ContestedCase>

            <ContestedCase title="Youth NEET & the NEET gender gap" tier="B">
              <p>
                Comparability, not accuracy: subsistence farming and
                unpaid family work count as employment in low-income
                settings, which mechanically depresses measured NEET
                elsewhere. India&rsquo;s value sits at the winsorisation
                ceiling; the gender gap exceeds the clipping bound
                outright, so India scores a literal zero. ±5% band.
              </p>
            </ContestedCase>

            <ContestedCase title="Harmonised learning outcome" tier="B, C where imputed">
              <p>
                Vintage 2005–2015, imputed for 29 of 125 countries by
                regression (R² 0.87). Imputed cells drop to tier C with a
                ±6% band. Replacing this series is the single
                highest-value upgrade available to this repository.
              </p>
            </ContestedCase>
          </div>
        </section>

        <section id="table" className="border-t border-rule py-sec">
          <div className="mx-auto max-w-[1180px] px-gut">
            <SectionHead eyebrow="The index" title="All 125 countries" />
            <CountryTable countries={countries} raw={raw} />
          </div>
        </section>

        <section id="thesis" className="border-t border-rule py-sec">
          <div className="mx-auto max-w-[1180px] px-gut">
            <SectionHead eyebrow="The disagreement" title="India, counted two ways" />
            <p className="mb-2.5 max-w-[68ch] text-[15.5px] text-ink-2">
              Same index, same method as the table above. Here&rsquo;s what
              it surfaces for India specifically.
            </p>
            <Duo
              left={{
                eyebrow: "One country, one vote",
                big: india.Percentile.toFixed(1),
                cap: "India ranks 81st of 125. Denmark, with 600,000 teenagers, counts the same as India with 253 million.",
              }}
              right={{
                eyebrow: "One teenager, one vote",
                big: india.pop_pct.toFixed(1),
                cap: "Weight every country by its 10–19 population and India rises seven points — the countries it trails are demographically enormous.",
              }}
            />
            <p className="mt-6 max-w-[68ch] text-[15.5px] text-ink-2">
              Both numbers are correct. The first answers{" "}
              <strong>&ldquo;how does India compare to other states?&rdquo;</strong>{" "}
              The second answers{" "}
              <strong>&ldquo;how does an Indian teenager compare to other teenagers?&rdquo;</strong>{" "}
              Most published rankings quietly answer the first while read
              as the second.
            </p>
          </div>
        </section>

        <section id="india" className="border-t border-rule py-sec">
          <div className="mx-auto max-w-[1180px] px-gut">
            <SectionHead eyebrow="The case" title="Five dimensions at the median. Two in freefall." />
            <div className="grid grid-cols-1 gap-11 md:grid-cols-2">
              <div>
                <span className="mb-3.5 block font-mono text-[11px] tracking-[.18em] text-ink-2 uppercase">
                  India by dimension — bar is India, hairline is the sample median
                </span>
                {DIM_BAR_ORDER.map(([k, l]) => (
                  <Bar
                    key={k}
                    label={l}
                    value={raw.indiaDims[k].toFixed(1)}
                    pct={raw.indiaDims[k]}
                    median={raw.medians[k]}
                    color={rampColor(raw.indiaDims[k])}
                  />
                ))}
              </div>
              <div>
                <p className="text-[15.5px] text-ink-2">
                  India&rsquo;s Living, Safety, Health, Education and
                  Digital scores sit between the 42nd and 50th percentile —
                  unremarkable for its income level, and improving. Mental
                  &amp; social wellbeing ranks 113th of 125. Economic
                  future ranks 122nd.
                </p>
                <blockquote className="mt-4.5 max-w-[64ch] border-l-[3px] border-s2 bg-paper-2 p-6 text-[19.5px] leading-snug">
                  Remove those two dimensions and India is a median
                  country. They are the entire deficit.
                </blockquote>
                <p className="mt-4.5 text-[15.5px] text-ink-2">
                  Youth NEET of 39% sits at the winsorisation ceiling. The
                  32-point gender gap exceeds the clipping bound, so India
                  scores zero. Together those two indicators forfeit 22 of
                  22.5 available points — the floor is holding the score
                  up.
                </p>
              </div>
            </div>
            <div className="mt-13">
              <span className="mb-3.5 block font-mono text-[11px] tracking-[.18em] text-ink-2 uppercase">
                Where the Future Score goes — points earned of points available
              </span>
              {FUTURE_BREAKDOWN.map(([l, e, a]) => (
                <Bar
                  key={l}
                  label={l}
                  value={`${e.toFixed(1)} / ${a.toFixed(1)}`}
                  pct={(e / a) * 100}
                  color={rampColor((e / a) * 100)}
                />
              ))}
              <p className="mt-4.5 max-w-[68ch] text-[15.5px] text-ink-2">
                Completion earns 85% of its available credit; learning
                outcome earns 33%. India moves adolescents through lower
                secondary at above-median rates and gets below-median
                cognitive output.
              </p>
            </div>
          </div>
        </section>

        <section id="ledger" className="border-t border-rule py-sec">
          <div className="mx-auto max-w-[1180px] px-gut">
            <SectionHead
              eyebrow="The ledger"
              title={`${belowPop.toFixed(0)} million below, ${abovePop.toFixed(0)} million above`}
            />
            <div className="flex h-[60px] overflow-hidden border border-ink">
              <div
                className="flex items-center justify-center font-mono text-[11.5px] tracking-[.05em] text-white"
                style={{ width: `${belowPct}%`, background: "var(--color-s2)" }}
              >
                {belowPct}%
              </div>
              <div
                className="flex items-center justify-center font-mono text-[11.5px] tracking-[.05em] text-paper"
                style={{ width: `${india.pop_pct.toFixed(1)}%`, background: "var(--color-ink)" }}
              >
                India {india.pop_pct.toFixed(1)}%
              </div>
              <div
                className="flex items-center justify-center font-mono text-[11.5px] tracking-[.05em] text-white"
                style={{ width: `${abovePct}%`, background: "var(--color-s5)" }}
              >
                {abovePct}%
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-7 font-mono text-[11.5px] text-ink-2">
              <span><b className="text-ink">{belowPop.toFixed(1)}m</b> in {below.length} countries scoring below</span>
              <span><b className="text-ink">{india.pop1019_m.toFixed(1)}m</b> in India</span>
              <span><b className="text-ink">{abovePop.toFixed(1)}m</b> in {above.length} countries scoring above</span>
            </div>
            <div className="mt-11 grid grid-cols-1 gap-11 md:grid-cols-2">
              <div>
                <span className="mb-3 block font-mono text-[11px] tracking-[.18em] text-ink-2 uppercase">What India clears</span>
                <Kv
                  rows={cumRows(below, "more countries", below.length - 10, Math.round(belowPop - below.slice(0, 10).reduce((s, c) => s + c.pop1019_m, 0)), belowPct).map((r) => ({
                    k: r.k,
                    v: `${r.v} · ${r.pct}`,
                  }))}
                />
                <p className="mt-3.5 text-[15px] text-ink-2">
                  Nigeria and Pakistan alone supply a quarter of it. Africa
                  contributes 21.3 of the 32.6 points.
                </p>
              </div>
              <div>
                <span className="mb-3 block font-mono text-[11px] tracking-[.18em] text-ink-2 uppercase">What clears India</span>
                <Kv
                  rows={cumRows(above, "more countries", above.length - 10, Math.round(abovePop - above.slice(0, 10).reduce((s, c) => s + c.pop1019_m, 0)), abovePct).map((r) => ({
                    k: r.k,
                    v: `${r.v} · ${r.pct}`,
                  }))}
                />
                <p className="mt-3.5 text-[15px] text-ink-2">
                  China alone is 12.9 of the 46.9 points. Only six African
                  countries and one South Asian country score above India.
                </p>
              </div>
            </div>
            <blockquote className="mt-10 max-w-[74ch] border-l-[3px] border-s2 bg-paper-2 p-6 text-[19.5px] leading-snug">
              Only 120 of the 581 million above India live in rich
              countries. The rest are in China and middle-income peers —
              Indonesia, the Philippines, Brazil, Mexico, Egypt, Vietnam,
              Iran, Uzbekistan. India isn&rsquo;t outranked by wealth. It&rsquo;s
              outranked at its own income level.
            </blockquote>
          </div>
        </section>

        <section id="within" className="border-t border-rule py-sec">
          <div className="mx-auto max-w-[1180px] px-gut">
            <SectionHead eyebrow="Disaggregation" title="Where the top of India actually lands" />
            <p className="mb-2.5 max-w-[68ch] text-[15.5px] text-ink-2">
              Split India by household wealth, score each stratum on the
              same global scale, drop it back into the world distribution.
              A claim like &ldquo;Indian teenagers do better than 70% of
              the world&rdquo; can then be tested, not asserted.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-11 md:grid-cols-2">
              <div>
                <span className="mb-3.5 block font-mono text-[11px] tracking-[.18em] text-ink-2 uppercase">India by wealth decile — world percentile reached</span>
                {[...raw.deciles].reverse().map(([k, toi, wp]) => (
                  <Bar
                    key={k}
                    label={k === "D10" ? "D10 richest" : k === "D1" ? "D1 poorest" : k}
                    value={wp.toFixed(1)}
                    pct={wp}
                    color={rampColor(toi)}
                  />
                ))}
              </div>
              <div>
                <span className="mb-3.5 block font-mono text-[11px] tracking-[.18em] text-ink-2 uppercase">What is true, and for how many</span>
                <Kv rows={CLAIM.map(([k, top, m]) => ({ k, v: `${top} · ${m}`, hl: top === "top 5%" }))} />
                <p className="mt-3.5 text-[15px] text-ink-2">
                  No Indian wealth stratum clears the 75th world
                  percentile. Wealth doesn&rsquo;t buy out the Economic
                  Future constraint — the richest decile still scores
                  79.1 on Life against 67.6 on Future.
                </p>
              </div>
            </div>
            <div className="mt-13">
              <span className="mb-3.5 block font-mono text-[11px] tracking-[.18em] text-ink-2 uppercase">India by state — world percentile reached</span>
              {[...raw.states].sort((a, b) => b[2] - a[2]).map(([k, toi, mid]) => (
                <Bar key={k} label={k} value={mid.toFixed(1)} pct={mid} color={rampColor(toi)} />
              ))}
              <p className="mt-4.5 max-w-[68ch] text-[15.5px] text-ink-2">
                State spread runs 48 to 68; wealth spread runs 35 to 73. A
                state average pools every class, so geography understates
                the real dispersion. No Indian state reaches the
                world&rsquo;s 62nd percentile.
              </p>
            </div>
          </div>
        </section>

        <section id="contribute" className="border-t border-rule py-sec">
          <div className="mx-auto max-w-[1180px] px-gut">
            <SectionHead eyebrow="Contribute" title="Fix a number, argue a weight, add a country" />
            <p className="max-w-[68ch] text-[15.5px] text-ink-2">
              Corrections are the point of this repository. Find a row in{" "}
              <code>data/observations.csv</code>, replace the value with a
              cited figure, open a pull request — CI checks the schema and
              rebuilds this page from it. A weight or framework objection
              goes through an issue instead.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {[
                ["https://github.com/bigansh/denominator", "Repository ↗"],
                ["https://github.com/bigansh/denominator/blob/master/CONTRIBUTING.md", "How to contribute ↗"],
                ["https://github.com/bigansh/denominator/blob/master/indexes/teenager-outcomes/docs/METHODOLOGY.md", "Methodology ↗"],
                ["https://github.com/bigansh/denominator/blob/master/indexes/teenager-outcomes/docs/CONTESTED.md", "Contested indicators ↗"],
                ["https://github.com/bigansh/denominator/blob/master/indexes/teenager-outcomes/docs/DATA_DICTIONARY.md", "Data dictionary ↗"],
                ["https://github.com/bigansh/denominator/blob/master/LICENSE", "Licence ↗"],
              ].map(([href, label]) => (
                <a
                  key={label}
                  href={href}
                  className="border border-ink px-4 py-2.5 font-mono text-[11px] tracking-[.08em] text-ink uppercase no-underline hover:bg-ink hover:text-paper"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer
        description="Teenager Outcomes Index — 125 countries, 18 indicators, 7 dimensions, 1.239 billion adolescents. Every figure traces to a sourced, editable row."
        sectionTitle="This index"
        sectionLinks={[
          { href: "#build", label: "How it's built" },
          { href: "#method", label: "Method" },
          { href: "#sources", label: "Sources & limits" },
          { href: "#table", label: "All 125 countries" },
          { href: "#contribute", label: "Contribute" },
        ]}
      />
    </>
  );
}

function ContestedCase({
  title,
  tier,
  children,
}: {
  title: string;
  tier: string;
  children: React.ReactNode;
}) {
  const isC = tier.startsWith("C");
  return (
    <div className="border-t border-rule py-6 first:border-t-0 first:pt-0">
      <div className="mb-2.5 flex flex-wrap items-baseline gap-3">
        <span className="font-display text-[20px] font-semibold tracking-[-.01em]">{title}</span>
        <span
          className={`border px-1.5 py-0.5 font-mono text-[9.5px] tracking-[.1em] uppercase ${
            isC ? "border-s2 text-s2" : "border-ink-2 text-ink-2"
          }`}
        >
          Tier {tier}
        </span>
      </div>
      <div className="max-w-[76ch] space-y-2.5 text-[15.5px] text-ink-2 [&_table]:mt-3">{children}</div>
    </div>
  );
}

type Country = ReturnType<typeof parseCountries>[number];
