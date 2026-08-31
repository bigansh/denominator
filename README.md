# Denominator

An open, sourced-data platform. Nothing is published here that wasn't
computed from a file you can open and check yourself, and nothing is
asserted that wasn't computed.

**Live site:** [denominator.fyi](https://denominator.fyi)

## What this is about

We publish data on human outcomes, sourced and checkable, counted per unit
and per person, because those two counts usually disagree and the
disagreement is the finding worth having.

## What's published

See the live site for what's currently up.

## Repository layout

Every published thing is self-contained under its own folder — its own
data, its own docs, its own README — so nothing has to share a schema or a
pipeline with anything else published here:

```
indexes/<slug>/         one folder per published index
case-studies/<slug>/    one folder per published case study — an analysis
                        that doesn't reduce to a cross-unit score
app/                    the published site (Next.js)
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Licence

- **Data:** CC BY 4.0
- **Code and site:** MIT

See [LICENSE](LICENSE) for both, in full. Underlying source data belongs to
the organisations named in each dataset's own source column and is subject
to their own terms.
