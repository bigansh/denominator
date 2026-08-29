# Contributing

Most of what lives in this repository is data, and most of it can be
improved. You do not need to write code to contribute anything useful here.
There are two lines of work — see the root [README](README.md) — and they're
contributed to differently.

## Contributing to the Teenager Outcomes Index

The published index. Its data, schema and review standard are documented in
full in [`indexes/teenager-outcomes/README.md`](indexes/teenager-outcomes/README.md)
and [`indexes/teenager-outcomes/docs/`](indexes/teenager-outcomes/docs) — read
those before opening a PR. In short:

- **Fix a number** (the highest-value thing you can do): find the row in
  `indexes/teenager-outcomes/data/observations.csv`, replace `value`,
  `value_low`, `value_high`, `year` and `source` with a cited figure from the
  actual source. "World Bank" is not a source; "World Bank WDI series
  SH.STA.STNT.ZS, accessed 2026-03-01" is.
- **Add a country** — every one of the 18 indicators, or CI rejects the row.
- **Argue about the framework** (weights, dimensions, indicator choice) — open
  an *issue*, not a PR, with the before/after table from
  `python indexes/teenager-outcomes/build.py`. Changes motivated by the rank
  they produce for a specific country are rejected on sight, in either
  direction.
- **Improve a tier or a caveat** in `indicators.csv`, with the reasoning in the
  PR.

Before opening a PR:

```bash
pip install pandas
python indexes/teenager-outcomes/validate.py     # must exit 0
python indexes/teenager-outcomes/build.py        # must run clean; commit the regenerated toi.json
```

CI runs exactly these two commands and fails the PR if `site/indexes/teenager-outcomes/toi.json`
doesn't match what `build.py` produces from the data in the same commit.

## Adding a dataset that isn't an index

The India ground-truth line of work — see the README for what it's for.
Nothing in it needs to reduce to a score, and it doesn't need a build
pipeline the way the index does, but it needs the same discipline:

- Its own top-level folder, named for what it measures (e.g.
  `footpath-adequacy/`), not nested inside `indexes/`.
- A `data/` folder of plain, editable files — CSV unless there's a real reason
  otherwise.
- A README documenting what's measured, the geography it's measured at (ward,
  city, state — be specific), and a schema for each file, the way
  `indexes/teenager-outcomes/docs/DATA_DICTIONARY.md` documents that index's
  files.
- A `source` on every row specific enough for someone else to locate the
  number, and a confidence tier or equivalent flag distinguishing a direct
  measurement from a modelled or extrapolated one.

Open an **issue** first to agree the shape — the geography unit, the schema,
what "sourced" means for this particular kind of observation — before sending
a large PR. This section will grow into something closer to the Teenager
Outcomes Index's contribution guide once a first dataset exists to write it
against.

## Review standard

Applies to both lines of work. A contribution is merged when the number is
better sourced than the one it replaces or fills a genuine gap — not when it
is more flattering to a place, and not when it is less. Both directions of
motivated editing are equally unwelcome. If a value is genuinely disputed
between credible sources, the answer is a wider range and a note explaining
the dispute, not a choice between them.

## Contributing code

The site is plain HTML/CSS/JS with no client-side build step, sharing one
stylesheet (`site/assets/brand.css`) across pages. Each index's page reads
its own generated JSON, co-located under `site/indexes/<slug>/`. Match the
existing style of whichever file you're editing rather than introducing a new
pattern. Small, focused PRs preferred.

## Reporting a problem with an existing number

Open an issue with a link to the row and the source that contradicts it. If
you can, propose the fix as a PR directly.

## Governance

Issues are open to anyone. Data corrections with a real citation are merged on
sight once CI passes (where CI applies). Framework or schema changes need a
maintainer to agree, and — for the index — a sensitivity run showing what
moves.
