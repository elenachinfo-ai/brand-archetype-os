// =============================================================================
// DashboardShell — Single-window cockpit layout.
// Three zones: Left Wing (inputs), Central Viewport (3D core), Right Wing (telemetry).
// Full RTL mirroring via framer-motion when switching to Arabic.
// =============================================================================

import React, { useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useArchetypeEngine } from "../useArchetypeEngine";
import { GlassPanel } from "./GlassPanel";
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
import type { Locale } from "../useArchetypeEngine";

// =============================================================================
// CONSTANTS
// =============================================================================

/** Archetype color mapping for glow accents */
const ARCHETYPE_GLOW_COLORS: Record<string, string> = {
  ruler: "#F5E6C8",
  creator: "#FFE4E1",
  sage: "#E6E6FA",
  innocent: "#F0F8FF",
  explorer: "#CFFFE5",
  hero: "#FFFACD",
  magician: "#E0FFFF",
  outlaw: "#F5F5F5",
  jester: "#FFF0F5",
  lover: "#FFC0CB",
  caregiver: "#F5FFFA",
  everyman: "#FAFAD2",
};

/** Memory module options — Q4: Spatial Resonance */
const SPACE_OPTIONS = [
  {
    key: "scandinavian_library",
    label: "Скандинавская библиотека",
    description: "Свет, порядок, тишина.",
    icon: "📚",
  },
  {
    key: "artistic_workshop",
    label: "Арт-мастерская",
    description: "Творчество, энергия, свобода.",
    icon: "🎨",
  },
  {
    key: "infinite_field",
    label: "Бескрайнее поле на рассвете",
    description: "Горизонт, свежесть, открытие.",
    icon: "🌅",
  },
];

/** Memory module options — Q5: Entry Protocol */
const ENTRY_OPTIONS = [
  {
    key: "quiet_whisper",
    label: "Тихий шёпот",
    description: "Незаметно, но незабываемо.",
    icon: "🌙",
  },
  {
    key: "confident_handshake",
    label: "Уверенное рукопожатие",
    description: "Прямо, сильно, ведущее.",
    icon: "🤝",
  },
  {
    key: "infectious_laugh",
    label: "Заразительный смех",
    description: "Мгновенный центр внимания.",
    icon: "✨",
  },
];

// =============================================================================
// SHELL LAYOUT
// =============================================================================

interface DashboardShellProps {
  children?: ReactNode; // Central viewport content (3D core placeholder)
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ children }) => {
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
    projectPlan,
    step,
    nextStep,
    prevStep,
    setStep,
    t,
    direction,
    locale,
    setLocale,
    isHydrated,
    hydrate,
    resetSession,
    isComplete,
  } = useArchetypeEngine();

  const hasInitialized = useRef(false);

  // ---- Init: hydrate + quality + sound ----
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Hydrate saved session
    hydrate();

    // Start quality monitoring
    qualityManager.start();

    // Init sound engine on first click/touch
    const initSound = () => {
      soundEngine.init();
      document.removeEventListener("pointerdown", initSound);
    };
    document.addEventListener("pointerdown", initSound);

    return () => {
      qualityManager.stop();
      document.removeEventListener("pointerdown", initSound);
    };
  }, []);

  // ---- Archetype drone ----
  useEffect(() => {
    if (dominantArchetype && isComplete) {
      // Map archetype to a base frequency
      const freqMap: Record<string, number> = {
        ruler: 196, // G3 — grounded
        creator: 293.66, // D4 — expressive
        sage: 246.94, // B3 — contemplative
        innocent: 329.63, // E4 — bright
        explorer: 261.63, // C4 — open
        hero: 220, // A3 — bold
        magician: 349.23, // F4 — ethereal
        outlaw: 174.61, // F3 — dark
        jester: 311.13, // Eb4 — playful
        lover: 277.18, // Db4 — warm
        caregiver: 233.08, // Bb3 — soft
        everyman: 261.63, // C4 — neutral
      };
      soundEngine.startDrone(freqMap[dominantArchetype] ?? 220);
    } else {
      soundEngine.stopDrone();
    }
  }, [dominantArchetype, isComplete]);

  // ---- Glow color ----
  const glowColor = dominantArchetype
    ? (ARCHETYPE_GLOW_COLORS[dominantArchetype] ?? "#CFFFE5")
    : "#CFFFE5";

  // ---- Steps navigation ----
  const totalSteps = 8; // 0 = onboarding, 1–7 = questions, 8 = result
  const isQuestionStep = step >= 1 && step <= 7;

  return (
    <div
      dir={direction}
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        fontFamily:
          direction === "rtl"
            ? "'IBM Plex Sans Arabic', 'Tajawal', sans-serif"
            : "'Inter', 'Montserrat', sans-serif",
      }}
    >
      {/* ---- Living Background ---- */}
      <DynamicBackground
        softness={uiTheme.softness}
        vibrancy={uiTheme.vibrancy}
      />

      {/* ---- Main Grid ---- */}
      <div
        className={`
          relative z-10 min-h-screen
          grid gap-4 p-4
          grid-cols-1
          md:grid-cols-[280px_1fr_280px]
          lg:grid-cols-[320px_1fr_320px]
          max-w-[1440px] mx-auto
        `}
      >
        {/* ============================================ */}
        {/* LEFT WING — Input Panel                       */}
        {/* ============================================ */}
        <motion.aside
          className="flex flex-col gap-4 order-1"
          layout
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          {/* Header: Logo + Language */}
          <GlassPanel
            intensity="light"
            className="p-4 flex items-center justify-between"
          >
            <div className="text-sm font-light tracking-widest text-slate-600 uppercase">
              Archetype<span className="text-slate-400">OS</span>
            </div>
            <LanguageToggle locale={locale} onLocaleChange={setLocale} />
          </GlassPanel>

          {/* Step indicator */}
          {isQuestionStep && (
            <GlassPanel
              intensity="light"
              className="p-3 flex items-center gap-3"
            >
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                  <div
                    key={s}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      s === step
                        ? "bg-slate-600 scale-125"
                        : s < step
                          ? "bg-slate-400"
                          : "bg-slate-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] text-slate-500 font-light">
                {t("ui.step_counter", { current: step, total: totalSteps - 1 })}
              </span>
            </GlassPanel>
          )}

          {/* Questions — only visible during diagnostic */}
          <AnimatePresence mode="wait">
            {isQuestionStep && (
              <motion.div
                key={`step-${step}`}
                initial={{ opacity: 0, x: direction === "rtl" ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction === "rtl" ? 20 : -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex flex-col gap-4"
              >
                <GlassPanel intensity="medium" className="p-5 space-y-5">
                  {/* Q1–Q3: Dual Sliders */}
                  {step === 1 && (
                    <>
                      <PastelSlider
                        id="q1_density"
                        value={sliders.q1_density.value}
                        onChange={setSlider}
                        leftColor="#F0F8FF"
                        rightColor="#FFE4E1"
                        leftLabel={t("questions.q1_density.left_label")}
                        rightLabel={t("questions.q1_density.right_label")}
                        ariaLabel={t("questions.q1_density.title")}
                      />
                      <div className="text-xs text-slate-500 font-light text-center">
                        {t("questions.q1_density.title")}
                      </div>
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <PastelSlider
                        id="q2_geometry"
                        value={sliders.q2_geometry.value}
                        onChange={setSlider}
                        leftColor="#E6E6FA"
                        rightColor="#CFFFE5"
                        leftLabel={t("questions.q2_geometry.left_label")}
                        rightLabel={t("questions.q2_geometry.right_label")}
                        ariaLabel={t("questions.q2_geometry.title")}
                      />
                      <div className="text-xs text-slate-500 font-light text-center">
                        {t("questions.q2_geometry.title")}
                      </div>
                    </>
                  )}
                  {step === 3 && (
                    <>
                      <PastelSlider
                        id="q3_temperature"
                        value={sliders.q3_temperature.value}
                        onChange={setSlider}
                        leftColor="#F5FFFA"
                        rightColor="#FFE4E1"
                        leftLabel={t("questions.q3_temperature.left_label")}
                        rightLabel={t("questions.q3_temperature.right_label")}
                        ariaLabel={t("questions.q3_temperature.title")}
                      />
                      <div className="text-xs text-slate-500 font-light text-center">
                        {t("questions.q3_temperature.title")}
                      </div>
                    </>
                  )}

                  {/* Q4: Spatial Resonance (Memory Module) */}
                  {step === 4 && (
                    <>
                      <div className="text-sm text-slate-600 font-medium">
                        {t("questions.q4_space.title")}
                      </div>
                      <div className="text-[11px] text-slate-400 italic">
                        {t("questions.q4_space.subtitle")}
                      </div>
                      <MemoryModule
                        id="q4_space"
                        options={SPACE_OPTIONS}
                        selectedKey={memoryModules.q4_space.selectedKey}
                        onSelect={setMemoryModule}
                        glowColor={glowColor}
                        ariaLabel={t("questions.q4_space.title")}
                      />
                    </>
                  )}

                  {/* Q5: Entry Protocol (Memory Module) */}
                  {step === 5 && (
                    <>
                      <div className="text-sm text-slate-600 font-medium">
                        {t("questions.q5_entry.title")}
                      </div>
                      <div className="text-[11px] text-slate-400 italic">
                        {t("questions.q5_entry.subtitle")}
                      </div>
                      <MemoryModule
                        id="q5_entry"
                        options={ENTRY_OPTIONS}
                        selectedKey={memoryModules.q5_entry.selectedKey}
                        onSelect={setMemoryModule}
                        glowColor={glowColor}
                        ariaLabel={t("questions.q5_entry.title")}
                      />
                    </>
                  )}

                  {/* Q6: Scrolling Rhythm (Power Dial) */}
                  {step === 6 && (
                    <>
                      <PowerDial
                        id="q6_scroll"
                        value={powerDials.q6_scroll.value}
                        onChange={setPowerDial}
                        leftLabel={t("questions.q6_scroll.left_label")}
                        rightLabel={t("questions.q6_scroll.right_label")}
                        color={glowColor}
                        ariaLabel={t("questions.q6_scroll.title")}
                      />
                      <div className="text-xs text-slate-500 font-light text-center">
                        {t("questions.q6_scroll.title")}
                      </div>
                    </>
                  )}

                  {/* Q7: Risk Appetite (Power Dial) */}
                  {step === 7 && (
                    <>
                      <PowerDial
                        id="q7_risk"
                        value={powerDials.q7_risk.value}
                        onChange={setPowerDial}
                        leftLabel={t("questions.q7_risk.left_label")}
                        rightLabel={t("questions.q7_risk.right_label")}
                        color={glowColor}
                        ariaLabel={t("questions.q7_risk.title")}
                      />
                      <div className="text-xs text-slate-500 font-light text-center">
                        {t("questions.q7_risk.title")}
                      </div>
                    </>
                  )}
                </GlassPanel>

                {/* Nav buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={prevStep}
                    disabled={step <= 1}
                    className="flex-1 py-2.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/20
                      text-sm text-slate-600 font-light
                      hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed
                      transition-all duration-300"
                    style={{ minHeight: 44 }}
                  >
                    {t("ui.back")}
                  </button>
                  <button
                    onClick={nextStep}
                    className="flex-1 py-2.5 rounded-xl bg-white/30 backdrop-blur-md border border-white/30
                      text-sm text-slate-700 font-medium
                      hover:bg-white/40 hover:border-white/40
                      transition-all duration-300"
                    style={{ minHeight: 44 }}
                  >
                    {step === 7 ? t("ui.finish") : t("ui.next")}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Onboarding */}
            {step === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4"
              >
                <GlassPanel
                  intensity="medium"
                  className="p-6 text-center space-y-4"
                >
                  <div className="text-2xl">🧬</div>
                  <h1 className="text-lg font-light text-slate-700 tracking-wide">
                    {t("app.title")}
                  </h1>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {t("app.subtitle")}
                  </p>
                  <button
                    onClick={() => setStep(1)}
                    className="w-full py-3 rounded-xl bg-white/40 backdrop-blur-md border border-white/40
                      text-slate-700 font-medium text-sm
                      hover:bg-white/50 transition-all duration-300
                      active:scale-[0.98]"
                    style={{ minHeight: 44 }}
                  >
                    {t("app.start_button")}
                  </button>
                </GlassPanel>
              </motion.div>
            )}

            {/* Result */}
            {step === 8 && isComplete && dominantArchetype && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4"
              >
                <GlassPanel
                  intensity="heavy"
                  className="p-5 space-y-4"
                  glowColor={glowColor}
                >
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest">
                    {t("results.your_archetype")}
                  </div>
                  <h2 className="text-xl font-light text-slate-800 tracking-wide">
                    {t(`archetypes.${dominantArchetype}`)}
                  </h2>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {t(`archetypes.${dominantArchetype}_desc`)}
                  </p>

                  {/* UI Theme metrics */}
                  <div className="space-y-2 pt-2 border-t border-white/20">
                    {[
                      { label: "Softness", key: "softness" as const },
                      { label: "Vibrancy", key: "vibrancy" as const },
                      { label: "Complexity", key: "complexity" as const },
                    ].map(({ label, key }) => (
                      <div
                        key={key}
                        className="flex items-center gap-2 text-[11px]"
                      >
                        <span className="w-20 text-slate-400">{label}</span>
                        <div className="flex-1 h-1 rounded-full bg-white/10">
                          <div
                            className="h-1 rounded-full transition-all duration-500"
                            style={{
                              width: `${uiTheme[key] * 100}%`,
                              backgroundColor: glowColor,
                            }}
                          />
                        </div>
                        <span className="w-8 text-right tabular-nums text-slate-600">
                          {Math.round(uiTheme[key] * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Style Tokens */}
                  <div className="pt-2 space-y-1">
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-2">
                      {t("results.style_tokens")}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded-lg bg-white/20">
                        <span className="text-slate-400">Radius</span>
                        <span className="ml-1.5 text-slate-600 font-medium tabular-nums">
                          {Math.round(uiTheme.softness * 44)}px
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-white/20">
                        <span className="text-slate-400">Blur</span>
                        <span className="ml-1.5 text-slate-600 font-medium tabular-nums">
                          {Math.round(uiTheme.complexity * 24)}px
                        </span>
                      </div>
                    </div>
                  </div>
                </GlassPanel>

                {/* AI Advisor */}
                <AIAdvisor />

                {/* Export Sequence */}
                <ExportSequence />

                {/* Order CTA — solid anchor button */}
                <button
                  id="cta-order-website"
                  className="w-full py-3.5 rounded-xl font-medium text-sm
                    bg-amber-200/80 backdrop-blur-md border border-amber-300/50
                    text-amber-800 hover:bg-amber-300/70
                    transition-all duration-300 active:scale-[0.98]
                    shadow-[0_4px_20px_rgba(251,191,36,0.2)]"
                  style={{ minHeight: 44 }}
                  onClick={() => {
                    soundEngine.play("pulse-confirm", 0);
                    // Package state for API call (Telegram/Email/CRM)
                    const payload = {
                      archetype: dominantArchetype,
                      scores: normalizedScores,
                      theme: uiTheme,
                      plan: projectPlan,
                      session: sessionId,
                    };
                    console.log("[CTA] Order payload ready:", payload);
                    // Placeholder: здесь — API-вызов
                    alert(
                      locale === "ru"
                        ? "Заявка сформирована! Лена свяжется с вами в ближайшее время."
                        : locale === "ar"
                          ? "تم تشكيل الطلب! ستتواصل لينا معك قريباً."
                          : "Request submitted! Lena will contact you shortly.",
                    );
                  }}
                >
                  {t("app.order_cta")}
                </button>

                <button
                  onClick={resetSession}
                  className="w-full py-2.5 rounded-xl text-sm text-slate-400 font-light
                    bg-transparent hover:text-slate-600 transition-colors duration-300"
                  style={{ minHeight: 44 }}
                >
                  ↺ Start new session
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.aside>

        {/* ============================================ */}
        {/* CENTRAL VIEWPORT — 3D Core + Living Plan     */}
        {/* ============================================ */}
        <motion.main
          className="relative order-2 min-h-[400px] md:min-h-[600px]"
          layout
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          <GlassPanel
            intensity="light"
            className="w-full h-full p-1 overflow-hidden"
          >
            {/* Living Plan — force-directed constellation (Phase 4) */}
            {children ? children : <LivingPlan className="w-full h-full" />}
          </GlassPanel>
        </motion.main>

        {/* ============================================ */}
        {/* RIGHT WING — Telemetry Panel                  */}
        {/* ============================================ */}
        <motion.aside
          className="flex flex-col gap-4 order-3"
          layout
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          {/* Radar */}
          <GlassPanel intensity="medium" className="p-4">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-3">
              Archetype Radar
            </div>
            <RadarChart
              scores={normalizedScores as any}
              brandPosition={radarPosition}
              dominantId={dominantArchetype}
            />
          </GlassPanel>

          {/* Harmony Score */}
          <GlassPanel intensity="light" className="p-4 space-y-2">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest">
              Harmony Score
            </div>
            <div className="text-2xl font-light text-slate-700 tabular-nums">
              {dominantArchetype
                ? Math.round((normalizedScores as any)[dominantArchetype] ?? 0)
                : "--"}
              %
            </div>
            <div className="text-[11px] text-slate-400">
              {dominantArchetype
                ? `Dominant: ${t(`archetypes.${dominantArchetype}`)}`
                : "Awaiting input…"}
            </div>
          </GlassPanel>

          {/* System Status */}
          <GlassPanel intensity="light" className="p-4 space-y-2">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest">
              System
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <div
                className={`w-1.5 h-1.5 rounded-full ${isHydrated ? "bg-emerald-400" : "bg-amber-400"}`}
              />
              {isHydrated ? "Session active" : "Initializing…"}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              Quality: {qualityManager.state.tier}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              {soundEngine.enabled ? "Sound: on" : "Sound: off"}
            </div>
          </GlassPanel>
        </motion.aside>
      </div>

      {/* ---- Onboarding overlay (blur background) ---- */}
      {step === 0 && (
        <div className="absolute inset-0 -z-5 backdrop-blur-[2px] pointer-events-none" />
      )}
    </div>
  );
};
