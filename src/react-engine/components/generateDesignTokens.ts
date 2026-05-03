// =============================================================================
// generateDesignTokens — Converts archetype scores into concrete design tokens.
// Generates: 5-color palette, Google Font pair, border-radius, box-shadow,
// backdrop-filter values. Ready for Figma/Tilda import.
// =============================================================================

import type { ArchetypeId, UIThemeState } from "../archetypeWeights";

// ---- Color palettes per archetype ----
const ARCHETYPE_PALETTES: Record<ArchetypeId, {
  primary: string; secondary: string; accent: string;
  neutralLight: string; neutralDark: string;
}> = {
  ruler:     { primary: "#F5E6C8", secondary: "#C9A030", accent: "#D4AF37", neutralLight: "#FAF8F2", neutralDark: "#3D3828" },
  creator:   { primary: "#FFE4E1", secondary: "#9C27B0", accent: "#E91E63", neutralLight: "#FFF5F5", neutralDark: "#2D1B2E" },
  sage:      { primary: "#E6E6FA", secondary: "#5C6BC0", accent: "#7E57C2", neutralLight: "#F5F5FF", neutralDark: "#1E2035" },
  innocent:  { primary: "#F0F8FF", secondary: "#66BB6A", accent: "#AED581", neutralLight: "#FAFFFA", neutralDark: "#1E3320" },
  explorer:  { primary: "#CFFFE5", secondary: "#00ACC1", accent: "#26C6DA", neutralLight: "#F5FFFA", neutralDark: "#0D3328" },
  hero:      { primary: "#FFFACD", secondary: "#E53935", accent: "#FF7043", neutralLight: "#FFFDF5", neutralDark: "#3D1810" },
  magician:  { primary: "#E0FFFF", secondary: "#7B1FA2", accent: "#AB47BC", neutralLight: "#F8F5FF", neutralDark: "#1A0F2E" },
  outlaw:    { primary: "#F5F5F5", secondary: "#37474F", accent: "#FF5722", neutralLight: "#FAFAFA", neutralDark: "#111111" },
  jester:    { primary: "#FFF0F5", secondary: "#FF6F00", accent: "#FFAB00", neutralLight: "#FFFBF5", neutralDark: "#3D2800" },
  lover:     { primary: "#FFC0CB", secondary: "#C2185B", accent: "#F06292", neutralLight: "#FFF5F7", neutralDark: "#3D1020" },
  caregiver: { primary: "#F5FFFA", secondary: "#2E7D32", accent: "#43A047", neutralLight: "#F0FAF0", neutralDark: "#0D2818" },
  everyman:  { primary: "#FAFAD2", secondary: "#795548", accent: "#8D6E63", neutralLight: "#FDFDF5", neutralDark: "#2D2418" },
};

// ---- Font pairs per archetype geometry ----
const FONT_PAIRS: Record<string, { heading: string; body: string; googleImport: string }> = {
  organic:   { heading: "Playfair Display", body: "Inter", googleImport: "Playfair+Display:wght@400;600&family=Inter:wght@300;400;500" },
  architectural: { heading: "DM Sans", body: "DM Sans", googleImport: "DM+Sans:wght@400;500;700" },
  balanced:  { heading: "Manrope", body: "Inter", googleImport: "Manrope:wght@300;400;600&family=Inter:wght@300;400;500" },
};

// ---- RTL-safe font overrides ----
const RTL_FONTS: Record<string, string> = {
  heading: "IBM Plex Sans Arabic",
  body: "IBM Plex Sans Arabic",
  googleImport: "IBM+Plex+Sans+Arabic:wght@300;400;500;600",
};

export interface DesignTokens {
  palette: {
    primary: { hex: string; hsl: string };
    secondary: { hex: string; hsl: string };
    accent: { hex: string; hsl: string };
    neutralLight: { hex: string; hsl: string };
    neutralDark: { hex: string; hsl: string };
  };
  typography: {
    heading: string;
    body: string;
    googleImport: string;
    scale: { h1: string; h2: string; h3: string; body: string; caption: string };
  };
  ui: {
    borderRadius: { sm: string; md: string; lg: string };
    boxShadow: { subtle: string; medium: string; elevated: string };
    backdropBlur: string;
    spacing: { unit: string; tight: string; normal: string; generous: string };
  };
  motion: {
    easing: string;
    durationFast: string;
    durationNormal: string;
  };
}

/** Convert hex to HSL string */
function hexToHSL(hex: string): string {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

/**
 * Generate a complete set of design tokens from archetype scores + UI theme.
 */
export function generateDesignTokens(
  dominantArchetype: ArchetypeId,
  secondaryArchetype: ArchetypeId | null,
  uiTheme: UIThemeState,
  direction: "ltr" | "rtl",
): DesignTokens {
  const domPalette = ARCHETYPE_PALETTES[dominantArchetype] ?? ARCHETYPE_PALETTES.everyman;
  const secPalette = secondaryArchetype
    ? ARCHETYPE_PALETTES[secondaryArchetype]
    : null;

  // Blend accent: 70% dominant + 30% secondary
  const accentHex = secPalette
    ? blendHex(domPalette.accent, secPalette.accent, 0.7)
    : domPalette.accent;

  const palette = {
    primary:    { hex: domPalette.primary,    hsl: hexToHSL(domPalette.primary) },
    secondary:  { hex: domPalette.secondary,  hsl: hexToHSL(domPalette.secondary) },
    accent:     { hex: accentHex,             hsl: hexToHSL(accentHex) },
    neutralLight: { hex: domPalette.neutralLight, hsl: hexToHSL(domPalette.neutralLight) },
    neutralDark:  { hex: domPalette.neutralDark,  hsl: hexToHSL(domPalette.neutralDark) },
  };

  // Typography: geometric → organic gradient
  const geomKey = uiTheme.softness > 0.6 ? "organic"
    : uiTheme.softness < 0.35 ? "architectural"
    : "balanced";
  const fonts = direction === "rtl" ? RTL_FONTS : FONT_PAIRS[geomKey];

  const typography = {
    heading: fonts.heading,
    body: fonts.body,
    googleImport: fonts.googleImport,
    scale: {
      h1: `${2.2 + uiTheme.complexity * 0.8}rem`,
      h2: `${1.6 + uiTheme.complexity * 0.5}rem`,
      h3: `${1.3 + uiTheme.complexity * 0.3}rem`,
      body: "1rem",
      caption: "0.75rem",
    },
  };

  // UI properties
  const softRadius = Math.round(4 + uiTheme.softness * 40);
  const blurPx = Math.round(4 + uiTheme.complexity * 22);

  const ui = {
    borderRadius: {
      sm: `${Math.round(softRadius * 0.4)}px`,
      md: `${Math.round(softRadius * 0.65)}px`,
      lg: `${softRadius}px`,
    },
    boxShadow: {
      subtle: `0 2px 12px rgba(0,0,0,${(0.03 + uiTheme.softness * 0.04).toFixed(2)})`,
      medium: `0 8px 30px rgba(0,0,0,${(0.05 + uiTheme.softness * 0.06).toFixed(2)})`,
      elevated: `0 16px 48px rgba(0,0,0,${(0.08 + uiTheme.softness * 0.06).toFixed(2)})`,
    },
    backdropBlur: `blur(${blurPx}px)`,
    spacing: {
      unit: "8px",
      tight: `${Math.round(6 + uiTheme.complexity * 4)}px`,
      normal: `${Math.round(16 + uiTheme.complexity * 8)}px`,
      generous: `${Math.round(32 + uiTheme.complexity * 24)}px`,
    },
  };

  // Motion: from arrow (structured) to cloud (soft)
  const motionEasing = uiTheme.softness > 0.6
    ? "cubic-bezier(0.2, 0, 0, 1)"
    : uiTheme.softness < 0.35
      ? "cubic-bezier(0.7, 0, 1, 0.5)"
      : "cubic-bezier(0.4, 0, 0.2, 1)";

  const motion = {
    easing: motionEasing,
    durationFast: `${(150 + uiTheme.softness * 180).toFixed(0)}ms`,
    durationNormal: `${(350 + uiTheme.softness * 400).toFixed(0)}ms`,
  };

  return { palette, typography, ui, motion };
}

/** Simple hex blending */
function blendHex(hex1: string, hex2: string, ratio: number): string {
  const r1 = parseInt(hex1.slice(1, 3), 16);
  const g1 = parseInt(hex1.slice(3, 5), 16);
  const b1 = parseInt(hex1.slice(5, 7), 16);
  const r2 = parseInt(hex2.slice(1, 3), 16);
  const g2 = parseInt(hex2.slice(3, 5), 16);
  const b2 = parseInt(hex2.slice(5, 7), 16);
  const r = Math.round(r1 * ratio + r2 * (1 - ratio));
  const g = Math.round(g1 * ratio + g2 * (1 - ratio));
  const b = Math.round(b1 * ratio + b2 * (1 - ratio));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/** Export tokens as Figma-ready JSON string */
export function tokensToFigmaJSON(tokens: DesignTokens): string {
  return JSON.stringify({
    name: "ArchetypeOS Brand Passport",
    version: "1.0",
    colors: {
      primary: tokens.palette.primary.hex,
      secondary: tokens.palette.secondary.hex,
      accent: tokens.palette.accent.hex,
      neutralLight: tokens.palette.neutralLight.hex,
      neutralDark: tokens.palette.neutralDark.hex,
    },
    typography: {
      heading: tokens.typography.heading,
      body: tokens.typography.body,
      scale: tokens.typography.scale,
    },
    ui: tokens.ui,
    motion: tokens.motion,
  }, null, 2);
}
