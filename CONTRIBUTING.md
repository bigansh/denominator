# Contributing

Most of this repository is data, and most of the data can be improved. You do
not need to write code to contribute anything useful here.

## The four kinds of contribution

### 1. Fix a number (most valuable)

The great majority of values in `data/observations.csv` were compiled by a model
and are right in level and ordering but were not pulled cell-by-cell from
primary sources. Replacing one with a cited value from the actual source is the
highest-value thing you can do.

Find the row, change `value`, `value_low`, `value_high`, `year` and `source`.
One indicator per pull request keeps the diff readable — you may change it for
every country at once.

```csv
iso3,country,indicator_id,value,value_low,value_high,year,confidence_tier,source,note
IND,India,stunting,35.5,33.9,37.1,2021,A,"NFHS-5 (2019-21), IIPS, table 10.1",95% CI from survey report
```

Rules:

- `source` must be specific enough for someone else to find the number. "World
  Bank" is not a source. "World Bank WDI series SH.STA.STNT.ZS, accessed
  2026-03-01" is.
- `value_low <= value <= value_high`. If the source publishes a confidence
  interval, use it. If the dispute is between two credible sources, span them
  and say so in `note`.
- `year` is the reference year of the measurement, not the publication year.
- Never invent a number to fill a gap. If a country cannot be completed, it does
  not enter the sample.

### 2. Add a country

You need all 18 indicators. A partial row fails CI, by design. Add a line to
`data/countries.csv` including an adolescent population, then 18 lines to
`data/observations.csv`.

### 3. Argue about the framework

Weights, dimensions and indicator selection are all judgement calls, and yours
may be better than ours. Open an **issue**, not a pull request, and say:

- what you would change and to what,
- the reasoning,
- which countries move and by how much (run `build/build.py` before and after —
  a proposal without the before/after table is hard to evaluate).

We do not accept weight changes that are motivated by the ranking they produce
for a particular country. Argue from the construct, not the result.

### 4. Improve a tier or a caveat

If an indicator is more contested than `indicators.csv` admits, or less, change
the `confidence_tier` and the `caveat` column and explain in the PR. Tier C
indicators are capped in the validator; if your change pushes perceptual weight
above 12 of 100 points, you will get a warning to address.

## Adding an India-specific dataset outside the index

`data/` today is the Teenager Outcomes Index's matrix and nothing else — every
file in it is read by `build/build.py`, so an unrelated dataset doesn't belong
there. A new, India-specific dataset (street measurements, urban density, and
similar) that doesn't fit an index should propose its own top-level folder,
following the same discipline as this one: every value sourced, a schema
documented the way `docs/DATA_DICTIONARY.md` documents this one, and nothing
merged without a citation. Open an issue first to agree the shape before
sending a large PR.

## Before you open a pull request

```bash
pip install pandas
python build/validate.py     # must exit 0
python build/build.py        # must run clean
```

CI runs exactly these two commands. If validation fails, the PR cannot merge.

Include in the PR description:

- **what changed** — indicator, countries affected
- **the source** — link or full citation
- **the effect** — the before/after line for any country that moves more than
  one rank. `build.py` prints India's line by default; paste more if relevant.

## What validation enforces

- Dimension weights sum to 100; each block sums to 50; sub-weights within each
  dimension sum to 1.0
- Every country has every indicator, exactly once
- `countries.csv` and `observations.csv` cover the same country set
- `value_low <= value <= value_high`; percentages within 0–100; ladder within 0–10
- Every observation has a non-empty source and a valid tier
- Warnings (not blocking) for far outliers and for excessive Tier C weight

## Review standard

A pull request is merged when the number is better sourced than the one it
replaces. Not when it is more flattering to a country, and not when it is less.
Both directions of motivated editing are equally unwelcome, and the fastest way
to have a change rejected is to argue for it on the basis of the rank it
produces.

If a value is genuinely disputed between credible sources, the answer is a wider
band in `value_low`/`value_high` and a note explaining the dispute — not a
choice between them.

## Contributing code

The site is plain HTML/CSS/JS with no client-side build step, sharing one
stylesheet (`site/brand.css`) across pages, and reading its data from the
generated `site/toi.json`. Match the existing style of whichever file you're
editing rather than introducing a new pattern. Small, focused PRs preferred.

## Reporting a problem with an existing number

Open an issue with a link to the row in `data/observations.csv` and the source
that contradicts it. If you can, propose the fix as a PR directly.

## Governance

Issues are open to anyone. Data corrections with a real citation are merged on
sight once CI passes. Framework changes need a maintainer to agree, and a
sensitivity run showing what moves.
