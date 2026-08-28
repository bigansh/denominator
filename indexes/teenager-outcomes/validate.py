#!/usr/bin/env python3
"""
Denominator — data validation.

Runs on every pull request. A contribution that breaks any check below fails CI
and cannot be merged. Run it locally before you open a PR:

    python indexes/teenager-outcomes/validate.py
"""
from __future__ import annotations
import pathlib
import sys

import pandas as pd

ROOT = pathlib.Path(__file__).resolve().parent
DATA = ROOT / "data"
TIERS = {"A", "B", "C"}
DIRECTIONS = {"positive", "negative"}
BLOCKS = {"life", "future"}

errors: list[str] = []
warnings: list[str] = []


def err(msg: str) -> None:
    errors.append(msg)


def warn(msg: str) -> None:
    warnings.append(msg)


def main() -> int:
    obs = pd.read_csv(DATA / "observations.csv")
    ind = pd.read_csv(DATA / "indicators.csv")
    dim = pd.read_csv(DATA / "dimensions.csv")
    cty = pd.read_csv(DATA / "countries.csv")

    # --- structure -------------------------------------------------------
    if dim.weight_points.sum() != 100:
        err(f"dimension weights sum to {dim.weight_points.sum()}, must be 100")
    if set(dim.block) - BLOCKS:
        err(f"unknown block(s): {set(dim.block) - BLOCKS}")
    for b in BLOCKS:
        if dim[dim.block == b].weight_points.sum() != 50:
            err(f"block '{b}' weights sum to {dim[dim.block == b].weight_points.sum()}, must be 50")
    for d, grp in ind.groupby("dimension_id"):
        if abs(grp.sub_weight.sum() - 1.0) > 1e-9:
            err(f"sub-weights for dimension '{d}' sum to {grp.sub_weight.sum()}, must be 1.0")
    if set(ind.dimension_id) != set(dim.dimension_id):
        err("indicators.csv and dimensions.csv disagree on the dimension list")
    if set(ind.direction) - DIRECTIONS:
        err(f"unknown direction(s): {set(ind.direction) - DIRECTIONS}")
    if set(ind.confidence_tier) - TIERS:
        err(f"unknown tier(s) in indicators.csv: {set(ind.confidence_tier) - TIERS}")

    # --- completeness: the matrix must be full ---------------------------
    want = set(ind.indicator_id)
    for iso, grp in obs.groupby("iso3"):
        missing = want - set(grp.indicator_id)
        if missing:
            err(f"{iso}: missing {sorted(missing)}")
        dupes = grp.indicator_id[grp.indicator_id.duplicated()].tolist()
        if dupes:
            err(f"{iso}: duplicate rows for {sorted(set(dupes))}")
    unknown = set(obs.indicator_id) - want
    if unknown:
        err(f"observations reference unknown indicators: {sorted(unknown)}")

    # --- country registry ------------------------------------------------
    if set(obs.iso3) != set(cty.iso3):
        only_obs = sorted(set(obs.iso3) - set(cty.iso3))
        only_cty = sorted(set(cty.iso3) - set(obs.iso3))
        if only_obs:
            err(f"observations for countries missing from countries.csv: {only_obs}")
        if only_cty:
            err(f"countries.csv lists countries with no observations: {only_cty}")
    if cty.iso3.duplicated().any():
        err("duplicate iso3 in countries.csv")
    if (cty.pop_1019_millions <= 0).any():
        err("non-positive adolescent population in countries.csv")

    # --- values ----------------------------------------------------------
    for r in obs.itertuples():
        if pd.isna(r.value):
            err(f"{r.iso3}/{r.indicator_id}: empty value (exclude the country instead)")
            continue
        if not (r.value_low <= r.value <= r.value_high):
            err(f"{r.iso3}/{r.indicator_id}: value {r.value} outside band "
                f"[{r.value_low}, {r.value_high}]")
        if r.confidence_tier not in TIERS:
            err(f"{r.iso3}/{r.indicator_id}: bad tier '{r.confidence_tier}'")
        if not isinstance(r.source, str) or not r.source.strip():
            err(f"{r.iso3}/{r.indicator_id}: source is required")

    pct = {"stunting", "water", "electricity", "lsec_comp", "youth_lit",
           "neet", "y_unemp", "internet", "child_labour", "child_marriage"}
    for r in obs[obs.indicator_id.isin(pct)].itertuples():
        if not 0 <= r.value <= 100:
            err(f"{r.iso3}/{r.indicator_id}: {r.value} outside 0-100")
    for r in obs[obs.indicator_id == "ladder"].itertuples():
        if not 0 <= r.value <= 10:
            err(f"{r.iso3}/ladder: {r.value} outside 0-10")

    # --- soft checks -----------------------------------------------------
    for k, grp in obs.groupby("indicator_id"):
        q1, q3 = grp.value.quantile(0.25), grp.value.quantile(0.75)
        fence = q3 + 3 * (q3 - q1)
        for r in grp[grp.value > fence].itertuples():
            warn(f"{r.iso3}/{k}: {r.value} is a far outlier (>3 IQR above Q3) — "
                 f"check the source before merging")
    tier_c = ind[ind.confidence_tier == "C"]
    if not tier_c.empty:
        load = (tier_c.merge(dim, on="dimension_id")
                .eval("sub_weight * weight_points").sum())
        if load > 12:
            warn(f"Tier C indicators carry {load:.1f} of 100 index points; "
                 f"consider reducing perceptual weight")

    for w in warnings:
        print(f"WARN  {w}")
    for e in errors:
        print(f"ERROR {e}")
    if errors:
        print(f"\n{len(errors)} error(s). Data not valid.")
        return 1
    print(f"\nOK — {obs.iso3.nunique()} countries x {len(ind)} indicators, "
          f"{len(obs)} observations, {len(warnings)} warning(s).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
