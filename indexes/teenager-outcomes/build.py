#!/usr/bin/env python3
"""
Denominator — Teenager Outcomes Index build.

Reads everything from data/. Writes dist/, and a copy of the generated JSON
into the site page that reads it. No hidden constants: every weight,
direction and value comes out of a CSV that a contributor can edit.

    python indexes/teenager-outcomes/build.py

This index is self-contained under indexes/teenager-outcomes/ — its own
data/, its own build/validate scripts, its own docs/ — so a second index can
sit next to it later without the two sharing a schema or a build pipeline.
"""
from __future__ import annotations
import json
import pathlib
import sys

import pandas as pd

ROOT = pathlib.Path(__file__).resolve().parent
REPO_ROOT = ROOT.parent.parent
DATA, DIST = ROOT / "data", ROOT / "dist"
SITE_PAGE = REPO_ROOT / "site" / "indexes" / "teenager-outcomes"
WINSOR_LOW, WINSOR_HIGH = 0.05, 0.95


def load():
    obs = pd.read_csv(DATA / "observations.csv")
    ind = pd.read_csv(DATA / "indicators.csv")
    dim = pd.read_csv(DATA / "dimensions.csv")
    cty = pd.read_csv(DATA / "countries.csv")
    return obs, ind, dim, cty


def normalise(wide: pd.DataFrame, ind: pd.DataFrame, bounds: dict) -> pd.DataFrame:
    """Winsorised min-max to 0-100, inverted for negative indicators."""
    out = {}
    for r in ind.itertuples():
        lo, hi = bounds[r.indicator_id]
        x = wide[r.indicator_id].clip(lo, hi)
        span = hi - lo
        out[r.indicator_id] = (
            100 * (x - lo) / span if r.direction == "positive" else 100 * (hi - x) / span
        )
    return pd.DataFrame(out, index=wide.index)


def score(wide, ind, dim, bounds):
    n = normalise(wide, ind, bounds)
    dims = {}
    for d in dim.itertuples():
        parts = ind[ind.dimension_id == d.dimension_id]
        dims[d.dimension_id] = sum(
            n[p.indicator_id] * p.sub_weight for p in parts.itertuples()
        )
    dims = pd.DataFrame(dims)
    w = dim.set_index("dimension_id").weight_points
    life_ids = dim[dim.block == "life"].dimension_id
    fut_ids = dim[dim.block == "future"].dimension_id
    life = sum(dims[i] * w[i] for i in life_ids) / w[life_ids].sum()
    fut = sum(dims[i] * w[i] for i in fut_ids) / w[fut_ids].sum()
    toi = (life * w[life_ids].sum() + fut * w[fut_ids].sum()) / w.sum()
    return dims, life, fut, toi


def percentiles(toi, pop):
    n = len(toi)
    country_pct = (toi.rank() - 1) / (n - 1) * 100
    total = pop.sum()
    pop_pct = pd.Series(index=toi.index, dtype=float)
    for i in toi.index:
        below = pop[toi < toi[i]].sum() / total * 100
        above = pop[toi > toi[i]].sum() / total * 100
        pop_pct[i] = below + (100 - below - above) / 2
    return country_pct, pop_pct


def main() -> int:
    obs, ind, dim, cty = load()
    DIST.mkdir(exist_ok=True)

    def wide_of(col):
        return obs.pivot(index="iso3", columns="indicator_id", values=col)

    central = wide_of("value")
    # Bounds are frozen on the CENTRAL values so that low/high runs move a country
    # against a fixed scale rather than reshaping the scale underneath it.
    bounds = {
        r.indicator_id: (
            central[r.indicator_id].quantile(WINSOR_LOW),
            central[r.indicator_id].quantile(WINSOR_HIGH),
        )
        for r in ind.itertuples()
    }

    dims, life, fut, toi = score(central, ind, dim, bounds)

    # Optimistic / pessimistic runs: each country gets its own most- and
    # least-favourable defensible value on every indicator simultaneously.
    fav, unfav = central.copy(), central.copy()
    for r in ind.itertuples():
        lo_v = wide_of("value_low")[r.indicator_id]
        hi_v = wide_of("value_high")[r.indicator_id]
        good, bad = (hi_v, lo_v) if r.direction == "positive" else (lo_v, hi_v)
        fav[r.indicator_id], unfav[r.indicator_id] = good, bad
    _, _, _, toi_hi = score(fav, ind, dim, bounds)
    _, _, _, toi_lo = score(unfav, ind, dim, bounds)

    res = cty.set_index("iso3").loc[central.index].copy()
    res["life"], res["future"], res["toi"] = life.round(1), fut.round(1), toi.round(1)
    res["toi_low"], res["toi_high"] = toi_lo.round(1), toi_hi.round(1)
    for d in dim.dimension_id:
        res[d] = dims[d].round(1)
    res["rank"] = toi.rank(ascending=False, method="min").astype(int)
    cp, pp = percentiles(toi, res.pop_1019_millions)
    res["country_pct"], res["pop_pct"] = cp.round(1), pp.round(1)
    res = res.sort_values("toi", ascending=False)
    res.to_csv(DIST / "results.csv")

    payload = {
        "meta": {
            "index": "Teenager Outcomes Index",
            "version": "3.0",
            "countries": int(len(res)),
            "indicators": int(len(ind)),
            "adolescents_millions": round(float(res.pop_1019_millions.sum()), 1),
            "winsor": [WINSOR_LOW, WINSOR_HIGH],
        },
        "columns": ["name", "region", "pop_1019_millions", "life", "future",
                    "toi", "rank", "country_pct", "pop_pct"],
        "rows": [
            [
                r["name"], r["region"], r["pop_1019_millions"], r["life"], r["future"],
                r["toi"], int(r["rank"]), r["country_pct"], r["pop_pct"],
            ]
            for _, r in res.iterrows()
        ],
        "bands": {r["name"]: [r["toi_low"], r["toi_high"]] for _, r in res.iterrows()},
        "dimensions": {
            d.dimension_id: {"label": d.label, "block": d.block, "weight": int(d.weight_points)}
            for d in dim.itertuples()
        },
        "medians": {d: round(float(dims[d].median()), 1) for d in dim.dimension_id},
        "indiaDims": {d: round(float(dims[d].loc["IND"]), 1) for d in dim.dimension_id}
        if "IND" in dims.index else {},
        "deciles": pd.read_csv(DATA / "india_wealth_deciles.csv")[
            ["stratum", "TOI", "world_pct"]].values.tolist(),
        "states": pd.read_csv(DATA / "india_states.csv")[
            ["state", "TOI", "mid"]].values.tolist(),
        # Per-indicator registry and the full observation matrix, keyed by
        # country name, so the site can show what an index is actually built
        # from — not just re-display the aggregates already in the table.
        "indicators": {
            r.indicator_id: {
                "label": r.label,
                "dimension": r.dimension_id,
                "direction": r.direction,
                "unit": r.unit,
                "subWeight": r.sub_weight,
                "tier": r.confidence_tier,
                "source": r.canonical_source,
                "caveat": r.caveat if isinstance(r.caveat, str) else "",
            }
            for r in ind.itertuples()
        },
        "observations": {
            iso_name: {
                r.indicator_id: {
                    "value": r.value,
                    "low": r.value_low,
                    "high": r.value_high,
                    "year": int(r.year),
                    "tier": r.confidence_tier,
                    "source": r.source,
                    "note": r.note if isinstance(r.note, str) else "",
                }
                for r in grp.itertuples()
            }
            for iso_name, grp in obs.assign(
                country=obs.iso3.map(cty.set_index("iso3").name)
            ).groupby("country")
        },
    }
    blob = json.dumps(payload, separators=(",", ":"))
    (DIST / "toi.json").write_text(blob)
    # co-located with the page that fetches it, not loose at the site root —
    # so a second index's generated JSON never collides with this one's.
    (SITE_PAGE / "toi.json").write_text(blob)

    print(f"built {len(res)} countries, {len(ind)} indicators -> "
          f"{DIST.relative_to(REPO_ROOT)}/")
    print(res[["name", "life", "future", "toi", "toi_low", "toi_high",
               "rank", "country_pct", "pop_pct"]].head(5).to_string(index=False))
    ind_row = res[res.name == "India"]
    if not ind_row.empty:
        r = ind_row.iloc[0]
        print(f"India: TOI {r.toi} [{r.toi_low}-{r.toi_high}]  rank {r['rank']}  "
              f"country pct {r.country_pct}  pop pct {r.pop_pct}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
