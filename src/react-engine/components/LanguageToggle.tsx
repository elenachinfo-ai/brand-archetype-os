// =============================================================================
// LanguageToggle — RU / EN / AR switcher
// Three glass pill buttons. AR triggers RTL + layout mirror via framer-motion.
// =============================================================================

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "../useArchetypeEngine";

interface LanguageToggleProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

const LOCALES: { id: Locale; label: string; native: string }[] = [
  { id: "ru", label: "RU", native: "Рус" },
  { id: "en", label: "EN", native: "Eng" },
  { id: "ar", label: "AR", native: "عرب" },
];

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  locale,
  onLocaleChange,
}) => {
  return (
    <div
      className="flex gap-1 p-1 bg-white/10 backdrop-blur-md rounded-full border border-white/15"
      role="radiogroup"
      aria-label="Select language"
    >
      {LOCALES.map((l) => {
        const isActive = locale === l.id;
        return (
          <button
            key={l.id}
            role="radio"
            aria-checked={isActive}
            onClick={() => onLocaleChange(l.id)}
            className={`
              relative px-3 py-1.5 text-xs font-medium rounded-full
              transition-colors duration-300
              ${
                isActive
                  ? "text-slate-700"
                  : "text-slate-500 hover:text-slate-600"
              }
            `}
            style={{ minWidth: 44, minHeight: 44, touchAction: "manipulation" }}
          >
            {/* Active indicator */}
            {isActive && (
              <motion.div
                layoutId="lang-active"
                className="absolute inset-0 bg-white/70 rounded-full shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{l.label}</span>
          </button>
        );
      })}
    </div>
  );
};
