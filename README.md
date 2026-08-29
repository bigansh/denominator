# Denominator

An open, sourced-data platform. One rule, applied to everything published
here regardless of what form it takes: nothing goes out until the matrix
behind it exists in a file you can open and check yourself, and nothing is
asserted that wasn't computed.

**Live site:** [denominator.fyi](https://denominator.fyi)

## Two lines of work

**Composite indexes of human outcomes** — each published twice, once counting
countries and once counting people, because those two rankings disagree and
the disagreement is usually the finding. One is published: the
[Teenager Outcomes Index](indexes/teenager-outcomes) — 125 countries, 18
indicators, 1.24bn adolescents, every observation sourced and tiered. Its
full data, method and docs live in
[`indexes/teenager-outcomes/`](indexes/teenager-outcomes), with
[its own README](indexes/teenager-outcomes/README.md).

**A ground-truth data commons for India** — sourced observations about
India's cities and infrastructure that don't reduce to a score at all,
collected from conditions actually on the ground instead of a standard
imported from somewhere else. This is the newer, slower half of the project.
Two examples of the kind of thing it will hold:

- **Footpath adequacy** — effective walkable width, after encroachment,
  parking and hawking are subtracted, measured against actual pedestrian
  load, ward by ward. Most Indian footpath codes descend from British
  pedestrian level-of-service research calibrated for a fraction of the
  footfall and none of the informal economy an Indian footpath actually
  carries.
- **Urban vehicle density** — registered vehicles per square kilometre of
  built-up area, not per kilometre of road. In a ward where the road network
  can't expand and most of the land is already built up, that's the number
  that reflects the actual constraint; vehicles-per-km-of-road is a rural
  metric applied to a dense city.

The pattern behind both: a number computed against an imported standard is
still a true number, it just stops meaning what the standard assumes it
means. Every dense city that has taken this seriously eventually stops
trusting the imported table and starts measuring its own conditions — London
runs its own pedestrian counts, New York's Street Design Manual is built on
New York's own data, Barcelona publishes ward-level data through its own
platform. Nothing under this line has shipped as a dataset yet. When one
does, it lands in its own top-level folder next to `indexes/`, follows the
same rule as everything else here, and gets a line in the table below. See
["Adding a dataset that isn't an index"](CONTRIBUTING.md#adding-a-dataset-that-isnt-an-index)
in CONTRIBUTING.md for the shape it's expected to take.

## What's published

| What | Coverage | Status |
|---|---|---|
| Teenager Outcomes Index | 125 countries · 18 indicators · 1.24bn adolescents | Published |
| India ground-truth commons | — | Not started |

## Repository layout

Every index is self-contained — its own source data, its own build pipeline,
its own docs, its own README — under `indexes/<slug>/`, so a second index
never has to share a schema or a build script with the first one. The site's
generated output lives next to the page that reads it, not in a shared pile
at the site root:

```
indexes/
  teenager-outcomes/         see indexes/teenager-outcomes/README.md
site/
  index.html                  the catalogue — what's published, so far
  assets/                      brand.css, favicon.svg — shared across every page
  indexes/
    teenager-outcomes/
      index.html                the published page
      toi.json                  generated — read by the page above, nothing else
```

A future non-index dataset gets its own top-level folder next to `indexes/`,
and its own page under `site/`, following the same pattern, with its own
README describing what it measures and where it came from.

## Contributing

Corrections are the point of this repository. See
[CONTRIBUTING.md](CONTRIBUTING.md). Most contributions are a data correction
with a real citation, not code — for the Teenager Outcomes Index specifically,
that means a row in `indexes/teenager-outcomes/data/observations.csv`.

## Licence

- **Data** (`indexes/*/data/`, `indexes/*/dist/`): CC BY 4.0
- **Code and site** (everything else): MIT

See [LICENSE](LICENSE) for both, in full. Underlying source data belongs to the
organisations named in each dataset's own source column and is subject to
their own terms.
