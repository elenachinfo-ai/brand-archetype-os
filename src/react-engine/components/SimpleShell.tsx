import React, { useEffect, useRef, type ReactNode } from "react";
import { useArchetypeEngine } from "../useArchetypeEngine";
import { LanguageToggle } from "./LanguageToggle";
import { DynamicBackground } from "./DynamicBackground";
import { PastelSlider } from "./PastelSlider";
import { MemoryModule } from "./MemoryModule";
import { PowerDial } from "./PowerDial";
import { AIAdvisor } from "./AIAdvisor";
import { ExportSequence } from "./ExportSequence";
import { RadarChart } from "./RadarChart";
import { soundEngine } from "./SoundEngine";
import { qualityManager } from "./QualityManager";

const A: Record<string, string> = {
  ruler: "#D4AF37", creator: "#E91E63", sage: "#7E57C2", innocent: "#AED581",
  explorer: "#26C6DA", hero: "#FF7043", magician: "#AB47BC", outlaw: "#FF5722",
  jester: "#FFAB00", lover: "#F06292", caregiver: "#43A047", everyman: "#8D6E63",
};

const Q4 = [
  { k: "scandinavian_library", l: "Scandinavian Library", d: "Light, order, silence." },
  { k: "artistic_workshop", l: "Artistic Workshop", d: "Chaos, creativity, energy." },
  { k: "infinite_field", l: "Infinite Field at Dawn", d: "Horizon, freedom, freshness." },
];
const Q5 = [
  { k: "quiet_whisper", l: "A Quiet Whisper", d: "Subtle but unforgettable." },
  { k: "confident_handshake", l: "A Confident Handshake", d: "Direct, strong, leading." },
  { k: "infectious_laugh", l: "An Infectious Laugh", d: "Instant centre of attention." },
];

export function SimpleShell({ children }: { children?: ReactNode }) {
  const e = useArchetypeEngine();
  const {
    sliders, setSlider, memoryModules, setMemoryModule, powerDials, setPowerDial,
    dominantArchetype, normalizedScores, uiTheme, radarPosition,
    step, nextStep, prevStep, setStep,
    locale, setLocale, direction, hydrate, resetSession, isComplete, t,
  } = e;
  const initRef = useRef(false);
  const loc = locale as string;
  const accent = dominantArchetype ? (A[dominantArchetype] ?? "#7bbcd4") : "#7bbcd4";
  const total = 7;

  useEffect(() => {
    if (initRef.current) return; initRef.current = true;
    hydrate(); qualityManager.start();
    const s = () => { soundEngine.init(); document.removeEventListener("pointerdown", s); };
    document.addEventListener("pointerdown", s);
    return () => { qualityManager.stop(); document.removeEventListener("pointerdown", s); };
  }, []);

  return (
    <div dir={direction} style={{ minHeight: "100vh", width: "100%", background: "#0a0b10", overflow: "hidden", position: "relative", fontFamily: direction === "rtl" ? "IBM Plex Sans Arabic,Tajawal,sans-serif" : "Inter,Manrope,sans-serif" }}>
      <DynamicBackground accentColor={accent} />

      {/* Top bar */}
      <div style={{ position: "relative", zIndex: 30, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px" }}>
        <span style={{ fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.6)", letterSpacing: "0.25em", textTransform: "uppercase" }}>ArchetypeOS</span>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {step >= 1 && step <= total && (
            <div style={{ display: "flex", gap: 6 }}>
              {Array.from({ length: total }, (_, i) => i + 1).map((s) => (
                <div key={s} style={{ width: 6, height: 6, borderRadius: "50%", background: s === step ? accent : s < step ? "#475569" : "#1e293b", boxShadow: s === step ? `0 0 6px ${accent}` : "none" }} />
              ))}
            </div>
          )}
          <LanguageToggle locale={locale} onLocaleChange={setLocale} />
        </div>
      </div>

      {/* 3D Core background */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "55vh", zIndex: 0 }}>{children}</div>

      {/* Content area */}
      <div style={{ position: "relative", zIndex: 20, display: "flex", justifyContent: "center", paddingTop: "10vh" }}>
        {/* Step 0 */}
        {step === 0 && (
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: 48, fontWeight: 300, color: "#fff", margin: "0 0 8px" }}>ArchetypeOS</h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", margin: "0 0 32px" }}>Brand DNA Diagnostic</p>
            <button onClick={() => setStep(1)} style={{ padding: "12px 32px", borderRadius: 9999, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.8)", fontSize: 14, cursor: "pointer", minHeight: 52 }}>Begin</button>
          </div>
        )}

        {/* Steps 1-7 */}
        {step >= 1 && step <= total && (
          <div style={{ width: "90vw", maxWidth: 420 }}>
            <div style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(20px)", borderRadius: 24, padding: 24, border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.3em" }}>Step {step} of {total}</span>
              </div>
              {step === 1 && <PastelSlider id="q1_density" value={sliders.q1_density.value} onChange={setSlider} leftColor="#334155" rightColor={accent} leftLabel="Air" rightLabel="Density" ariaLabel="Density" />}
              {step === 2 && <PastelSlider id="q2_geometry" value={sliders.q2_geometry.value} onChange={setSlider} leftColor="#334155" rightColor={accent} leftLabel="Organic" rightLabel="Architectural" ariaLabel="Geometry" />}
              {step === 3 && <PastelSlider id="q3_temperature" value={sliders.q3_temperature.value} onChange={setSlider} leftColor="#334155" rightColor={accent} leftLabel="Quiet Luxury" rightLabel="Digital Energy" ariaLabel="Temperature" />}
              {step === 4 && <div><p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", textAlign: "center" }}>If the brand were a place — where are we?</p><MemoryModule id="q4_space" options={Q4.map(o => ({ key: o.k, label: o.l, desc: o.d }))} selectedKey={memoryModules.q4_space.selectedKey} onSelect={setMemoryModule} glowColor={accent} /></div>}
              {step === 5 && <div><p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", textAlign: "center" }}>How does the brand enter a room?</p><MemoryModule id="q5_entry" options={Q5.map(o => ({ key: o.k, label: o.l, desc: o.d }))} selectedKey={memoryModules.q5_entry.selectedKey} onSelect={setMemoryModule} glowColor={accent} /></div>}
              {step === 6 && <PowerDial id="q6_scroll" value={powerDials.q6_scroll.value} onChange={setPowerDial} leftLabel="Fluid" rightLabel="Structured" color={accent} />}
              {step === 7 && <PowerDial id="q7_risk" value={powerDials.q7_risk.value} onChange={setPowerDial} leftLabel="Classic" rightLabel="Avant-garde" color={accent} />}
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 16 }}>
              <button onClick={prevStep} disabled={step <= 1} style={{ padding: "10px 20px", borderRadius: 9999, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", fontSize: 12, cursor: "pointer", minHeight: 48, opacity: step <= 1 ? 0.2 : 1 }}>Back</button>
              <button onClick={nextStep} style={{ padding: "10px 20px", borderRadius: 9999, border: `1px solid ${accent}44`, background: accent + "0a", color: accent, fontSize: 12, cursor: "pointer", minHeight: 48 }}>{step === total ? "Finish" : "Next"}</button>
            </div>
          </div>
        )}

        {/* Result */}
        {step === 8 && isComplete && dominantArchetype && (
          <div style={{ width: "90vw", maxWidth: 420, maxHeight: "80vh", overflow: "auto", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(20px)", borderRadius: 24, padding: 24, border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.3em", marginBottom: 4 }}>Brand Archetype</div>
              <h2 style={{ fontSize: 28, fontWeight: 300, color: "#fff", margin: "0 0 4px" }}>{t(`archetypes.${dominantArchetype}`)}</h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", margin: 0 }}>{t(`archetypes.${dominantArchetype}_desc`)}</p>
            </div>

            <div style={{ marginBottom: 16 }}>
              {[
                { label: "Softness", key: "softness" as const },
                { label: "Vibrancy", key: "vibrancy" as const },
                { label: "Complexity", key: "complexity" as const },
              ].map(({ label, key }) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, marginBottom: 6 }}>
                  <span style={{ width: 80, color: "rgba(255,255,255,0.4)" }}>{label}</span>
                  <div style={{ flex: 1, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)" }}>
                    <div style={{ height: 4, borderRadius: 2, width: `${uiTheme[key] * 100}%`, background: accent, transition: "width 0.5s" }} />
                  </div>
                  <span style={{ width: 32, textAlign: "right", color: "rgba(255,255,255,0.5)" }}>{Math.round(uiTheme[key] * 100)}%</span>
                </div>
              ))}
            </div>

            <div style={{ height: 140, marginBottom: 16 }}>
              <RadarChart scores={normalizedScores as any} brandPosition={radarPosition} dominantId={dominantArchetype} />
            </div>

            <AIAdvisor />
            <div style={{ marginTop: 16 }}>
              <ExportSequence />
            </div>

            <button onClick={() => { soundEngine.play("pulse-confirm", 0); const msg = encodeURIComponent(`ArchetypeOS — запрос на сайт\nАрхетип: ${t(`archetypes.${dominantArchetype}`)} (${Math.round((normalizedScores as any)[dominantArchetype] ?? 0)}%)`); window.open(`https://t.me/elenachinfo?text=${msg}`, "_blank"); }}
              style={{ width: "100%", padding: "14px", borderRadius: 9999, border: `1px solid ${accent}35`, background: accent + "12", color: accent, fontSize: 14, cursor: "pointer", minHeight: 56, marginTop: 16 }}>Order Website</button>
            <button onClick={resetSession} style={{ width: "100%", padding: "8px", border: "none", background: "transparent", color: "rgba(255,255,255,0.3)", fontSize: 12, cursor: "pointer", minHeight: 44, marginTop: 8 }}>New Session</button>
          </div>
        )}
      </div>
    </div>
  );
}
