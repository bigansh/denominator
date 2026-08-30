# Counting Women

**This is not an index. It is the reason the index cannot be built yet.**

A case study in what the statistical system can and cannot see about violence
against women, with India as the subject and the G20 as the control. Published at
`site/case-studies/counting-women/`.

Read this file in full before touching anything here. It is the handover between
sessions and it is meant to be edited.

---

## 1. The argument, in four sentences

India's recorded rape rate is 2.10 per 100,000 population against England and
Wales at 117.5 — a 55.9× gap that survives correction for reporting and still
says nothing about safety. The harms that determine whether a woman occupies
public space — staring, comments, following, filming, exposure — have no offence
code in India and no national instrument anywhere except the EU, Mexico, Canada,
Australia and the UK. India runs the largest violence-measurement sample in the
G20 and the narrowest questionnaire. **The one thing that is cleanly rankable
here is not safety; it is whether a country runs an instrument capable of
measuring safety.**

---

## 2. Layout

```
case-studies/counting-women/
  data/
    instruments.csv          19 rows — G20 measurement landscape. 12 verified,
                                       7 marked unverified and EXCLUDED, not assumed
    india-benchmarks.csv     25 rows — every number used on the page, each with its
                                       instrument and a comparability flag
  build.py                   computes the capacity score + every arithmetic claim
  dist/counting-women.json   generated. do not hand-edit
site/case-studies/counting-women/
  index.html                 the page. uses /assets/brand.css, no page-specific build
```

Run it (standard library only, no dependencies):

```bash
python3 case-studies/counting-women/build.py
cd site && python3 -m http.server 8000
```

`build.py` writes `dist/counting-women.json` and a co-located copy at
`site/case-studies/counting-women/counting-women.json` — the page fetches the
latter at runtime for the capacity table, the has/lacks breakdown, the sample-size
bars, and the comparability ledger. The narrative sections (the two
discontinuities, the harm ladder, the price study) are prose, sourced directly
from `data/india-benchmarks.csv`'s rows and checked against `build.py`'s printed
output, not templated — there's no repeating per-row structure to drive there.

Current output:

```
G20 members 19 · verified 12 · unverified 7
India  50/100, rank 11 of 12 verified, 9.1 percentile
India sample 716,397 = 2.63x every other published G20 sample combined
benchmark rows: 6 comparable, 2 partial, 6 not comparable, 11 no comparator
```

---

## 3. The measurement capacity score

100 points, six components, every one a published fact about whether an
instrument exists. Not a safety score. Not a proxy for a safety score.

| Component | Points | Countries with it |
|---|---:|---:|
| Runs a dedicated violence-against-women survey | 25 | 10/12 |
| Repeats it at least every five years | 15 | 7/12 |
| Most recent round within five years | 15 | 11/12 |
| Covers violence by someone other than a partner | 20 | 11/12 |
| Disaggregates public-space harassment by act | 15 | 5/12 |
| Publishes the victim reporting rate | 10 | 9/12 |

```
Australia, Mexico, South Korea, UK (E&W)   100
Canada, United States                       85
Japan                                       75
France, Germany, Italy                      70
India                                       50   <- rank 11 of 12
China                                        0
```

India has cadence, recency and non-partner coverage. It lacks a dedicated VAW
survey, act-level disaggregation, and a published reporting rate. Its only
population-based measure is a module inside a health survey, asked of ever-married
women, about their husbands. There is no national crime victimisation survey.

**Percentiles on N=12 are coarse — about 9 points per rank.** Report the band, not
the position. This is the same reason the project refused a 19-country G20 index.

---

## 4. Standing decisions

| Decision | Reason |
|---|---|
| Case study, not an index | ~42 of a would-be 100 points have no instrument in 16 of 19 G20 members. A row must be complete |
| G20 is the comparison frame, not a statistical sample | N=19 breaks 5/95 winsorisation and collapses population weighting onto China and India |
| Rape-per-capita displayed, never scored | "Displayed with the reason it does not score" answers the first question every reader asks |
| 7 G20 members excluded, not imputed | Argentina, Brazil, Indonesia, Russia, Saudi Arabia, South Africa, Türkiye are unchecked |
| The score ranks statistical systems, not countries | Say so on the page, every time |
| Female LFPR and female police share are NOT safety indicators | Confounded past use. Saudi LFPR roughly doubled on labour reform; India's fell through rising income and education |

---

## 5. The two discontinuities — the core finding

Both of India's instruments broke in the same reporting year, in the same
direction. **Neither can be read as progress and they cannot corroborate each
other.**

**The survey.** NFHS-6 (fieldwork 2023–24, fact sheets released 29 May 2026;
679,238 households, 716,397 women, 715 districts, all states except Manipur):

```
India spousal violence, ever-married 18-49    29.3% -> ~25%
Karnataka                                     44.4% -> 14.1%   -30.3pp
Kerala                                          9.8% -> 17.7%   +7.9pp
Karnataka sexual violence before 18 (18-29)     2.1% ->  0.2%   zero urban disclosure
```

Researchers comparing rounds report the question structure and routing logic were
identical, which removes the benign explanation. Fieldworker effects account for
~32% of total variation in measured IPV. The fact sheet carries 101 indicators
against NFHS-5's 131 — sex ratio at birth, all three mortality rates and all seven
anaemia breakdowns dropped. Sheets reportedly ready ~a year before release, which
came after the 2024 general election and the April 2026 state elections. The
ministry calls it an interim release; **the full report is still pending.**

**The police series.** NCRB Crime in India 2024, first year of the Bharatiya Nyaya
Sanhita:

```
                                   2023 (IPC)   2024 (BNS)   change
Cognizable crime, all heads             6.24m        5.89m    -6.0%
Rate per lakh population                448.3        418.9    -29.4
Crimes against women                  448,211      441,534    -1.5%
Rate per lakh women                      66.2         64.6     -1.6
Rape                                   32,032       29,536    -7.8%
```

The BNS renumbered offences and changed some definitions and scope. **NCRB itself
advises caution comparing 2024 with earlier years.** The 6% headline fall is not a
finding about crime.

**WHO's 2023 prevalence estimates draw on data published to November 2024, so they
still rest on NFHS-5.** India's global anchor and India's own newest survey now
disagree. Any population-weighted number built on WHO inherits that.

---

## 6. Denominators — derive, do not assume

India's rates on this page use **NCRB's own implied denominators**, derived from
the rates NCRB publishes, not UN WPP. UN WPP gives a materially different total
and mixing the two produces numbers that don't reconcile with NCRB's own
percentages.

```
441,534 crimes against women @ 64.6 per lakh women  ->  683.5m women
5.89m cognizable cases       @ 418.9 per lakh       ->  1,406m people
```

`build.py` computes both denominators from the raw case counts and rates, then
derives the rape rate and ratio from those unrounded figures rather than from the
already-rounded 2.10/117.5 display values — dividing the rounded rates gives
56.0×, not 55.9×. It prints the full chain on every run so drift is visible
immediately.

Computed claims on the page, all reproducible:

```
India rape per 100k population    29,536 / 1,406m        = 2.10
E&W   rape per 100k population    71,667 / 61.0m         = 117.5   (ONS mid-2023)
ratio                                                    = 55.9x
adjusted India  (reporting ~1.1%, x91)                   = ~191
adjusted E&W    (reporting 14.7%,  x6.8)                 = ~799
residual after correcting for reporting                  = 4.2x
```

**Trap:** rape is **6.7%** of crimes against women. The widely reported "10.4%"
uses a different denominator — offences against women *and children*, 284,530
cases. Do not mix them.

---

## 7. What this page never claims

These are on the page, at the top, as the finding. Do not soften or relocate them.

- No statement of the form "India is safer or less safe than X." Not one.
- No harassment rate for India. No national instrument measures it.
- No reporting rate for India. The ~1.1% is inferred from NFHS-5 help-seeking
  (14.2% sought any help; ~8% of those reached police), never measured.
- No current IPV level for India. NFHS-6 is discontinuous, full report pending.
- No trend. Two rounds with a break between them is not a trend.
- Nothing about China. No current public instrument identified — and that absence
  is itself the result.

---

## 8. Comparability is a schema field, not a convention

The one rule that makes everything else honest: **never compare a police statistic
from one country to a survey statistic from another.**

`india-benchmarks.csv` carries `instrument` and `comparable` on every row.
`comparable` is computable, not asserted: it is `yes` when India's instrument
matches the comparator's. Six of 25 rows qualify. That proportion, not any number
inside it, is the finding of the page.

Instrument enum in use: `admin_record`, `probability_survey`,
`subnational_survey`, `non_probability_survey`, `modelled_estimate`,
`perceptual_poll`, `content_analysis`, `crowdsourced`, `audit`, `inferred`.

**Not yet done, and it should be:** port this enum into
`indexes/teenager-outcomes/data/observations.csv` and add one rule to that
index's `validate.py` — fail if any single indicator carries mixed instruments
across countries. Roughly 30 lines. It costs nothing now and makes any future
index honest by construction rather than by discipline.

---

## 9. Known limitations

- **7 of 19 G20 members unverified.** Argentina, Brazil, Indonesia, Russia, Saudi
  Arabia, South Africa, Türkiye. Brazil and Türkiye almost certainly have national
  instruments (Türkiye's Hacettepe National Research on Domestic Violence against
  Women, 2008 and 2014; Brazil's FBSP work) — neither has been checked against
  source. **This is the highest-value work available.** If Brazil scores above
  India the finding gets sharper, not weaker.
- **Delhi figures are city-level and dated.** ICRW/UN Women baseline is 2013;
  Borker's fieldwork is 2017. Neither is nationally representative and the page
  says so.
- **The EU-GBV cells are marked `verified=no`.** Published summaries describe
  partner and non-partner violence plus sexual harassment *at work*. Whether the
  instrument disaggregates *public-space* harassment by act type has not been
  established. Read the questionnaire before promoting those cells.
- **Sample sizes are missing for Australia, Canada and the EU3.** The bar chart
  only shows countries where n is published, and says so.
- **The Amnesty comparison is not a government statistic** and its population is
  women politicians, not women. It is still the only like-for-like cross-national
  measurement in the study, which is itself the point.
- **The 2018 Thomson Reuters "most dangerous country" poll is deliberately absent.**
  It surveyed 548 experts. It is a perception poll about perceptions and it does
  not belong here.
- **`data/india-benchmarks.csv`'s `total_crime` row originally read 5,850,000
  cases.** Its own `note` field and this README both state 5.89m. Corrected to
  5,890,000 to match — the figure the 418.9-per-lakh rate and the 1,406m implied
  population actually reproduce.

---

## 10. Next actions, in order

1. **Verify the 7 remaining G20 rows** in `instruments.csv`. Each needs the survey
   name, agency, cadence, latest round, sample size, and whether it covers
   non-partner violence, disaggregates by act, and publishes a reporting rate.
2. **Read the EU-GBV questionnaire** and settle the three `verified=no` cells.
3. **Port the `instrument` enum + validator rule** into the teenager-outcomes
   index (§8 above).
4. ~~Add the case study to the home page catalogue~~ — done: `site/index.html`
   carries a `.entry` with a bare `.status` chip reading "Case study".
5. **Watch for the NFHS-6 full national report.** It may or may not explain the
   Karnataka discontinuity. Either outcome is publishable; if it does not address
   it, say so.

---

## 11. Advocacy output this page exists to justify

NFHS-6 reached 716,397 women. EU-GBV reached 114,023 across 27 countries. Adding a
past-12-month public-space harassment module by act type — comments, following,
staring, groping, filming, exposure — to the next NFHS round, using EU-GBV
wording, would make India the first non-EU country with a comparable measure of
the harms that actually determine whether women occupy public space. It costs a
questionnaire module on a survey already in the field.

Three further things would move India's capacity score with no new fieldwork:
publish the victim reporting rate as an official statistic as Korea does;
disaggregate the existing sexual violence question by act; and separate the
violence module from the health survey so unmarried women are in scope.

---

## 12. Owner notes

*Anything written here overrides the defaults above.*

<!-- Add direction, corrections, or priorities here. -->

- Anything in this file that is now wrong:
- Publication date target:
