/**
 * The seven-stop plum -> teal data ramp, and the interpolation used to map
 * a 0-100 score onto it. Carried over from the static site's shared
 * col()/hx() functions — this is the one colour system reused across every
 * score and every dataset on the site.
 */
export const RAMP = [
  "#4B1D3F",
  "#8E3536",
  "#C06A34",
  "#C9A94E",
  "#6F9A6B",
  "#2A6C63",
  "#134B4C",
];

function hexToRgb(hex: string): [number, number, number] {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [
    number,
    number,
    number,
  ];
}

/** t is 0-100. Returns an `rgb(r, g, b)` string. */
export function rampColor(t: number): string {
  const x = Math.max(0, Math.min(1, t / 100)) * (RAMP.length - 1);
  const i = Math.floor(x);
  const f = x - i;
  const a = hexToRgb(RAMP[i]);
  const b = hexToRgb(RAMP[Math.min(i + 1, RAMP.length - 1)]);
  const [r, g, bch] = a.map((v, k) => Math.round(v + (b[k] - v) * f));
  return `rgb(${r}, ${g}, ${bch})`;
}
