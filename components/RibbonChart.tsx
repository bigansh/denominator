"use client";

import { useEffect, useRef, useState } from "react";
import type { Country } from "@/lib/toi";
import { rampColor } from "@/lib/ramp";

type Seg = { c: Country; x: number; w: number };

export function RibbonChart({ countries }: { countries: Country[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const segsRef = useRef<Seg[]>([]);
  const hoverXRef = useRef<number | null>(null);
  const [mode, setMode] = useState<"pop" | "cty">("pop");

  const ascending = [...countries].sort((a, b) => a.TOI - b.TOI);
  const india = ascending.find((c) => c.country === "India") ?? ascending[0];
  const [readout, setReadout] = useState(india);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const cx = cv.getContext("2d");
    if (!cx) return;

    function layout() {
      const W = cv!.width / devicePixelRatio;
      const tot =
        mode === "pop"
          ? ascending.reduce((s, c) => s + c.pop1019_m, 0)
          : ascending.length;
      let x = 0;
      segsRef.current = ascending.map((c) => {
        const w = ((mode === "pop" ? c.pop1019_m : 1) / tot) * W;
        const s = { c, x, w };
        x += w;
        return s;
      });
    }

    function draw() {
      const W = cv!.width / devicePixelRatio;
      const H = cv!.height / devicePixelRatio;
      cx!.clearRect(0, 0, W, H);
      segsRef.current.forEach((s) => {
        cx!.fillStyle = rampColor(s.c.TOI);
        cx!.fillRect(s.x, 0, Math.max(s.w, 0.4), H - 24);
        if (s.c.country === "India") {
          cx!.strokeStyle = "#E3E7E1";
          cx!.lineWidth = 2;
          cx!.strokeRect(s.x + 1, 1, s.w - 2, H - 26);
          cx!.fillStyle = "#141B17";
          cx!.fillRect(s.x, H - 24, s.w, 3);
          if (s.w > 54) {
            cx!.fillStyle = "#E3E7E1";
            cx!.font = '600 11px "IBM Plex Mono", monospace';
            cx!.textAlign = "center";
            cx!.fillText("INDIA", s.x + s.w / 2, H / 2 - 6);
          }
        }
      });
      cx!.fillStyle = "#141B17";
      cx!.font = '400 9.5px "IBM Plex Mono", monospace';
      [0, 25, 50, 75, 100].forEach((p) => {
        const px = (p / 100) * W;
        cx!.fillRect(px === W ? W - 1 : px, H - 20, 1, 7);
        cx!.textAlign = p === 0 ? "left" : p === 100 ? "right" : "center";
        cx!.fillText(p + "%", px, H - 6);
      });
      const hx = hoverXRef.current;
      if (hx !== null) {
        const s = segsRef.current.find((s) => hx >= s.x && hx < s.x + s.w);
        if (s) {
          cx!.strokeStyle = "#141B17";
          cx!.lineWidth = 1;
          cx!.beginPath();
          cx!.moveTo(hx, 0);
          cx!.lineTo(hx, H - 24);
          cx!.stroke();
        }
      }
    }

    function resize() {
      const r = cv!.getBoundingClientRect();
      cv!.width = r.width * devicePixelRatio;
      cv!.height = 132 * devicePixelRatio;
      cx!.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      layout();
      draw();
    }

    function pick(e: MouseEvent | TouchEvent) {
      const r = cv!.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const x = clientX - r.left;
      hoverXRef.current = x;
      const s = segsRef.current.find((s) => x >= s.x && x < s.x + s.w);
      if (s) setReadout(s.c);
      draw();
    }

    function leave() {
      hoverXRef.current = null;
      setReadout(india);
      draw();
    }

    const touchMove = (e: TouchEvent) => {
      e.preventDefault();
      pick(e);
    };

    cv.addEventListener("mousemove", pick);
    cv.addEventListener("touchmove", touchMove, { passive: false });
    cv.addEventListener("mouseleave", leave);
    window.addEventListener("resize", resize);
    resize();

    return () => {
      cv.removeEventListener("mousemove", pick);
      cv.removeEventListener("touchmove", touchMove);
      cv.removeEventListener("mouseleave", leave);
      window.removeEventListener("resize", resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const totalPop = ascending.reduce((s, c) => s + c.pop1019_m, 0);

  return (
    <div className="mt-14 border-t border-rule pt-9">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-5">
        <div>
          <div className="font-mono text-[11px] tracking-[.18em] text-ink-2 uppercase">
            The cohort ribbon
          </div>
          <div className="mt-1.5 text-[15px] text-ink-2">
            Every segment is a country, worst to best. Hover to read any
            point.
          </div>
        </div>
        <div className="inline-flex border border-ink">
          <button
            onClick={() => setMode("pop")}
            aria-pressed={mode === "pop"}
            className="border-0 bg-transparent px-4 py-2.5 font-mono text-[11px] tracking-[.08em] text-ink uppercase aria-pressed:bg-ink aria-pressed:text-paper"
          >
            Width = teenagers
          </button>
          <button
            onClick={() => setMode("cty")}
            aria-pressed={mode === "cty"}
            className="border-0 bg-transparent px-4 py-2.5 font-mono text-[11px] tracking-[.08em] text-ink uppercase aria-pressed:bg-ink aria-pressed:text-paper"
          >
            Width = countries
          </button>
        </div>
      </div>
      <canvas ref={canvasRef} height={132} className="block h-[132px] w-full cursor-crosshair touch-none" />
      <div className="mt-2 flex justify-between font-mono text-[10.5px] tracking-[.06em] text-ink-2">
        <span>Worst outcomes</span>
        <span>{mode === "pop" ? `${totalPop.toFixed(1)}m teenagers` : `${ascending.length} countries`}</span>
        <span>Best outcomes</span>
      </div>
      <div className="mt-6 grid grid-cols-2 items-baseline gap-4 border-t border-rule pt-4.5 md:grid-cols-[minmax(190px,1.2fr)_repeat(4,minmax(80px,1fr))]">
        <div>
          <span className="mb-0.5 block font-mono text-[9.5px] tracking-[.12em] text-ink-2 uppercase">Country</span>
          <span className="font-display text-[25px] font-semibold tracking-[-.02em]">{readout.country}</span>
        </div>
        <div>
          <span className="mb-0.5 block font-mono text-[9.5px] tracking-[.12em] text-ink-2 uppercase">Index</span>
          <span className="font-mono text-[19px] font-medium tabular-nums">{readout.TOI.toFixed(1)}</span>
        </div>
        <div>
          <span className="mb-0.5 block font-mono text-[9.5px] tracking-[.12em] text-ink-2 uppercase">Teens (m)</span>
          <span className="font-mono text-[19px] font-medium tabular-nums">{readout.pop1019_m.toFixed(1)}</span>
        </div>
        <div>
          <span className="mb-0.5 block font-mono text-[9.5px] tracking-[.12em] text-ink-2 uppercase">Country pct</span>
          <span className="font-mono text-[19px] font-medium tabular-nums">{readout.Percentile.toFixed(1)}</span>
        </div>
        <div>
          <span className="mb-0.5 block font-mono text-[9.5px] tracking-[.12em] text-ink-2 uppercase">Population pct</span>
          <span className="font-mono text-[19px] font-medium tabular-nums">{readout.pop_pct.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}
