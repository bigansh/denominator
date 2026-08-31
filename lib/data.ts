import fs from "node:fs";
import path from "node:path";
import type { TOIRaw } from "./toi";

/**
 * Reads generated JSON from public/data/ at build time. This is the one
 * place any page touches the filesystem for data — every index and case
 * study's build.py writes here, and pages read it directly rather than
 * fetching it client-side, so a page's numbers are baked in at build time,
 * not loaded after the fact.
 */
function readJSON<T>(file: string): T {
  const p = path.join(process.cwd(), "public", "data", file);
  return JSON.parse(fs.readFileSync(p, "utf8")) as T;
}

export type CountingWomenData = {
  verified: number;
  unverified: number;
  india: {
    capacity: number;
    rank: number;
    of: number;
    percentile: number;
    has: string[];
    lacks: string[];
    sample_n: number;
    sample_multiple_of_rest: number;
  };
  table: {
    iso3: string;
    country: string;
    capacity: number;
    vaw_name: string;
    vaw_agency: string;
    vaw_cadence_yrs: number | null;
    vaw_latest: number;
    vaw_n: number;
  }[];
  components: { key: string; points: number; label: string; n_countries: number }[];
  benchmark_comparability: Record<string, number>;
  denominators: Record<string, number>;
};

export function getTOIData(): TOIRaw {
  return readJSON<TOIRaw>("toi.json");
}

export function getCountingWomenData(): CountingWomenData {
  return readJSON<CountingWomenData>("counting-women.json");
}
