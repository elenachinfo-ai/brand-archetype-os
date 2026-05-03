// =============================================================================
// ArchetypeOS — useArchetypeEngine
// Main React hook. Manages hybrid inputs, computes archetype scores,
// generates project plans, and persists state to localStorage.
//
// Architecture:
//   Zustand store (zero-latency updates) →
//   Three input families (Sliders, Memory Modules, Power Dials) →
//   Weight accumulation → Normalize → Dominant archetype →
//   Derived: radar position, UI theme, project plan
// =============================================================================

import { create } from "zustand";
import {
  type ArchetypeId,
  type ArchetypeDelta,
  type UIThemeState,
  ARCHETYPE_IDS,
  ARCHETYPE_MAP,
  SLIDER_DENSITY,
  SLIDER_GEOMETRY,
  SLIDER_TEMPERATURE,
  MEMORY_SPATIAL_RESONANCE,
  MEMORY_ENTRY_PROTOCOL,
  DIAL_SCROLL_RHYTHM,
  DIAL_RISK_APPETITE,
  normalizeScores,
  computeRadarPosition,
  getDominantArchetype,
  getSecondaryArchetype,
  computeUITheme,
} from "./archetypeWeights";

// ---- Localization ----
import translations from "./translations.json";

// =============================================================================
// TYPES
// =============================================================================

export type Locale = "ru" | "en" | "ar";

/** A single slider's state: value 0–100 (maps to a bipolar axis internally) */
export interface SliderState {
  id: string;
  value: number; // 0 = extreme left, 100 = extreme right
}

/** A Memory Module (text selection) — user picks one of N options */
export interface MemoryModuleState {
  id: string;
  selectedKey: string | null; // e.g. "scandinavian_library"
}

/** A Power Dial — single continuous knob 0–100 */
export interface PowerDialState {
  id: string;
  value: number;
}

/** One node in the dynamic project plan */
export interface ProjectPlanNode {
  id: string;
  labelKey: string; // translations key
  baseImportance: number; // 0..1
  currentImportance: number; // 0..1 — scaled by dominant archetype
  archetypeAffinity: Partial<Record<ArchetypeId, number>>; // multiplier per archetype
}

/** The complete engine state */
export interface EngineState {
  // ---- Inputs ----
  sliders: Record<string, SliderState>;
  memoryModules: Record<string, MemoryModuleState>;
  powerDials: Record<string, PowerDialState>;

  // ---- Locale ----
  locale: Locale;
  direction: "ltr" | "rtl";

  // ---- Computed ----
  rawScores: Record<ArchetypeId, number>;
  normalizedScores: Record<ArchetypeId, number>;
  dominantArchetype: ArchetypeId | null;
  dominantScore: number;
  secondaryArchetype: ArchetypeId | null;
  secondaryScore: number;
  radarPosition: { x: number; y: number };
  uiTheme: UIThemeState;
  projectPlan: ProjectPlanNode[];

  // ---- Session ----
  sessionId: string;
  step: number; // current diagnostic step (0 = onboarding, 1–7 = questions, 8 = result)
  isHydrated: boolean;
  isComplete: boolean;

  // ---- Actions ----
  setSlider: (id: string, value: number) => void;
  setMemoryModule: (id: string, selectedKey: string) => void;
  setPowerDial: (id: string, value: number) => void;
  setLocale: (locale: Locale) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  recalculate: () => void;
  resetSession: () => void;
  hydrate: () => boolean;
  t: (key: string, params?: Record<string, string | number>) => string;
}

// =============================================================================
// DEFAULT INPUTS — initial slider/dial/module configuration
// =============================================================================

const DEFAULT_SLIDERS: Record<string, SliderState> = {
  q1_density: { id: "q1_density", value: 50 },
  q2_geometry: { id: "q2_geometry", value: 50 },
  q3_temperature: { id: "q3_temperature", value: 50 },
};

const DEFAULT_MEMORY_MODULES: Record<string, MemoryModuleState> = {
  q4_space: { id: "q4_space", selectedKey: null },
  q5_entry: { id: "q5_entry", selectedKey: null },
};

const DEFAULT_POWER_DIALS: Record<string, PowerDialState> = {
  q6_scroll: { id: "q6_scroll", value: 50 },
  q7_risk: { id: "q7_risk", value: 50 },
};

// =============================================================================
// DEFAULT PROJECT PLAN — base nodes with archetype affinities
// =============================================================================

const DEFAULT_PROJECT_PLAN: ProjectPlanNode[] = [
  {
    id: "hero_section",
    labelKey: "project_plan.hero_section",
    baseImportance: 0.9,
    currentImportance: 0.9,
    archetypeAffinity: { hero: 1.3, creator: 1.2, outlaw: 1.1 },
  },
  {
    id: "about_section",
    labelKey: "project_plan.about_section",
    baseImportance: 0.7,
    currentImportance: 0.7,
    archetypeAffinity: { sage: 1.4, ruler: 1.2, caregiver: 1.1 },
  },
  {
    id: "services_section",
    labelKey: "project_plan.services_section",
    baseImportance: 0.8,
    currentImportance: 0.8,
    archetypeAffinity: { ruler: 1.3, magician: 1.2, creator: 1.1 },
  },
  {
    id: "portfolio_section",
    labelKey: "project_plan.portfolio_section",
    baseImportance: 0.7,
    currentImportance: 0.7,
    archetypeAffinity: { creator: 1.5, magician: 1.3, outlaw: 1.2 },
  },
  {
    id: "interactive_section",
    labelKey: "project_plan.interactive_section",
    baseImportance: 0.5,
    currentImportance: 0.5,
    archetypeAffinity: {
      explorer: 1.6,
      magician: 1.4,
      creator: 1.2,
      jester: 1.2,
    },
  },
  {
    id: "testimonials_section",
    labelKey: "project_plan.testimonials_section",
    baseImportance: 0.6,
    currentImportance: 0.6,
    archetypeAffinity: {
      caregiver: 1.4,
      everyman: 1.3,
      lover: 1.2,
      innocent: 1.1,
    },
  },
  {
    id: "cta_section",
    labelKey: "project_plan.cta_section",
    baseImportance: 0.9,
    currentImportance: 0.9,
    archetypeAffinity: { hero: 1.4, outlaw: 1.3, ruler: 1.2 },
  },
  {
    id: "contact_section",
    labelKey: "project_plan.contact_section",
    baseImportance: 0.8,
    currentImportance: 0.8,
    archetypeAffinity: { caregiver: 1.3, everyman: 1.2, lover: 1.1 },
  },
];

// =============================================================================
// SESSION PERSISTENCE
// =============================================================================

const STORAGE_KEY = "ArchetypeOS_Session";

interface PersistedSession {
  sessionId: string;
  sliders: Record<string, SliderState>;
  memoryModules: Record<string, MemoryModuleState>;
  powerDials: Record<string, PowerDialState>;
  locale: Locale;
  step: number;
  isComplete: boolean;
  savedAt: number;
}

function generateSessionId(): string {
  return `asos_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function saveSession(state: EngineState): void {
  const data: PersistedSession = {
    sessionId: state.sessionId,
    sliders: state.sliders,
    memoryModules: state.memoryModules,
    powerDials: state.powerDials,
    locale: state.locale,
    step: state.step,
    isComplete: state.isComplete,
    savedAt: Date.now(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

function loadSession(): PersistedSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as PersistedSession;
    // Validate structure
    if (
      !data.sessionId ||
      !data.sliders ||
      !data.memoryModules ||
      !data.powerDials
    ) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

// =============================================================================
// CALCULATION LOGIC — maps inputs → 12 archetype scores
// =============================================================================

function computeRawScores(
  sliders: Record<string, SliderState>,
  memoryModules: Record<string, MemoryModuleState>,
  powerDials: Record<string, PowerDialState>,
): Record<ArchetypeId, number> {
  // Initialize all archetypes at 0
  const scores: Record<ArchetypeId, number> = {} as Record<ArchetypeId, number>;
  ARCHETYPE_IDS.forEach((id) => {
    scores[id] = 0;
  });

  // Helper: apply deltas
  const apply = (deltas: ArchetypeDelta[], factor: number = 1) => {
    deltas.forEach((d) => {
      scores[d.archetypeId] += d.delta * factor;
    });
  };

  // ---- Block A: Dual Sliders (interpolate between two extremes) ----

  // Q1: Density of Matter [air ↔ density]
  const densityVal = sliders.q1_density?.value ?? 50;
  const densityFactor = (densityVal - 50) / 50; // −1 (air) … +1 (density)
  if (densityFactor <= 0) {
    apply(SLIDER_DENSITY.air, Math.abs(densityFactor));
  }
  if (densityFactor >= 0) {
    apply(SLIDER_DENSITY.density, densityFactor);
  }

  // Q2: Geometry [organic ↔ architectural]
  const geomVal = sliders.q2_geometry?.value ?? 50;
  const geomFactor = (geomVal - 50) / 50;
  if (geomFactor <= 0) {
    apply(SLIDER_GEOMETRY.organic, Math.abs(geomFactor));
  }
  if (geomFactor >= 0) {
    apply(SLIDER_GEOMETRY.architectural, geomFactor);
  }

  // Q3: Temperature [muted ↔ vibrant]
  const tempVal = sliders.q3_temperature?.value ?? 50;
  const tempFactor = (tempVal - 50) / 50;
  if (tempFactor <= 0) {
    apply(SLIDER_TEMPERATURE.muted, Math.abs(tempFactor));
  }
  if (tempFactor >= 0) {
    apply(SLIDER_TEMPERATURE.vibrant, tempFactor);
  }

  // ---- Block B: Memory Modules (selection with full weight) ----

  // Q4: Spatial Resonance
  const spaceKey = memoryModules.q4_space?.selectedKey;
  if (spaceKey && MEMORY_SPATIAL_RESONANCE[spaceKey]) {
    apply(MEMORY_SPATIAL_RESONANCE[spaceKey], 1);
  }

  // Q5: Entry Protocol
  const entryKey = memoryModules.q5_entry?.selectedKey;
  if (entryKey && MEMORY_ENTRY_PROTOCOL[entryKey]) {
    apply(MEMORY_ENTRY_PROTOCOL[entryKey], 1);
  }

  // ---- Block C: Power Dials ----

  // Q6: Scrolling Rhythm [fluid ↔ structured]
  const scrollVal = powerDials.q6_scroll?.value ?? 50;
  const scrollFactor = (scrollVal - 50) / 50;
  if (scrollFactor <= 0) {
    apply(DIAL_SCROLL_RHYTHM.fluid, Math.abs(scrollFactor));
  }
  if (scrollFactor >= 0) {
    apply(DIAL_SCROLL_RHYTHM.structured, scrollFactor);
  }

  // Q7: Risk Appetite [classic ↔ experimental]
  const riskVal = powerDials.q7_risk?.value ?? 50;
  const riskFactor = (riskVal - 50) / 50;
  if (riskFactor <= 0) {
    apply(DIAL_RISK_APPETITE.classic, Math.abs(riskFactor));
  }
  if (riskFactor >= 0) {
    apply(DIAL_RISK_APPETITE.experimental, riskFactor);
  }

  return scores;
}

/** Scale project plan node importance based on dominant archetype */
function scaleProjectPlan(
  plan: ProjectPlanNode[],
  dominantArchetype: ArchetypeId | null,
): ProjectPlanNode[] {
  if (!dominantArchetype) return plan;

  return plan.map((node) => {
    const affinity = node.archetypeAffinity[dominantArchetype] ?? 1.0;
    const scaled = clamp(node.baseImportance * affinity, 0, 1);
    return { ...node, currentImportance: scaled };
  });
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

// =============================================================================
// ZUSTAND STORE
// =============================================================================

// Debounce timer for autosave
let saveTimer: ReturnType<typeof setTimeout> | null = null;
const SAVE_DEBOUNCE_MS = 500;

export const useArchetypeStore = create<EngineState>((set, get) => ({
  // ---- Initial state ----
  sliders: { ...DEFAULT_SLIDERS },
  memoryModules: { ...DEFAULT_MEMORY_MODULES },
  powerDials: { ...DEFAULT_POWER_DIALS },
  locale: "ru",
  direction: "ltr",
  rawScores: {} as Record<ArchetypeId, number>,
  normalizedScores: {} as Record<ArchetypeId, number>,
  dominantArchetype: null,
  dominantScore: 0,
  secondaryArchetype: null,
  secondaryScore: 0,
  radarPosition: { x: 0, y: 0 },
  uiTheme: { softness: 0.5, vibrancy: 0.5, complexity: 0.5 },
  projectPlan: DEFAULT_PROJECT_PLAN,
  sessionId: generateSessionId(),
  step: 0,
  isHydrated: false,
  isComplete: false,

  // ---- Actions ----

  setSlider: (id, value) => {
    set((s) => ({
      sliders: { ...s.sliders, [id]: { id, value: clamp(value, 0, 100) } },
    }));
    get().recalculate();
  },

  setMemoryModule: (id, selectedKey) => {
    set((s) => ({
      memoryModules: { ...s.memoryModules, [id]: { id, selectedKey } },
    }));
    get().recalculate();
  },

  setPowerDial: (id, value) => {
    set((s) => ({
      powerDials: {
        ...s.powerDials,
        [id]: { id, value: clamp(value, 0, 100) },
      },
    }));
    get().recalculate();
  },

  setLocale: (locale) => {
    const direction = locale === "ar" ? "rtl" : "ltr";
    set({ locale, direction });
    // Persist locale change
    const s = get();
    debouncedSave(s);
  },

  setStep: (step) => {
    set({ step: clamp(step, 0, 8) });
    const s = get();
    debouncedSave(s);
  },

  nextStep: () => {
    const s = get();
    const next = Math.min(s.step + 1, 8);
    set({ step: next, isComplete: next === 8 });
    debouncedSave({ ...s, step: next });
  },

  prevStep: () => {
    const s = get();
    set({ step: Math.max(s.step - 1, 0) });
    debouncedSave(s);
  },

  recalculate: () => {
    const { sliders, memoryModules, powerDials } = get();

    // Compute raw → normalized scores
    const rawScores = computeRawScores(sliders, memoryModules, powerDials);
    const normalizedScores = normalizeScores(rawScores);

    // Determine dominant & secondary
    const dominant = getDominantArchetype(normalizedScores);
    const secondary = getSecondaryArchetype(normalizedScores);

    // Radar position
    const radarPosition = computeRadarPosition(normalizedScores);

    // UI theme
    const uiTheme = computeUITheme(normalizedScores);

    // Project plan
    const projectPlan = scaleProjectPlan(DEFAULT_PROJECT_PLAN, dominant.id);

    set({
      rawScores,
      normalizedScores,
      dominantArchetype: dominant.id,
      dominantScore: dominant.score,
      secondaryArchetype: secondary?.id ?? null,
      secondaryScore: secondary?.score ?? 0,
      radarPosition,
      uiTheme,
      projectPlan,
    });

    // Fire a "Pulse" event for the 3D Core to listen to
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("archetypeos:pulse", {
          detail: {
            dominantArchetype: dominant.id,
            uiTheme,
            radarPosition,
            normalizedScores,
          },
        }),
      );
    }

    // Debounced autosave
    const s = get();
    debouncedSave(s);
  },

  resetSession: () => {
    // Clear persisted session
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }

    set({
      sliders: { ...DEFAULT_SLIDERS },
      memoryModules: { ...DEFAULT_MEMORY_MODULES },
      powerDials: { ...DEFAULT_POWER_DIALS },
      rawScores: {} as Record<ArchetypeId, number>,
      normalizedScores: {} as Record<ArchetypeId, number>,
      dominantArchetype: null,
      dominantScore: 0,
      secondaryArchetype: null,
      secondaryScore: 0,
      radarPosition: { x: 0, y: 0 },
      uiTheme: { softness: 0.5, vibrancy: 0.5, complexity: 0.5 },
      projectPlan: DEFAULT_PROJECT_PLAN,
      sessionId: generateSessionId(),
      step: 0,
      isHydrated: true,
      isComplete: false,
    });
  },

  /**
   * Hydrate state from a previously saved session.
   * Returns true if a session was found and loaded.
   */
  hydrate: () => {
    const saved = loadSession();
    if (!saved) {
      set({ isHydrated: true });
      return false;
    }

    // Merge saved inputs, keeping defaults for any missing keys
    const sliders = { ...DEFAULT_SLIDERS };
    if (saved.sliders) {
      Object.entries(saved.sliders).forEach(([k, v]) => {
        if (sliders[k]) sliders[k] = v;
      });
    }

    const memoryModules = { ...DEFAULT_MEMORY_MODULES };
    if (saved.memoryModules) {
      Object.entries(saved.memoryModules).forEach(([k, v]) => {
        if (memoryModules[k]) memoryModules[k] = v;
      });
    }

    const powerDials = { ...DEFAULT_POWER_DIALS };
    if (saved.powerDials) {
      Object.entries(saved.powerDials).forEach(([k, v]) => {
        if (powerDials[k]) powerDials[k] = v;
      });
    }

    set({
      sliders,
      memoryModules,
      powerDials,
      locale: saved.locale ?? "ru",
      direction: saved.locale === "ar" ? "rtl" : "ltr",
      sessionId: saved.sessionId,
      step: saved.step ?? 0,
      isComplete: saved.isComplete ?? false,
      isHydrated: true,
    });

    // Trigger recalculation with restored inputs
    // Use setTimeout to allow Zustand to flush the state update first
    setTimeout(() => {
      get().recalculate();
    }, 0);

    return true;
  },

  /**
   * Translation helper. Looks up a dotted key in translations.json
   * for the current locale. Falls back to ru.
   * Supports {param} interpolation.
   */
  t: (key: string, params?: Record<string, string | number>) => {
    const { locale } = get();
    const parts = key.split(".");
    let node: any = translations;

    for (const part of parts) {
      if (node && typeof node === "object" && part in node) {
        node = node[part];
      } else {
        return key; // raw key as last resort
      }
    }

    // Extract locale-specific string if node is a locale object
    if (node && typeof node === "object" && node[locale]) {
      node = node[locale];
    }
    // Fallback: try ru
    if (node && typeof node === "object" && node["ru"]) {
      node = node["ru"];
    }

    let text = typeof node === "string" ? node : key;

    // Interpolate {param} placeholders
    if (params && typeof text === "string") {
      Object.entries(params).forEach(([k, v]) => {
        text = (text as string).replace(`{${k}}`, String(v));
      });
    }

    return text as string;
  },
}));

// =============================================================================
// DEBOUNCED AUTOSAVE
// =============================================================================

function debouncedSave(state: EngineState): void {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveSession(state);
  }, SAVE_DEBOUNCE_MS);
}

// =============================================================================
// REACT HOOK — convenience wrapper around the Zustand store
// =============================================================================

/**
 * useArchetypeEngine — the primary hook for ArchetypeOS.
 *
 * Usage:
 *   const {
 *     sliders, setSlider,
 *     memoryModules, setMemoryModule,
 *     dominantArchetype, uiTheme,
 *     projectPlan,
 *     step, nextStep, prevStep,
 *     t, direction, locale, setLocale,
 *     isHydrated, hydrate, resetSession,
 *   } = useArchetypeEngine();
 */
export function useArchetypeEngine() {
  return useArchetypeStore();
}

/**
 * Convenience selector for the current locale's direction.
 */
export function useDirection(): "ltr" | "rtl" {
  return useArchetypeStore((s) => s.direction);
}

/**
 * Convenience selector for the UI theme state.
 * Returns softness, vibrancy, complexity — all 0..1.
 * Subscribe to this in the 3D Core for real-time morphing.
 */
export function useUITheme(): UIThemeState {
  return useArchetypeStore((s) => s.uiTheme);
}

/**
 * Convenience selector for the dominant archetype ID.
 */
export function useDominantArchetype(): ArchetypeId | null {
  return useArchetypeStore((s) => s.dominantArchetype);
}

/**
 * Listen for "Pulse" events from outside React (e.g., 3D canvas).
 */
export function useOnPulse(callback: (detail: any) => void): void {
  if (typeof window === "undefined") return;
  // Intentionally not using useEffect here — caller wraps it
  window.addEventListener("archetypeos:pulse", (e: Event) => {
    callback((e as CustomEvent).detail);
  });
}

// =============================================================================
// EXPORT: Full engine state type for external consumers
// =============================================================================

export type { ArchetypeId, UIThemeState };
export { ARCHETYPE_IDS, ARCHETYPE_MAP };
