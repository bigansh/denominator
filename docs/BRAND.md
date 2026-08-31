# Denominator — brand book

The design system behind every page in this repository, extracted from the
actual stylesheet (`site/assets/brand.css`) and the page-specific styles
built on top of it. If a new page needs a component that isn't described
here, build it to match what's here rather than inventing a new pattern —
and then add it to this document.

---

## 1. Identity

**Name:** Denominator, always capitalised, never abbreviated in running
text. Every ranking has a denominator; most don't tell you theirs — that's
the whole premise, and the name is meant to be read literally.

**Mark:** a 26×9px horizontal bar (`.rule-bar`), filled with a 7-stop
linear gradient running through the full data ramp (below), placed
immediately to the left of the wordmark. It is not a logo separate from
the colour system — it *is* the colour system, shown as a swatch. This is
also the favicon (`site/assets/favicon.svg`): the same bar, centred on a
rounded paper-coloured square.

**Wordmark:** "Denominator" set in Bricolage Grotesque, weight 800, 19px,
letter-spacing -0.045em.

---

## 2. Colour

Two independent palettes. Never mix their roles: the ink/paper palette is
for interface (text, backgrounds, borders); the ramp is for data (score,
magnitude, rank) and nothing else — it never colours a button, a nav link,
or decorative chrome.

### Interface

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#E3E7E1` | Page background |
| `--paper-2` | `#D7DCD4` | Hover states, subtle fills, expanded-row backgrounds |
| `--paper-3` | `#CBD2C9` | Text-on-dark tertiary (e.g. captions inside a filled block) |
| `--ink` | `#141B17` | Primary text, borders on emphasis elements, filled blocks |
| `--ink-2` | `#4A5751` | Secondary text — labels, captions, nav links at rest |
| `--ink-3` | `#6D7A73` | Tertiary text — the quietest label on the page |
| `--rule` | `#B4BCB4` | Hairline borders between sections and table rows |

### The data ramp

Seven stops, low to high. Plum is worst, deep teal is best. This exact
sequence is the only palette ever used to represent a score, a rank, or a
magnitude, on any chart, table, chip, or map, in any index:

| Stop | Hex |
|---|---|
| `--s0` | `#4B1D3F` |
| `--s1` | `#8E3536` |
| `--s2` | `#C06A34` |
| `--s3` | `#C9A94E` |
| `--s4` | `#6F9A6B` |
| `--s5` | `#2A6C63` |
| `--s6` | `#134B4C` |

`--s2` doubles as the single accent colour for interface moments that need
one — the underline beneath an emphasised word in a hero headline, the
focus ring (`:focus-visible`), the left border of a blockquote. It is
never used decoratively beyond that; reach for it because it's already the
accent, not because orange is available.

The ramp is interpolated in JavaScript wherever a continuous score needs a
colour (e.g. a value from 0–100), not just used as 7 discrete swatches:

```js
const RAMP = ['#4B1D3F','#8E3536','#C06A34','#C9A94E','#6F9A6B','#2A6C63','#134B4C'];
function hx(h){return[1,3,5].map(i=>parseInt(h.slice(i,i+2),16))}
function col(t){ // t in roughly 10–96
  const x = Math.max(0,Math.min(1,(t-10)/86))*(RAMP.length-1);
  const i = Math.floor(x), f = x-i, a = hx(RAMP[i]), b = hx(RAMP[Math.min(i+1,RAMP.length-1)]);
  return `rgb(${a.map((v,k)=>Math.round(v+(b[k]-v)*f)).join(',')})`;
}
```

Reuse this function rather than re-deriving the interpolation each time.

---

## 3. Typography

**Mid-migration note:** the display face changed from Bricolage Grotesque to
**Space Grotesk** as part of the Next.js rebuild (`redesign/nextjs` branch)
— Bricolage read as too heavy/generic; Space Grotesk carries the same
"technical, not decorative" job with more mechanical character and less
weight. Pages already rebuilt under `app/` use Space Grotesk, loaded via
`next/font/google` in `app/layout.tsx` (self-hosted at build, not a
`<link>`). Pages still under `site/` are unchanged (Bricolage Grotesque, the
old `<link>` tag) until their turn to be rebuilt. Newsreader and IBM Plex
Mono are unchanged in both.

Three families, three distinct jobs. Never use one for another's job.

| Token | Family | Job |
|---|---|---|
| `--fd` / `font-display` | Space Grotesk | Display — every heading (h1–h4), big numbers, wordmark |
| `--fb` / `font-body` | Newsreader | Body prose — paragraphs, `.note`, blockquotes, table first-column labels |
| `--fm` / `font-mono` | IBM Plex Mono | Data and metadata — eyebrows, nav links, labels, table numbers, tier badges, footer headings |

On a page under `site/`, loaded once at the top of `<head>`:

```html
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700;12..96,800&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

On a page under `app/`, all three are set up once in `app/layout.tsx` via
`next/font/google` and exposed as CSS variables consumed by the
`font-display`/`font-body`/`font-mono` Tailwind utilities (see
`app/globals.css`'s `@theme` block) — no per-page setup needed.

**Headings** (`h1`–`h4`): Space Grotesk, weight 600–700 (Space Grotesk has
no 800 cut — its 700 is already less heavy than Bricolage's 800, which is
the point), letter-spacing -0.02 to -0.025em, line-height ~1.0–1.02, no
default margin. `h2` inside a `.sechead` is `clamp(27px, 3.5vw, 42px)`. A
hero `h1` runs much larger — `clamp(40px, 7.2vw, 92px)` on an index page,
`clamp(38px, 6.6vw, 80px)` on the homepage — with a smaller floor below
420px so it doesn't hit the same fixed minimum on a narrow phone.

**Body** (`body`, `.note`, `p`): Newsreader, 17px, line-height 1.58
(16.5px below 820px). `.note` caps its own measure at `max-width: 66ch`.

**Mono / data** (`.mono`, `.eyebrow`, nav, table cells): IBM Plex Mono.
An `.eyebrow` is 11px, letter-spacing 0.18em, uppercase, `--ink-2` —
always plain descriptive text, never numbered (see `CLAUDE.md`, hard
rule 1).

**Emphasis in a headline**: wrap the emphasised span in `<em>` styled with
`font-style: normal` and a 3px `--s2` underline, offset 9–10px:

```css
h1 em{font-style:normal;text-decoration:underline 3px var(--s2);text-underline-offset:9px}
```

---

## 4. Spacing & layout

```css
--gut: 32px;              /* 28px at ≤820px */
--sec: 88px;               /* vertical section padding; 56px at ≤820px */
--stack-1: 14px; --stack-2: 24px; --stack-3: 40px; --stack-4: 60px;
--headh: 58px;             /* auto at ≤820px, header stacks vertically */
```

`.wrap` is the one container every page's content sits inside:
`max-width: 1180px; margin: 0 auto; padding: 0 var(--gut)`. Every top-level
section, the header's `.mast`, and the footer's `.cols` all use it — this
is what keeps the left/right edge identical everywhere on the page. See
`CLAUDE.md` hard rule 6 for the one way this has actually broken in
practice (a padding shorthand overriding it on a hero element).

Breakpoints in use: `900px` (two-column grids collapse to one),
`820px` (header stops being a horizontal bar, gutter narrows), `640px` /
`560px` (component-level: table columns, card grids), `420px` (hero
heading gets a smaller size floor).

A `<section>` is `padding: var(--sec) 0; border-top: 1px solid var(--rule)`
— the hairline between sections, not a background colour change, is what
separates them. The very first section on a page has no top border
(`section:first-of-type{border-top:0}`).

---

## 5. Components

**Header** (`.site-head` / `.mast`): not sticky (deliberately — see
`CLAUDE.md`). Brand mark + wordmark on the left, nav on the right, same on
every page: `Published`, `Principles`, `GitHub ↗`. An index page's own
in-page navigation is a separate `.jumpnav` row inside its hero, not part
of the header.

**Footer** (`.site-foot`): 3-column grid (`1.4fr 1fr 1fr`, collapsing to
one column below 900px), top border in `--ink` (heavier than the
`--rule` hairlines used elsewhere). Column headings are `.site-foot h4` —
mono, 10.5px, uppercase, `--ink-3`. Links have a `--rule` underline that
darkens to `--ink` on hover.

**Principle / rule cards** (`.principles` / `.principle`): equal-width
grid, 1px `--rule` gaps forming hairlines between cards via
`background: var(--rule)` behind `--paper`-filled cells. No numbering on
the label — a card is titled by its `h3` alone.

**Catalogue entries** (`.cat` / `.entry`): a 3-column row
(`118px 1fr 300px` — code/date, description, stats), full-row link,
hover fills `--paper-2` and underlines the `h3`. `.status` is a small
bordered mono pill; `.status.live` inverts to filled `--ink`. There is no
"draft" or "not started" variant in current use — see `CLAUDE.md` hard
rule 3.

**Key-value tables** (`.kv`): the plain workhorse table for any
short list of label→value(s) — sensitivity results, contested-indicator
scenario tables, dimension breakdowns. First column is body serif and
left-aligned; everything else is mono and right-aligned. A `.hl` row
inverts to filled `--ink`.

**Parameter tables** (`.paramtable`, TOI page): the pattern for a real
data table describing a fixed set of things (dimensions, indicators,
whatever a future index needs to enumerate) — a compact `<table>` with a
heavy `--ink` header rule, not a grid of tall cards. This replaced an
earlier card-grid version that wasted vertical space on mostly-empty
cells; don't reintroduce cards for this kind of content.

**Tier badges & legends** (`.tier`, `.tierlegend`): a confidence tier is
always a small bordered mono pill (`A` / `B` / `C`), `--ink-2` bordered by
default, `--s2`-bordered specifically for tier C. `.tierlegend` is a
3-column grid (1-column below 820px) explaining what each tier means, once
per index page.

**Case cards** (`.case`, TOI page's Contested section): a stacked list,
hairline-separated, each with a heading + tier badge on one line
(`.case-h`) and supporting prose below. Use this pattern for any
"argued in the open" content — a contested indicator, a disputed
methodology choice.

**Bars** (`.bars` / `.bar`): label / horizontal fill / value, three-column
grid. `.bar .med` draws a thin vertical hairline marking a reference point
(e.g. the sample median) across the fill.

**The country/unit table + row toggle** (`table.grid`, TOI page): a
sortable, searchable table where a row expands (via a `▸` caret,
`.car`, rotating open) into a `.rowdetail` panel. The panel's job is to
show information that **isn't** already a visible column — the full
indicator-level breakdown, sourced and tiered, not a restatement of the
row (see `CLAUDE.md` hard rule 9 on how this interacts with the mobile
column-hiding pattern).

**Buttons / link rows** (`.linkrow a`, `.toggle button`): bordered `--ink`
box, mono, uppercase, inverts to filled `--ink` on hover/active. This is
the only button style — there is no filled/ghost/primary/secondary
distinction to choose between.

---

## 6. Voice & tone

- **Short, declarative sentences.** Say the thing, then stop. "No score is
  published until the full matrix exists." Not "We believe that scores
  should only be published once the underlying matrix has been fully
  assembled."
- **Concrete numbers over vague claims.** "125 countries, 18 indicators"
  reads better than "a comprehensive set of indicators."
- **State limitations plainly, in the same place as the number**, not in
  an appendix. "Mental & social wellbeing is the weakest dimension" sits
  next to the score it qualifies.
- **No AI-flavoured filler.** No "unlock," "seamless," "revolutionize,"
  "in today's world," "it's not just X, it's Y," throat-clearing
  introductions, or excessive em-dash pairs. If a sentence could appear in
  generic SaaS marketing copy unchanged, rewrite it.
- **A specific example illustrates the method; it does not replace it.**
  When a worked example is needed (India, a particular country, a
  particular dispute), introduce the general method first and the example
  second — see `CLAUDE.md` hard rule 2 and the TOI page's section order.
- **Landing pages carry almost no prose.** A headline, one sentence, one
  large visual. Explanation belongs on the page the visual leads to, not
  stacked underneath it.
- **Never announce what hasn't shipped.** No roadmap language, no
  "coming soon," no draft entries. See `CLAUDE.md` hard rule 3.

## 7. Quick checklist for a new page

- [ ] Loads `/assets/brand.css` and the three Google Fonts, nothing else
- [ ] Header and footer nav match every other page exactly
- [ ] Hero: headline + ≤1 sentence + one large visual, nothing else
- [ ] No numbered eyebrows or section labels anywhere
- [ ] Any score/magnitude uses the 7-stop ramp via `col()`, not ad-hoc colour
- [ ] Every number on the page traces to a generated JSON/CSV, not a
      hardcoded value
- [ ] Mobile: no table requires horizontal scroll; secondary columns hide
      and reappear in a detail toggle instead
- [ ] Nothing on the page describes work that hasn't shipped yet
