// =============================================================================
// PowerDial — Single-value intensity knob (0–100).
// Draggable arc with glowing glass indicator.
// =============================================================================

import React, { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { soundEngine } from "./SoundEngine";

interface PowerDialProps {
  id: string;
  value: number; // 0–100
  onChange: (id: string, value: number) => void;
  /** Labels for extremes */
  leftLabel?: string;
  rightLabel?: string;
  /** Accent color */
  color?: string;
  ariaLabel?: string;
}

export const PowerDial: React.FC<PowerDialProps> = ({
  id,
  value,
  onChange,
  leftLabel = "Min",
  rightLabel = "Max",
  color = "#CFFFE5",
  ariaLabel = "Intensity dial",
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const lastSoundRef = useRef(0);

  const computeValue = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return value;
      const rect = track.getBoundingClientRect();
      const x = clientX - rect.left;
      const pct = Math.max(0, Math.min(1, x / rect.width));
      return Math.round(pct * 100);
    },
    [value],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(true);
      const v = computeValue(e.clientX);
      onChange(id, v);

      const now = performance.now();
      if (now - lastSoundRef.current > 80) {
        soundEngine.play("water-drop", v / 100);
        lastSoundRef.current = now;
      }
    },
    [id, onChange, computeValue],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const v = computeValue(e.clientX);
      onChange(id, v);
    },
    [isDragging, id, onChange, computeValue],
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const pct = value;

  return (
    <div
      className="w-full space-y-2 select-none"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Labels */}
      <div className="flex justify-between text-[11px] text-slate-400 font-light tracking-wide">
        <span>{leftLabel}</span>
        <span className="text-slate-500 font-medium tabular-nums">{value}%</span>
        <span>{rightLabel}</span>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        className="relative w-full h-10 flex items-center cursor-pointer"
        role="slider"
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        tabIndex={0}
        style={{ touchAction: "none" }}
      >
        {/* Background */}
        <div className="absolute w-full h-2 rounded-full bg-white/15" />

        {/* Fill */}
        <motion.div
          className="absolute h-2 rounded-full"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(to right, ${color}44, ${color})`,
            boxShadow: `0 0 10px ${color}66`,
          }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        />

        {/* Knob */}
        <motion.div
          className="absolute w-7 h-7 rounded-full pointer-events-none"
          animate={{ left: `calc(${pct}% - 14px)` }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          style={{
            background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.95), ${color}cc)`,
            boxShadow: isDragging
              ? `0 0 20px ${color}99, 0 4px 12px rgba(0,0,0,0.1), inset 0 0.5px 0 rgba(255,255,255,0.9)`
              : `0 0 10px ${color}44, 0 2px 6px rgba(0,0,0,0.08), inset 0 0.5px 0 rgba(255,255,255,0.8)`,
            border: "0.5px solid rgba(255,255,255,0.6)",
          }}
        />
      </div>
    </div>
  );
};
