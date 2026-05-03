// Dark holographic HUD background — fine grid + radial glow.
// v2: Culturally-aware — RTL gets denser ornamentation feel,
// grid opacity follows complexity, glow intensity follows vibrancy.
import React, { useEffect, useRef } from "react";
import { useArchetypeEngine } from "../useArchetypeEngine";

interface Props {
  accentColor?: string;
}

export const DynamicBackground: React.FC<Props> = ({
  accentColor = "#7bbcd4",
}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const { direction, uiTheme } = useArchetypeEngine();
  const isRTL = direction === "rtl";

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    let running = true;
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      c.width = innerWidth * dpr;
      c.height = innerHeight * dpr;
      c.style.width = innerWidth + "px";
      c.style.height = innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    addEventListener("resize", resize);

    const draw = () => {
      if (!running) return;
      const W = innerWidth,
        H = innerHeight;
      const v = uiTheme.vibrancy;
      const cplx = uiTheme.complexity;

      // Dark base
      ctx.fillStyle = "#0a0b10";
      ctx.fillRect(0, 0, W, H);

      // ---- Grid ----
      // RTL: denser ornamentation grid (step 30 instead of 40)
      // Higher complexity = smaller step
      const baseStep = isRTL ? 32 : 40;
      const step = Math.max(20, baseStep - Math.round(cplx * 16));
      const gridAlpha = isRTL
        ? 0.03 + cplx * 0.04 // RTL: 0.03-0.07 (denser ornament feel)
        : 0.02 + cplx * 0.02; // LTR: 0.02-0.04 (airy)
      ctx.strokeStyle = `rgba(255,255,255,${gridAlpha.toFixed(3)})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let x = 0; x < W; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
      }
      for (let y = 0; y < H; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
      }
      ctx.stroke();

      // ---- Subtle ornamentation for RTL ----
      // Diagonal cross-hatch at major grid intersections — geometric pattern feel
      if (isRTL) {
        const bigStep = step * 3;
        ctx.strokeStyle = `rgba(255,255,255,${(0.012 + cplx * 0.015).toFixed(3)})`;
        ctx.lineWidth = 0.3;
        ctx.beginPath();
        for (let x = 0; x < W; x += bigStep) {
          for (let y = 0; y < H; y += bigStep) {
            // Small diamond at intersection
            const s = 4;
            ctx.moveTo(x, y - s);
            ctx.lineTo(x + s, y);
            ctx.lineTo(x, y + s);
            ctx.lineTo(x - s, y);
            ctx.closePath();
          }
        }
        ctx.stroke();
      }

      // ---- Radial glow ----
      // Intensity follows vibrancy: 0.3 → stronger
      const glowAlpha1 = (0.06 + v * 0.08).toFixed(2);
      const glowAlpha2 = (0.02 + v * 0.05).toFixed(2);
      const g = ctx.createRadialGradient(
        W / 2,
        H / 2,
        0,
        W / 2,
        H / 2,
        Math.max(W, H) * 0.5,
      );
      g.addColorStop(0, accentColor + glowAlpha1);
      g.addColorStop(0.4, accentColor + glowAlpha2);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
    return () => {
      running = false;
      removeEventListener("resize", resize);
    };
  }, [accentColor, direction, uiTheme.vibrancy, uiTheme.complexity]);

  return (
    <canvas ref={ref} className="fixed inset-0 -z-10" aria-hidden="true" />
  );
};
