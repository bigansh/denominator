#!/usr/bin/env python3
"""
Counting Women — build.py

Reads data/instruments.csv and data/india-benchmarks.csv, computes the
measurement-capacity score and every arithmetic claim the case study makes,
and writes the result to dist/counting-women.json and (co-located, so the
page can fetch it with a relative path) site/case-studies/counting-women/
counting-women.json.

This is a case study, not an index: nothing here produces a cross-country
safety ranking. The only thing scored is whether a country runs an
instrument capable of measuring violence against women at all.
"""

import csv
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent
DATA = ROOT / "data"
DIST = ROOT / "dist"
PUBLIC_DATA = ROOT.parent.parent / "public" / "data"

COMPONENTS = [
    ("dedicated_vaw", 25, "Runs a dedicated violence-against-women survey"),
    ("cadence_5yr_or_less", 15, "Repeats it at least every five years"),
    ("latest_within_5yr", 15, "Most recent round within five years"),
    ("covers_nonpartner", 20, "Covers violence by someone other than a partner"),
    ("act_type_disaggregated", 15, "Disaggregates public-space harassment by act"),
    ("reporting_rate_published", 10, "Publishes the victim reporting rate"),
]


def read_csv(path):
    with open(path, newline="", encoding="utf-8") as f:
        return [row for row in csv.DictReader(f)]


def build_instruments():
    rows = read_csv(DATA / "instruments.csv")
    verified = [r for r in rows if r["verified"] == "1"]
    unverified = [r for r in rows if r["verified"] != "1"]

    for r in verified:
        r["_capacity"] = sum(
            points for key, points, _ in COMPONENTS if r[key] == "1"
        )

    ranked = sorted(verified, key=lambda r: r["_capacity"], reverse=True)
    n = len(ranked)

    for r in ranked:
        above = sum(1 for o in ranked if o["_capacity"] > r["_capacity"])
        below = sum(1 for o in ranked if o["_capacity"] < r["_capacity"])
        r["_rank"] = above + 1
        r["_percentile"] = round(below / (n - 1) * 100, 1) if n > 1 else 0.0

    india = next(r for r in ranked if r["iso3"] == "IND")

    table = [
        {
            "iso3": r["iso3"],
            "country": r["country"],
            "capacity": r["_capacity"],
            "vaw_name": r["vaw_name"],
            "vaw_agency": r["vaw_agency"],
            "vaw_cadence_yrs": int(r["vaw_cadence_yrs"]) if r["vaw_cadence_yrs"] else None,
            "vaw_latest": int(r["vaw_latest"]),
            "vaw_n": int(r["vaw_n"]),
        }
        for r in ranked
    ]

    components = [
        {
            "key": key,
            "points": points,
            "label": label,
            "n_countries": sum(1 for r in verified if r[key] == "1"),
        }
        for key, points, label in COMPONENTS
    ]

    has = [label for key, points, label in COMPONENTS if india[key] == "1"]
    lacks = [label for key, points, label in COMPONENTS if india[key] != "1"]

    india_n = int(india["vaw_n"])
    other_n_sum = sum(int(r["vaw_n"]) for r in verified if r["iso3"] != "IND")
    sample_multiple = round(india_n / other_n_sum, 2) if other_n_sum else None

    return {
        "verified": len(verified),
        "unverified": len(unverified),
        "india": {
            "capacity": float(india["_capacity"]),
            "rank": india["_rank"],
            "of": n,
            "percentile": india["_percentile"],
            "has": has,
            "lacks": lacks,
            "sample_n": india_n,
            "sample_multiple_of_rest": sample_multiple,
        },
        "table": table,
        "components": components,
    }


def build_benchmarks():
    rows = read_csv(DATA / "india-benchmarks.csv")
    rows = [r for r in rows if r.get("metric")]

    tally = {"yes": 0, "no": 0, "partial": 0, "n/a": 0}
    for r in rows:
        c = (r.get("comparable") or "").strip().lower() or "n/a"
        tally[c] = tally.get(c, 0) + 1

    def find(metric, subject):
        return next(
            (r for r in rows if r["metric"] == metric and r["subject"] == subject),
            None,
        )

    # Work from raw, unrounded case counts and populations throughout, and
    # only round at the final display step. Rounding the intermediate rates
    # first (2.10, 117.5) and then dividing gives 56.0, not the 55.9 that
    # NCRB's and ONS's own underlying counts reproduce — the published rate
    # columns are display roundings of these same raw numbers, not a second,
    # independent measurement.
    rape_row = find("recorded_rape", "India")
    india_rape_cases = float(rape_row["value"])
    ew_rape_cases = float(rape_row["comparator_value"])
    ew_population = 61_000_000  # ONS mid-2023, per the row's own note

    total_row = find("total_crime", "India")
    total_value = float(total_row["value"])
    total_rate = 418.9  # per lakh population, NCRB Crime in India 2024
    total_population = total_value / (total_rate / 100000)
    total_population_m = round(total_population / 1_000_000)

    india_rate = india_rape_cases / total_population * 100000
    ew_rate = ew_rape_cases / ew_population * 100000
    ratio = round(ew_rate / india_rate, 1)

    reporting_row = find("victim_reporting_rate", "India")
    india_reporting = float(reporting_row["value"])
    ew_reporting = float(reporting_row["comparator_value"])
    adjusted_india = round(india_rate / (india_reporting / 100))
    adjusted_ew = round(ew_rate / (ew_reporting / 100))
    residual_ratio = round(adjusted_ew / adjusted_india, 1)

    caw_row = find("crimes_against_women", "India")
    caw_value = float(caw_row["value"])
    caw_rate = 64.6  # per lakh women, published in the note; women count derives from it
    women_population_m = round(caw_value / (caw_rate / 100000) / 1_000_000, 1)

    return {
        "benchmark_comparability": tally,
        "denominators": {
            "recorded_rape_rate_india": round(india_rate, 2),
            "recorded_rape_rate_ew": round(ew_rate, 1),
            "ratio": ratio,
            "victim_reporting_rate_india": india_reporting,
            "victim_reporting_rate_ew": ew_reporting,
            "adjusted_india": adjusted_india,
            "adjusted_ew": adjusted_ew,
            "residual_ratio_after_reporting": residual_ratio,
            "implied_women_population_m": women_population_m,
            "implied_total_population_m": total_population_m,
        },
    }


def main():
    out = {}
    out.update(build_instruments())
    out.update(build_benchmarks())

    DIST.mkdir(parents=True, exist_ok=True)
    PUBLIC_DATA.mkdir(parents=True, exist_ok=True)

    text = json.dumps(out, indent=2)
    (DIST / "counting-women.json").write_text(text + "\n")
    # the Next.js app reads generated JSON at build time from this single
    # well-known location — never a client-side fetch.
    (PUBLIC_DATA / "counting-women.json").write_text(text + "\n")

    d = out["denominators"]
    print(
        f"G20 members {out['verified'] + out['unverified']} · "
        f"verified {out['verified']} · unverified {out['unverified']}"
    )
    print(
        f"India  {out['india']['capacity']:.0f}/100, rank {out['india']['rank']} "
        f"of {out['india']['of']}, {out['india']['percentile']} percentile"
    )
    print(
        f"India sample {out['india']['sample_n']:,} = "
        f"{out['india']['sample_multiple_of_rest']}x every other published "
        "G20 sample combined"
    )
    print(
        f"benchmark rows: {out['benchmark_comparability'].get('yes', 0)} comparable, "
        f"{out['benchmark_comparability'].get('partial', 0)} partial, "
        f"{out['benchmark_comparability'].get('no', 0)} not comparable, "
        f"{out['benchmark_comparability'].get('n/a', 0)} no comparator"
    )
    print(
        f"rape rate: India {d['recorded_rape_rate_india']} vs E&W "
        f"{d['recorded_rape_rate_ew']} per 100k = {d['ratio']}x · "
        f"adjusted for reporting: {d['adjusted_india']} vs {d['adjusted_ew']} "
        f"= {d['residual_ratio_after_reporting']}x residual"
    )
    print(
        f"implied denominators: {d['implied_women_population_m']}m women, "
        f"{d['implied_total_population_m']}m total population"
    )


if __name__ == "__main__":
    main()
