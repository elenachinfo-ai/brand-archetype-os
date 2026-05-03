// =============================================================================
// ExportSequence — "Finalize Architecture" button + full export protocol.
//
// Sequence: Click → core spins → nodes align → file chip appears →
//           Brand Passport JSON → Copy to Figma/Tilda → Shareable URL
// =============================================================================

import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useArchetypeEngine } from "../useArchetypeEngine";
import type { ArchetypeId } from "../archetypeWeights";
import {
  generateDesignTokens,
  tokensToFigmaJSON,
} from "./generateDesignTokens";
import { soundEngine } from "./SoundEngine";

type ExportPhase = "idle" | "spinning" | "aligning" | "packaging" | "complete";

export const ExportSequence: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const {
    dominantArchetype,
    secondaryArchetype,
    normalizedScores,
    uiTheme,
    sliders,
    memoryModules,
    powerDials,
    sessionId,
    locale,
    direction,
    t,
  } = useArchetypeEngine();

  const [phase, setPhase] = useState<ExportPhase>("idle");
  const [copied, setCopied] = useState<"figma" | "tilda" | "url" | null>(null);
  const [showChip, setShowChip] = useState(false);

  // Generate tokens
  const tokens = useMemo(() => {
    if (!dominantArchetype) return null;
    return generateDesignTokens(
      dominantArchetype as ArchetypeId,
      secondaryArchetype as ArchetypeId,
      uiTheme,
      direction as "ltr" | "rtl",
    );
  }, [dominantArchetype, secondaryArchetype, uiTheme, direction]);

  // Compile full Brand Passport JSON
  const passportJSON = useMemo(() => {
    if (!dominantArchetype || !tokens) return "";
    const payload = {
      passport_version: "1.0",
      session_id: sessionId,
      locale,
      archetype: {
        primary: dominantArchetype,
        secondary: secondaryArchetype,
        scores: normalizedScores,
      },
      ui_theme: uiTheme,
      design_tokens: tokens,
      input_snapshot: { sliders, memoryModules, powerDials },
      exported_at: new Date().toISOString(),
    };
    return JSON.stringify(payload, null, 2);
  }, [
    dominantArchetype,
    tokens,
    sessionId,
    locale,
    normalizedScores,
    uiTheme,
    sliders,
    memoryModules,
    powerDials,
    secondaryArchetype,
  ]);

  // Generate shareable URL hash (LZ-based compression via base64)
  const shareableURL = useMemo(() => {
    try {
      const mini = JSON.stringify({
        a: dominantArchetype,
        s: secondaryArchetype,
        sc: normalizedScores,
        th: uiTheme,
      });
      const hash = btoa(unescape(encodeURIComponent(mini)));
      return `${window.location.origin}${window.location.pathname}#asos=${hash}`;
    } catch {
      return "";
    }
  }, [dominantArchetype, secondaryArchetype, normalizedScores, uiTheme]);

  // ---- Export protocol ----
  const handleExport = useCallback(() => {
    if (phase !== "idle") return;
    soundEngine.play("pulse-confirm", 0.6);

    // Phase 1: Spin (300ms)
    setPhase("spinning");
    window.dispatchEvent(new CustomEvent("archetypeos:export-spin"));

    setTimeout(() => {
      // Phase 2: Align (400ms)
      setPhase("aligning");
      window.dispatchEvent(new CustomEvent("archetypeos:export-align"));

      setTimeout(() => {
        // Phase 3: Package (reveal chip)
        setPhase("packaging");
        setShowChip(true);
        soundEngine.play("paper-rustle");

        setTimeout(() => {
          setPhase("complete");
        }, 600);
      }, 400);
    }, 300);
  }, [phase]);

  // ---- Copy handlers ----
  const copyToClipboard = useCallback(
    async (type: "figma" | "tilda" | "url") => {
      try {
        const text =
          type === "figma"
            ? tokens
              ? tokensToFigmaJSON(tokens)
              : ""
            : type === "tilda"
              ? passportJSON
              : shareableURL;
        await navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
      } catch {
        // Fallback for older browsers
        const ta = document.createElement("textarea");
        ta.value =
          type === "figma"
            ? tokens
              ? tokensToFigmaJSON(tokens)
              : ""
            : type === "tilda"
              ? passportJSON
              : shareableURL;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
      }
    },
    [tokens, passportJSON, shareableURL],
  );

  const harmonyScore = dominantArchetype
    ? Math.round(
        (normalizedScores as Record<string, number>)[dominantArchetype] ?? 0,
      )
    : 0;

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* ---- Harmony Flash (score > 90%) ---- */}
      <AnimatePresence>
        {harmonyScore > 90 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${tokens?.palette.accent.hex ?? "#CFFFE5"}22, transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* ---- Export Button ---- */}
      {phase === "idle" && (
        <motion.button
          onClick={handleExport}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl font-medium text-base
            bg-slate-800/10 backdrop-blur-xl border border-slate-300/40
            text-slate-700 hover:bg-slate-800/20 hover:border-slate-400/50
            transition-all duration-500
            shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
          style={{ minHeight: 52 }}
        >
          {locale === "ru"
            ? "Завершить архитектуру"
            : locale === "ar"
              ? "إنهاء الهندسة المعمارية"
              : "Finalize Architecture"}
        </motion.button>
      )}

      {/* ---- Spinning animation ---- */}
      {phase === "spinning" && (
        <motion.div
          className="w-full py-4 rounded-2xl bg-white/30 backdrop-blur-xl border border-white/30 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-8 h-8 mx-auto rounded-full border-2 border-slate-300 border-t-slate-600"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-xs text-slate-500 mt-2 font-light">
            {locale === "ru"
              ? "Сборка архитектуры…"
              : locale === "ar"
                ? "تجميع الهندسة…"
                : "Assembling architecture…"}
          </p>
        </motion.div>
      )}

      {/* ---- Aligning animation ---- */}
      {phase === "aligning" && (
        <motion.div
          className="w-full py-4 rounded-2xl bg-white/30 backdrop-blur-xl border border-white/30 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex justify-center gap-1.5 mb-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-8 rounded-full bg-slate-400/40"
                initial={{ height: 8 }}
                animate={{ height: [8, 32, 16, 28, 20] }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              />
            ))}
          </div>
          <p className="text-xs text-slate-500 font-light">
            {locale === "ru"
              ? "Выравнивание структуры…"
              : locale === "ar"
                ? "محاذاة الهيكل…"
                : "Aligning structure…"}
          </p>
        </motion.div>
      )}

      {/* ---- File Chip (packaging + complete) ---- */}
      <AnimatePresence>
        {showChip && tokens && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="bg-white/50 backdrop-blur-2xl border border-white/50 rounded-2xl p-5
              shadow-[0_12px_40px_rgba(0,0,0,0.05),inset_0_0.5px_0_rgba(255,255,255,0.8)]"
          >
            {/* Chip header */}
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                style={{ backgroundColor: tokens.palette.primary.hex }}
                animate={{ rotate: [0, 5, -3, 0] }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                📦
              </motion.div>
              <div>
                <div className="text-sm font-medium text-slate-700">
                  Brand Passport
                </div>
                <div className="text-[10px] text-slate-400">
                  {new Date().toLocaleDateString(
                    locale === "ru" ? "ru" : locale === "ar" ? "ar" : "en",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    },
                  )}
                </div>
              </div>
            </div>

            {/* Token summary */}
            <div className="grid grid-cols-3 gap-2 mb-4 text-[11px]">
              <div className="text-center p-2 rounded-xl bg-white/30">
                <div className="text-slate-400">Radius</div>
                <div className="text-slate-700 font-medium">
                  {tokens.ui.borderRadius.lg}
                </div>
              </div>
              <div className="text-center p-2 rounded-xl bg-white/30">
                <div className="text-slate-400">Blur</div>
                <div className="text-slate-700 font-medium">
                  {tokens.ui.backdropBlur}
                </div>
              </div>
              <div className="text-center p-2 rounded-xl bg-white/30">
                <div className="text-slate-400">Font</div>
                <div className="text-slate-700 font-medium truncate">
                  {tokens.typography.heading.split(" ")[0]}
                </div>
              </div>
            </div>

            {/* Copy buttons — only visible when complete */}
            {phase === "complete" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard("figma")}
                    className="flex-1 py-2.5 rounded-xl text-xs font-medium
                      bg-white/60 border border-white/50 text-slate-700
                      hover:bg-white/80 transition-all duration-300"
                    style={{ minHeight: 44 }}
                  >
                    {copied === "figma" ? "✓ Copied!" : "Copy to Figma"}
                  </button>
                  <button
                    onClick={() => copyToClipboard("tilda")}
                    className="flex-1 py-2.5 rounded-xl text-xs font-medium
                      bg-white/60 border border-white/50 text-slate-700
                      hover:bg-white/80 transition-all duration-300"
                    style={{ minHeight: 44 }}
                  >
                    {copied === "tilda" ? "✓ Copied!" : "Copy to Tilda"}
                  </button>
                </div>
                <button
                  onClick={() => copyToClipboard("url")}
                  className="w-full py-2 rounded-xl text-xs text-slate-500 font-light
                    bg-white/30 border border-white/30
                    hover:bg-white/50 transition-all duration-300"
                  style={{ minHeight: 36 }}
                >
                  {copied === "url" ? "✓ Link copied!" : "Copy Shareable Link"}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- "Revived — Sent — Warmed" label ---- */}
      <AnimatePresence>
        {phase === "complete" && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center text-[11px] text-slate-400 font-light italic tracking-wide"
          >
            {locale === "ru"
              ? "Оживлено за минуту — Отправлено — Согрето"
              : locale === "ar"
                ? "أُحيي في دقيقة — أُرسل — دُفئ"
                : "Revived in a minute — Sent — Warmed"}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};
