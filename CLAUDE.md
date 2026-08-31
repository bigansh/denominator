# Denominator — agent guide

Claude Code loads this file automatically at the start of every session in
this repository. It exists so the conventions below don't have to be
re-explained, or re-learned by making the same mistake twice. Most of the
"hard rules" section is a direct record of something that was built wrong
once, corrected, and should not be reintroduced.

The design system referenced throughout is documented in full in
[`docs/BRAND.md`](docs/BRAND.md) — read that before writing any new page.

## What this project is

An open, sourced-data platform. Nothing is published that wasn't computed
from a file that can be opened and checked, and nothing is asserted that
wasn't computed. See [`README.md`](README.md) for the public-facing version
of this.

## Repository architecture

**In progress:** the presentation layer is mid-migration from static
HTML/CSS to Next.js + Tailwind, on the `redesign/nextjs` branch, not yet
merged to `master`. The homepage (`app/page.tsx`) is rebuilt under the new
system; `indexes/teenager-outcomes/` and `case-studies/counting-women/`'s
pages are not yet, and still live as static HTML under `site/` until their
turn comes. Don't assume the whole site is on one stack until this note is
gone — check which of `app/` or `site/<path>/index.html` actually serves a
given page before editing it.

```
indexes/<slug>/
  data/            source CSVs — the actual editable inputs
  build.py         data/ -> dist/ + public/data/<slug>.json (+, while a
                   page still lives under site/, a copy co-located there)
  validate.py      schema and sanity checks, run in CI on every PR
  dist/            generated output, committed (CI fails if it's stale)
  docs/            this index's own methodology / contested-indicators /
                   data-dictionary docs
  README.md        this index's own full writeup — data schema, run
                   instructions, method, tiers, known limitations

app/               Next.js App Router pages. A page reads its generated
                   JSON at build time from public/data/<slug>.json via
                   lib/data.ts (fs.readFileSync in a Server Component) —
                   never a client-side fetch()
components/        shared React components — Header/Footer (identical on
                   every page, see Hard rules), Brand, and per-page pieces
lib/               data loaders (lib/data.ts) and the shared colour-ramp
                   interpolation (lib/ramp.ts) — the one ramp, reused
                   wherever a score needs a colour, same as before
public/data/       generated JSON, one well-known location every page
                   reads from — the Next.js equivalent of the old
                   co-located <slug>.json

site/              the old static site — still live for any page not yet
                   rebuilt under app/. Being phased out page by page, not
                   deleted until nothing depends on it.

docs/              repository-wide docs (this file's companion pieces —
                   BRAND.md and anything else that applies to every index,
                   not just one)
```

**The core rule this structure exists to enforce:** every index is
self-contained. A second index never has to share a schema, a build
pipeline, or a JSON file with the first one. When in doubt about where
something goes, ask "does this belong to one index, or to the whole
platform?" — one index's specifics go under `indexes/<slug>/`, platform-wide
things go at the root, in `app/`+`components/`+`lib/`, or in `docs/`.

## Adding a new index

Follow the Teenager Outcomes Index (`indexes/teenager-outcomes/`) as the
reference implementation. In order:

1. **Data first.** Build `indexes/<slug>/data/*.csv` before anything else.
   Every observation needs: a value, a plausible low/high range, a year, a
   confidence tier (A = counted/measured and undisputed, B = measured with
   real comparability problems, C = perceptual or modelled), and a source
   specific enough that someone else could find the same number. No row
   ships without a source. No number gets invented to fill a gap — an
   incomplete row means the unit doesn't enter the sample.
2. **`validate.py`** enforces the schema mechanically: weights sum
   correctly, every unit has every indicator exactly once, bands are
   internally consistent, sources are non-empty. Write this before the
   build script, not after.
3. **`build.py`** reads `data/`, computes the score (or whatever the
   output is), runs the whole thing again at every unit's best and worst
   defensible value to produce a band, and writes the generated JSON
   straight into `site/indexes/<slug>/`. The published page always reads a
   band, e.g. `55.6 [52.4–59.0]`, never a bare point estimate.
4. **The page** (`site/indexes/<slug>/index.html`) reads the generated
   JSON at runtime (`fetch('<slug>.json')`, relative, co-located — never an
   absolute `/toi.json`-style path at the site root). Section order:
   construction/method/sources-and-limits/contested-indicators come
   **before** any specific worked example (see Hard rules, below, for why).
   A per-row or per-unit toggle should show the actual underlying
   indicator-level detail — not a re-statement of columns already visible
   in the row.
5. **`indexes/<slug>/README.md`** gets the full writeup: data schema, run
   instructions, method in one paragraph, tier table, known limitations.
   This is where the detail lives — not the root README.
6. **Register it** in `site/index.html`'s catalogue section (one `.entry`
   card) and nowhere else at the root level. The root README and
   CONTRIBUTING.md do not name or detail any specific index — see Hard
   rules.

## Adding something that isn't an index

Not everything published has to reduce to a score. A raw sourced dataset
(no build pipeline, no aggregation) still gets its own top-level folder,
its own README documenting what it measures and the geography/unit it's
at, and the same sourcing discipline — a citation specific enough to
locate the number, and a confidence flag distinguishing a direct
measurement from a modelled or extrapolated one. Agree the shape in an
issue before building it.

### Case studies

A case study is the other non-index shape: an analysis that deliberately
does **not** produce a cross-unit score, usually because coverage is too
incomplete to meet the completeness bar a real index needs (see
`case-studies/counting-women/` — the reference implementation). It gets the
same self-contained treatment as an index, under `case-studies/<slug>/`
rather than `indexes/<slug>/`:

```
case-studies/<slug>/
  data/*.csv        source rows, same sourcing discipline as an index
  build.py          computes every arithmetic claim the page makes and
                     writes the generated JSON
  dist/<slug>.json  generated, committed
site/case-studies/<slug>/
  index.html        the page, co-located <slug>.json fetched at runtime
  README.md         the case study's own full writeup, same as an index's
```

What's different from an index: there's no score, no ranking, no
`validate.py`-enforced weight/band schema — `build.py`'s job is to compute
and print the specific numeric claims the page makes (ratios, denominators,
tallies) so they stay reproducible, not to produce a comparable metric per
unit. A repeating structure inside the case study (a comparison table across
countries, a tally of tag values) should still be JSON-driven and fetched at
runtime, the same as an index's table; one-off narrative facts sourced from
`data/*.csv` rows can stay as prose in the page, checked against `build.py`'s
printed output rather than templated, since there's no per-row structure to
drive there. On the homepage catalogue, a case study gets a bare `.status`
chip reading "Case study" (not `.status.live`) to distinguish it from a
published index.

## Hard rules

Each of these was a real correction, not a style preference.

1. **No sequence numbers on section eyebrows or step labels.** Not `01 /
   Construction`, not `RULE 01`, not `step 04`. Use plain descriptive
   labels (`Construction`, `Compute it, don't assert it`). If prose needs
   to point at another section, link it (`<a href="#method">Method</a>`)
   or say "above" / "further down" — never `&sect;04`.
2. **The root `README.md` and `CONTRIBUTING.md` never name or detail a
   specific index.** No stats, no schema walkthrough, no "the Teenager
   Outcomes Index is..." — that all lives in that index's own README. The
   root docs describe the platform and the rule only. This was rebuilt
   three times before landing here; don't re-add index-specific detail to
   either file.
3. **Never publish forward-looking or aspirational content**, on the site
   or in docs. No "coming soon," no draft catalogue entries for unbuilt
   work, no naming a future focus area before anything exists for it. Show
   only what's actually built. If it isn't published, it isn't mentioned.
4. **Landing pages are minimal text, large visuals.** A hero section is a
   headline, at most one short sentence of lede, and one large visual —
   not a paragraph of exposition. This applies to the homepage hero and to
   each index page's hero.
5. **Nav and footer are identical across every page** — same links, same
   order, same wording. If a page needs page-specific navigation (jumping
   to its own sections), that's a separate in-page element (see
   `.jumpnav` in the TOI page), never a variation on the shared header or
   footer.
6. **Never use a 3-value `padding` shorthand** (`padding: Xpx 0 Ypx`) on
   an element that also needs `.wrap`'s horizontal gutter. The middle `0`
   silently zeroes left/right padding and overrides the gutter, because
   both rules have equal specificity and the later one in the cascade
   wins. This exact bug shipped twice (`.toi-hero`, `.home-hero`) before
   being caught by measuring computed styles, not by looking at it. Use
   `padding-top` / `padding-bottom` as separate properties instead.
7. **Testing mobile widths in headless Chrome:** `--window-size` silently
   floors around 500px in this environment and will not reproduce anything
   below that — it *looks* like it's rendering a narrow viewport but isn't.
   Use CDP device-metrics emulation instead
   (`Emulation.setDeviceMetricsOverride` with `mobile: true`, driven over
   the remote-debugging websocket) to get a real sub-500px render before
   concluding a mobile layout bug does or doesn't exist.
8. **Data-first, always.** No number is hardcoded into an HTML or JS file.
   If a value can change, it lives in a CSV under `data/` and gets read by
   `build.py`. This is the entire reason the repository is structured the
   way it is — it's not a style preference, it's the point.
9. **Tables that would need horizontal scroll on mobile don't get one.**
   Hide secondary columns below the relevant breakpoint and recover that
   information in an expandable per-row detail panel instead (see
   `table.grid` in the TOI page for the pattern).

## Deployment

Vercel, connected to `github.com/bigansh/denominator`, production branch
`master`. Live at `denominator.fyi`, aliased through Vercel; changing a
published index's URL slug needs a matching entry in `vercel.json`'s
`redirects` so old links don't 404.

On `master` (the still-static site): `vercel.json`'s `buildCommand` runs
each index's `build.py` (pip install needs `--break-system-packages` —
Vercel's Python is `uv`-managed and rejects a plain `pip install`).
`outputDirectory` is `site`.

On `redesign/nextjs` (mid-migration, not yet merged): `buildCommand` runs
the same `build.py` scripts — now writing into `public/data/` — followed by
`next build`; `framework` is `"nextjs"` and `outputDirectory` is unset
(Next.js manages its own build output). Once every page is rebuilt under
`app/` and this branch merges to `master`, this becomes the only
deployment path and this section's "on master" half goes away.
