# Contested indicators

Some of the numbers in this index are disputed. This document says which, why,
and what we do about it.

## The policy

**A contested indicator is a reason to publish a range, not a reason to drop the
indicator or to drop the conclusion.**

Dropping a disputed number silently smuggles in a judgement — usually the
judgement of whoever is loudest. Keeping it silently pretends to a precision the
data does not have. So every disputed indicator stays in, with a
`value_low`/`value_high` band wide enough to span the credible disagreement, and
the index is published as a band.

## Four tests we apply before deciding how to handle a dispute

**1. Is the dispute about the instrument or the collection?**
A fight over what a number *means* is a validity problem, handled with weights.
A fight over whether it was *measured properly* is a reliability problem,
handled with bands.

**2. Does the indicator have a physical anchor?**
Height-for-age, deaths, electricity connections and subscriptions are countable.
Ladder scores and perception indices are not. Physically anchored indicators
survive political disagreement; perceptual ones do not. Tier accordingly.

**3. Would the domestic statistical system produce the same answer?**
Stunting from NFHS passes this test — it is India's own survey. A foreign
composite built on top of national data does not automatically inherit that
standing.

**4. Does the conclusion survive the plausible range?**
Run it. If the headline holds across the full band, say so. If it doesn't,
publish the range instead of the point.

---

## Case: Cantril life evaluation (`ladder`, tier C)

**What it is.** One question from the Gallup World Poll: imagine a ladder from 0
(worst possible life for you) to 10 (best possible life for you); which step are
you on now? The national score is the arithmetic mean, three-year rolling,
roughly 1,000 respondents per country per year. It is an adult measure, not an
adolescent one, and the six variables the World Happiness Report reports
alongside it (GDP, social support, life expectancy, freedom, generosity,
corruption) are regressors used to explain the score, not inputs to it.

**Why it is contested for India.** India scores far below its income level and
below several poorer neighbours. Three explanations compete, none conclusive:

- *Aspiration gap.* The question is relative to the best life **for you**, so it
  is attainment over expectation. Fast-rising expectations mechanically depress
  the ladder even as conditions improve.
- *Scale use.* Abstract 0–10 self-placement is a learned skill and translates
  unevenly across a dozen-plus languages.
- *Face value.* India scores lowest on perceived freedom of life choices, and
  the report's own regressions weight social trust heavily.

**How we handle it.** Tier C. A ±20% band, spanning the WHR 2024 value (4.054)
through 2026 (4.536). The validator warns if Tier C indicators exceed 12 of 100
index points.

**Does the conclusion survive?** Yes, and removing the indicator makes India
*worse*, not better — the mental dimension then rests wholly on suicide
mortality, where India is also below median.

| Scenario | India TOI | Rank |
|---|---|---|
| Pessimistic ladder + pessimistic stunting | 54.6 | 83 |
| Central, as published | 55.6 | 81 |
| Optimistic ladder + optimistic stunting | 56.4 | 81 |
| Ladder forced to the sample median | 57.8 | 80 |
| Ladder deleted from the index entirely | 56.0 | **85** |

## Case: child stunting (`stunting`, tier A)

**What it is.** Height-for-age more than two standard deviations below the WHO
reference median, in children under five. For India the source is NFHS-5
(2019–21), run by the national health ministry.

**Why it is contested.** The Government of India has rejected the Global Hunger
Index in successive editions, arguing that three of its four indicators concern
child health and cannot be projected onto the whole population, and that the
fourth rests on a small opinion-poll sample. It also cites Poshan Tracker
administrative data showing far lower wasting than the GHI uses.

**How we handle it.** We do not use the GHI. We use the NFHS stunting figure
directly, which is India's own probability-sample survey, not a foreign
composite. The government's methodological objection is to the GHI's
*construction*, not to NFHS anthropometry — Poshan Abhiyaan is built around
reducing the same measure. The Poshan Tracker is a self-selected administrative
census of children attending anganwadis, measured by staff with an incentive to
record improvement; it is not a substitute for a probability sample and the two
are not measuring the same population.

A ±6% band is applied to span the residual disagreement. The dispute is
materially sharper for *wasting*, which this index does not use.

## Case: youth NEET (`neet`, `neet_gap`, tier B)

**What it is.** Share of 15–24-year-olds not in employment, education or
training.

**Why it is contested.** Comparability. In low-income settings, subsistence
farming and unpaid family work are counted as employment, which mechanically
depresses measured NEET. India's high NEET partly reflects a formalised labour
statistic and a large population of young women outside both school and measured
work — a genuine outcome, but the comparison set is not clean.

**How we handle it.** Tier B, ±5% band, and the caveat is printed alongside the
result rather than buried. India's values sit at the winsorisation ceiling, so
the index cannot represent India as worse than it already does on these two.

## Case: harmonised learning outcome (`hlo`, tier B; C where imputed)

Vintage 2005–2015 and imputed for 29 of 125 countries by OLS on log(under-5
mortality), youth literacy, lower-secondary completion and internet use
(R² 0.87). China's value derives from PISA-participating provinces rather than
the national population, and mainland China produced no PISA 2022 result at all.

Imputed cells are dropped to tier C and carry a ±6% band. Replacing this series
with something current is the most valuable single upgrade available to this
repository.

## Reporting standard

When citing a result from this index, cite the band. `India: 55.6 [52.4–59.0],
rank 81 of 125` is the correct form. A bare point estimate from a dataset that
publishes bands is a misquotation.
