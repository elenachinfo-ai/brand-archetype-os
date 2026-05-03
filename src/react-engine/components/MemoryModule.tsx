// =============================================================================
// MemoryModule — Chip-style selection for text-choice questions.
// Each option is a glass "chip". Active chip glows with archetype harmony color.
// =============================================================================

import React from "react";
import { motion } from "framer-motion";
import { soundEngine } from "./SoundEngine";

interface MemoryOption {
  key: string;
  label: string;
  description?: string;
  icon?: string;
}

interface MemoryModuleProps {
  id: string;
  options: MemoryOption[];
  selectedKey: string | null;
  onSelect: (id: string, key: string) => void;
  /** Glow color for active chip — derived from archetype harmony */
  glowColor?: string;
  ariaLabel?: string;
}

export const MemoryModule: React.FC<MemoryModuleProps> = ({
  id,
  options,
  selectedKey,
  onSelect,
  glowColor = "#CFFFE5",
  ariaLabel = "Select an option",
}) => {
  return (
    <div
      className="space-y-2.5"
      role="radiogroup"
      aria-label={ariaLabel}
    >
      {options.map((opt) => {
        const isActive = selectedKey === opt.key;

        return (
          <motion.button
            key={opt.key}
            role="radio"
            aria-checked={isActive}
            onClick={() => {
              onSelect(id, opt.key);
              soundEngine.play("paper-rustle");
            }}
            whileTap={{ scale: 0.97 }}
            className={`
              w-full text-left px-4 py-3 rounded-xl
              border transition-all duration-300
              backdrop-blur-md
              ${
                isActive
                  ? "bg-white/10 border-white/20"
                  : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12]"
              }
            `}
            style={
              isActive
                ? {
                    boxShadow: `0 0 24px ${glowColor}33`,
                    borderColor: `${glowColor}66`,
                  }
                : { minHeight: 44 }
            }
          >
            <div className="flex items-start gap-3">
              {/* Chip indicator */}
              <div
                className={`
                  mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center
                  text-sm flex-shrink-0 transition-all duration-300
                  ${
                    isActive
                      ? "bg-white/15"
                      : "bg-white/[0.04]"
                  }
                `}
                style={
                  isActive
                    ? { boxShadow: `0 0 12px ${glowColor}44` }
                    : undefined
                }
              >
                {opt.icon || "◇"}
              </div>

              <div className="min-w-0">
                <div
                  className={`text-sm font-medium transition-colors duration-300 ${
                    isActive ? "text-white" : "text-slate-400"
                  }`
                >
                  {opt.label}
                </div>
                {opt.description && (
                  <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {opt.description}
                  </div>
                )}
              </div>

              {/* Active dot */}
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  style={{ backgroundColor: glowColor }}
                />
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};
