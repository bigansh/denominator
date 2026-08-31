import { rampColor } from "@/lib/ramp";

const COLS = 32;
const ROWS = 6;

/** The hero mosaic — a deterministic grid over the data ramp, rendered server-side. */
export function Mosaic() {
  const cells = Array.from({ length: COLS * ROWS }, (_, i) => {
    const v = (Math.sin(i * 0.31) + Math.sin(i * 0.11 + 2) * 0.6 + 1.6) / 3.2;
    return rampColor(v * 100);
  });
  return (
    <div
      className="grid border border-ink"
      style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
    >
      {cells.map((c, i) => (
        <div key={i} style={{ background: c, aspectRatio: "1.4" }} />
      ))}
    </div>
  );
}
