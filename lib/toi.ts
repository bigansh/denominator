export type TOIRaw = {
  meta: {
    index: string;
    version: string;
    countries: number;
    indicators: number;
    adolescents_millions: number;
    winsor: [number, number];
  };
  columns: string[];
  rows: [string, string, number, number, number, number, number, number, number][];
  bands: Record<string, [number, number]>;
  dimensions: Record<string, { label: string; weight: number }>;
  medians: Record<string, number>;
  indiaDims: Record<string, number>;
  deciles: [string, number, number][];
  states: [string, number, number][];
  indicators: Record<string, { label: string; unit: string; dimension: string }>;
  observations: Record<
    string,
    Record<
      string,
      { value: string | number; low?: number; high?: number; tier: string; source: string; note?: string }
    >
  >;
};

export type Country = {
  country: string;
  region: string;
  pop1019_m: number;
  LifeScore: number;
  FutureScore: number;
  TOI: number;
  Rank: number;
  Percentile: number;
  pop_pct: number;
  toiLow?: number;
  toiHigh?: number;
};

const COLS = [
  "country",
  "region",
  "pop1019_m",
  "LifeScore",
  "FutureScore",
  "TOI",
  "Rank",
  "Percentile",
  "pop_pct",
] as const;

export function parseCountries(raw: TOIRaw): Country[] {
  return raw.rows.map((r) => {
    const o = {} as Country;
    COLS.forEach((k, i) => {
      // @ts-expect-error tuple->object assignment across a fixed column map
      o[k] = r[i];
    });
    const band = raw.bands?.[o.country];
    if (band) {
      o.toiLow = band[0];
      o.toiHigh = band[1];
    }
    return o;
  });
}
