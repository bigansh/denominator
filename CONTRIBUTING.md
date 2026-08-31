# Contributing

Most of what lives in this repository is data, and most of it can be
improved. You do not need to write code to contribute anything useful here.

Each published thing is self-contained under its own top-level folder, with
its own data, its own README, and its own contribution notes specific to
what it measures and how — read that folder's own README before opening a
PR against it. This document covers what's true across all of them.

## Review standard

A contribution is merged when it's better sourced than what it replaces, or
fills a genuine gap — not when it's more flattering to a place, and not when
it's less. Motivated editing in either direction is rejected. If a value is
genuinely disputed between credible sources, the answer is a wider range and
a note explaining the dispute, not a choice between them.

## Proposing something new

A new dataset or a new published index doesn't need to look like anything
already here. Open an **issue** first to agree the shape — what it measures,
what geography or unit it's at, what "sourced" means for that particular
kind of observation — before sending a large PR.

## Contributing code

The site is Next.js + Tailwind, sharing one design system
(`app/globals.css`'s tokens and the components in `components/`) across
pages. Match the existing style of whichever file you're editing rather
than introducing a new pattern. Small, focused PRs preferred.

## Reporting a problem with an existing number

Open an issue with a link to the row and the source that contradicts it. If
you can, propose the fix as a PR directly.

## Governance

Issues are open to anyone. Data corrections with a real citation are merged
on sight once CI passes, where CI applies. Anything that changes a schema or
a framework needs a maintainer to agree.
