// HolographicShell — Unified holographic viewport v2.
// Single center: 3D sphere as background, questions float over it.
// No GlassPanel frames. Pure typography + sphere.
// Now at parity with DashboardShell: 8 questions, cultural context, Telegram CTA.

import React, { useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useArchetypeEngine } from "../useArchetypeEngine";
import { LanguageToggle } from "./LanguageToggle";
import { DynamicBackground } from "./DynamicBackground";
import { PastelSlider } from "./PastelSlider";
import { MemoryModule } from "./MemoryModule";
import { PowerDial } from "./PowerDial";
import { AIAdvisor } from "./AIAdvisor";
import { ExportSequence } from "./ExportSequence";
import { soundEngine } from "./SoundEngine";
import { qualityManager } from "./QualityManager";
import {
  getArchetypeMetaphor,
  getLocaleTypographyOverrides,
  type LocaleCode,
} from "../cultureLoader";

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

const Q4_OPTIONS = [
  {
    key: "scandinavian_library",
    label: {
      ru: "Скандинавская библиотека",
      en: "Scandinavian Library",
      ar: "مكتبة إسكندنافية",
    },
    desc: {
      ru: "Свет, порядок, тишина.",
      en: "Light, order, silence.",
      ar: "ضوء، نظام، صمت.",
    },
  },
  {
    key: "artistic_workshop",
    label: { ru: "Арт-мастерская", en: "Artistic Workshop", ar: "ورشة فنية" },
    desc: {
      ru: "Хаос, творчество, энергия.",
      en: "Chaos, creativity, energy.",
      ar: "فوضى، إبداع، طاقة.",
    },
  },
  {
    key: "infinite_field",
    label: {
      ru: "Бескрайнее поле",
      en: "Infinite Field at Dawn",
      ar: "حقل لا نهائي عند الفجر",
    },
    desc: {
      ru: "Горизонт, свобода, свежесть.",
      en: "Horizon, freedom, freshness.",
      ar: "أفق، حرية، نضارة.",
    },
  },
];

const Q5_OPTIONS = [
  {
    key: "quiet_whisper",
    label: { ru: "Тихий шёпот", en: "A Quiet Whisper", ar: "همسة هادئة" },
    desc: {
      ru: "Незаметно, но незабываемо.",
      en: "Subtle but unforgettable.",
      ar: "خفية لكن لا تُنسى.",
    },
  },
  {
    key: "confident_handshake",
    label: {
      ru: "Уверенное рукопожатие",
      en: "A Confident Handshake",
      ar: "مصافحة واثقة",
    },
    desc: {
      ru: "Прямо, сильно, ведущее.",
      en: "Direct, strong, leading.",
      ar: "مباشرة، قوية، قائدة.",
    },
  },
  {
    key: "infectious_laugh",
    label: {
      ru: "Заразительный смех",
      en: "An Infectious Laugh",
      ar: "ضحكة معدية",
    },
    desc: {
      ru: "Мгновенный центр внимания.",
      en: "Instant centre of attention.",
      ar: "مركز الاهتمام الفوري.",
    },
  },
];

interface Props {
  children?: ReactNode;
}

export const HolographicShell: React.FC<Props> = ({ children }) => {
  const e = useArchetypeEngine();
  const {
    sliders,
    setSlider,
    memoryModules,
    setMemoryModule,
    powerDials,
    setPowerDial,
    dominantArchetype,
    normalizedScores,
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
  } = e;

  const initRef = useRef(false);
  const loc = locale as "ru" | "en" | "ar";
  const accent = dominantArchetype
    ? (ACCENT[dominantArchetype] ?? "#7bbcd4")
    : "#7bbcd4";
  const totalSteps = 8; // diagnostic questions

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

  const T = {
    start:
      loc === "ru"
        ? "Начать диагностику"
        : loc === "ar"
          ? "ابدأ التشخيص"
          : "Begin Diagnosis",
    back: loc === "ru" ? "← Назад" : loc === "ar" ? "→ رجوع" : "← Back",
    next:
      step === totalSteps
        ? loc === "ru"
          ? "Завершить"
          : loc === "ar"
            ? "إنهاء"
            : "Finish"
        : loc === "ru"
          ? "Далее →"
          : loc === "ar"
            ? "→ التالي"
            : "Next →",
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
            ? "الحمض البصري"
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
            ? "ديناميكية UX"
            : "UX Dynamics",
    },
    q1l: loc === "ru" ? "Воздух" : loc === "ar" ? "هواء" : "Air",
    q1r: loc === "ru" ? "Плотность" : loc === "ar" ? "كثافة" : "Density",
    q2l: loc === "ru" ? "Органика" : loc === "ar" ? "عضوي" : "Organic",
    q2r:
      loc === "ru" ? "Архитектура" : loc === "ar" ? "هندسي" : "Architectural",
    q3l:
      loc === "ru"
        ? "Тихая роскошь"
        : loc === "ar"
          ? "فخامة هادئة"
          : "Quiet Luxury",
    q3r:
      loc === "ru"
        ? "Цифровая энергия"
        : loc === "ar"
          ? "طاقة رقمية"
          : "Digital Energy",
    q4p:
      loc === "ru"
        ? "Если бы бренд был пространством — где мы?"
        : loc === "ar"
          ? "لو كانت العلامة مكاناً — أين نحن؟"
          : "If the brand were a space — where are we?",
    q5p:
      loc === "ru"
        ? "Как бренд входит в комнату?"
        : loc === "ar"
          ? "كيف تدخل العلامة إلى الغرفة؟"
          : "How does the brand enter a room?",
    q6l: loc === "ru" ? "Текучий" : loc === "ar" ? "سلس" : "Fluid",
    q6r: loc === "ru" ? "Структурный" : loc === "ar" ? "منظم" : "Structured",
    q7l: loc === "ru" ? "Классика" : loc === "ar" ? "كلاسيكي" : "Classic",
    q7r: loc === "ru" ? "Авангард" : loc === "ar" ? "طليعي" : "Avant-garde",
    q8l:
      loc === "ru"
        ? "Тёплое свечение"
        : loc === "ar"
          ? "توهج دافئ"
          : "Warm Glow",
    q8r:
      loc === "ru"
        ? "Холодная чистота"
        : loc === "ar"
          ? "صفاء بارد"
          : "Cold Clarity",
    orderOk:
      loc === "ru"
        ? "Заявка сформирована!"
        : loc === "ar"
          ? "تم تشكيل الطلب!"
          : "Request submitted!",
    new:
      loc === "ru"
        ? "Новая сессия"
        : loc === "ar"
          ? "جلسة جديدة"
          : "New session",
    culturalLabel:
      loc === "ru"
        ? "Культурный код"
        : loc === "ar"
          ? "الرمز الثقافي"
          : "Cultural Code",
    softness: loc === "ru" ? "Мягкость" : "Softness",
    vibrancy:
      loc === "ru" ? "Насыщенность" : loc === "ar" ? "حيوية" : "Vibrancy",
    complexity:
      loc === "ru" ? "Сложность" : loc === "ar" ? "تعقيد" : "Complexity",
    hint:
      loc === "ru"
        ? "Здесь появится созвездие вашего бренда"
        : loc === "ar"
          ? "ستظهر هنا كوكبة علامتك التجارية"
          : "Your brand constellation will appear here",
  };

  const block =
    step >= 1 && step <= 3
      ? "a"
      : step >= 4 && step <= 5
        ? "b"
        : step >= 6 && step <= 8
          ? "c"
          : null;

  return (
    <div
      dir={direction}
      className="relative min-h-screen w-full overflow-hidden bg-[#0a0b10]"
      style={getLocaleTypographyOverrides(loc as LocaleCode)}
    >
      <DynamicBackground accentColor={accent} />

      {/* 3D Sphere — fills background */}
      <div className="absolute inset-0 z-0">{children}</div>

      {/* Grid overlay — subtle, reacts to complexity */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, ${accent} 1px, transparent 1px)`,
          backgroundSize: `${24 + uiTheme.complexity * 16}px ${24 + uiTheme.complexity * 16}px`,
        }}
      />

      {/* Top bar */}
      <div className="relative z-20 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        <span className="text-xs sm:text-sm tracking-[0.2em] text-slate-500 uppercase font-light">
          Archetype<span className="text-slate-700">OS</span>
        </span>
        <div className="flex items-center gap-3 sm:gap-4">
          {step >= 1 && step <= totalSteps && (
            <div className="hidden sm:flex gap-2 items-center">
              <span className="text-[10px] text-slate-600 uppercase tracking-wider mr-1">
                {block ? T.blocks[block] : ""}
              </span>
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
                <div
                  key={s}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${s === step ? "scale-125" : ""}`}
                  style={{
                    backgroundColor:
                      s === step ? accent : s < step ? "#475569" : "#1e293b",
                    boxShadow: s === step ? `0 0 6px ${accent}` : "none",
                  }}
                />
              ))}
            </div>
          )}
          {/* Mobile step indicator */}
          {step >= 1 && step <= totalSteps && (
            <span className="sm:hidden text-[11px] text-slate-500 font-light">
              {step}/{totalSteps}
            </span>
          )}
          <LanguageToggle locale={locale} onLocaleChange={setLocale} />
        </div>
      </div>

      {/* Content — centered, floating over sphere */}
      <div
        className="relative z-10 flex items-center justify-center px-4"
        style={{ minHeight: "calc(100vh - 180px)" }}
      >
        <AnimatePresence mode="wait">
          {/* STEP 0 — Onboarding */}
          {step === 0 && (
            <motion.div
              key="s0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center max-w-sm"
            >
              <h1 className="text-3xl sm:text-4xl font-light text-white tracking-wide mb-3">
                ArchetypeOS
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed mb-2">
                {loc === "ru"
                  ? "Диагностический инструмент для определения ДНК вашего бренда."
                  : loc === "ar"
                    ? "أداة تشخيصية لتحديد الحمض النووي لعلامتك التجارية."
                    : "A diagnostic tool to determine your brand's DNA."}
              </p>
              <p className="text-xs text-slate-600 mb-8">
                {loc === "ru"
                  ? "8 вопросов — и вы узнаете свой архетип."
                  : loc === "ar"
                    ? "٨ أسئلة — وستعرف نمطك الأصلي."
                    : "8 questions — and you'll know your archetype."}
              </p>
              <button
                onClick={() => setStep(1)}
                className="px-8 py-3 rounded-full text-sm font-medium border transition-all tracking-wide
                  bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 active:scale-[0.98]"
                style={{ minHeight: 52 }}
              >
                {T.start}
              </button>
            </motion.div>
          )}

          {/* STEPS 1-8 — Diagnostic */}
          {step >= 1 && step <= totalSteps && (
            <motion.div
              key={`q${step}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-md space-y-5"
            >
              {/* Block header */}
              {block && (
                <div className="text-center">
                  <span className="text-[10px] text-slate-600 uppercase tracking-[0.3em]">
                    {T.blocks[block]}
                  </span>
                </div>
              )}
              {step === 1 && (
                <PastelSlider
                  id="q1_density"
                  value={sliders.q1_density.value}
                  onChange={setSlider}
                  leftColor="#334155"
                  rightColor={accent}
                  leftLabel={T.q1l}
                  rightLabel={T.q1r}
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
                  leftLabel={T.q2l}
                  rightLabel={T.q2r}
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
                  leftLabel={T.q3l}
                  rightLabel={T.q3r}
                  ariaLabel="Temperature"
                />
              )}
              {step === 4 && (
                <div className="space-y-3">
                  <p className="text-sm text-slate-400 font-light text-center">
                    {T.q4p}
                  </p>
                  <MemoryModule
                    id="q4_space"
                    options={Q4_OPTIONS.map((o) => ({
                      key: o.key,
                      label: o.label[loc] ?? o.label.en,
                      desc: o.desc[loc] ?? o.desc.en,
                    }))}
                    selectedKey={memoryModules.q4_space.selectedKey}
                    onSelect={setMemoryModule}
                    glowColor={accent}
                  />
                </div>
              )}
              {step === 5 && (
                <div className="space-y-3">
                  <p className="text-sm text-slate-400 font-light text-center">
                    {T.q5p}
                  </p>
                  <MemoryModule
                    id="q5_entry"
                    options={Q5_OPTIONS.map((o) => ({
                      key: o.key,
                      label: o.label[loc] ?? o.label.en,
                      desc: o.desc[loc] ?? o.desc.en,
                    }))}
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
                  leftLabel={T.q6l}
                  rightLabel={T.q6r}
                  color={accent}
                />
              )}
              {step === 7 && (
                <PowerDial
                  id="q7_risk"
                  value={powerDials.q7_risk.value}
                  onChange={setPowerDial}
                  leftLabel={T.q7l}
                  rightLabel={T.q7r}
                  color={accent}
                />
              )}
              {step === 8 && (
                <PowerDial
                  id="q8_aura"
                  value={powerDials.q8_aura.value}
                  onChange={setPowerDial}
                  leftLabel={T.q8l}
                  rightLabel={T.q8r}
                  color={accent}
                />
              )}
            </motion.div>
          )}

          {/* STEP 9 — Result */}
          {step === 9 && isComplete && dominantArchetype && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-md space-y-5 max-h-[80vh] overflow-y-auto scrollbar-hide"
            >
              {/* Archetype identity */}
              <div className="space-y-2 text-center">
                <div className="text-[10px] text-slate-600 uppercase tracking-[0.3em]">
                  Brand Archetype
                </div>
                <h2 className="text-3xl font-light text-white">
                  {t(`archetypes.${dominantArchetype}`)}
                </h2>
                <p className="text-sm text-slate-500">
                  {t(`archetypes.${dominantArchetype}_desc`)}
                </p>
              </div>

              {/* Cultural metaphor */}
              {(() => {
                const m = getArchetypeMetaphor(
                  dominantArchetype,
                  loc as LocaleCode,
                );
                if (!m) return null;
                return (
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                    <div className="text-[9px] text-slate-600 uppercase tracking-widest">
                      {T.culturalLabel}
                    </div>
                    <p className="text-xs text-slate-400 italic">
                      «{m.primary_metaphor}»
                    </p>
                    <p className="text-[10px] text-slate-600">{m.visual}</p>
                  </div>
                );
              })()}

              {/* Theme bars */}
              <div className="space-y-2">
                {[
                  { label: T.softness, key: "softness" as const },
                  { label: T.vibrancy, key: "vibrancy" as const },
                  { label: T.complexity, key: "complexity" as const },
                ].map(({ label, key }) => (
                  <div
                    key={key}
                    className="flex items-center gap-3 text-[11px]"
                  >
                    <span className="w-24 text-slate-500">{label}</span>
                    <div className="flex-1 h-1 rounded-full bg-white/[0.06]">
                      <div
                        className="h-1 rounded-full transition-all duration-500"
                        style={{
                          width: `${uiTheme[key] * 100}%`,
                          backgroundColor: accent,
                        }}
                      />
                    </div>
                    <span className="w-8 text-right tabular-nums text-slate-600 font-medium">
                      {Math.round(uiTheme[key] * 100)}%
                    </span>
                  </div>
                ))}
              </div>

              <AIAdvisor />
              <ExportSequence />

              {/* CTA — Telegram */}
              <button
                id="cta-order"
                onClick={() => {
                  soundEngine.play("pulse-confirm", 0);
                  const label = t(`archetypes.${dominantArchetype}`);
                  const score = Math.round(
                    (normalizedScores as any)[dominantArchetype] ?? 0,
                  );
                  const soft = Math.round(uiTheme.softness * 100);
                  const vibr = Math.round(uiTheme.vibrancy * 100);
                  const comp = Math.round(uiTheme.complexity * 100);
                  const msg = encodeURIComponent(
                    `ArchetypeOS — запрос на сайт\nАрхетип: ${label} (${score}%)\nSoftness ${soft}% · Vibrancy ${vibr}% · Complexity ${comp}%`,
                  );
                  window.open(`https://t.me/elenachinfo?text=${msg}`, "_blank");
                }}
                className="w-full py-3.5 rounded-full font-medium text-sm border transition-all active:scale-[0.98]"
                style={{
                  minHeight: 56,
                  backgroundColor: accent + "12",
                  borderColor: accent + "35",
                  color: accent,
                }}
              >
                {T.order}
              </button>

              <button
                onClick={resetSession}
                className="w-full py-2 text-xs text-slate-600 hover:text-slate-400 transition-colors"
                style={{ minHeight: 44 }}
              >
                {T.new}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav — fixed at bottom */}
      {step >= 1 && step <= totalSteps && (
        <div className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          <button
            onClick={prevStep}
            disabled={step <= 1}
            className="px-5 py-2.5 rounded-full text-xs font-medium bg-white/5 border border-white/10
              text-slate-500 hover:text-white hover:border-white/20 disabled:opacity-20 transition-all"
            style={{ minHeight: 48 }}
          >
            {T.back}
          </button>
          <button
            onClick={nextStep}
            className="px-5 py-2.5 rounded-full text-xs font-medium border transition-all active:scale-[0.98]"
            style={{
              minHeight: 48,
              borderColor: accent + "44",
              color: accent,
              backgroundColor: accent + "0a",
            }}
          >
            {T.next}
          </button>
        </div>
      )}
    </div>
  );
};
