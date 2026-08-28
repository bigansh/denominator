# Methodology

## 1. Sample

A country enters the index only if every indicator can be populated at
reasonable confidence. Partial coverage means exclusion, not imputation. The one
exception is the harmonised learning outcome, imputed by OLS for 29 countries
and flagged with tier C on those rows.

125 countries, covering roughly 95% of the world's population aged 10–19.
Percentiles are within-sample.

## 2. Normalisation

Each indicator is clipped at the 5th and 95th percentile of the sample, then
rescaled to 0–100:

    positive indicator:  100 * (clip(x) - p05) / (p95 - p05)
    negative indicator:  100 * (p95 - clip(x)) / (p95 - p05)

Clipping stops a single extreme country from compressing everyone else into a
narrow band — Lesotho's suicide rate, Niger's child marriage rate and Chad's
electricity access would each do this if left unbounded.

The winsorisation bounds are computed once, from the central values, and then
frozen. The low and high runs move a country against a fixed scale rather than
reshaping the scale underneath it.

## 3. Aggregation

    dimension = Σ (normalised indicator × sub_weight)
    Life      = Σ (dimension × weight) for life-block dimensions / 50
    Future    = Σ (dimension × weight) for future-block dimensions / 50
    Index     = 0.5 × Life + 0.5 × Future

| Dimension | Block | Points |
|---|---|---|
| Health & survival | life | 15 |
| Mental & social wellbeing | life | 15 |
| Safety & protection | life | 15 |
| Living environment | life | 5 |
| Education & learning | future | 25 |
| Economic future | future | 15 |
| Digital & opportunity access | future | 10 |

Life and Future are kept apart and weighted evenly so that a country with a
comfortable present and a poor launchpad cannot hide behind a single average.

## 4. Two percentiles

**Country percentile** — each country is one unit:

    (ascending rank − 1) / (N − 1) × 100

**Population percentile** — each country is weighted by its 10–19 population:

    share of adolescents in lower-scoring countries
      + half the share living in this country

The midpoint convention matters for large countries. India is a single
indivisible 20.4% block of the world's adolescents, so the strict-below figure
(32.6), the midpoint (42.9) and the below-plus-self figure (53.0) span twenty
points. The midpoint is published because it is the standard treatment for a
tied block and the only one that does not let a country's own size distort the
answer in either direction.

## 5. Bands

Every observation carries `value_low` and `value_high`. The build runs the whole
index three times: central, every-country-at-its-best, and
every-country-at-its-worst. The published band for a country is the spread of
its own score across those runs.

This is how contested indicators are handled. Dropping a disputed indicator
smuggles in a judgement; keeping it silently pretends to a precision the data
does not have. The band is the honest object. See [CONTESTED.md](CONTESTED.md).

## 6. Sensitivity

India's country percentile under nine alternative specifications:

| Specification | Percentile | Rank |
|---|---|---|
| V3 baseline | 35.5 | 81 |
| Equal dimension weights | 34.7 | 82 |
| Economic 15→25, Education 25→15 | 27.4 | 91 |
| Economic 15→5, Education 25→35 | 39.5 | 76 |
| Mental dimension dropped | 38.7 | 77 |
| Life Score only | 35.5 | 81 |
| Future Score only | 35.5 | 81 |
| No winsorisation | 37.9 | 78 |
| Z-score normalisation | 35.5 | 81 |

Range 27–40. A headline that moves materially under reweighting should be
reported as a range, not a point.

## 7. Within-country strata

To test a claim like "Indian teenagers do better than X% of the world", India is
split by household wealth using domestic survey gradients (NFHS-5, PLFS), each
stratum is scored against the *frozen global* bounds, and the strata are
inserted into the world distribution in place of the country's single block.

Symmetry check: splitting all 125 countries into the same strata barely moves
the result, so the comparison is not an artefact of disaggregating one side only.
