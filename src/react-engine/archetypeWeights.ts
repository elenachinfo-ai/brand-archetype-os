// =============================================================================
// ArchetypeOS — Archetype Weights Matrix
// The mathematical heart of the engine. Maps 12 Jungian archetypes to a 2D
// coordinate system (Order↔Freedom, Ego↔Social) and defines how user inputs
// translate into archetype activation scores.
// =============================================================================

/** 2D coordinate position for each archetype on the radar map */
export interface ArchetypePosition {
  x: number; // −1 (Freedom) … +1 (Order)
  y: number; // −1 (Ego/Self) … +1 (Social/Collective)
  color: string;
}

/** Weight delta applied to an archetype when a specific answer is chosen */
export interface ArchetypeDelta {
  archetypeId: ArchetypeId;
  delta: number; // signed weight shift (−10 … +10)
}

/** The 12 archetype IDs */
export type ArchetypeId =
  | "ruler"
  | "creator"
  | "sage"
  | "innocent"
  | "explorer"
  | "hero"
  | "magician"
  | "outlaw"
  | "jester"
  | "lover"
  | "caregiver"
  | "everyman";

/** All 12 archetypes in canonical order */
export const ARCHETYPE_IDS: ArchetypeId[] = [
  "ruler",
  "creator",
  "sage",
  "innocent",
  "explorer",
  "hero",
  "magician",
  "outlaw",
  "jester",
  "lover",
  "caregiver",
  "everyman",
];

// ---- Archetype 2D Map ----
// Axes:
//   X: Order (−1) ↔ Freedom (+1)
//   Y: Ego / Self (−1) ↔ Social / Collective (+1)
// =============================================================================
export const ARCHETYPE_MAP: Record<ArchetypeId, ArchetypePosition> = {
  ruler:     { x: 0.0,  y: 1.0,  color: "#FDF5E6" }, // top center — ultimate order, collective
  creator:   { x: 0.5,  y: 0.8,  color: "#FFE4E1" },
  sage:      { x: -0.5, y: 0.8,  color: "#E6E6FA" },
  innocent:  { x: -1.0, y: 0.5,  color: "#F0F8FF" },
  explorer:  { x: 1.0,  y: 0.5,  color: "#CFFFE5" },
  hero:      { x: 1.0,  y: -0.5, color: "#FFFACD" },
  magician:  { x: 0.5,  y: -0.8, color: "#E0FFFF" },
  outlaw:    { x: -0.5, y: -0.8, color: "#F5F5F5" },
  jester:    { x: -1.0, y: -0.5, color: "#FFF0F5" },
  lover:     { x: -0.8, y: 0.0,  color: "#FFC0CB" },
  caregiver: { x: -0.5, y: 0.5,  color: "#F5FFFA" },
  everyman:  { x: 0.0,  y: 0.0,  color: "#FAFAD2" }, // origin — balanced center
};

// ---- Input Impact Matrix ----
// Maps diagnostic answers to archetype weight deltas.
// Each answer applies signed deltas to specific archetypes.
// =============================================================================

/** Slider input impact: [tradition ↔ innovation] */
export const SLIDER_TRADITION_INNOVATION: Record<"innovation" | "tradition", ArchetypeDelta[]> = {
  innovation: [
    { archetypeId: "creator",  delta: 5 },
    { archetypeId: "magician", delta: 3 },
    { archetypeId: "outlaw",   delta: 4 },
    { archetypeId: "sage",     delta: -2 },
  ],
  tradition: [
    { archetypeId: "ruler",    delta: 5 },
    { archetypeId: "innocent", delta: 4 },
    { archetypeId: "caregiver",delta: 3 },
    { archetypeId: "creator",  delta: -3 },
  ],
};

/** Slider input impact: [logic ↔ emotion] */
export const SLIDER_LOGIC_EMOTION: Record<"emotion" | "logic", ArchetypeDelta[]> = {
  emotion: [
    { archetypeId: "lover",  delta: 5 },
    { archetypeId: "jester", delta: 4 },
    { archetypeId: "creator",delta: 3 },
  ],
  logic: [
    { archetypeId: "sage",   delta: 5 },
    { archetypeId: "ruler",  delta: 4 },
    { archetypeId: "hero",   delta: 2 },
  ],
};

/** Slider: Density of Matter [air/minimalism ↔ density/detail] */
export const SLIDER_DENSITY: Record<"air" | "density", ArchetypeDelta[]> = {
  air: [
    { archetypeId: "innocent", delta: 5 },
    { archetypeId: "sage",     delta: 4 },
    { archetypeId: "explorer", delta: 3 },
    { archetypeId: "ruler",    delta: -2 },
  ],
  density: [
    { archetypeId: "creator",  delta: 5 },
    { archetypeId: "magician", delta: 3 },
    { archetypeId: "outlaw",   delta: 4 },
    { archetypeId: "innocent", delta: -3 },
  ],
};

/** Slider: Geometry [organic/soft ↔ architectural/sharp] */
export const SLIDER_GEOMETRY: Record<"organic" | "architectural", ArchetypeDelta[]> = {
  organic: [
    { archetypeId: "lover",     delta: 5 },
    { archetypeId: "caregiver", delta: 4 },
    { archetypeId: "innocent",  delta: 3 },
    { archetypeId: "ruler",     delta: -2 },
  ],
  architectural: [
    { archetypeId: "ruler",   delta: 5 },
    { archetypeId: "hero",    delta: 4 },
    { archetypeId: "sage",    delta: 3 },
    { archetypeId: "jester",  delta: -2 },
  ],
};

/** Slider: Temperature [muted/quiet-luxury ↔ vibrant/digital-energy] */
export const SLIDER_TEMPERATURE: Record<"muted" | "vibrant", ArchetypeDelta[]> = {
  muted: [
    { archetypeId: "sage",      delta: 5 },
    { archetypeId: "ruler",     delta: 4 },
    { archetypeId: "everyman",  delta: 3 },
    { archetypeId: "jester",    delta: -2 },
  ],
  vibrant: [
    { archetypeId: "jester",   delta: 5 },
    { archetypeId: "creator",  delta: 4 },
    { archetypeId: "magician", delta: 3 },
    { archetypeId: "sage",     delta: -2 },
  ],
};

// ---- Memory Module (Selection) Impact ----
// Each text-choice answer maps to specific archetype weight shifts.
// =============================================================================

/** Q4: Spatial Resonance — "If the brand were a physical space…" */
export const MEMORY_SPATIAL_RESONANCE: Record<string, ArchetypeDelta[]> = {
  scandinavian_library: [
    { archetypeId: "sage",    delta: 5 },
    { archetypeId: "ruler",   delta: 4 },
    { archetypeId: "innocent",delta: 2 },
  ],
  artistic_workshop: [
    { archetypeId: "creator", delta: 5 },
    { archetypeId: "outlaw",  delta: 4 },
    { archetypeId: "jester",  delta: 3 },
  ],
  infinite_field: [
    { archetypeId: "explorer", delta: 5 },
    { archetypeId: "innocent", delta: 4 },
    { archetypeId: "hero",     delta: 2 },
  ],
};

/** Q5: Entry Protocol — "How does the brand enter a room?" */
export const MEMORY_ENTRY_PROTOCOL: Record<string, ArchetypeDelta[]> = {
  quiet_whisper: [
    { archetypeId: "lover",  delta: 5 },
    { archetypeId: "sage",   delta: 4 },
    { archetypeId: "everyman",delta: 2 },
  ],
  confident_handshake: [
    { archetypeId: "hero",   delta: 5 },
    { archetypeId: "ruler",  delta: 4 },
    { archetypeId: "creator",delta: 2 },
  ],
  infectious_laugh: [
    { archetypeId: "jester",   delta: 5 },
    { archetypeId: "magician", delta: 4 },
    { archetypeId: "explorer", delta: 2 },
  ],
};

// ---- Power Dial Impact ----
// =============================================================================

/** Q6: Scrolling Rhythm [fluid/liquid ↔ structured/step-by-step] */
export const DIAL_SCROLL_RHYTHM: Record<"fluid" | "structured", ArchetypeDelta[]> = {
  fluid: [
    { archetypeId: "explorer", delta: 4 },
    { archetypeId: "magician", delta: 3 },
    { archetypeId: "lover",    delta: 3 },
  ],
  structured: [
    { archetypeId: "ruler",  delta: 4 },
    { archetypeId: "sage",   delta: 3 },
    { archetypeId: "hero",   delta: 3 },
  ],
};

/** Q7: Risk Appetite [proven/classic ↔ experimental/avant-garde] */
export const DIAL_RISK_APPETITE: Record<"classic" | "experimental", ArchetypeDelta[]> = {
  classic: [
    { archetypeId: "everyman", delta: 4 },
    { archetypeId: "innocent", delta: 3 },
    { archetypeId: "ruler",    delta: 2 },
  ],
  experimental: [
    { archetypeId: "outlaw",   delta: 5 },
    { archetypeId: "magician", delta: 4 },
    { archetypeId: "creator",  delta: 3 },
  ],
};

// =============================================================================
// COMPUTATION ENGINE
// =============================================================================

/**
 * Normalize a map of archetype → raw score so all values sum to 100%.
 * Handles negative scores by clamping to a minimum floor before normalizing.
 */
export function normalizeScores(scores: Record<ArchetypeId, number>): Record<ArchetypeId, number> {
  const FLOOR = 1; // minimum % for any archetype
  const entries = Object.entries(scores) as [ArchetypeId, number][];

  // Clamp negatives to 0, then apply floor
  const clamped: Record<ArchetypeId, number> = {} as Record<ArchetypeId, number>;
  entries.forEach(([id, val]) => {
    clamped[id] = Math.max(0, val);
  });

  const total = Object.values(clamped).reduce((s, v) => s + v, 0);
  if (total === 0) {
    // All-zero edge case — equal distribution
    const equal = 100 / ARCHETYPE_IDS.length;
    ARCHETYPE_IDS.forEach((id) => {
      clamped[id] = equal;
    });
    return clamped;
  }

  // Scale to 100%, respecting floor
  const remaining = 100 - FLOOR * ARCHETYPE_IDS.length;
  if (remaining <= 0) {
    // Floor takes everything — equal split
    ARCHETYPE_IDS.forEach((id) => {
      clamped[id] = 100 / ARCHETYPE_IDS.length;
    });
    return clamped;
  }

  const result: Record<ArchetypeId, number> = {} as Record<ArchetypeId, number>;
  entries.forEach(([id]) => {
    result[id] = FLOOR + (clamped[id] / total) * remaining;
  });

  return result;
}

/**
 * Compute a weighted (x, y) position on the 2D radar map
 * based on archetype scores.
 */
export function computeRadarPosition(
  scores: Record<ArchetypeId, number>,
): { x: number; y: number } {
  let weightedX = 0;
  let weightedY = 0;
  let totalWeight = 0;

  ARCHETYPE_IDS.forEach((id) => {
    const pos = ARCHETYPE_MAP[id];
    const weight = scores[id] / 100; // normalize to 0..1
    weightedX += pos.x * weight;
    weightedY += pos.y * weight;
    totalWeight += weight;
  });

  if (totalWeight === 0) return { x: 0, y: 0 };

  return {
    x: weightedX / totalWeight,
    y: weightedY / totalWeight,
  };
}

/**
 * Determine the dominant archetype from normalized scores.
 */
export function getDominantArchetype(
  scores: Record<ArchetypeId, number>,
): { id: ArchetypeId; score: number; position: ArchetypePosition } {
  let maxId: ArchetypeId = "everyman";
  let maxScore = 0;

  ARCHETYPE_IDS.forEach((id) => {
    if (scores[id] > maxScore) {
      maxScore = scores[id];
      maxId = id;
    }
  });

  return {
    id: maxId,
    score: maxScore,
    position: ARCHETYPE_MAP[maxId],
  };
}

/**
 * Get secondary archetype (second highest score) for nuance.
 */
export function getSecondaryArchetype(
  scores: Record<ArchetypeId, number>,
): { id: ArchetypeId; score: number } | null {
  const sorted = [...ARCHETYPE_IDS].sort((a, b) => scores[b] - scores[a]);
  if (sorted.length < 2) return null;
  return { id: sorted[1], score: scores[sorted[1]] };
}

/**
 * Calculate UI Theme State from the archetype scores.
 * Returns three continuous parameters (0..1) for the UI to consume.
 */
export interface UIThemeState {
  softness: number;  // 0 = sharp/angular, 1 = soft/rounded
  vibrancy: number;  // 0 = muted/quiet, 1 = vibrant/saturated
  complexity: number; // 0 = minimal/airy, 1 = dense/detailed
}

export function computeUITheme(scores: Record<ArchetypeId, number>): UIThemeState {
  // Softness: weighted by organic-leaning archetypes
  const softArchetypes: ArchetypeId[] = ["lover", "caregiver", "innocent", "everyman"];
  const sharpArchetypes: ArchetypeId[] = ["ruler", "hero", "outlaw", "sage"];
  const softScore = softArchetypes.reduce((s, id) => s + scores[id], 0);
  const sharpScore = sharpArchetypes.reduce((s, id) => s + scores[id], 0);
  const total = softScore + sharpScore || 1;
  const softness = softScore / total;

  // Vibrancy: weighted by energy-leaning archetypes
  const vibrantArchetypes: ArchetypeId[] = ["jester", "creator", "magician", "explorer"];
  const mutedArchetypes: ArchetypeId[] = ["sage", "ruler", "everyman", "innocent"];
  const vibrantScore = vibrantArchetypes.reduce((s, id) => s + scores[id], 0);
  const mutedScore = mutedArchetypes.reduce((s, id) => s + scores[id], 0);
  const totalV = vibrantScore + mutedScore || 1;
  const vibrancy = vibrantScore / totalV;

  // Complexity: weighted by detail/density-leaning archetypes
  const complexArchetypes: ArchetypeId[] = ["creator", "magician", "outlaw", "ruler"];
  const simpleArchetypes: ArchetypeId[] = ["innocent", "everyman", "explorer", "caregiver"];
  const complexScore = complexArchetypes.reduce((s, id) => s + scores[id], 0);
  const simpleScore = simpleArchetypes.reduce((s, id) => s + scores[id], 0);
  const totalC = complexScore + simpleScore || 1;
  const complexity = complexScore / totalC;

  return {
    softness: clamp(softness, 0, 1),
    vibrancy: clamp(vibrancy, 0, 1),
    complexity: clamp(complexity, 0, 1),
  };
}

/** Utility: clamp a value between min and max */
function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}
