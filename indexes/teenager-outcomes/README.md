# Teenager Outcomes Index

125 countries, 18 indicators, 7 dimensions, 1.24bn adolescents. Scored once
per country and once per person, because those two rankings disagree and the
disagreement is usually the finding. Published at
[denominator.fyi/indexes/teenager-outcomes/](https://denominator.fyi/indexes/teenager-outcomes/).

## The data is the product

Everything in `data/` is a plain CSV. The site, the scores, the ranks and the
percentiles are all generated from it. There is no number on the page that
isn't derived from a file you can open in a spreadsheet and edit.

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
build.py                     data/ -> dist/ + ../../site/indexes/teenager-outcomes/toi.json
validate.py                  schema and sanity checks. runs in CI on every PR
dist/                        generated. results.csv and toi.json
docs/
  METHODOLOGY.md             how a score is computed, in full
  CONTESTED.md               indicators under dispute and how they are handled
  DATA_DICTIONARY.md         every column in every file
```

## Run it

```bash
pip install pandas
python validate.py     # checks the data, from this directory
python build.py        # writes dist/ and the site's toi.json
cd ../../site && python -m http.server 8000
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
rather than a bare point estimate — click a row on the site's table to see it,
along with the full indicator-by-indicator breakdown behind that number.
A contested indicator is a reason to publish a range, not a reason to drop the
indicator or the conclusion — see [docs/CONTESTED.md](docs/CONTESTED.md) for
the four cases handled that way.

## Known limitations

Read these before quoting anything.

- **Sources are organisation-level, not yet series-ID-level.** Every one of the
  2,250 observations names a real source — UN IGME, UNICEF/WHO/World Bank JME,
  WHO Global Health Estimates, UNODC, ILO/UNICEF, UNESCO UIS, ITU, the World
  Happiness Report, and others — but not yet a specific series ID and access
  date on every row. Tightening those 2,250 citations to that standard is the
  single highest-value contribution anyone can make to this index.
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

## Contributing to this index

See the repository's [CONTRIBUTING.md](../../CONTRIBUTING.md). The short
version: edit a row in `data/observations.csv`, put a real citation in the
`source` column, open a pull request. CI checks the schema and rebuilds. You
do not need to touch any code.
