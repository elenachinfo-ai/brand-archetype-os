# BRAND PASSPORT — [ARCHETYPE_NAME]

> *Prepared by ArchetypeOS Diagnostic Engine v2.0*
> *Classification: Strategic Brand Identity Synthesis*
> *Intended Audience: Creative Directors, Brand Strategists, Design Systems Architects*

---

## How We Arrived at This

The ArchetypeOS diagnostic engine determines brand archetype through a convergent, multi-signal methodology, not a single-axis questionnaire. The system administers an 8-question visual diagnostic that probes five core dimensions — brand motive, emotional signature, communication voice, client need-state, and product character — while simultaneously collecting passive behavioral telemetry across four sensor channels: mouse kinematics (trajectory directness, velocity, dwell), scroll dynamics (speed variance, direction-change frequency, smoothness), attention allocation (section dwell times by content type, revisit patterns via IntersectionObserver), and decision latency (CTA-click response time measured from first visibility). Each question answer applies a 4D vector delta (Control, Energy, Focus, Method), and each behavioral sensor contributes a normalized [−1, +1] signal to the same four dimensions in real time. These streams are fused via exponential moving average (α = 0.12) at a 500 ms tick rate, with a per-step delta clamp of ±15 to prevent signal shock. Confidence is computed as the inverse of vector volatility — the standard deviation of the last 8 snapshots across all four dimensions, normalized such that σ ≥ 15 maps to 0% confidence and σ = 0 maps to 100%. The archetype is locked only after 3 consecutive ticks above the 75% confidence threshold, ensuring the conclusion is not a fleeting impulse but a stable convergence of conscious preference and unconscious behavior. This is pattern recognition, not a personality quiz.

---

## 📜 Manifesto

> [MANIFESTO_TEXT]

*— ArchetypeOS Brand Strategy Division*

---

## 🎯 Strategic Positioning

| Dimension | Directive |
|---|---|
| **Behavior Model** | `[BEHAVIOR_MODEL]` |
| **UX Architecture** | [UX_STRUCTURE] |
| **User Relationship** | [UX_BEHAVIOR] |

### Brand Promise

**[HERO_TEXT]**

[HERO_SUB]

**Primary CTA:** [CTA_TEXT]

---

## 🎨 UI Tokens — Full Design System

### Color Palette

```css
/* === Primary Identity === */
--primary:         [ARCHETYPE_COLOR];
--primary-dim:     [COLOR_ACCENT_DIM];

/* === Secondary & Accent === */
--accent-warm:     [COLOR_ACCENT_BEIGE];
--accent-warm-dim: [COLOR_ACCENT_BEIGE_DIM];
--accent-cool:     [COLOR_ACCENT_GREEN];
--accent-cool-dim: [COLOR_ACCENT_GREEN_DIM];

/* === Background Hierarchy (Deep → Panel → Glass) === */
--bg-deep:         [COLOR_BG_DEEP];        /* Foundation — the space behind everything */
--bg-graphite:     [COLOR_BG_GRAPHITE];    /* Elevated surfaces */
--bg-panel:        [COLOR_BG_PANEL];       /* Interactive containers */
--bg-glass:        [COLOR_BG_GLASS];       /* Frosted overlays (backdrop-filter) */
--bg-glass-strong: [COLOR_BG_GLASS_STRONG];/* Modal & dialog glass */

/* === Borders === */
--border-subtle:   [COLOR_BORDER_SUBTLE];  /* Dividers, inactive edges */
--border-mid:      [COLOR_BORDER_MID];     /* Active/focused edges */

/* === Text Hierarchy === */
--text-primary:    [COLOR_TEXT_PRIMARY];   /* Body, headings */
--text-secondary:  [COLOR_TEXT_SECONDARY]; /* Labels, metadata */
--text-tertiary:   [COLOR_TEXT_TERTIARY];  /* Disabled, placeholders */

/* === Glow & Effects === */
--glow-ambient:    [COLOR_GLOW];           /* Subtle ambient radiance */
--glow-strong:     [COLOR_GLOW_STRONG];    /* Active/highlight glow */
```

### Typography System

| Token | Value | Application |
|---|---|---|
| **Font Stack** | `[FONT_BODY]` | Brand primary + system fallbacks |
| **Style Character** | [TYPOGRAPHY_STYLE] | — |
| **h1** | 2.25rem / 700–800 / −0.02em | Hero, manifesto |
| **h2** | 1.75rem / 600–700 / −0.01em | Section headers |
| **h3** | 1.25rem / 500–600 / 0 | Panel titles |
| **body** | 1rem / 400–500 / 0 | Primary content |
| **label** | 0.8125rem / 500 / +0.04em | UI labels, HUD |
| **caption** | 0.6875rem / 400 / +0.02em | Metadata, footnotes |

**Weight Hierarchy:** The archetype determines weight emphasis — some demand bold authority (Hero, Ruler), others favor refined lightness (Magician, Lover). The system respects the typographic spirit: *"Type has spirit. Words have meaning."* — Paula Scher.

### Spatial System

**Border Radius Tokens:**

| Token | Value | Character |
|---|---|---|
| `--radius-sm` | [RADIUS_SM] | Buttons, inputs, chips |
| `--radius-md` | [RADIUS_MD] | Cards, panels, modals |
| `--radius-lg` | [RADIUS_LG] | Hero sections, featured containers |

**Spacing Scale** (4 px base grid):

```
xs:  4px    sm:  8px    md:  16px
lg:  24px   xl:  32px   2xl: 48px
3xl: 64px   4xl: 96px
```

**Panel Transparency Levels:**

| Layer | Opacity | Use |
|---|---|---|
| Glass (light) | 0.55–0.65 | Hover overlays, subtle sections |
| Glass (strong) | 0.75–0.90 | Modals, dialogs, persistent panels |

### Motion Language

**Easing Curves:**

| Token | Value | Rationale |
|---|---|---|
| `--transition-fast` | [TRANSITION_FAST] | Micro-interactions: hover, focus, toggle. [MOTION_RATIONALE_FAST] |
| `--transition-normal` | [TRANSITION_NORMAL] | Panel transitions, page reveals, archetype pivot. [MOTION_RATIONALE_NORMAL] |

**Duration Hierarchy:**

| Class | Duration | Usage |
|---|---|---|
| Instant | 80–120 ms | Checkbox, switch, ripple |
| Micro | 150–250 ms | Hover, tooltip, selection highlight |
| Standard | 300–500 ms | Panel open/close, tab switch |
| Narrative | 600–900 ms | Page transitions, archetype pivot, scan reveal |
| Ceremonial | 1000–2000 ms | Brand moment of truth, lock animation |

**Animation Character:** [MOTION_STYLE]

### Visual Effects

**Backdrop Filter:**

```css
backdrop-filter: blur(18px) saturate(140%);
-webkit-backdrop-filter: blur(18px) saturate(140%);
```

Applied to all `--bg-glass` and `--bg-glass-strong` surfaces.

**Glow Presets:**

| Preset | Value | Application |
|---|---|---|
| Ambient | [COLOR_GLOW] | Background radiance, inactive brand dot |
| Active | [COLOR_GLOW_STRONG] | Active elements, locked brand dot, CTA hover |
| Scan Line | `linear-gradient(180deg, transparent, [ARCHETYPE_COLOR]80, [ARCHETYPE_COLOR]cc, [ARCHETYPE_COLOR]80, transparent)` | Pivot transition sweep |

**Particle Behavior** (Three.js / Canvas):

The 3D canvas field renders a dynamic particle system whose visual character shifts with the archetype:

| Property | Value |
|---|---|
| Grid Color | [CANVAS_GRID] |
| Connection Line | [CANVAS_LINE] |
| Dot Glow | [CANVAS_DOT_GLOW] |
| Background Glow | [CANVAS_BG_GLOW] |

**Grid / Overlay Patterns:**

The archetypal grid is a low-opacity structural weave that reinforces the spatial logic. High-control archetypes (Ruler, Sage) receive denser, more orthogonal grids. High-energy archetypes (Rebel, Jester) receive disrupted, asymmetric patterns. The grid serves as a subliminal spatial signature — invisible until you look for it, but felt in every frame.

---

## 🧠 UX Logic — The Psychology

### Emotional Target
*What the user should feel:*

[PSYCH_PROFILE]

### Behavioral Target
*What the user should do:*

The behavioral model `[BEHAVIOR_MODEL]` defines the user's journey arc. Each stage must be architecturally supported:
- **Entry:** The first 400 ms determine whether the user stays. The visual signature must telegraph the archetype instantly.
- **Progression:** Each interaction deepens the archetypal relationship. No dead ends — every state must lead meaningfully forward.
- **Climax:** The "moment of truth" (archetype lock + pivot animation) is the emotional peak. It must feel earned, not automated.
- **Resolution:** Post-lock, the transformed UI reinforces identity. The user sees *their* brand reflected back at them.

### Pitfalls to Avoid — The Shadow Side

Every archetype carries a shadow — the corrupted expression of its core drive. These anti-patterns must be actively designed against:

| Archetype | Shadow | Anti-Pattern |
|---|---|---|
| Hero | Arrogance | Overly aggressive CTAs; dismissing user hesitation as weakness |
| Magician | Manipulation | "Magical" effects that deceive rather than reveal; dark patterns |
| Ruler | Tyranny | Inflexible hierarchy; removing user agency in the name of "order" |
| Caregiver | Martyrdom | Self-sacrificing UX that exhausts the brand; over-nurturing that creates dependency |
| Lover | Superficiality | Aesthetic without substance; seductive UI that leads nowhere |
| Jester | Irreverence | Humor that undermines trust; playfulness that trivializes serious decisions |
| Everyman | Invisibility | So "relatable" it becomes forgettable; no distinctive point of view |
| Explorer | Aimlessness | Endless discovery without destination; navigation that never converges |
| Rebel | Nihilism | Destruction without proposed alternative; aggression that alienates |
| Creator | Perfectionism | Infinite iteration that prevents launch; "coming soon" forever |
| Sage | Dogmatism | Knowledge wielded as gatekeeping; complexity used to exclude |
| Innocent | Naïveté | Optimism disconnected from reality; ignoring genuine user concerns |

### Decision Architecture

Choices within an archetype-aligned interface follow a consistent logic:

- **High Control** (Ruler, Sage): Fewer options, hierarchically weighted. The brand curates — the user selects with confidence.
- **High Energy** (Hero, Rebel, Jester): Bold binary choices. Momentum over deliberation.
- **High Focus** (Sage, Creator, Magician): Layered disclosure. Depth available on demand; surface remains clean.
- **High Method** (Magician, Creator, Caregiver): Process-emphasizing flows. The journey is as important as the destination.

---

## 🌍 Cross-Cultural Adaptation Notes

The ArchetypeOS engine supports three locales with culturally-aware visual remapping. Archetype identity is universal, but its expression must breathe with local aesthetic traditions.

### RU — Русский

| Dimension | Adaptation |
|---|---|
| **Font Stack** | `'Manrope', 'Inter', -apple-system, sans-serif` — Cyrillic-optimized with proper italic hinting |
| **Font Scale** | 1.0× (baseline) |
| **Cultural Anchor** | Heroic narrative tradition, constructivist spatial drama, the weight of meaning |
| **Key Difference** | Russian audiences respond to *depth of narrative*. The archetype story must feel mythic, not merely commercial. Headlines carry more weight; negative space signals importance, not absence. |
| **Color Shift** | Slightly deeper saturation — Russian visual culture tolerates (and expects) richer chroma in brand identity. |
| **Motion** | More deliberate pacing — fast gratuitous animation reads as frivolous. Earn every frame. |

### EN — English

| Dimension | Adaptation |
|---|---|
| **Font Stack** | `'Manrope', 'Inter', -apple-system, sans-serif` — Latin-optimized, geometric clarity |
| **Font Scale** | 1.0× (baseline) |
| **Cultural Anchor** | Directness, clarity, understatement until the moment demands drama |
| **Key Difference** | English-language audiences respond to *confidence without arrogance*. The archetype must demonstrate, not declare. Show, then tell — briefly. |
| **Color Shift** | Neutral baseline — the archetype color is used as a strategic accent, not an atmospheric flood. |
| **Motion** | Efficient, purposeful. Animation should clarify hierarchy, not decorate it. |

### AR — العربية (RTL)

| Dimension | Adaptation |
|---|---|
| **Font Stack** | `'Noto Naskh Arabic', 'Scheherazade New', 'Traditional Arabic', serif` — Calligraphic integrity preserved |
| **Font Scale** | 1.05× (Arabic script requires slightly larger optical size for equivalent legibility) |
| **Line Height** | 1.75× (accommodates diacritical marks and elongated character forms) |
| **Letter Spacing** | 0 (Arabic is inherently connected — tracking disrupts ligatures) |
| **Direction** | RTL — full layout mirroring |
| **Cultural Anchor** | Ornamental density, geometric pattern traditions, negative space as active design element |
| **Key Difference** | Arabic visual culture treats *negative space as a positive design element*, not emptiness. Ornamentation is structural, not decorative. The archetype must express through geometric abundance, not minimalist restraint. |

**RTL-Specific CSS Overrides:**

```css
/* Applied automatically when locale === 'ar' */
[dir="rtl"] {
  --transform-origin: right center;          /* Animations originate from right */
  --animation-enter: translateX(-20px);      /* Elements enter from left */
  --text-align-default: right;
  --flex-direction-row: row-reverse;
  --border-radius-remap: /* TL/TR/BR/BL → TR/TL/BL/BR */;
}
```

**Per-Archetype RTL Notes:**

| Archetype | RTL Adaptation |
|---|---|
| Hero | Accent direction flows right-to-left; grid orientation mirrors |
| Ruler | Ornamentation density increases — Arabic visual expectation of prestige |
| Lover | Curvilinear visual language aligns naturally with Arabic calligraphic fluidity |
| Magician | Negative space treated as mystical void — aligns with geometric pattern traditions |
| Sage | Text-heavy layouts reflow naturally; Arabic readers expect depth via text, not whitespace |
| Jester | Playful asymmetry preserved but mirrored; surprise direction reverses |

**Negative Space Logic:**

| Tradition | Principle |
|---|---|
| European (LTR) | Space is absence — the void between objects. Minimalism = removing until nothing can be removed. |
| Arabic (RTL) | Space is presence — the field that gives objects meaning. Density creates rhythm; emptiness creates emphasis through contrast, not isolation. |

*Design Implication:* When adapting an archetype for Arabic audiences, do not simply mirror the layout. Reconsider the spatial composition — what reads as "clean" in LTR may read as "empty" in RTL. Negative space must be intentional, not residual.

---

## 📊 4D Vector Profile

The Brand Vector maps the archetype across four independent psychological dimensions, each scored 0–100. These are not personality traits — they are *operating parameters* that govern how the brand behaves across every touchpoint.

| Dimension | Score | Interpretation |
|---|---|---|
| **Control** | [VECTOR_CONTROL]/100 | [CONTROL_INTERPRETATION] |
| **Energy** | [VECTOR_ENERGY]/100 | [ENERGY_INTERPRETATION] |
| **Focus** | [VECTOR_FOCUS]/100 | [FOCUS_INTERPRETATION] |
| **Method** | [VECTOR_METHOD]/100 | [METHOD_INTERPRETATION] |

```
Control  ████████████████████░░░░  [VECTOR_CONTROL]
Energy   ██████████████████████░░  [VECTOR_ENERGY]
Focus    ████████████████████░░░░  [VECTOR_FOCUS]
Method   ██████████████████░░░░░░  [VECTOR_METHOD]
```

### Dimensional Interpretation Guide

**Control** (0 = chaotic, 100 = structured):
- *0–30:* The brand thrives in disruption. Structure is the enemy. (Rebel, Jester)
- *31–60:* Balanced flexibility — frameworks exist but don't constrain. (Explorer, Everyman, Creator)
- *61–100:* Architecture is identity. Every element has its place. (Ruler, Sage, Hero)

**Energy** (0 = calm, 100 = dynamic):
- *0–30:* Stillness is strategic. The brand speaks quietly and is leaned into. (Sage, Innocent)
- *31–60:* Measured dynamism — movement with purpose. (Caregiver, Everyman, Ruler)
- *61–100:* Velocity is the message. The brand moves and the user moves with it. (Hero, Rebel, Jester, Magician)

**Focus** (0 = diffuse, 100 = concentrated):
- *0–30:* Wide-angle lens. Everything is interesting; nothing is isolated. (Jester, Rebel, Innocent)
- *31–60:* Selective attention. The brand knows what matters and ignores the rest. (Explorer, Lover, Everyman)
- *61–100:* Laser precision. Depth over breadth, always. (Sage, Ruler, Hero, Creator)

**Method** (0 = intuitive, 100 = systematic):
- *0–30:* Gut-driven. Process follows impulse, not the reverse. (Rebel, Jester)
- *31–60:* Balanced approach — intuition informed by structure. (Everyman, Explorer, Lover, Innocent)
- *61–100:* Systematic rigor. The method is the message. (Magician, Sage, Creator, Ruler)

---

## 🔗 Implementation Map

### CSS Variable File Reference

All theme tokens are defined in `archetype-themes.js` under `ArchetypeThemes.[ARCHETYPE_ID].vars` and injected into `:root` via `Pivot._applyTheme()`. The default holographic theme is held in `styles.css :root` and restored via `Pivot.resetToDefault()`.

**Source files:**

| File | Role |
|---|---|
| `styles.css` | Default CSS custom properties (`:root`); layout system; HUD styling; result modal |
| `archetype-themes.js` | 12 archetype theme maps (`ArchetypeThemes`); each contains `vars` (CSS properties) and `canvas` (Three.js/Canvas overrides) |
| `pivot.js` | Theme application engine — `Pivot.execute(archetypeId)` sets all `:root` variables, canvas colors, body font, and runs the scan-line transition animation |
| `archetype-result.js` | Result popup renderer — reads from `archetypes[]` and `ArchetypeThemes[]` to display the Brand Passport summary |

### Three.js / Canvas Targets

The 3D brand-positioning field is rendered on a `<canvas>` element with 2D context (`engine.js`, `drawField()`). Canvas color overrides are stored in `window.__pivotCanvas` and applied during the draw loop.

**Canvas property mapping:**

```
ArchetypeThemes.[id].canvas.grid    → grid line strokeStyle
ArchetypeThemes.[id].canvas.line    → connection line color (brand dot → nearest archetype)
ArchetypeThemes.[id].canvas.dotGlow → radial gradient center color for brand dot
ArchetypeThemes.[id].canvas.bgGlow  → radial gradient for nearest-archetype ambient glow
```

### Animation Preset Reference

| Animation | Trigger | Duration | Curve |
|---|---|---|---|
| **Scan Line Sweep** | `Pivot.execute()` — Phase 1 | 400 ms | Linear (top → bottom) |
| **Text Fade-in** | Midpoint of scan sweep | 200 ms | Ease-out |
| **CSS Variable Transition** | `Pivot._applyTheme()` + `_reveal()` | 600 ms | `cubic-bezier(0.4, 0, 0.2, 1)` |
| **Vector Snap Animation** | `Interpreter._lockArchetype()` → `animateToVector()` | 800 ms | Custom ease (linear → decelerate) |
| **Result Modal Entrance** | `ArchetypeResult.show()` | 400 ms | `translateY(20px → 0)` + opacity |
| **Status Dot Pulse** | Continuous (HUD) | 2 s | `ease-in-out` infinite |

---

## 📋 Archetype Quick-Reference Matrix

For rapid creative direction, the 12 archetypes reduced to their essential signals:

| Archetype | Color | Vector (C/E/F/M) | One-Line Essence |
|---|---|---|---|
| Hero | `#e74c3c` | 75/90/80/60 | *Victory through courageous action.* |
| Magician | `#9b59b6` | 60/85/70/90 | *Transformation through wonder.* |
| Ruler | `#f39c12` | 95/60/90/85 | *Order that builds legacy.* |
| Caregiver | `#27ae60` | 50/40/60/70 | *Strength through service.* |
| Lover | `#e91e63` | 40/80/50/60 | *Connection through devotion.* |
| Jester | `#ff9800` | 30/95/30/40 | *Truth through joy.* |
| Everyman | `#795548` | 45/50/50/50 | *Belonging through honesty.* |
| Explorer | `#00bcd4` | 35/75/40/55 | *Freedom through discovery.* |
| Rebel | `#ff5722` | 20/90/30/25 | *Liberation through disruption.* |
| Creator | `#673ab7` | 55/70/75/80 | *Vision through expression.* |
| Sage | `#607d8b` | 70/30/90/85 | *Wisdom through understanding.* |
| Innocent | `#8bc34a` | 25/40/35/45 | *Paradise through hope.* |

---

## 📐 Production Notes

### Template Variable Map

This document is a **template** rendered by the `ArchetypeResult` module. All bracketed tokens (`[TOKEN_NAME]`) are replaced at render time with live data from `archetypes[]`, `ArchetypeThemes[]`, and the interpreter's computed vector.

**Token resolution order:**

1. **Archetype identity:** `archetypes.find(a => a.id === result.id)` → `[ARCHETYPE_NAME]`, `[ARCHETYPE_COLOR]`, `[BEHAVIOR_MODEL]`, etc.
2. **Theme tokens:** `ArchetypeThemes[result.id].vars` → `[COLOR_BG_DEEP]`, `[RADIUS_SM]`, `[TRANSITION_FAST]`, etc.
3. **Canvas tokens:** `ArchetypeThemes[result.id].canvas` → `[CANVAS_GRID]`, `[CANVAS_LINE]`, etc.
4. **Live vector:** `userVector` (or locked archetype vector) → `[VECTOR_CONTROL]`, `[VECTOR_ENERGY]`, etc.
5. **Locale context:** `culture_logic.json` → `[LOCALE]`, RTL adaptations

### Export Formats

- **Markdown:** This document, as-is, for Notion, Obsidian, GitHub wikis, or any markdown-compatible knowledge base.
- **HTML Injection:** Rendered via `ArchetypeResult.show()` into the result modal popup — a condensed version of key sections.
- **PDF Export:** Print-stylesheet-ready. The document uses CSS `@page` compatibility and avoids fixed-position elements in the printable content layer.

### Version

```
ArchetypeOS Brand Passport Template v2.0
Diagnostic Engine: ArchetypeOS r2
Last Updated: 2025-01
Classification: Internal — Creative Director & Strategist
```

---

> *"Words have meaning. Type has spirit. The combination is spectacular."*
> — Paula Scher, Pentagram

> *This Brand Passport is the strategic conclusion of a convergent diagnostic process. It is not a test result — it is a design recommendation from the ArchetypeOS engine to the creative team who will bring this brand to life.*
