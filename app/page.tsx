import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Mosaic } from "@/components/Mosaic";
import { CatalogueEntry } from "@/components/CatalogueEntry";
import { getTOIData, getCountingWomenData } from "@/lib/data";

const PRINCIPLES = [
  {
    title: "Compute it, don’t assert it",
    body: "No score is published until the full country-by-indicator matrix exists and the arithmetic runs end to end. Where the data can’t support a number, the cell stays empty rather than filled with something plausible.",
  },
  {
    title: "State the denominator",
    body: "A country percentile and a population percentile answer different questions. We compute both, print both, and name which one a claim rests on — a composite that hides this is one you can’t check.",
  },
  {
    title: "Ship the workings",
    body: "Every score comes with the live data behind it — inputs editable, sources attached, results recalculated from the file itself. Provenance is stated per value: published data or modelled.",
  },
];

export default function Home() {
  const toi = getTOIData();
  const cw = getCountingWomenData();
  const benchmarkRows = Object.values(cw.benchmark_comparability).reduce(
    (a, b) => a + b,
    0,
  );

  return (
    <>
      <Header />
      <main>
        <div className="mx-auto max-w-[1180px] px-gut pt-[clamp(48px,8vw,88px)] pb-sec">
          <h1 className="max-w-[15ch] font-display text-[clamp(38px,6.6vw,80px)] font-semibold leading-[1.02] tracking-[-.025em]">
            Every ranking has a{" "}
            <span className="underline decoration-s2 decoration-[3px] underline-offset-[8px]">
              denominator
            </span>
            . Most don&rsquo;t tell you theirs.
          </h1>
          <p className="mt-6 max-w-[54ch] text-[clamp(18px,2.1vw,22px)] font-light text-ink-2">
            We publish sourced, computed data on human outcomes — nothing
            goes out until the matrix behind it exists in a file you can
            open and check.
          </p>
          <div className="mt-9">
            <Mosaic />
          </div>
          <p className="mt-3 max-w-[70ch] font-mono text-[11.5px] tracking-[.02em] text-ink-2">
            One colour ramp, one rule — sourced, computed, checkable —
            carried across every score and every dataset published here.
          </p>
        </div>

        <section id="principles" className="border-t border-rule py-sec">
          <div className="mx-auto max-w-[1180px] px-gut">
            <div className="mb-10">
              <span className="mb-3.5 block font-mono text-[11px] tracking-[.18em] text-ink-2 uppercase">
                What we hold to
              </span>
              <h2 className="max-w-[22ch] font-display text-[clamp(27px,3.5vw,42px)] font-semibold tracking-[-.02em]">
                Three rules, applied to everything we publish
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-px overflow-hidden border border-rule bg-rule md:grid-cols-3">
              {PRINCIPLES.map((p) => (
                <div key={p.title} className="bg-paper p-7">
                  <h3 className="mb-2.5 font-display text-[19px] font-semibold tracking-[-.01em]">
                    {p.title}
                  </h3>
                  <p className="text-[15.5px] text-ink-2">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="catalogue" className="border-t border-rule py-sec">
          <div className="mx-auto max-w-[1180px] px-gut">
            <div className="mb-10">
              <span className="mb-3.5 block font-mono text-[11px] tracking-[.18em] text-ink-2 uppercase">
                The catalogue
              </span>
              <h2 className="max-w-[22ch] font-display text-[clamp(27px,3.5vw,42px)] font-semibold tracking-[-.02em]">
                What&rsquo;s published
              </h2>
              <p className="mt-4 max-w-[64ch] text-[17.5px] text-ink-2">
                Every score published here is computed from the data behind
                it, not asserted.
              </p>
            </div>
            <div className="border-t border-rule">
              <CatalogueEntry
                href="/indexes/teenager-outcomes/"
                code={
                  <>
                    TOI
                    <br />
                    2026
                  </>
                }
                status="Published"
                live
                title="Teenager Outcomes Index"
                description="The quality of adolescence and the quality of the launchpad out of it, scored separately and then combined. Eighteen indicators across seven dimensions, split evenly between conditions now and prospects next."
                stats={[
                  { value: toi.meta.countries, label: "Countries" },
                  { value: toi.meta.indicators, label: "Indicators" },
                  {
                    value: (
                      <>
                        {(toi.meta.adolescents_millions / 1000).toFixed(2)}
                        <span className="text-[0.55em]">bn</span>
                      </>
                    ),
                    label: "Adolescents",
                  },
                  { value: Object.keys(toi.dimensions).length, label: "Dimensions" },
                ]}
              />
              <CatalogueEntry
                href="/case-studies/counting-women/"
                code={
                  <>
                    CASE
                    <br />
                    STUDY
                  </>
                }
                status="Case study"
                title="Counting Women"
                description="What the statistical system can and cannot see about violence against women, with India as the subject and the G20 as the control. Not an index — the reason one cannot be built yet."
                stats={[
                  { value: cw.verified + cw.unverified, label: "G20 members" },
                  { value: cw.verified, label: "Verified" },
                  {
                    value: (
                      <>
                        {cw.india.capacity.toFixed(0)}
                        <span className="text-[0.55em]">/100</span>
                      </>
                    ),
                    label: "India capacity",
                  },
                  { value: benchmarkRows, label: "Benchmark rows" },
                ]}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer
        description="Sourced, computed data on human outcomes, published with the workings, the weights and every denominator attached."
        sectionTitle="Published"
        sectionLinks={[
          { href: "/indexes/teenager-outcomes/", label: "Teenager Outcomes Index" },
          { href: "/case-studies/counting-women/", label: "Counting Women" },
        ]}
      />
    </>
  );
}
