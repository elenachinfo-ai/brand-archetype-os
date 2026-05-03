// =============================================================================
// cultureLoader — Typed accessor for culture_logic.json
// Bridges the rich cross-cultural metadata into the React engine.
// =============================================================================

import cultureData from "../../culture_logic.json";

// ---- Types ----

export type LocaleCode = "ru" | "en" | "ar";

export interface LocaleMeta {
  code: string;
  name: string;
  name_en: string;
  direction: "ltr" | "rtl";
  script: string;
  font_families: string[];
  font_scale: number;
  cultural_anchor: string;
}

export interface ArchetypeMetaphor {
  primary_metaphor: string;
  primary_metaphor_en?: string; // AR only
  visual: string;
}

export interface VisualBenchmark {
  color_shift: string;
  typography: string;
  spatial: string;
  motion: string;
  key_difference: string;
}

export interface RTLVisualRule {
  spatial_concept: string;
  pattern_type: string;
  // Hero/Ruler have extra fields
  accent_direction?: string;
  grid_orientation?: string;
  ornamentation_density?: string;
  visual_language?: string;
}

export interface CultureLayer {
  version: string;
  locales: Record<LocaleCode, LocaleMeta>;
  metaphor_mappings: Record<string, Record<LocaleCode, ArchetypeMetaphor>>;
  typography_rules: {
    rtl: {
      enabled_locales: string[];
      css_overrides: Record<string, unknown>;
    };
    arabic_specific: Record<string, unknown>;
    russian_specific: Record<string, unknown>;
    english_specific: Record<string, unknown>;
  };
  visual_benchmarks_per_locale: Record<string, Record<LocaleCode, VisualBenchmark>>;
  negative_space_cultural_logic: {
    european_ltr: {
      principle: string;
      spacing_strategy: string;
      ornamentation: string;
      density: string;
    };
    arabic_rtl: {
      principle: string;
      spacing_strategy: string;
      ornamentation: string;
      density: string;
      design_implication: string;
    };
  };
  archetype_rtl_visual_rules: {
    general_rtl_overrides: Record<string, unknown>;
    per_archetype: Record<string, RTLVisualRule>;
  };
}

// ---- Singleton loader ----

let _cache: CultureLayer | null = null;

export function getCultureLayer(): CultureLayer {
  if (!_cache) {
    _cache = cultureData as unknown as CultureLayer;
  }
  return _cache;
}

// ---- Accessors ----

/** Get locale metadata (font families, scale, direction, etc.) */
export function getLocaleMeta(locale: LocaleCode): LocaleMeta {
  return getCultureLayer().locales[locale] ?? getCultureLayer().locales["en"];
}

/** Get the culturally-adapted metaphor for an archetype in a given locale */
export function getArchetypeMetaphor(
  archetypeId: string,
  locale: LocaleCode,
): ArchetypeMetaphor {
  const mappings = getCultureLayer().metaphor_mappings;
  const archetype = mappings[archetypeId];
  if (!archetype) {
    return {
      primary_metaphor: archetypeId,
      visual: "Default",
    };
  }
  return archetype[locale] ?? archetype["en"];
}

/** Get per-locale visual benchmark for an archetype */
export function getVisualBenchmark(
  archetypeId: string,
  locale: LocaleCode,
): VisualBenchmark | null {
  const benchmarks = getCultureLayer().visual_benchmarks_per_locale;
  const entry = benchmarks[archetypeId];
  if (!entry) return null;
  return (entry as Record<LocaleCode, VisualBenchmark>)[locale] ?? null;
}

/** Get RTL visual rule for an archetype */
export function getRTLRule(archetypeId: string): RTLVisualRule | null {
  const rules = getCultureLayer().archetype_rtl_visual_rules;
  return rules.per_archetype[archetypeId] ?? null;
}

/** Get negative space logic for the active direction */
export function getNegativeSpaceLogic(
  direction: "ltr" | "rtl",
): CultureLayer["negative_space_cultural_logic"]["european_ltr"] | null {
  const ns = getCultureLayer().negative_space_cultural_logic;
  return direction === "rtl" ? ns.arabic_rtl : ns.european_ltr;
}

/** Get font families for a locale — returns a CSS font-family string */
export function getLocaleFontStack(locale: LocaleCode): string {
  const meta = getLocaleMeta(locale);
  return meta.font_families.join(", ");
}

/** Get font scale factor for a locale */
export function getLocaleFontScale(locale: LocaleCode): number {
  return getLocaleMeta(locale).font_scale;
}

/** Get line height factor for a locale (from typography_rules) */
export function getLocaleLineHeightFactor(locale: LocaleCode): number {
  const rules = getCultureLayer().typography_rules;
  if (locale === "ar") return (rules.arabic_specific as any).line_height_factor ?? 1.15;
  if (locale === "ru") return (rules.russian_specific as any).line_height_factor ?? 1.08;
  return (rules.english_specific as any).line_height_factor ?? 1.0;
}

/** Get typography considerations for a locale */
export function getLocaleTypoConsiderations(
  locale: LocaleCode,
): Record<string, string> {
  const rules = getCultureLayer().typography_rules;
  if (locale === "ar") return (rules.arabic_specific as any).calligraphic_considerations ?? {};
  if (locale === "ru") return (rules.russian_specific as any).considerations ?? {};
  return (rules.english_specific as any).considerations ?? {};
}

/**
 * Build a CSS-in-JS object with locale-specific typography overrides.
 * Returns properties to spread onto a container style.
 */
export function getLocaleTypographyOverrides(
  locale: LocaleCode,
): Record<string, string | number> {
  const meta = getLocaleMeta(locale);
  const scale = meta.font_scale;
  const lh = getLocaleLineHeightFactor(locale);

  return {
    fontFamily: getLocaleFontStack(locale),
    "--font-scale": scale,
    "--line-height-factor": lh,
    fontSize: `${scale * 100}%`,
    lineHeight: lh,
    direction: meta.direction,
  };
}

/**
 * Get the culturally-enriched question adaptation for a given question type.
 * Falls back gracefully when the exact question doesn't exist in culture_logic.
 */
export function getCulturalQuestionHint(
  archetypeId: string | null,
  locale: LocaleCode,
): string {
  if (!archetypeId) return "";
  const benchmark = getVisualBenchmark(archetypeId, locale);
  if (!benchmark) return "";
  return benchmark.key_difference;
}

/**
 * Build a combined cultural context object for the active locale + archetype.
 * This is the primary export for components — a single call gives all cultural data.
 */
export interface CulturalContext {
  locale: LocaleMeta;
  archetypeMetaphor: ArchetypeMetaphor | null;
  visualBenchmark: VisualBenchmark | null;
  rtlRule: RTLVisualRule | null;
  negativeSpace: string; // one-line principle
  fontStack: string;
  fontScale: number;
  lineHeightFactor: number;
  typographyOverrides: Record<string, string | number>;
}

export function getCulturalContext(
  locale: LocaleCode,
  archetypeId: string | null,
): CulturalContext {
  const localeMeta = getLocaleMeta(locale);
  const metaphor = archetypeId
    ? getArchetypeMetaphor(archetypeId, locale)
    : null;
  const benchmark = archetypeId
    ? getVisualBenchmark(archetypeId, locale)
    : null;
  const rtlRule = archetypeId ? getRTLRule(archetypeId) : null;
  const nsLogic = getNegativeSpaceLogic(localeMeta.direction);

  return {
    locale: localeMeta,
    archetypeMetaphor: metaphor,
    visualBenchmark: benchmark,
    rtlRule,
    negativeSpace: nsLogic?.principle ?? "",
    fontStack: getLocaleFontStack(locale),
    fontScale: localeMeta.font_scale,
    lineHeightFactor: getLocaleLineHeightFactor(locale),
    typographyOverrides: getLocaleTypographyOverrides(locale),
  };
}
