// HolographicShell — Unified holographic viewport.
// Single center: 3D sphere in background, questions/text float over it.
// No frames. No panels. Pure typography + sphere.

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

const ACCENT: Record<string, string> = {
  ruler: "#D4AF37", creator: "#E91E63", sage: "#7E57C2", innocent: "#AED581",
  explorer: "#26C6DA", hero: "#FF7043", magician: "#AB47BC", outlaw: "#FF5722",
  jester: "#FFAB00", lover: "#F06292", caregiver: "#43A047", everyman: "#8D6E63",
};

const Q4 = [
  { key: "scandinavian_library", label: "Scandinavian Library", desc: "Light, order, silence." },
  { key: "artistic_workshop", label: "Artistic Workshop", desc: "Chaos, creativity, energy." },
  { key: "infinite_field", label: "Infinite Field at Dawn", desc: "Horizon, freedom, freshness." },
];

const Q5 = [
  { key: "quiet_whisper", label: "A Quiet Whisper", desc: "Subtle but unforgettable." },
  { key: "confident_handshake", label: "A Confident Handshake", desc: "Direct, strong, leading." },
  { key: "infectious_laugh", label: "An Infectious Laugh", desc: "Instant centre of attention." },
];

interface Props { children?: ReactNode }

export const HolographicShell: React.FC<Props> = ({ children }) => {
  const e = useArchetypeEngine();
  const {
    sliders, setSlider, memoryModules, setMemoryModule, powerDials, setPowerDial,
    dominantArchetype, normalizedScores, uiTheme,
    step, nextStep, prevStep, setStep,
    locale, setLocale, direction,
    isHydrated, hydrate, resetSession, isComplete, t,
  } = e;

  const initRef = useRef(false);
  const loc = locale as "ru" | "en" | "ar";
  const accent = dominantArchetype ? (ACCENT[dominantArchetype] ?? "#7bbcd4") : "#7bbcd4";

  useEffect(() => {
    if (initRef.current) return; initRef.current = true;
    hydrate(); qualityManager.start();
    const s = () => { soundEngine.init(); document.removeEventListener("pointerdown", s); };
    document.addEventListener("pointerdown", s);
    return () => { qualityManager.stop(); document.removeEventListener("pointerdown", s); };
  }, []);

  const T = {
    start: loc === "ru" ? "Начать диагностику" : "Begin Diagnosis",
    back: loc === "ru" ? "Назад" : "Back",
    next: step === 7 ? (loc === "ru" ? "Завершить" : "Finish") : (loc === "ru" ? "Далее" : "Next"),
    order: loc === "ru" ? "Заказать сайт по архетипу" : "Order Website by Archetype",
    blocks: { a: loc === "ru" ? "Визуальное ДНК" : "Visual DNA", b: loc === "ru" ? "Метафоры бренда" : "Brand Metaphors", c: loc === "ru" ? "Динамика UX" : "UX Dynamics" },
    q1l: loc === "ru" ? "Воздух" : "Air", q1r: loc === "ru" ? "Плотность" : "Density",
    q2l: loc === "ru" ? "Органика" : "Organic", q2r: loc === "ru" ? "Архитектура" : "Architectural",
    q3l: loc === "ru" ? "Тихая роскошь" : "Quiet Luxury", q3r: loc === "ru" ? "Цифровая энергия" : "Digital Energy",
    q4p: loc === "ru" ? "Если бы бренд был пространством — где мы?" : "If the brand were a space — where are we?",
    q5p: loc === "ru" ? "Как бренд входит в комнату?" : "How does the brand enter a room?",
    q6l: loc === "ru" ? "Текучий" : "Fluid", q6r: loc === "ru" ? "Структурный" : "Structured",
    q7l: loc === "ru" ? "Классика" : "Classic", q7r: loc === "ru" ? "Авангард" : "Avant-garde",
    orderOk: loc === "ru" ? "Заявка сформирована!" : "Request submitted!",
    new: loc === "ru" ? "Новая сессия" : "New session",
  };

  const block = step >= 1 && step <= 3 ? "a" : step >= 4 && step <= 5 ? "b" : step >= 6 && step <= 7 ? "c" : null;

  return (
    <div dir={direction} className="relative min-h-screen w-full overflow-hidden bg-[#0a0b10]"
      style={{ fontFamily: direction === "rtl" ? "'IBM Plex Sans Arabic','Tajawal',sans-serif" : "'Inter','Manrope',sans-serif" }}>
      <DynamicBackground accentColor={accent} />

      {/* 3D Sphere — fills background */}
      <div className="absolute inset-0 z-0">{children}</div>

      {/* Top bar */}
      <div className="relative z-20 flex items-center justify-between px-6 py-4">
        <span className="text-xs tracking-[0.25em] text-slate-600 uppercase">Archetype<span className="text-slate-800">OS</span></span>
        <div className="flex items-center gap-4">
          {step >= 1 && step <= 7 && (
            <div className="flex gap-2 items-center">
              <span className="text-[10px] text-slate-600 uppercase tracking-wider mr-1">{block ? T.blocks[block] : ""}</span>
              {[1, 2, 3, 4, 5, 6, 7].map(s => (
                <div key={s} className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${s === step ? "scale-125" : ""}`}
                  style={{ backgroundColor: s === step ? accent : s < step ? "#64748b" : "#1e293b", boxShadow: s === step ? `0 0 6px ${accent}` : "none" }} />
              ))}
            </div>
          )}
          <LanguageToggle locale={locale} onLocaleChange={setLocale} />
        </div>
      </div>

      {/* Content — centered, floating over sphere */}
      <div className="relative z-10 flex items-center justify-center" style={{ minHeight: "calc(100vh - 160px)" }}>
        <AnimatePresence mode="wait">
          {/* STEP 0 */}
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-center max-w-sm">
              <h1 className="text-3xl font-light text-white tracking-wide mb-3">ArchetypeOS</h1>
              <p className="text-sm text-slate-500 leading-relaxed mb-8">
                {loc === "ru" ? "Определите ДНК вашего бренда за 7 шагов." : "Determine your brand's DNA in 7 steps."}
              </p>
              <button onClick={() => setStep(1)}
                className="px-8 py-3 rounded-full text-sm font-medium border transition-all tracking-wide
                  bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20"
                style={{ minHeight: 48 }}>{T.start}</button>
            </motion.div>
          )}

          {/* STEPS 1-7 */}
          {step >= 1 && step <= 7 && (
            <motion.div key={`q${step}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="w-full max-w-md px-4 space-y-5">
              {step === 1 && <PastelSlider id="q1_density" value={sliders.q1_density.value} onChange={setSlider} leftColor="#334155" rightColor={accent} leftLabel={T.q1l} rightLabel={T.q1r} ariaLabel="Density" />}
              {step === 2 && <PastelSlider id="q2_geometry" value={sliders.q2_geometry.value} onChange={setSlider} leftColor="#334155" rightColor={accent} leftLabel={T.q2l} rightLabel={T.q2r} ariaLabel="Geometry" />}
              {step === 3 && <PastelSlider id="q3_temperature" value={sliders.q3_temperature.value} onChange={setSlider} leftColor="#334155" rightColor={accent} leftLabel={T.q3l} rightLabel={T.q3r} ariaLabel="Temperature" />}
              {step === 4 && <div className="space-y-3"><p className="text-sm text-slate-400 font-light">{T.q4p}</p><MemoryModule id="q4_space" options={Q4} selectedKey={memoryModules.q4_space.selectedKey} onSelect={setMemoryModule} glowColor={accent} /></div>}
              {step === 5 && <div className="space-y-3"><p className="text-sm text-slate-400 font-light">{T.q5p}</p><MemoryModule id="q5_entry" options={Q5} selectedKey={memoryModules.q5_entry.selectedKey} onSelect={setMemoryModule} glowColor={accent} /></div>}
              {step === 6 && <PowerDial id="q6_scroll" value={powerDials.q6_scroll.value} onChange={setPowerDial} leftLabel={T.q6l} rightLabel={T.q6r} color={accent} />}
              {step === 7 && <PowerDial id="q7_risk" value={powerDials.q7_risk.value} onChange={setPowerDial} leftLabel={T.q7l} rightLabel={T.q7r} color={accent} />}
            </motion.div>
          )}

          {/* STEP 8 — Result */}
          {step === 8 && isComplete && dominantArchetype && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="w-full max-w-md px-4 space-y-5 max-h-[80vh] overflow-y-auto">
              <div className="space-y-2">
                <div className="text-[10px] text-slate-600 uppercase tracking-[0.3em]">Brand Archetype</div>
                <h2 className="text-3xl font-light text-white">{t(`archetypes.${dominantArchetype}`)}</h2>
                <p className="text-sm text-slate-500">{t(`archetypes.${dominantArchetype}_desc`)}</p>
              </div>
              <AIAdvisor />
              <ExportSequence />
              <button id="cta-order" onClick={() => { soundEngine.play("pulse-confirm", 0); alert(T.orderOk); }}
                className="w-full py-3.5 rounded-full font-medium text-sm border transition-all"
                style={{ minHeight: 52, backgroundColor: accent + "15", borderColor: accent + "40", color: accent }}>{T.order}</button>
              <button onClick={resetSession} className="w-full py-2 text-xs text-slate-600 hover:text-slate-400 transition-colors"
                style={{ minHeight: 44 }}>{T.new}</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav — fixed at bottom */}
      {step >= 1 && step <= 7 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          <button onClick={prevStep} disabled={step <= 1}
            className="px-5 py-2 rounded-full text-xs font-medium bg-white/5 border border-white/10
              text-slate-500 hover:text-white hover:border-white/20 disabled:opacity-20 transition-all"
            style={{ minHeight: 44 }}>{T.back}</button>
          <button onClick={nextStep}
            className="px-5 py-2 rounded-full text-xs font-medium border transition-all"
            style={{ minHeight: 44, borderColor: accent + "44", color: accent, backgroundColor: accent + "0a" }}>{T.next}</button>
        </div>
      )}
    </div>
  );
};
