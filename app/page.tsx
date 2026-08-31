import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Mosaic } from "@/components/Mosaic";
import { CatalogueEntry } from "@/components/CatalogueEntry";
import { Reveal } from "@/components/Reveal";
import { getTOIData, getCountingWomenData } from "@/lib/data";

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
          <Reveal>
            <h1 className="max-w-[15ch] font-display text-[clamp(38px,6.6vw,80px)] font-semibold leading-[1.02] tracking-[-.025em]">
              Every ranking has a{" "}
              <span className="underline decoration-s2 decoration-[3px] underline-offset-[8px]">
                denominator
              </span>
              . Most don&rsquo;t tell you theirs.
            </h1>
            <p className="mt-6 max-w-[54ch] text-[clamp(18px,2.1vw,22px)] font-light text-ink-2">
              We publish sourced, computed data on human outcomes. Nothing
              goes out until the numbers behind it are in a file you can
              open.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-9">
            <Mosaic />
          </Reveal>
          <p className="mt-3 max-w-[70ch] font-mono text-[11.5px] tracking-[.02em] text-ink-2">
            One colour ramp, one rule: sourced, computed, checkable.
          </p>
        </div>

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
                Computed from the data behind it. Not asserted.
              </p>
            </div>
            <div className="border-t border-rule">
              <Reveal>
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
                description="The quality of adolescence and the launchpad out of it — scored separately, then combined."
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
              </Reveal>
              <Reveal delay={0.08}>
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
                description="What the statistical system can and can't see about violence against women. India as the subject, the G20 as the control."
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
              </Reveal>
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
