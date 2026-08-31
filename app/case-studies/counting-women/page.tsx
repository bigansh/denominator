import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Kicker, SectionHead, Jumpnav } from "@/components/SectionHead";
import { Duo, ClaimBoundary, SrcNote } from "@/components/Callouts";
import { Kv, WideTable } from "@/components/Tables";
import { Bar, Ledger } from "@/components/Bars";
import { Ladder } from "@/components/Ladder";
import { getCountingWomenData } from "@/lib/data";
import { rampColor } from "@/lib/ramp";

export const metadata: Metadata = {
  title: "Counting Women",
  description:
    "India records 2.10 rapes per 100,000 people. England and Wales records 55.9 times more. Neither number measures safety.",
};

const JUMPNAV = [
  { href: "#headline", label: "The headline number" },
  { href: "#inversion", label: "The inversion" },
  { href: "#breaks", label: "The two breaks" },
  { href: "#harm", label: "What the harm is" },
  { href: "#price", label: "The price" },
  { href: "#clean", label: "One clean comparison" },
  { href: "#instruments", label: "What everyone else runs" },
  { href: "#gap", label: "What would close it" },
];

export default function CountingWomen() {
  const d = getCountingWomenData();
  const den = d.denominators;
  const compByLabel = Object.fromEntries(d.components.map((c) => [c.label, c.points]));
  const withN = [...d.table].filter((r) => r.vaw_n > 0).sort((a, b) => b.vaw_n - a.vaw_n);
  const maxN = withN[0]?.vaw_n ?? 1;

  return (
    <>
      <Header />
      <main>
        <div className="mx-auto max-w-[1180px] px-gut pt-[clamp(40px,7vw,72px)] pb-14">
          <Kicker items={[{ label: "Case study", dark: true }, { label: "Not an index" }]} />
          <h1 className="max-w-[16ch] font-display text-[clamp(32px,5.6vw,64px)] font-semibold leading-[1.05] tracking-[-.02em]">
            India records the fewest rapes. It asks the fewest questions.
          </h1>
          <p className="mt-5 max-w-[58ch] text-[clamp(17px,1.9vw,20px)] font-light text-ink-2">
            England and Wales records 55.9 times more rape per head than
            India. Correcting for reporting doesn&rsquo;t close the gap.
            The gap says nothing about safety.
          </p>

          <Duo
            left={{
              eyebrow: "Recorded rape, per 100,000 population",
              big: den.recorded_rape_rate_india.toFixed(2),
              cap: "India, 29,536 cases, NCRB 2024.",
            }}
            right={{
              eyebrow: "Recorded rape, per 100,000 population",
              big: den.recorded_rape_rate_ew.toFixed(1),
              cap: "England and Wales, 71,667 offences, year ending March 2025.",
            }}
          />
          <SrcNote>
            Both rates computed here from NCRB&rsquo;s own implied
            population — 683.5m women,{" "}
            {den.implied_total_population_m.toLocaleString("en-US")}m
            people. The ratio is {den.ratio}×. It compares two different
            offence definitions across two different instruments, not
            interpretable in either direction.
          </SrcNote>

          <ClaimBoundary
            title="What this page does not claim"
            items={[
              { strong: "No “India is safer or less safe than X.”", rest: "Not one, anywhere below." },
              { strong: "No harassment rate for India.", rest: "No national instrument measures it." },
              { strong: "No reporting rate for India.", rest: "The ~1.1% is inferred from help-seeking, never measured." },
              { strong: "No current partner-violence level for India.", rest: "NFHS-6 is discontinuous; the full report is pending." },
              { strong: "No trend.", rest: "Two rounds with a break between them isn't a trend." },
              { strong: "Nothing about China.", rest: "No public instrument was found — the absence is the result." },
            ]}
          />
          <Jumpnav items={JUMPNAV} />
        </div>

        <section id="headline" className="border-t border-rule py-sec">
          <div className="mx-auto max-w-[1180px] px-gut">
            <SectionHead
              eyebrow="The headline number"
              title={`Four reasons ${den.ratio}× isn't a fact about the world`}
              sub="Each breaks the comparison on its own."
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[
                {
                  h: "Legal truncation",
                  p: "Section 63 of the BNS excludes marital rape. In England and Wales, 43% of rape victims were assaulted by a partner — the one category India's count structurally can't contain.",
                },
                {
                  h: "Counting rules",
                  p: "England has counted rape per incident since 2016. India counts one case per police report. Repeat victimisation inflates one side and not the other.",
                },
                {
                  h: "Exposure",
                  p: "A per-capita rate divides by all women, including those not in public. Only 42% of Indian women can go alone to a market, a clinic, or outside their village.",
                },
                {
                  h: "Instrument",
                  p: "CSEW is a victimisation survey. NFHS is a household interview about a husband, asked of a subsample of married women. How a question is asked changes what gets disclosed.",
                },
              ].map((r) => (
                <div key={r.h}>
                  <h3 className="mb-1.5 font-display text-[17px] font-semibold">{r.h}</h3>
                  <p className="max-w-[46ch] text-[15.5px] text-ink-2">{r.p}</p>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <span className="mb-3 block font-mono text-[11px] tracking-[.18em] text-ink-2 uppercase">
                Correcting for reporting
              </span>
              <WideTable
                className="max-w-[640px]"
                columns={[
                  { label: "Jurisdiction" },
                  { label: "Recorded" },
                  { label: "Reporting rate" },
                  { label: "Adjusted" },
                ]}
                rows={[
                  {
                    cells: ["England & Wales", den.recorded_rape_rate_ew.toFixed(1), `${den.victim_reporting_rate_ew}%`, `~${den.adjusted_ew}`],
                  },
                  {
                    hl: true,
                    cells: ["India", den.recorded_rape_rate_india.toFixed(2), `~${den.victim_reporting_rate_india}% (inferred)`, `~${den.adjusted_india}`],
                  },
                ]}
              />
              <SrcNote>
                The correction doesn&rsquo;t close the gap — a{" "}
                {den.residual_ratio_after_reporting}× residual remains once
                both rates are inflated by their own reporting rate.
              </SrcNote>
            </div>
          </div>
        </section>

        <section id="inversion" className="border-t border-rule py-sec">
          <div className="mx-auto max-w-[1180px] px-gut">
            <SectionHead
              eyebrow="The inversion"
              title="The recorded rate inverts prevalence, inside one legal system"
              sub="One penal code, one instrument. If the comparison fails here, it carries nothing across a border."
            />
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              <p className="max-w-[52ch] text-[16px] text-ink-2">
                Kerala&rsquo;s recorded crime-against-women rate runs
                roughly twice Bihar&rsquo;s. NFHS-5 shows the opposite
                order in measured prevalence — Kerala has among India&rsquo;s
                lowest measured sexual violence, and its lowest freedom of
                movement. A recorded rate measures willingness to report,
                not the underlying rate.
              </p>
              <Kv
                rows={[
                  { k: "Kerala, recorded crime against women", v: "≈ 2× Bihar" },
                  { k: "Kerala, recorded cruelty by husband", v: "≈ 4× Bihar" },
                  { k: "Kerala, measured sexual violence", v: "1%", hl: true },
                  { k: "Kerala, freedom of movement", v: "15%", hl: true },
                ]}
              />
            </div>
          </div>
        </section>

        <section id="breaks" className="border-t border-rule py-sec">
          <div className="mx-auto max-w-[1180px] px-gut">
            <SectionHead
              eyebrow="What just happened to India's own numbers"
              title="Both of India's instruments broke, the same year"
              sub="One break is a caveat. Two, in one year, is why this isn't an index."
            />
            <WideTable
              className="max-w-[720px]"
              columns={[{ label: "Measure" }, { label: "NFHS-5" }, { label: "NFHS-6" }, { label: "Change" }]}
              rows={[
                { cells: ["India, spousal violence, 18–49", "29.3%", "≈ 25%", "−4.3pp"] },
                { hl: true, cells: ["Karnataka, spousal violence", "44.4%", "14.1%", "−30.3pp"] },
                { cells: ["Kerala, spousal violence", "9.8%", "17.7%", "+7.9pp"] },
                { hl: true, cells: ["Karnataka, sexual violence before 18", "2.1%", "0.2%", "−1.9pp"] },
              ]}
            />
            <p className="mt-5 max-w-[62ch] text-[15.5px] text-ink-2">
              A 30-point swing in four years has no precedent in any
              country&rsquo;s violence data. Zero urban Karnataka
              respondents disclosed childhood sexual abuse — a disclosure
              artefact, not a finding. Researchers report the question
              structure was unchanged between rounds, which rules out
              survey design as the cause.
            </p>
            <p className="mt-3 max-w-[62ch] text-[15.5px] text-ink-2">
              WHO&rsquo;s global estimate still rests on NFHS-5 — it draws
              on data published before NFHS-6&rsquo;s release. India&rsquo;s
              global anchor and India&rsquo;s own newest survey now
              disagree.
            </p>

            <div className="mt-12">
              <span className="mb-3 block font-mono text-[11px] tracking-[.18em] text-ink-2 uppercase">
                The second break — NCRB 2024, first year of the Bharatiya Nyaya Sanhita
              </span>
              <WideTable
                className="max-w-[760px]"
                columns={[{ label: "Measure" }, { label: "2023 (IPC)" }, { label: "2024 (BNS)" }, { label: "Change" }]}
                rows={[
                  { cells: ["Cognizable crime, all heads", "6.24m", "5.89m", "−6.0%"] },
                  { cells: ["Rate, per lakh population", "448.3", "418.9", "−29.4"] },
                  { cells: ["Crimes against women", "448,211", "441,534", "−1.5%"] },
                  { cells: ["Rate, per lakh women", "66.2", "64.6", "−1.6"] },
                  { hl: true, cells: ["Rape", "32,032", "29,536", "−7.8%"] },
                ]}
              />
              <p className="mt-5 max-w-[62ch] text-[15.5px] text-ink-2">
                The BNS replaced the IPC in 2024 and renumbered offences.
                NCRB itself advises caution comparing 2024 with earlier
                years. A 6% fall in recorded crime is not a finding about
                crime.
              </p>
              <SrcNote>
                Composition, 2024: cruelty by husband/relatives 27.2%,
                kidnapping 15.4%, POCSO 15.4%, outraging modesty 10.9%,
                rape 6.7%. The widely reported &ldquo;10.4%&rdquo; figure
                uses a different denominator — offences against women{" "}
                <em>and children</em>, not crimes against women alone.
              </SrcNote>
            </div>
          </div>
        </section>

        <section id="harm" className="border-t border-rule py-sec">
          <div className="mx-auto max-w-[1180px] px-gut">
            <SectionHead
              eyebrow="What the harm is"
              title="The most frequent harms have no offence code and no instrument"
              sub="Ordered by frequency, not severity."
            />
            <Ladder
              columns={["Indian national instrument", "Offence code"]}
              rows={[
                { harm: "Staring and ogling", n: "63% of Delhi students", cells: [{ v: "no", t: "none" }, { v: "no", t: "none" }] },
                { harm: "Sexual comments", n: "largest category, NCR", cells: [{ v: "no", t: "none" }, { v: "part", t: "partial" }] },
                { harm: "Catcalling and whistling", cells: [{ v: "no", t: "none" }, { v: "part", t: "partial" }] },
                { harm: "Unwanted photography and filming", cells: [{ v: "no", t: "none" }, { v: "no", t: "none" }] },
                { harm: "Indecent exposure", cells: [{ v: "no", t: "none" }, { v: "no", t: "none" }] },
                { harm: "Following", cells: [{ v: "no", t: "none" }, { v: "yes", t: "354D" }] },
                { harm: "Touching and groping", n: "largest outside metros", cells: [{ v: "no", t: "none" }, { v: "yes", t: "outrage of modesty" }] },
                { harm: "Online sexual harassment", cells: [{ v: "no", t: "none" }, { v: "part", t: "IT Act" }] },
                { harm: "Non-partner sexual violence", cells: [{ v: "part", t: "NFHS module" }, { v: "yes", t: "BNS 63" }] },
                { harm: "Intimate partner violence", cells: [{ v: "part", t: "NFHS module" }, { v: "part", t: "498A, not rape" }] },
              ]}
            />
            <SrcNote>
              Delhi — a city of 20m+ — registered 316 cases of sexual
              harassment and 279 of assault with intent to disrobe in
              2024, the highest of any of the 19 metropolitan cities.
              Where a code exists, the registered count is still
              negligible against survey-measured prevalence.
            </SrcNote>
          </div>
        </section>

        <section id="price" className="border-t border-rule py-sec">
          <div className="mx-auto max-w-[1180px] px-gut">
            <SectionHead
              eyebrow="The price"
              title="Delhi women pay double the tuition for a safer route"
              sub="Borker, World Bank WP 9731 — 4,000 students, eight Delhi colleges, every feasible route mapped against Safetipin/Safecity safety data."
            />
            <WideTable
              className="max-w-[600px]"
              columns={[{ label: "Willingness to pay, one SD safer" }, { label: "Women" }, { label: "Men" }]}
              rows={[
                { hl: true, cells: ["College quality forgone", "13.04pp (8.5 ranks)", "1.37pp (0.9 ranks)"] },
                { cells: ["Annual travel spend", "₹18,800", "₹1,200"] },
                { cells: ["Extra travel time", "40 min", "4 min"] },
              ]}
            />
            <p className="mt-5 max-w-[64ch] text-[15.5px] text-ink-2">
              89% of the women had faced harassment while travelling; 63%
              unwanted staring. Women accept a college 8.5 ranks lower to
              travel a safer route — a premium roughly double Delhi
              University&rsquo;s average tuition. None of it appears in any
              crime statistic.
            </p>
          </div>
        </section>

        <section id="clean" className="border-t border-rule py-sec">
          <div className="mx-auto max-w-[1180px] px-gut">
            <SectionHead
              eyebrow="The one clean comparison"
              title="Identical method, two jurisdictions: 13.8 against 7.1"
            />
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              <div>
                <Bar label="India" value="13.8%" pct={69} color={rampColor(15)} subject />
                <Bar label="UK + USA" value="7.1%" pct={35.5} color={rampColor(45)} />
                <SrcNote>
                  Share of tweets to women politicians rated abusive.
                  Amnesty Troll Patrol: 114,716 tweets to 95 Indian women
                  politicians (2019) against 778 women in the UK/USA
                  (2017) — same crowdsourced-plus-ML method both times.
                </SrcNote>
              </div>
              <p className="max-w-[48ch] text-[16px] text-ink-2">
                The only like-for-like cross-national measurement in this
                study, and it isn&rsquo;t a government statistic. Those 95
                women alone attract on the order of 10,000 abusive
                mentions a day. India&rsquo;s entire national cybercrime
                record with a sexual-exploitation motive: 4,199 cases, all
                of 2023.
              </p>
            </div>
          </div>
        </section>

        <section id="instruments" className="border-t border-rule py-sec">
          <div className="mx-auto max-w-[1180px] px-gut">
            <SectionHead
              eyebrow="What everyone else runs"
              title="India interviews more women than the rest of the G20, through a health survey"
              sub="Measurement capacity, 100 points — whether an instrument exists. Not a safety score."
            />
            <WideTable
              columns={[
                { label: "Country" },
                { label: "Instrument" },
                { label: "Agency" },
                { label: "Cadence" },
                { label: "Latest" },
                { label: "n" },
                { label: "Capacity" },
              ]}
              rows={d.table.map((r) => {
                const isChina = r.capacity === 0;
                return {
                  hl: r.iso3 === "IND",
                  cells: [
                    r.country,
                    isChina ? "none identified" : r.vaw_name,
                    isChina ? "—" : r.vaw_agency,
                    isChina || !r.vaw_cadence_yrs ? "—" : `${r.vaw_cadence_yrs} yr`,
                    isChina ? "—" : r.vaw_latest,
                    r.vaw_n ? r.vaw_n.toLocaleString("en-US") : "—",
                    r.capacity,
                  ],
                };
              })}
            />
            <SrcNote>
              {d.verified} of {d.verified + d.unverified} G20 members
              verified — the rest are unchecked, excluded rather than
              assumed. India ranks {d.india.rank} of {d.india.of} verified,
              {" "}{d.india.percentile}th percentile.
            </SrcNote>

            <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2">
              <div>
                <span className="mb-3 block font-mono text-[11px] tracking-[.18em] text-ink-2 uppercase">
                  What India has, and doesn&rsquo;t
                </span>
                <Kv
                  rows={[
                    ...d.india.has.map((l) => ({ k: l, v: `yes · ${compByLabel[l]}` })),
                    ...d.india.lacks.map((l) => ({ k: l, v: "no · 0", hl: true })),
                  ]}
                />
              </div>
              <p className="text-[15.5px] text-ink-2">
                India has no dedicated violence-against-women survey. Its
                only population-based measure is a module inside a health
                survey, asked of ever-married women, about their husbands.
                There is no national crime victimisation survey.
              </p>
            </div>

            <div className="mt-12">
              <span className="mb-3 block font-mono text-[11px] tracking-[.18em] text-ink-2 uppercase">
                Respondents interviewed, where the sample is published
              </span>
              {withN.map((r) => (
                <Bar
                  key={r.iso3}
                  label={r.country}
                  value={r.vaw_n.toLocaleString("en-US")}
                  pct={(r.vaw_n / maxN) * 100}
                  color={rampColor(r.iso3 === "IND" ? 90 : (r.vaw_n / maxN) * 70)}
                  subject={r.iso3 === "IND"}
                />
              ))}
              <SrcNote>
                India&rsquo;s sample is {d.india.sample_multiple_of_rest}×
                every other published G20 sample combined. Sample size
                isn&rsquo;t the constraint — the questionnaire is.
              </SrcNote>
            </div>
          </div>
        </section>

        <section id="gap" className="border-t border-rule py-sec">
          <div className="mx-auto max-w-[1180px] px-gut">
            <SectionHead
              eyebrow="What would close it"
              title="One questionnaire module, on a survey already in the field"
            />
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              <p className="max-w-[52ch] text-[16px] text-ink-2">
                NFHS-6 reached 716,397 women. Adding a public-space
                harassment module — comments, following, staring, filming
                — using EU-GBV&rsquo;s wording would make India the first
                non-EU country with a comparable measure of the harms that
                determine whether women occupy public space.
              </p>
              <div>
                <span className="mb-3 block font-mono text-[11px] tracking-[.18em] text-ink-2 uppercase">
                  Of {Object.values(d.benchmark_comparability).reduce((a, b) => a + b, 0)} benchmark rows in this study
                </span>
                <Ledger
                  segments={[
                    { n: d.benchmark_comparability.yes ?? 0, label: "comparable", bg: rampColor(85), fg: "var(--color-paper)" },
                    { n: d.benchmark_comparability.partial ?? 0, label: "partial", bg: rampColor(50) },
                    { n: d.benchmark_comparability.no ?? 0, label: "not comparable", bg: rampColor(15), fg: "var(--color-paper)" },
                    { n: d.benchmark_comparability["n/a"] ?? 0, label: "no comparator", bg: "var(--color-paper-2)" },
                  ]}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer
        description="A case study, not an index. Roughly 42 of 100 capacity points have no instrument in 16 of 19 G20 members — a row must be complete."
        sectionTitle="This case study"
        sectionLinks={[
          { href: "#headline", label: "The headline number" },
          { href: "#breaks", label: "The two breaks" },
          { href: "#instruments", label: "What everyone else runs" },
          {
            href: "https://github.com/bigansh/denominator/blob/master/case-studies/counting-women/README.md",
            label: "Full writeup ↗",
          },
          {
            href: "https://github.com/bigansh/denominator/tree/master/case-studies/counting-women/data",
            label: "Source data ↗",
          },
        ]}
      />
    </>
  );
}
