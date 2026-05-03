// =============================================================================
// DynamicBackground — Living Mesh Gradient
// Slow, fluid 4-color mesh that subtly shifts. 60fps via requestAnimationFrame.
// Palette: Mint (#CFFFE5), Lavender (#E6E6FA), Peach (#FFE4E1), Baby Blue (#F0F8FF).
// =============================================================================

import React, { useEffect, useRef } from "react";
import { qualityManager } from "./QualityManager";

interface DynamicBackgroundProps {
  /** Override softness from UI theme (0..1) — controls blob roundness */
  softness?: number;
  /** Override vibrancy (0..1) — controls color saturation */
  vibrancy?: number;
}

const PALETTE = {
  mint: { r: 207, g: 255, b: 229 },
  lavender: { r: 230, g: 230, b: 250 },
  peach: { r: 255, g: 228, b: 225 },
  babyBlue: { r: 240, g: 248, b: 255 },
};

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({
  softness = 0.5,
  vibrancy = 0.5,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap for perf
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = (now: number) => {
      if (!running) return;
      timeRef.current = now * 0.001; // seconds
      const t = timeRef.current;
      const W = window.innerWidth;
      const H = window.innerHeight;

      // Clear
      ctx.clearRect(0, 0, W, H);

      // 4 soft blobs that drift slowly
      const blobs = [
        {
          x: W * 0.25 + Math.sin(t * 0.3) * W * 0.08,
          y: H * 0.3 + Math.cos(t * 0.4) * H * 0.1,
          r: Math.max(W, H) * (0.45 + softness * 0.2),
          color: PALETTE.mint,
        },
        {
          x: W * 0.7 + Math.cos(t * 0.35) * W * 0.1,
          y: H * 0.25 + Math.sin(t * 0.45) * H * 0.08,
          r: Math.max(W, H) * (0.4 + softness * 0.2),
          color: PALETTE.lavender,
        },
        {
          x: W * 0.3 + Math.cos(t * 0.5) * W * 0.12,
          y: H * 0.7 + Math.sin(t * 0.35) * H * 0.1,
          r: Math.max(W, H) * (0.42 + softness * 0.18),
          color: PALETTE.peach,
        },
        {
          x: W * 0.7 + Math.sin(t * 0.4) * W * 0.09,
          y: H * 0.65 + Math.cos(t * 0.5) * H * 0.12,
          r: Math.max(W, H) * (0.38 + softness * 0.22),
          color: PALETTE.babyBlue,
        },
      ];

      // Render each blob as a large radial gradient
      blobs.forEach((blob) => {
        const { r: cr, g: cg, b: cb } = blob.color;

        // Desaturate based on vibrancy inversion (vibrancy=0 = pastel, 1 = saturated)
        const sat = 0.3 + vibrancy * 0.7;
        const gray = (cr + cg + cb) / 3;
        const rr = Math.round(gray + (cr - gray) * sat);
        const gg = Math.round(gray + (cg - gray) * sat);
        const bb = Math.round(gray + (cb - gray) * sat);

        const gradient = ctx.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          blob.r,
        );
        gradient.addColorStop(0, `rgba(${rr},${gg},${bb},0.55)`);
        gradient.addColorStop(0.5, `rgba(${rr},${gg},${bb},0.2)`);
        gradient.addColorStop(1, "rgba(255,255,255,0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, W, H);
      });

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      running = false;
      window.removeEventListener("resize", resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [softness, vibrancy]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      aria-hidden="true"
    />
  );
};
