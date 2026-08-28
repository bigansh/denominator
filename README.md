# Denominator

Open composite indexes of human outcomes. Every index is published twice — once
counting countries, once counting people — because those two rankings disagree,
and the disagreement is usually the finding.

**Live site:** [denominator.biglabs.group](https://denominator.biglabs.group)

Currently one index:

| Index | Coverage | Status |
|---|---|---|
| Teenager Outcomes Index (TOI) V3 | 125 countries · 18 indicators · 1.24bn adolescents | Published |

---

## The data is the product

Everything in `data/` is a plain CSV. The site, the scores, the ranks and the
percentiles are all generated from it. There is no number anywhere on the site
that isn't derived from a file you can open in a spreadsheet and edit.

```
data/
  countries.csv              125 rows — iso3, name, region, adolescent population
  dimensions.csv               7 rows — the dimensions and their weights
  indicators.csv              18 rows — indicator registry: weights, direction,
                                        unit, confidence tier, source, caveats
  observations.csv         2,250 rows — the matrix. one row per country-indicator,
                                        with a plausible range and a source
  india_wealth_deciles.csv    within-India strata, wealth deciles
  india_states.csv           within-India strata, states
build/
  build.py                   data/ -> dist/ + site/toi.json
  validate.py                schema and sanity checks. runs in CI on every PR
site/                        the published site. reads site/toi.json
dist/                        generated. results.csv and toi.json
docs/
  METHODOLOGY.md             how a score is computed, in full
  CONTESTED.md               indicators under dispute and how they are handled
  DATA_DICTIONARY.md         every column in every file
```

## Run it

```bash
pip install pandas
python build/validate.py     # checks the data
python build/build.py        # writes dist/ and site/toi.json
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
of the two. Full detail in [docs/METHODOLOGY.md](docs/METHODOLOGY.md).

## Confidence tiers

Every indicator carries a tier, because not all numbers are equally solid:

| Tier | Meaning | Examples |
|---|---|---|
| **A** | Physically counted or measured; nationally sourced; not seriously disputed | under-5 mortality, stunting, electricity access, homicide |
| **B** | Measured, but with real comparability problems | youth NEET, child labour, learning outcomes, mobile broadband |
| **C** | Perceptual or modelled | Cantril life evaluation, imputed learning outcomes |

Every observation also carries `value_low` and `value_high`. The build produces
a band alongside every score, so a country is published as *55.6 [52.4–59.0]*
rather than a bare point estimate — click a row on the site's table to see it.
A contested indicator is a reason to publish a range, not a reason to drop the
indicator or the conclusion.

## Known limitations

Read these before quoting anything.

- **The mental wellbeing dimension is the weakest.** Suicide mortality and adult
  life evaluation are proxies; neither is adolescent-specific. No adolescent
  mental-health prevalence series has global country coverage.
- **17 of 18 indicators are model-compiled reconstructions** from UNICEF, WHO,
  UNESCO UIS, UN Population Division, UNODC, ILO, ITU and the World Happiness
  Report, vintage 2022–2024. They are right in level and ordering but are not a
  verified extract from a single source database. Replacing them with cited
  values pulled from primary sources — a real series ID and access date, not
  just an organisation name — is the single highest-value contribution anyone
  can make to this repository.
- **Learning outcomes are old.** The harmonised learning outcome series covers
  2005–2015, is imputed for 29 of 125 countries, and China's value derives from
  PISA-participating provinces rather than the national population.
- **125 countries, not 194.** Inclusion requires a complete row. Percentiles are
  within-sample and cover about 95% of the world's 10–19 population.
- **Within-India strata are gradients**, encoded from published NFHS-5 and PLFS
  patterns, not a microdata reanalysis.

## Beyond the index

The Teenager Outcomes Index counts people. There's a second, slower line of
work sitting behind it: building the same kind of sourced, checkable dataset
for things that don't fit an index at all — India-specific urban and
infrastructure observations (footpath widths, vehicle density, and similar)
that are usually measured against standards imported from elsewhere rather
than the conditions actually on the ground. No dataset in that line exists in
this repository yet. When one does, it will follow the same rule as the TOI
data: every row sourced, every source checkable, nothing asserted that wasn't
computed.

## Contributing

Corrections are the point of this repository. See
[CONTRIBUTING.md](CONTRIBUTING.md). The short version: edit a row in
`data/observations.csv`, put a real citation in the `source` column, open a pull
request. CI checks the schema and rebuilds. You do not need to touch any code.

## Licence

- **Data** (`data/`, `dist/`): CC BY 4.0
- **Code and site** (`build/`, `site/`): MIT

See [LICENSE](LICENSE) for both, in full. Underlying source data belongs to the
organisations named in the `source` column and is subject to their own terms.
