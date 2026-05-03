// =============================================================================
// PastelSlider — Gradient track with glowing glass bead thumb.
// Calls setSlider on the engine. Emits "water-drop" sound on change.
// =============================================================================

import React, { useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { soundEngine } from "./SoundEngine";

interface PastelSliderProps {
  id: string;
  value: number; // 0–100
  onChange: (id: string, value: number) => void;
  /** Gradient colors for the track: left extreme → right extreme */
  leftColor?: string;
  rightColor?: string;
  /** Labels */
  leftLabel?: string;
  rightLabel?: string;
  /** Aria label */
  ariaLabel?: string;
}

export const PastelSlider: React.FC<PastelSliderProps> = ({
  id,
  value,
  onChange,
  leftColor = "#CFFFE5",
  rightColor = "#FFE4E1",
  leftLabel,
  rightLabel,
  ariaLabel = "Slider",
}) => {
  const lastSoundRef = useRef(0);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = Number(e.target.value);
      onChange(id, v);

      // Sound throttled to ~100ms
      const now = performance.now();
      if (now - lastSoundRef.current > 100) {
        soundEngine.play("water-drop", v / 100);
        lastSoundRef.current = now;
      }
    },
    [id, onChange],
  );

  const pct = value;
  const thumbColor = interpolateColor(leftColor, rightColor, pct / 100);

  return (
    <div className="w-full space-y-2">
      {/* Labels */}
      {(leftLabel || rightLabel) && (
        <div className="flex justify-between text-[11px] text-slate-400 font-light tracking-wide">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      )}

      {/* Slider track */}
      <div className="relative w-full h-12 flex items-center">
        {/* Track background */}
        <div
          className="absolute w-full h-1.5 rounded-full"
          style={{
            background: `linear-gradient(to right, ${leftColor}66, ${rightColor}66)`,
          }}
        />

        {/* Track fill */}
        <div
          className="absolute h-1.5 rounded-full"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(to right, ${leftColor}, ${thumbColor})`,
          }}
        />

        {/* Native input (invisible, for accessibility + touch) */}
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={handleChange}
          aria-label={ariaLabel}
          className="
            absolute w-full h-12 opacity-0 cursor-pointer z-10
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-[44px]
            [&::-webkit-slider-thumb]:h-[44px]
            [&::-webkit-slider-thumb]:cursor-pointer
          "
          style={{ touchAction: "none" }}
        />

        {/* Glass bead thumb (visual only) */}
        <motion.div
          className="absolute w-5 h-5 rounded-full pointer-events-none z-10"
          animate={{
            left: `calc(${pct}% - 10px)`,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          style={{
            background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.9), ${thumbColor}cc)`,
            boxShadow: `0 0 12px ${thumbColor}66, 0 2px 8px rgba(0,0,0,0.08), inset 0 0.5px 0 rgba(255,255,255,0.8)`,
            border: "0.5px solid rgba(255,255,255,0.6)",
          }}
        />
      </div>
    </div>
  );
};

/** Simple linear interpolation between two hex colors */
function interpolateColor(c1: string, c2: string, t: number): string {
  const r1 = parseInt(c1.slice(1, 3), 16);
  const g1 = parseInt(c1.slice(3, 5), 16);
  const b1 = parseInt(c1.slice(5, 7), 16);
  const r2 = parseInt(c2.slice(1, 3), 16);
  const g2 = parseInt(c2.slice(3, 5), 16);
  const b2 = parseInt(c2.slice(5, 7), 16);

  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
