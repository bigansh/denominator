# Data dictionary

## data/countries.csv
| column | type | notes |
|---|---|---|
| `iso3` | string | ISO 3166-1 alpha-3. Primary key. |
| `name` | string | Display name. Must match the name used in `observations.csv`. |
| `region` | string | One of: Africa, Central Asia, East Asia, Europe, Latin America, Middle East, North America, Oceania, South Asia, Southeast Asia. |
| `pop_1019_millions` | float | Population aged 10–19, millions. Used for the population-weighted percentile. |
| `pop_source` | string | Provenance of the population figure. |
| `pop_tier` | A/B/C | Confidence tier for the population figure. |

## data/dimensions.csv
| column | type | notes |
|---|---|---|
| `dimension_id` | string | Primary key. Referenced by `indicators.csv`. |
| `label` | string | Display name. |
| `block` | life / future | Which half of the index. Each block must total 50 points. |
| `weight_points` | int | Points out of 100. All seven must sum to 100. |
| `core_question` | string | The question the dimension is meant to answer. |

## data/indicators.csv
| column | type | notes |
|---|---|---|
| `indicator_id` | string | Primary key. Referenced by `observations.csv`. |
| `label` | string | Display name. |
| `dimension_id` | string | Foreign key to `dimensions.csv`. |
| `sub_weight` | float | Share within its dimension. Sub-weights within a dimension must sum to 1.0. |
| `direction` | positive / negative | `negative` means lower is better and the normalised score is inverted. |
| `unit` | string | Unit of the raw value. |
| `confidence_tier` | A/B/C | A = counted and undisputed. B = measured with comparability problems. C = perceptual or modelled. |
| `canonical_source` | string | Where this indicator should come from. |
| `caveat` | string | What is wrong with it. Shown on the site. |

## data/observations.csv
The matrix. One row per country × indicator. 125 × 18 = 2,250 rows.

| column | type | notes |
|---|---|---|
| `iso3` | string | Foreign key to `countries.csv`. |
| `country` | string | Denormalised for readability in diffs. Must match `countries.csv`. |
| `indicator_id` | string | Foreign key to `indicators.csv`. |
| `value` | float | The central estimate. This drives the published score. |
| `value_low` | float | Least favourable defensible value. Must be ≤ `value`. |
| `value_high` | float | Most favourable defensible value. Must be ≥ `value`. |
| `year` | int | Reference year of the measurement, not of publication. |
| `confidence_tier` | A/B/C | May differ from the indicator default — e.g. an imputed cell drops to C. |
| `source` | string | Required. Must be specific enough to locate the number. |
| `note` | string | Free text. Use it for disputes, imputation method, survey table references. |

Note that `value_low`/`value_high` are in the indicator's own units, so for a
negative indicator the *low* value is the better one. The build handles the
direction; contributors should not pre-invert anything.

## dist/results.csv
Generated. One row per country: dimension scores, `life`, `future`, `toi`,
`toi_low`, `toi_high`, `rank`, `country_pct`, `pop_pct`.

## dist/toi.json and site/toi.json
Generated. The payload the site reads. Same content as `results.csv` plus
dimension metadata, sample medians, India's dimension profile, and the
within-India strata.
