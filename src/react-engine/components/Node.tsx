// =============================================================================
// Node — Single glassmorphism node in the Living Plan constellation.
// Scale, glow, and position driven by archetype affinity + force simulation.
// =============================================================================

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface PlanNodeData {
  id: string;
  label: string;
  description?: string;
  /** Current importance (0..1) — drives visual scale and mass */
  importance: number;
  /** Archetype affinity multiplier for this node */
  affinity: number;
  /** Pastel color from the global gradient */
  color: string;
  /** Glow color (dominant archetype accent) */
  glowColor: string;
  /** Current position in the force simulation */
  x: number;
  y: number;
  /** Is this node highlighted? */
  isHighlighted: boolean;
}

interface NodeProps {
  data: PlanNodeData;
  onClick?: (id: string) => void;
  /** RTL mode: flip tooltip position */
  isRTL?: boolean;
}

export const Node: React.FC<NodeProps> = ({ data, onClick, isRTL = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = useCallback(() => {
    onClick?.(data.id);
  }, [data.id, onClick]);

  // Scale: base 1.0, grows with importance (1.0 → 2.5)
  const baseScale = 1;
  const scale = baseScale + data.importance * 1.5;
  const hoverScale = scale * 1.15;

  // Glow intensity: base 0, grows with importance and affinity
  const glowAlpha = 0.08 + data.importance * data.affinity * 0.3;

  // Node radius: proportional to importance
  const baseRadius = 28;
  const radius = baseRadius + data.importance * 24;

  return (
    <motion.g
      className="cursor-pointer"
      animate={{
        x: data.x,
        y: data.y,
      }}
      transition={{
        type: "spring",
        stiffness: 60,
        damping: 18,
        mass: 0.3 + data.importance * 0.6,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Outer glow ring — breathing when highlighted */}
      <motion.circle
        cx={0}
        cy={0}
        r={radius + 12}
        fill="none"
        stroke={data.glowColor}
        strokeWidth={0.5}
        animate={{
          opacity: data.isHighlighted ? [0.25, 0.55, 0.25] : glowAlpha * 1.8,
          scale: data.isHighlighted ? [1, 1.06, 1] : 1,
        }}
        transition={
          data.isHighlighted
            ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.5 }
        }
      />

      {/* Mid glow — importance-based */}
      <motion.circle
        cx={0}
        cy={0}
        r={radius + 4}
        fill={data.glowColor}
        animate={{ opacity: glowAlpha }}
        transition={{ duration: 0.8 }}
      />

      {/* Main node body — glassmorphism */}
      <motion.g
        animate={{ scale: isHovered ? hoverScale : scale }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {/* Glass circle */}
        <circle
          cx={0}
          cy={0}
          r={radius}
          fill="rgba(255,255,255,0.45)"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth={0.5}
          style={{
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        />

        {/* Inner accent ring */}
        <circle
          cx={0}
          cy={0}
          r={radius - 3}
          fill="none"
          stroke={data.color}
          strokeWidth={1}
          opacity={0.5}
        />

        {/* Label — truncated to fit */}
        <text
          x={0}
          y={1}
          textAnchor="middle"
          dominantBaseline="central"
          className="select-none pointer-events-none"
          style={{
            fontSize: Math.max(9, 11 - Math.max(0, data.label.length - 14) * 0.4),
            fontWeight: data.isHighlighted ? 500 : 350,
            fill: data.isHighlighted ? "#334155" : "#64748b",
            fontFamily: "inherit",
            letterSpacing: "0.03em",
          }}
        >
          {data.label.length > 16 ? data.label.slice(0, 15) + "…" : data.label}
        </text>

        {/* Percentage badge — only visible when importance > 0.3 */}
        <AnimatePresence>
          {data.importance > 0.3 && (
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <circle
                cx={0}
                cy={-radius - 4}
                r={10}
                fill="rgba(255,255,255,0.7)"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth={0.5}
              />
              <text
                x={0}
                y={-radius - 3}
                textAnchor="middle"
                dominantBaseline="central"
                className="select-none pointer-events-none"
                style={{
                  fontSize: 8,
                  fontWeight: 500,
                  fill: "#475569",
                  fontFamily: "inherit",
                }}
              >
                {Math.round(data.importance * 100)}
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </motion.g>

      {/* Hover tooltip */}
      <AnimatePresence>
        {isHovered && data.description && (
          <motion.g
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
          >
            {/* Tooltip background */}
            <rect
              x={isRTL ? -14 : -(radius + 4)}
              y={radius + 8}
              width={Math.min(220, data.description.length * 6 + 24)}
              height={data.description.length > 40 ? 42 : 30}
              rx={10}
              fill="rgba(255,255,255,0.75)"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth={0.5}
              style={{
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
            />
            {/* Tooltip text */}
            <text
              x={isRTL ? 6 : radius + 10}
              y={radius + 26}
              textAnchor={isRTL ? "end" : "start"}
              className="select-none pointer-events-none"
              style={{
                fontSize: 10,
                fontWeight: 350,
                fill: "#475569",
                fontFamily: "inherit",
                lineHeight: 1.4,
              }}
            >
              {data.description.length > 50
                ? data.description.slice(0, 48) + "…"
                : data.description}
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </motion.g>
  );
};
