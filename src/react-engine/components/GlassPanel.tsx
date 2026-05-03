// =============================================================================
// GlassPanel — Reusable glassmorphism container
// backdrop-filter: blur(24px), translucent white, 0.5px white border.
// =============================================================================

import React, { type ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  /** Panel intensity: "light" | "medium" | "heavy" */
  intensity?: "light" | "medium" | "heavy";
  /** Optional accent glow from the archetype color */
  glowColor?: string;
  /** Click handler */
  onClick?: () => void;
  /** ARIA role */
  role?: string;
  /** aria-label */
  label?: string;
  /** ID for anchoring */
  id?: string;
}

const intensityMap = {
  light: {
    bg: "bg-white/20",
    blur: "backdrop-blur-md",
    border: "border-white/20",
  },
  medium: {
    bg: "bg-white/30",
    blur: "backdrop-blur-xl",
    border: "border-white/30",
  },
  heavy: {
    bg: "bg-white/40",
    blur: "backdrop-blur-2xl",
    border: "border-white/40",
  },
} as const;

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className = "",
  intensity = "medium",
  glowColor,
  onClick,
  role,
  label,
  id,
}) => {
  const style = intensityMap[intensity];

  return (
    <div
      id={id}
      role={role}
      aria-label={label}
      onClick={onClick}
      className={`
        ${style.bg} ${style.blur} ${style.border}
        border rounded-2xl
        shadow-[0_8px_32px_rgba(0,0,0,0.04),inset_0_0.5px_0_rgba(255,255,255,0.6)]
        transition-all duration-500 ease-out
        hover:shadow-[0_12px_40px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)]
        hover:border-white/50
        ${onClick ? "cursor-pointer active:scale-[0.98]" : ""}
        ${className}
      `}
      style={
        glowColor
          ? ({
              "--glow-color": glowColor,
              boxShadow: `0 8px 32px rgba(0,0,0,0.04), 0 0 40px ${glowColor}15, inset 0 0.5px 0 rgba(255,255,255,0.6)`,
            } as React.CSSProperties)
          : undefined
      }
    >
      {children}
    </div>
  );
};
