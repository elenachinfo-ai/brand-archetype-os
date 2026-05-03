// =============================================================================
// RadarChart — Real-time 2D radar of archetype scores + brand-dot position.
// SVG-based, lightweight, receives normalized scores from the engine.
// =============================================================================

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import type { ArchetypeId } from "../useArchetypeEngine";
import { ARCHETYPE_MAP } from "../archetypeWeights";

interface RadarChartProps {
  /** Normalized archetype scores (0–100%) */
  scores: Record<ArchetypeId, number>;
  /** Current (x, y) position of the brand dot (−1..1) */
  brandPosition: { x: number; y: number };
  /** Dominant archetype for highlight */
  dominantId: ArchetypeId | null;
}

const SIZE = 200;
const CENTER = SIZE / 2;
const RADIUS = 80;
const GRID_COLOR = "rgba(255,255,255,0.12)";
const AXIS_COLOR = "rgba(255,255,255,0.2)";

export const RadarChart: React.FC<RadarChartProps> = ({
  scores,
  brandPosition,
  dominantId,
}) => {
  // Map archetype (x, y) positions to SVG coordinates
  const points = useMemo(() => {
    return (Object.entries(ARCHETYPE_MAP) as [ArchetypeId, typeof ARCHETYPE_MAP[string]][]).map(
      ([id, pos]) => {
        const sx = CENTER + pos.x * RADIUS;
        const sy = CENTER - pos.y * RADIUS; // SVG Y is inverted
        const score = scores[id] ?? 0;
        const isDominant = id === dominantId;
        const radius = 3 + (score / 100) * 8; // scale node size by score
        return { id, sx, sy, score, isDominant, color: pos.color, radius };
      },
    );
  }, [scores, dominantId]);

  // Brand dot position in SVG coords
  const brandSX = CENTER + brandPosition.x * RADIUS;
  const brandSY = CENTER - brandPosition.y * RADIUS;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full max-w-[200px] h-auto"
        aria-label="Archetype radar chart"
        role="img"
      >
        {/* Background circle */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke={GRID_COLOR}
          strokeWidth={1}
        />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS * 0.5}
          fill="none"
          stroke={GRID_COLOR}
          strokeWidth={0.5}
          strokeDasharray="3 3"
        />

        {/* Axes: crosshair */}
        <line
          x1={CENTER - RADIUS}
          y1={CENTER}
          x2={CENTER + RADIUS}
          y2={CENTER}
          stroke={AXIS_COLOR}
          strokeWidth={0.5}
        />
        <line
          x1={CENTER}
          y1={CENTER - RADIUS}
          x2={CENTER}
          y2={CENTER + RADIUS}
          stroke={AXIS_COLOR}
          strokeWidth={0.5}
        />

        {/* Axis labels */}
        <text
          x={CENTER + RADIUS + 10}
          y={CENTER + 4}
          className="text-[9px] fill-slate-400"
          textAnchor="start"
        >
          Freedom
        </text>
        <text
          x={CENTER - RADIUS - 10}
          y={CENTER + 4}
          className="text-[9px] fill-slate-400"
          textAnchor="end"
        >
          Order
        </text>
        <text
          x={CENTER}
          y={CENTER - RADIUS - 8}
          className="text-[9px] fill-slate-400"
          textAnchor="middle"
        >
          Social
        </text>
        <text
          x={CENTER}
          y={CENTER + RADIUS + 14}
          className="text-[9px] fill-slate-400"
          textAnchor="middle"
        >
          Ego
        </text>

        {/* Archetype nodes */}
        {points.map((p) => (
          <g key={p.id}>
            {/* Glow for dominant */}
            {p.isDominant && (
              <circle
                cx={p.sx}
                cy={p.sy}
                r={p.radius + 6}
                fill="none"
                stroke={p.color}
                strokeWidth={1}
                opacity={0.4}
              >
                <animate
                  attributeName="opacity"
                  values="0.4;0.15;0.4"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
            <circle
              cx={p.sx}
              cy={p.sy}
              r={p.radius}
              fill={p.color}
              opacity={p.isDominant ? 0.85 : 0.45}
              stroke="rgba(255,255,255,0.5)"
              strokeWidth={p.isDominant ? 1 : 0.5}
            />
            {/* Label for dominant */}
            {p.isDominant && (
              <text
                x={p.sx}
                y={p.sy - p.radius - 6}
                className="text-[10px] fill-slate-700 font-medium"
                textAnchor="middle"
              >
                {p.id}
              </text>
            )}
          </g>
        ))}

        {/* Brand position dot */}
        <motion.circle
          cx={brandSX}
          cy={brandSY}
          r={5}
          fill="rgba(255,255,255,0.9)"
          stroke="rgba(0,0,0,0.15)"
          strokeWidth={1}
          animate={{ cx: brandSX, cy: brandSY }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.5))" }}
        />

        {/* Crosshair on brand dot */}
        <motion.line
          x1={brandSX - 8}
          y1={brandSY}
          x2={brandSX + 8}
          y2={brandSY}
          stroke="rgba(255,255,255,0.5)"
          strokeWidth={0.5}
          animate={{ x1: brandSX - 8, y1: brandSY, x2: brandSX + 8, y2: brandSY }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        />
        <motion.line
          x1={brandSX}
          y1={brandSY - 8}
          x2={brandSX}
          y2={brandSY + 8}
          stroke="rgba(255,255,255,0.5)"
          strokeWidth={0.5}
          animate={{ x1: brandSX, y1: brandSY - 8, x2: brandSX, y2: brandSY + 8 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        />
      </svg>

      {/* Score bars for top 3 */}
      <div className="w-full space-y-1.5">
        {Object.entries(scores)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([id, score]) => (
            <div key={id} className="flex items-center gap-2 text-[11px]">
              <span
                className="w-16 truncate text-slate-500 font-light"
              >
                {id}
              </span>
              <div className="flex-1 h-1 rounded-full bg-white/10">
                <motion.div
                  className="h-1 rounded-full"
                  style={{ backgroundColor: ARCHETYPE_MAP[id as ArchetypeId]?.color ?? "#ccc" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ type: "spring", stiffness: 150, damping: 20 }}
                />
              </div>
              <span className="w-8 text-right tabular-nums text-slate-600 font-medium">
                {Math.round(score)}%
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};
