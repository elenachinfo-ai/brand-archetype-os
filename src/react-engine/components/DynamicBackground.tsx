// Dark holographic HUD background — fine grid + radial glow
import React, { useEffect, useRef } from "react";

interface Props {
  accentColor?: string;
}

export const DynamicBackground: React.FC<Props> = ({
  accentColor = "#7bbcd4",
}) => {
  const ref = useRef<HTMLCanvasElement>(null);

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
      ctx.clearRect(0, 0, W, H);

      // Fine grid
      const step = 40;
      ctx.strokeStyle = "rgba(255,255,255,0.03)";
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

      // Radial glow at center
      const g = ctx.createRadialGradient(
        W / 2,
        H / 2,
        0,
        W / 2,
        H / 2,
        Math.max(W, H) * 0.6,
      );
      g.addColorStop(0, accentColor + "0c");
      g.addColorStop(0.5, accentColor + "05");
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
  }, [accentColor]);

  return (
    <canvas ref={ref} className="fixed inset-0 -z-10" aria-hidden="true" />
  );
};
