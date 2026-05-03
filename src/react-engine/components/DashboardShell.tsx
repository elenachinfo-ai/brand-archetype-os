// =============================================================================
// DashboardShell v2 — Clean, obvious structure.
// Layout: Left (Input) + Center (3D Core) + Right (Telemetry).
// Step flow: Onboarding → Block A (Q1-3) → Block B (Q4-5) → Block C (Q6-7) → Result
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

// ---- Archetype glow colors ----
const GLOW: Record<string, string> = {
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

// ---- Question block definitions ----
const BLOCK_TITLES: Record<string, Record<string, string>> = {
  ru: { a: "🎯 Визуальное ДНК", b: "🏛️ Метафоры бренда", c: "🎚️ Динамика UX" },
  en: { a: "🎯 Visual DNA", b: "🏛️ Brand Metaphors", c: "🎚️ UX Dynamics" },
  ar: {
    a: "🎯 الحمض النووي البصري",
    b: "🏛️ استعارات العلامة التجارية",
    c: "🎚️ ديناميكيات UX",
  },
};

// ---- Memory module options ----
const Q4_OPTIONS = [
  {
    key: "scandinavian_library",
    label: "📚 Скандинавская библиотека",
    desc: "Свет, порядок, тишина.",
  },
  {
    key: "artistic_workshop",
    label: "🎨 Арт-мастерская",
    desc: "Творчество, энергия, свобода.",
  },
  {
    key: "infinite_field",
    label: "🌅 Бескрайнее поле на рассвете",
    desc: "Горизонт, свежесть, открытие.",
  },
];

const Q5_OPTIONS = [
  {
    key: "quiet_whisper",
    label: "🌙 Тихий шёпот",
    desc: "Незаметно, но незабываемо.",
  },
  {
    key: "confident_handshake",
    label: "🤝 Уверенное рукопожатие",
    desc: "Прямо, сильно, ведущее.",
  },
  {
    key: "infectious_laugh",
    label: "✨ Заразительный смех",
    desc: "Мгновенный центр внимания.",
  },
];

// ---- Archetype drone frequencies ----
const DRONE_FREQ: Record<string, number> = {
  ruler: 196,
  creator: 293.66,
  sage: 246.94,
  innocent: 329.63,
  explorer: 261.63,
  hero: 220,
  magician: 349.23,
  outlaw: 174.61,
  jester: 311.13,
  lover: 277.18,
  caregiver: 233.08,
  everyman: 261.63,
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

interface DashboardShellProps {
  children?: ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ children }) => {
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
  } = engine;

  const initRef = useRef(false);

  // ---- Init ----
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    hydrate();
    qualityManager.start();
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

  // ---- Ambient drone ----
  useEffect(() => {
    if (dominantArchetype && isComplete) {
      soundEngine.startDrone(DRONE_FREQ[dominantArchetype] ?? 220);
    } else {
      soundEngine.stopDrone();
    }
  }, [dominantArchetype, isComplete]);

  const glow = dominantArchetype
    ? (GLOW[dominantArchetype] ?? "#CFFFE5")
    : "#CFFFE5";
  const loc = locale as "ru" | "en" | "ar";
  const isRTL = direction === "rtl";
  const totalSteps = 8; // 0=start, 1-3=BlockA, 4-5=BlockB, 6-7=BlockC, 8=result

  // Determine current block
  const currentBlock =
    step >= 1 && step <= 3
      ? "a"
      : step >= 4 && step <= 5
        ? "b"
        : step >= 6 && step <= 7
          ? "c"
          : null;
  const stepLabel =
    step === 0
      ? "Старт"
      : currentBlock
        ? `${BLOCK_TITLES[loc]?.[currentBlock] ?? ""} · ${step}/7`
        : step === 8
          ? "Результат"
          : "";

  // ---- Button text helpers ----
  const btnBack = loc === "ru" ? "← Назад" : loc === "ar" ? "→ رجوع" : "← Back";
  const btnNext =
    step === 7
      ? loc === "ru"
        ? "Завершить ✓"
        : loc === "ar"
          ? "إنهاء ✓"
          : "Finish ✓"
      : loc === "ru"
        ? "Далее →"
        : loc === "ar"
          ? "→ التالي"
          : "Next →";
  const btnStart =
    loc === "ru"
      ? "🚀 Начать диагностику"
      : loc === "ar"
        ? "🚀 ابدأ التشخيص"
        : "🚀 Begin Diagnosis";
  const btnOrder =
    loc === "ru"
      ? "💎 Заказать сайт по архетипу"
      : loc === "ar"
        ? "💎 اطلب موقعاً حسب النمط"
        : "💎 Order Website by Archetype";

  return (
    <div
      dir={direction}
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        fontFamily: isRTL
          ? "'IBM Plex Sans Arabic','Tajawal',sans-serif"
          : "'Inter','Manrope',sans-serif",
      }}
    >
      <DynamicBackground
        softness={uiTheme.softness}
        vibrancy={uiTheme.vibrancy}
      />

      {/* ---- Top bar ---- */}
      <div className="relative z-20 flex items-center justify-between px-4 py-3 max-w-[1440px] mx-auto">
        <div className="text-sm font-light tracking-[0.2em] text-slate-600 uppercase select-none">
          Archetype<span className="text-slate-400">OS</span>
        </div>
        <div className="flex items-center gap-3">
          {stepLabel && (
            <span className="text-[11px] text-slate-400 font-light hidden sm:inline">
              {stepLabel}
            </span>
          )}
          <LanguageToggle locale={locale} onLocaleChange={setLocale} />
        </div>
      </div>

      {/* ---- Main grid ---- */}
      <div
        className="relative z-10 grid gap-4 px-4 pb-6 max-w-[1440px] mx-auto
        grid-cols-1 md:grid-cols-[300px_1fr_280px] lg:grid-cols-[340px_1fr_300px]"
      >
        {/* ======== LEFT PANEL: Input ======== */}
        <AnimatePresence mode="wait">
          <motion.aside
            key={`left-${step}`}
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-3"
          >
            {/* ---- STEP 0: Onboarding ---- */}
            {step === 0 && (
              <GlassPanel
                intensity="medium"
                className="p-6 text-center space-y-4"
              >
                <div className="text-3xl">🧬</div>
                <h1 className="text-lg font-light text-slate-700 tracking-wide">
                  ArchetypeOS
                </h1>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {loc === "ru"
                    ? "Диагностический инструмент для определения ДНК вашего бренда. 7 вопросов — и вы узнаете свой архетип, получите палитру, шрифты и структуру сайта."
                    : loc === "ar"
                      ? "أداة تشخيصية لتحديد الحمض النووي لعلامتك التجارية. ٧ أسئلة — وستعرف نمطك الأصلي ولوحة الألوان والخطوط وهيكل الموقع."
                      : "A diagnostic tool to determine your brand's DNA. 7 questions — and you'll know your archetype, color palette, fonts, and site structure."}
                </p>
                <button
                  onClick={() => setStep(1)}
                  className="w-full py-3 rounded-xl bg-white/45 backdrop-blur-md border border-white/40
                    text-slate-700 font-medium hover:bg-white/60 transition-all active:scale-[0.98]"
                  style={{ minHeight: 48 }}
                >
                  {btnStart}
                </button>
              </GlassPanel>
            )}

            {/* ---- STEPS 1-7: Diagnostic ---- */}
            {step >= 1 && step <= 7 && (
              <>
                <GlassPanel intensity="medium" className="p-4 space-y-4">
                  {/* Block header */}
                  {currentBlock && (
                    <div className="text-xs text-slate-400 uppercase tracking-widest">
                      {BLOCK_TITLES[loc]?.[currentBlock]}
                    </div>
                  )}

                  {/* Q1: Density slider */}
                  {step === 1 && (
                    <PastelSlider
                      id="q1_density"
                      value={sliders.q1_density.value}
                      onChange={setSlider}
                      leftColor="#F0F8FF"
                      rightColor="#FFE4E1"
                      leftLabel={
                        loc === "ru" ? "Воздух" : loc === "ar" ? "هواء" : "Air"
                      }
                      rightLabel={
                        loc === "ru"
                          ? "Плотность"
                          : loc === "ar"
                            ? "كثافة"
                            : "Density"
                      }
                      ariaLabel={
                        loc === "ru" ? "Плотность материи" : "Density of Matter"
                      }
                    />
                  )}

                  {/* Q2: Geometry slider */}
                  {step === 2 && (
                    <PastelSlider
                      id="q2_geometry"
                      value={sliders.q2_geometry.value}
                      onChange={setSlider}
                      leftColor="#E6E6FA"
                      rightColor="#CFFFE5"
                      leftLabel={
                        loc === "ru"
                          ? "Органика"
                          : loc === "ar"
                            ? "عضوي"
                            : "Organic"
                      }
                      rightLabel={
                        loc === "ru"
                          ? "Архитектура"
                          : loc === "ar"
                            ? "هندسي"
                            : "Architectural"
                      }
                      ariaLabel={
                        loc === "ru"
                          ? "Геометрия характера"
                          : "Geometry of Character"
                      }
                    />
                  )}

                  {/* Q3: Temperature slider */}
                  {step === 3 && (
                    <PastelSlider
                      id="q3_temperature"
                      value={sliders.q3_temperature.value}
                      onChange={setSlider}
                      leftColor="#F5FFFA"
                      rightColor="#FFE4E1"
                      leftLabel={
                        loc === "ru"
                          ? "Тихая роскошь"
                          : loc === "ar"
                            ? "فخامة هادئة"
                            : "Quiet Luxury"
                      }
                      rightLabel={
                        loc === "ru"
                          ? "Цифровая энергия"
                          : loc === "ar"
                            ? "طاقة رقمية"
                            : "Digital Energy"
                      }
                      ariaLabel={
                        loc === "ru"
                          ? "Световая температура"
                          : "Luminous Temperature"
                      }
                    />
                  )}

                  {/* Q4: Spatial resonance */}
                  {step === 4 && (
                    <div className="space-y-3">
                      <p className="text-sm text-slate-600 font-medium">
                        {loc === "ru"
                          ? "Если бы бренд был пространством — где мы?"
                          : loc === "ar"
                            ? "لو كانت العلامة التجارية مكاناً — أين نحن؟"
                            : "If the brand were a space — where are we?"}
                      </p>
                      <MemoryModule
                        id="q4_space"
                        options={Q4_OPTIONS}
                        selectedKey={memoryModules.q4_space.selectedKey}
                        onSelect={setMemoryModule}
                        glowColor={glow}
                      />
                    </div>
                  )}

                  {/* Q5: Entry protocol */}
                  {step === 5 && (
                    <div className="space-y-3">
                      <p className="text-sm text-slate-600 font-medium">
                        {loc === "ru"
                          ? "Как бренд входит в комнату?"
                          : loc === "ar"
                            ? "كيف تدخل العلامة التجارية إلى الغرفة؟"
                            : "How does the brand enter a room?"}
                      </p>
                      <MemoryModule
                        id="q5_entry"
                        options={Q5_OPTIONS}
                        selectedKey={memoryModules.q5_entry.selectedKey}
                        onSelect={setMemoryModule}
                        glowColor={glow}
                      />
                    </div>
                  )}

                  {/* Q6: Scroll rhythm */}
                  {step === 6 && (
                    <PowerDial
                      id="q6_scroll"
                      value={powerDials.q6_scroll.value}
                      onChange={setPowerDial}
                      leftLabel={
                        loc === "ru"
                          ? "Текучий"
                          : loc === "ar"
                            ? "سلس"
                            : "Fluid"
                      }
                      rightLabel={
                        loc === "ru"
                          ? "Структурный"
                          : loc === "ar"
                            ? "منظم"
                            : "Structured"
                      }
                      color={glow}
                      ariaLabel="Scrolling Rhythm"
                    />
                  )}

                  {/* Q7: Risk appetite */}
                  {step === 7 && (
                    <PowerDial
                      id="q7_risk"
                      value={powerDials.q7_risk.value}
                      onChange={setPowerDial}
                      leftLabel={
                        loc === "ru"
                          ? "Классика"
                          : loc === "ar"
                            ? "كلاسيكي"
                            : "Classic"
                      }
                      rightLabel={
                        loc === "ru"
                          ? "Авангард"
                          : loc === "ar"
                            ? "طليعي"
                            : "Avant-garde"
                      }
                      color={glow}
                      ariaLabel="Risk Appetite"
                    />
                  )}
                </GlassPanel>

                {/* Nav buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={prevStep}
                    disabled={step <= 1}
                    className="flex-1 py-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/20
                      text-sm text-slate-600 font-medium hover:bg-white/30 disabled:opacity-25 disabled:cursor-not-allowed
                      transition-all"
                    style={{ minHeight: 48 }}
                  >
                    {btnBack}
                  </button>
                  <button
                    onClick={nextStep}
                    className="flex-1 py-3 rounded-xl bg-white/35 backdrop-blur-md border border-white/30
                      text-sm text-slate-700 font-semibold hover:bg-white/50 transition-all"
                    style={{ minHeight: 48 }}
                  >
                    {btnNext}
                  </button>
                </div>
              </>
            )}

            {/* ---- STEP 8: Result ---- */}
            {step === 8 && isComplete && dominantArchetype && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-3"
              >
                <GlassPanel
                  intensity="heavy"
                  className="p-5 space-y-4"
                  glowColor={glow}
                >
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest">
                    Brand Archetype
                  </div>
                  <h2 className="text-xl font-light text-slate-800">
                    {t(`archetypes.${dominantArchetype}`)}
                  </h2>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {t(`archetypes.${dominantArchetype}_desc`)}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-white/20">
                    {[
                      {
                        label: loc === "ru" ? "Мягкость" : "Softness",
                        key: "softness" as const,
                      },
                      {
                        label: loc === "ru" ? "Насыщенность" : "Vibrancy",
                        key: "vibrancy" as const,
                      },
                      {
                        label: loc === "ru" ? "Сложность" : "Complexity",
                        key: "complexity" as const,
                      },
                    ].map(({ label, key }) => (
                      <div
                        key={key}
                        className="flex items-center gap-2 text-[11px]"
                      >
                        <span className="w-24 text-slate-400">{label}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-white/10">
                          <div
                            className="h-1.5 rounded-full transition-all duration-500"
                            style={{
                              width: `${uiTheme[key] * 100}%`,
                              backgroundColor: glow,
                            }}
                          />
                        </div>
                        <span className="w-8 text-right tabular-nums text-slate-600 font-medium">
                          {Math.round(uiTheme[key] * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-lg bg-white/20">
                      <span className="text-slate-400">Radius </span>
                      <span className="text-slate-700 font-medium">
                        {Math.round(4 + uiTheme.softness * 40)}px
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-white/20">
                      <span className="text-slate-400">Blur </span>
                      <span className="text-slate-700 font-medium">
                        {Math.round(4 + uiTheme.complexity * 22)}px
                      </span>
                    </div>
                  </div>
                </GlassPanel>

                <AIAdvisor />
                <ExportSequence />

                <button
                  id="cta-order-website"
                  onClick={() => {
                    soundEngine.play("pulse-confirm", 0);
                    const payload = {
                      archetype: dominantArchetype,
                      scores: normalizedScores,
                      theme: uiTheme,
                      plan: projectPlan,
                    };
                    alert(
                      loc === "ru"
                        ? "Заявка сформирована! Лена свяжется с вами."
                        : loc === "ar"
                          ? "تم تشكيل الطلب! ستتواصل معك لينا."
                          : "Request submitted! Lena will contact you.",
                    );
                  }}
                  className="w-full py-4 rounded-xl font-semibold text-sm bg-amber-200/80 border border-amber-300/50
                    text-amber-800 hover:bg-amber-300/70 transition-all active:scale-[0.98] shadow-[0_4px_20px_rgba(251,191,36,0.2)]"
                  style={{ minHeight: 52 }}
                >
                  {btnOrder}
                </button>

                <button
                  onClick={resetSession}
                  className="w-full py-2.5 text-xs text-slate-400 font-light bg-transparent hover:text-slate-600 transition-colors"
                  style={{ minHeight: 44 }}
                >
                  ↺{" "}
                  {loc === "ru"
                    ? "Новая сессия"
                    : loc === "ar"
                      ? "جلسة جديدة"
                      : "New session"}
                </button>
              </motion.div>
            )}
          </motion.aside>
        </AnimatePresence>

        {/* ======== CENTER: 3D Core + LivingPlan ======== */}
        <motion.main
          layout
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="relative min-h-[350px] md:min-h-[550px] order-2"
        >
          <GlassPanel
            intensity="light"
            className="w-full h-full p-1 overflow-hidden"
          >
            {children ? children : <LivingPlan className="w-full h-full" />}
          </GlassPanel>
          {/* Hint text when idle */}
          {step === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-sm text-slate-400 font-light bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2">
                {loc === "ru"
                  ? "Здесь появится созвездие вашего бренда"
                  : loc === "ar"
                    ? "ستظهر هنا كوكبة علامتك التجارية"
                    : "Your brand constellation will appear here"}
              </p>
            </div>
          )}
        </motion.main>

        {/* ======== RIGHT PANEL: Telemetry ======== */}
        <motion.aside
          layout
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="flex flex-col gap-3 order-3"
        >
          <GlassPanel intensity="medium" className="p-4">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-2">
              {loc === "ru" ? "Радар архетипов" : "Archetype Radar"}
            </div>
            <RadarChart
              scores={normalizedScores as any}
              brandPosition={radarPosition}
              dominantId={dominantArchetype}
            />
          </GlassPanel>

          <GlassPanel intensity="light" className="p-4">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">
              {loc === "ru" ? "Гармония" : "Harmony"}
            </div>
            <div className="text-2xl font-light text-slate-700 tabular-nums">
              {dominantArchetype
                ? `${Math.round((normalizedScores as any)[dominantArchetype] ?? 0)}%`
                : "--"}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {dominantArchetype
                ? t(`archetypes.${dominantArchetype}`)
                : loc === "ru"
                  ? "Ожидание ввода..."
                  : "Awaiting input..."}
            </div>
          </GlassPanel>

          <GlassPanel
            intensity="light"
            className="p-4 space-y-2 text-[11px] text-slate-500"
          >
            <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">
              {loc === "ru" ? "Система" : "System"}
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-1.5 h-1.5 rounded-full ${isHydrated ? "bg-emerald-400" : "bg-amber-400"}`}
              />
              {isHydrated
                ? loc === "ru"
                  ? "Сессия активна"
                  : "Session active"
                : loc === "ru"
                  ? "Загрузка..."
                  : "Loading..."}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              GPU: {qualityManager.state.tier}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              {soundEngine.enabled
                ? loc === "ru"
                  ? "Звук: вкл"
                  : "Sound: on"
                : loc === "ru"
                  ? "Звук: выкл"
                  : "Sound: off"}
            </div>
          </GlassPanel>
        </motion.aside>
      </div>
    </div>
  );
};
