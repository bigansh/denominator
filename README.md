# Denominator

An open, sourced-data platform, not a single dataset. Two things live here
under the same rule — nothing published that wasn't computed from a file you
can open and check:

1. **Composite indexes of human outcomes**, each published twice — once
   counting countries, once counting people — because those two rankings
   disagree, and the disagreement is usually the finding.
2. **A ground-truth data commons for India** — sourced observations that don't
   fit an index at all (street and urban infrastructure measurements, for a
   start), collected from local conditions instead of imported standards.

**Live site:** [denominator.fyi](https://denominator.fyi)

## Repository layout

Every index is self-contained — its own source data, its own build pipeline,
its own docs — under `indexes/<slug>/`, so a second index never has to share
a schema or a build script with the first one. The site's generated output
lives next to the page that reads it, not in a shared pile at the site root:

```
indexes/
  teenager-outcomes/
    data/                     the source CSVs — see below
    build.py                  data/ -> dist/ + site/indexes/teenager-outcomes/toi.json
    validate.py                schema and sanity checks. runs in CI on every PR
    dist/                      generated. results.csv and toi.json
    docs/
      METHODOLOGY.md           how a score is computed, in full
      CONTESTED.md             indicators under dispute and how they are handled
      DATA_DICTIONARY.md       every column in every file
site/
  index.html                   the catalogue — what's published, so far
  assets/                       brand.css, favicon.svg — shared across every page
  indexes/
    teenager-outcomes/
      index.html                the published page
      toi.json                  generated — read by the page above, nothing else
```

A future non-index dataset (see [Beyond the index](#beyond-the-index)) gets
its own top-level folder next to `indexes/`, and its own page under
`site/`, following the same pattern.

## What's published

**Indexes**

| Index | Coverage | Status |
|---|---|---|
| Teenager Outcomes Index (TOI) | 125 countries · 18 indicators · 1.24bn adolescents | Published |

**India dataset commons**

Nothing yet. This is the newer, slower half of the project — see
[Beyond the index](#beyond-the-index) below for what it's for and how a
dataset gets added. The rest of this document, past that section, describes
the Teenager Outcomes Index specifically.

---

## Beyond the index

The Teenager Outcomes Index counts people. There's a second, slower line of
work sitting alongside it: building the same kind of sourced, checkable
dataset for things that don't fit an index at all — India-specific urban and
infrastructure observations (footpath widths, vehicle density, and similar)
that are usually measured against standards imported from elsewhere rather
than the conditions actually on the ground. No dataset in that line exists in
this repository yet. When one does, it lands in its own top-level folder next
to `indexes/`, follows the same rule as the TOI data — every row sourced, every
source checkable, nothing asserted that wasn't computed — and gets its own
entry in the table above. See [CONTRIBUTING.md](CONTRIBUTING.md#adding-a-dataset-that-isnt-an-index)
for the shape a new dataset is expected to take.

---

## Teenager Outcomes Index

Everything from here down is specific to the TOI — the one index currently
published. Its own data, build pipeline and docs live under
[`indexes/teenager-outcomes/`](indexes/teenager-outcomes).

## The data is the product

Everything in `indexes/teenager-outcomes/data/` is a plain CSV. The site, the
scores, the ranks and the percentiles are all generated from it. There is no
number anywhere on the page that isn't derived from a file you can open in a
spreadsheet and edit.

```
indexes/teenager-outcomes/data/
  countries.csv              125 rows — iso3, name, region, adolescent population
  dimensions.csv               7 rows — the dimensions and their weights
  indicators.csv              18 rows — indicator registry: weights, direction,
                                        unit, confidence tier, source, caveats
  observations.csv         2,250 rows — the matrix. one row per country-indicator,
                                        with a plausible range and a source
  india_wealth_deciles.csv    within-India strata, wealth deciles
  india_states.csv           within-India strata, states
```

## Run it

```bash
pip install pandas
python indexes/teenager-outcomes/validate.py   # checks the data
python indexes/teenager-outcomes/build.py      # writes dist/ and site/indexes/teenager-outcomes/toi.json
cd site && python -m http.server 8000
```

Build output for the current data:

```
India: TOI 55.6 [52.4-59.0]  rank 81  country pct 35.5  pop pct 42.9
```

## The one-paragraph method

Each indicator is clipped at the 5th and 95th percentile of the sample, rescaled
0–100, and inverted where lower is better. Indicators roll up into seven
dimensions by fixed sub-weights; dimensions roll into a **Life Score** (health,
mental wellbeing, safety, living environment — 50 points) and a **Future Score**
(education, economic future, digital access — 50 points). The index is the mean
of the two. Full detail in
[indexes/teenager-outcomes/docs/METHODOLOGY.md](indexes/teenager-outcomes/docs/METHODOLOGY.md).

## Confidence tiers

Every indicator carries a tier, because not all numbers are equally solid:

| Tier | Meaning | Examples |
|---|---|---|
| **A** | Physically counted or measured; nationally sourced; not seriously disputed | under-5 mortality, stunting, electricity access, homicide |
| **B** | Measured, but with real comparability problems | youth NEET, child labour, learning outcomes, mobile broadband |
| **C** | Perceptual or modelled | Cantril life evaluation, imputed learning outcomes |

Every observation also carries `value_low` and `value_high`. The build produces
a band alongside every score, so a country is published as *55.6 [52.4–59.0]*
rather than a bare point estimate — click a row on the site's table to see it,
along with the full indicator-by-indicator breakdown behind that number.
A contested indicator is a reason to publish a range, not a reason to drop the
indicator or the conclusion.

## Known limitations

Read these before quoting anything.

- **Sources are organisation-level, not yet series-ID-level.** Every one of the
  2,250 observations names a real source — UN IGME, UNICEF/WHO/World Bank JME,
  WHO Global Health Estimates, UNODC, ILO/UNICEF, UNESCO UIS, ITU, the World
  Happiness Report, and others — but not yet a specific series ID and access
  date on every row. Tightening those 2,250 citations to that standard is the
  single highest-value contribution anyone can make to this repository.
- **The mental wellbeing dimension is the weakest.** Suicide mortality and adult
  life evaluation are proxies; neither is adolescent-specific. No adolescent
  mental-health prevalence series has global country coverage.
- **Learning outcomes are old.** The harmonised learning outcome series covers
  2005–2015, is imputed for 29 of 125 countries, and China's value derives from
  PISA-participating provinces rather than the national population.
- **125 countries, not 194.** Inclusion requires a complete row. Percentiles are
  within-sample and cover about 95% of the world's 10–19 population.
- **Within-India strata are gradients**, encoded from published NFHS-5 and PLFS
  patterns, not a microdata reanalysis.

Four indicators are formally contested — the Cantril life evaluation, stunting
(against the Global Hunger Index), youth NEET, and the learning-outcome vintage
— with the policy and the worked cases for each in
[indexes/teenager-outcomes/docs/CONTESTED.md](indexes/teenager-outcomes/docs/CONTESTED.md).

## Contributing

Corrections are the point of this repository. See
[CONTRIBUTING.md](CONTRIBUTING.md). The short version: edit a row in
`indexes/teenager-outcomes/data/observations.csv`, put a real citation in the
`source` column, open a pull request. CI checks the schema and rebuilds. You
do not need to touch any code.

## Licence

- **Data** (`indexes/*/data/`, `indexes/*/dist/`): CC BY 4.0
- **Code and site** (everything else): MIT

See [LICENSE](LICENSE) for both, in full. Underlying source data belongs to the
organisations named in the `source` column and is subject to their own terms.
