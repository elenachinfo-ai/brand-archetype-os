// =============================================================================
// HolographicShell — Unified single-viewport interface.
// Dark holographic HUD. Sphere at center. Questions float as overlays.
// No frames. No emoji. Sphere responds in real-time to every answer.
// =============================================================================

import React, { useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useArchetypeEngine } from "../useArchetypeEngine";
import { LanguageToggle } from "./LanguageToggle";
import { DynamicBackground } from "./DynamicBackground";
import { PastelSlider } from "./PastelSlider";
import { MemoryModule } from "./MemoryModule";
import { PowerDial } from "./PowerDial";
import { RadarChart } from "./RadarChart";
import { LivingPlan } from "./LivingPlan";
import { AIAdvisor } from "./AIAdvisor";
import { ExportSequence } from "./ExportSequence";
import { soundEngine } from "./SoundEngine";
import { qualityManager } from "./QualityManager";

// ---- Accent colors per archetype (saturated for HUD) ----
const ACCENT: Record<string, string> = {
  ruler: "#D4AF37",
  creator: "#E91E63",
  sage: "#7E57C2",
  innocent: "#AED581",
  explorer: "#26C6DA",
  hero: "#FF7043",
  magician: "#AB47BC",
  outlaw: "#FF5722",
  jester: "#FFAB00",
  lover: "#F06292",
  caregiver: "#43A047",
  everyman: "#8D6E63",
};

// ---- Q4 options: no emoji ----
const Q4 = [
  {
    key: "scandinavian_library",
    label: "Scandinavian Library",
    desc: "Light, order, silence.",
  },
  {
    key: "artistic_workshop",
    label: "Artistic Workshop",
    desc: "Chaos, creativity, energy.",
  },
  {
    key: "infinite_field",
    label: "Infinite Field at Dawn",
    desc: "Horizon, freedom, freshness.",
  },
];

// ---- Q5 options: no emoji ----
const Q5 = [
  {
    key: "quiet_whisper",
    label: "A Quiet Whisper",
    desc: "Subtle but unforgettable.",
  },
  {
    key: "confident_handshake",
    label: "A Confident Handshake",
    desc: "Direct, strong, leading.",
  },
  {
    key: "infectious_laugh",
    label: "An Infectious Laugh",
    desc: "Instant centre of attention.",
  },
];

// =============================================================================
// COMPONENT
// =============================================================================

interface Props {
  children?: ReactNode;
}

export const DashboardShell: React.FC<Props> = ({ children }) => {
  const engine = useArchetypeEngine();
  const {
    sliders,
    setSlider,
    memoryModules,
    setMemoryModule,
    powerDials,
    setPowerDial,
    dominantArchetype,
    normalizedScores,
    radarPosition,
    uiTheme,
    step,
    nextStep,
    prevStep,
    setStep,
    locale,
    setLocale,
    direction,
    isHydrated,
    hydrate,
    resetSession,
    isComplete,
    t,
  } = engine;

  const initRef = useRef(false);
  const loc = locale as "ru" | "en" | "ar";
  const accent = dominantArchetype
    ? (ACCENT[dominantArchetype] ?? "#7bbcd4")
    : "#7bbcd4";
  const isRTL = direction === "rtl";

  // ---- Init ----
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    hydrate();
    qualityManager.start();
    const s = () => {
      soundEngine.init();
      document.removeEventListener("pointerdown", s);
    };
    document.addEventListener("pointerdown", s);
    return () => {
      qualityManager.stop();
      document.removeEventListener("pointerdown", s);
    };
  }, []);

  // ---- Text helpers (no emoji) ----
  const L = {
    start:
      loc === "ru"
        ? "Начать диагностику"
        : loc === "ar"
          ? "ابدأ التشخيص"
          : "Begin Diagnosis",
    back: loc === "ru" ? "Назад" : loc === "ar" ? "رجوع" : "Back",
    next:
      step === 7
        ? loc === "ru"
          ? "Завершить"
          : loc === "ar"
            ? "إنهاء"
            : "Finish"
        : loc === "ru"
          ? "Далее"
          : loc === "ar"
            ? "التالي"
            : "Next",
    order:
      loc === "ru"
        ? "Заказать сайт по архетипу"
        : loc === "ar"
          ? "اطلب موقعاً حسب النمط"
          : "Order Website by Archetype",
    blocks: {
      a:
        loc === "ru"
          ? "Визуальное ДНК"
          : loc === "ar"
            ? "الحمض النووي البصري"
            : "Visual DNA",
      b:
        loc === "ru"
          ? "Метафоры бренда"
          : loc === "ar"
            ? "استعارات العلامة"
            : "Brand Metaphors",
      c:
        loc === "ru"
          ? "Динамика UX"
          : loc === "ar"
            ? "ديناميكيات UX"
            : "UX Dynamics",
    },
    q1_left: loc === "ru" ? "Воздух" : "Air",
    q1_right: loc === "ru" ? "Плотность" : "Density",
    q2_left: loc === "ru" ? "Органика" : "Organic",
    q2_right: loc === "ru" ? "Архитектура" : "Architectural",
    q3_left: loc === "ru" ? "Тихая роскошь" : "Quiet Luxury",
    q3_right: loc === "ru" ? "Цифровая энергия" : "Digital Energy",
    q4_prompt:
      loc === "ru"
        ? "Если бы бренд был пространством — где мы?"
        : "If the brand were a space — where are we?",
    q5_prompt:
      loc === "ru"
        ? "Как бренд входит в комнату?"
        : "How does the brand enter a room?",
    q6_left: loc === "ru" ? "Текучий" : "Fluid",
    q6_right: loc === "ru" ? "Структурный" : "Structured",
    q7_left: loc === "ru" ? "Классика" : "Classic",
    q7_right: loc === "ru" ? "Авангард" : "Avant-garde",
    harmony: loc === "ru" ? "Гармония" : "Harmony",
    awaiting: loc === "ru" ? "Ожидание..." : "Awaiting...",
    new: loc === "ru" ? "Новая сессия" : "New session",
  };

  const block =
    step >= 1 && step <= 3
      ? "a"
      : step >= 4 && step <= 5
        ? "b"
        : step >= 6 && step <= 7
          ? "c"
          : null;

  return (
    <div
      dir={direction}
      className="relative min-h-screen w-full overflow-hidden bg-[#0a0b10] text-slate-300"
      style={{
        fontFamily: isRTL
          ? "'IBM Plex Sans Arabic','Tajawal',sans-serif"
          : "'Inter','Manrope',sans-serif",
      }}
    >
      <DynamicBackground accentColor={accent} />

      {/* ---- Top bar: logo, step dots, language ---- */}
      <div className="relative z-30 flex items-center justify-between px-6 py-4 max-w-[1400px] mx-auto">
        <div className="text-xs font-light tracking-[0.25em] text-slate-500 uppercase select-none">
          Archetype<span className="text-slate-700">OS</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Step dots — geometric, no emoji */}
          {step >= 1 && step <= 7 && (
            <div className="flex gap-2 items-center">
              <span className="text-[10px] text-slate-600 font-light uppercase tracking-wider mr-1">
                {block ? L.blocks[block] : ""}
              </span>
              {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                <div key={s} className="relative w-2 h-2">
                  <div
                    className={`w-2 h-2 rounded-full transition-all duration-500 ${s === step ? "bg-white shadow-[0_0_8px]" : s < step ? "bg-slate-500" : "bg-slate-800"}`}
                    style={s === step ? { boxShadow: `0 0 8px ${accent}` } : {}}
                  />
                  {s === step && (
                    <div
                      className="absolute inset-0 rounded-full animate-ping opacity-30"
                      style={{ backgroundColor: accent }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
          <LanguageToggle locale={locale} onLocaleChange={setLocale} />
        </div>
      </div>

      {/* ---- Main viewport: sphere center + overlay elements ---- */}
      <div
        className="relative z-20 max-w-[1400px] mx-auto px-6 pb-8"
        style={{ minHeight: "calc(100vh - 80px)" }}
      >
        {/* 3D Sphere canvas — fills center */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-full h-full">{children}</div>
        </div>

        {/* ---- HUD overlay elements ---- */}
        <div
          className="relative z-10 flex"
          style={{ minHeight: "calc(100vh - 140px)" }}
        >
          {/* LEFT: questions + nav */}
          <div className="w-[340px] flex-shrink-0 flex flex-col justify-center gap-4">
            <AnimatePresence mode="wait">
              {/* STEP 0 — Start */}
              {step === 0 && (
                <motion.div
                  key="start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <div className="text-[10px] text-slate-600 uppercase tracking-[0.3em] mb-3">
                      Brand Archetype Diagnostic
                    </div>
                    <h1 className="text-3xl font-light text-white tracking-wide mb-2">
                      ArchetypeOS
                    </h1>
                    <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                      {loc === "ru"
                        ? "Определите ДНК вашего бренда за 7 шагов. Алгоритм анализирует визуальные предпочтения и строит персональную дизайн-систему."
                        : "Determine your brand's DNA in 7 steps. The algorithm analyzes visual preferences and builds a personal design system."}
                    </p>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-sm font-medium
                      text-white/80 hover:bg-white/10 hover:border-white/20 transition-all tracking-wide"
                    style={{ minHeight: 48 }}
                  >
                    {L.start}
                  </button>
                </motion.div>
              )}

              {/* STEPS 1-7 */}
              {step >= 1 && step <= 7 && (
                <motion.div
                  key={`q${step}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-5"
                >
                  {/* Question content — no frames, just typography */}
                  <div className="space-y-4">
                    {step === 1 && (
                      <PastelSlider
                        id="q1_density"
                        value={sliders.q1_density.value}
                        onChange={setSlider}
                        leftColor="#334155"
                        rightColor={accent}
                        leftLabel={L.q1_left}
                        rightLabel={L.q1_right}
                        ariaLabel="Density"
                      />
                    )}
                    {step === 2 && (
                      <PastelSlider
                        id="q2_geometry"
                        value={sliders.q2_geometry.value}
                        onChange={setSlider}
                        leftColor="#334155"
                        rightColor={accent}
                        leftLabel={L.q2_left}
                        rightLabel={L.q2_right}
                        ariaLabel="Geometry"
                      />
                    )}
                    {step === 3 && (
                      <PastelSlider
                        id="q3_temperature"
                        value={sliders.q3_temperature.value}
                        onChange={setSlider}
                        leftColor="#334155"
                        rightColor={accent}
                        leftLabel={L.q3_left}
                        rightLabel={L.q3_right}
                        ariaLabel="Temperature"
                      />
                    )}
                    {step === 4 && (
                      <div className="space-y-3">
                        <p className="text-sm text-slate-400 font-light">
                          {L.q4_prompt}
                        </p>
                        <MemoryModule
                          id="q4_space"
                          options={Q4}
                          selectedKey={memoryModules.q4_space.selectedKey}
                          onSelect={setMemoryModule}
                          glowColor={accent}
                        />
                      </div>
                    )}
                    {step === 5 && (
                      <div className="space-y-3">
                        <p className="text-sm text-slate-400 font-light">
                          {L.q5_prompt}
                        </p>
                        <MemoryModule
                          id="q5_entry"
                          options={Q5}
                          selectedKey={memoryModules.q5_entry.selectedKey}
                          onSelect={setMemoryModule}
                          glowColor={accent}
                        />
                      </div>
                    )}
                    {step === 6 && (
                      <PowerDial
                        id="q6_scroll"
                        value={powerDials.q6_scroll.value}
                        onChange={setPowerDial}
                        leftLabel={L.q6_left}
                        rightLabel={L.q6_right}
                        color={accent}
                      />
                    )}
                    {step === 7 && (
                      <PowerDial
                        id="q7_risk"
                        value={powerDials.q7_risk.value}
                        onChange={setPowerDial}
                        leftLabel={L.q7_left}
                        rightLabel={L.q7_right}
                        color={accent}
                      />
                    )}
                  </div>

                  {/* Nav */}
                  <div className="flex gap-3">
                    <button
                      onClick={prevStep}
                      disabled={step <= 1}
                      className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium
                        text-slate-500 hover:text-white hover:border-white/20 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                      style={{ minHeight: 44 }}
                    >
                      {L.back}
                    </button>
                    <button
                      onClick={nextStep}
                      className="px-5 py-2.5 border rounded-full text-xs font-medium transition-all
                        hover:border-white/30"
                      style={{
                        minHeight: 44,
                        borderColor: accent + "44",
                        color: accent,
                        backgroundColor: accent + "0a",
                      }}
                    >
                      {L.next}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 8 — Result */}
              {step === 8 && isComplete && dominantArchetype && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-5"
                >
                  <div className="space-y-3">
                    <div className="text-[10px] text-slate-600 uppercase tracking-[0.3em]">
                      Brand Archetype
                    </div>
                    <h2 className="text-3xl font-light text-white tracking-wide">
                      {t(`archetypes.${dominantArchetype}`)}
                    </h2>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {t(`archetypes.${dominantArchetype}_desc`)}
                    </p>
                    {/* Theme bars */}
                    <div className="space-y-2 pt-3">
                      {(["softness", "vibrancy", "complexity"] as const).map(
                        (k) => (
                          <div
                            key={k}
                            className="flex items-center gap-3 text-[11px]"
                          >
                            <span className="w-20 text-slate-600 capitalize">
                              {k}
                            </span>
                            <div className="flex-1 h-1 bg-white/5 rounded-full">
                              <div
                                className="h-1 rounded-full transition-all duration-700"
                                style={{
                                  width: `${uiTheme[k] * 100}%`,
                                  backgroundColor: accent,
                                }}
                              />
                            </div>
                            <span className="w-8 text-right tabular-nums text-slate-500">
                              {Math.round(uiTheme[k] * 100)}%
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                  <AIAdvisor />
                  <ExportSequence />
                  <button
                    id="cta-order-website"
                    onClick={() => {
                      soundEngine.play("pulse-confirm", 0);
                      alert(
                        loc === "ru"
                          ? "Заявка сформирована!"
                          : "Request submitted!",
                      );
                    }}
                    className="w-full py-3.5 rounded-full font-medium text-sm border transition-all"
                    style={{
                      minHeight: 52,
                      backgroundColor: accent + "15",
                      borderColor: accent + "40",
                      color: accent,
                    }}
                  >
                    {L.order}
                  </button>
                  <button
                    onClick={resetSession}
                    className="w-full py-2 text-xs text-slate-600 hover:text-slate-400 transition-colors"
                    style={{ minHeight: 44 }}
                  >
                    {L.new}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT: telemetry — always visible */}
          <div className="flex-1 flex flex-col justify-center items-end gap-4">
            <div className="w-[220px] space-y-4">
              {/* Radar */}
              <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
                <div className="text-[9px] text-slate-600 uppercase tracking-[0.3em] mb-2">
                  Radar
                </div>
                <RadarChart
                  scores={normalizedScores as any}
                  brandPosition={radarPosition}
                  dominantId={dominantArchetype}
                />
              </div>
              {/* Harmony score */}
              <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
                <div className="text-[9px] text-slate-600 uppercase tracking-[0.3em] mb-1">
                  {L.harmony}
                </div>
                <div className="text-2xl font-light text-white tabular-nums">
                  {dominantArchetype
                    ? `${Math.round((normalizedScores as any)[dominantArchetype] ?? 0)}%`
                    : "--"}
                </div>
              </div>
              {/* Status */}
              <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-2xl space-y-1.5 text-[10px] text-slate-600">
                <div className="text-[9px] text-slate-600 uppercase tracking-[0.3em] mb-1">
                  System
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-1 h-1 rounded-full ${isHydrated ? "bg-emerald-500" : "bg-amber-500"}`}
                  />
                  {isHydrated ? "Active" : "Loading..."}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-sky-500" />
                  GPU: {qualityManager.state.tier}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-violet-500" />
                  Sound: {soundEngine.enabled ? "on" : "off"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
