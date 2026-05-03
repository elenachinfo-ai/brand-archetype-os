# BRAND PASSPORT — THE MAGICIAN (Архетип Мага)

> *Prepared by ArchetypeOS Diagnostic Engine v2.0*
> *Classification: Strategic Brand Identity Synthesis*
> *Intended Audience: Creative Directors, Brand Strategists, Design Systems Architects*
> *Dominant Archetype: MAGICIAN (83%) · Secondary: CREATOR (71%)*

---

## How We Arrived at This

The ArchetypeOS diagnostic engine determines brand archetype through a convergent, multi-signal methodology, not a single-axis questionnaire. The system administers an 8-question visual diagnostic that probes five core dimensions — brand motive, emotional signature, communication voice, client need-state, and product character — while simultaneously collecting passive behavioral telemetry across four sensor channels: mouse kinematics (trajectory directness, velocity, dwell), scroll dynamics (speed variance, direction-change frequency, smoothness), attention allocation (section dwell times by content type, revisit patterns via IntersectionObserver), and decision latency (CTA-click response time measured from first visibility). Each question answer applies a 4D vector delta (Control, Energy, Focus, Method), and each behavioral sensor contributes a normalized [−1, +1] signal to the same four dimensions in real time. These streams are fused via exponential moving average (α = 0.12) at a 500 ms tick rate, with a per-step delta clamp of ±15 to prevent signal shock. Confidence is computed as the inverse of vector volatility — the standard deviation of the last 8 snapshots across all four dimensions, normalized such that σ ≥ 15 maps to 0% confidence and σ = 0 maps to 100%. The archetype is locked only after 3 consecutive ticks above the 75% confidence threshold, ensuring the conclusion is not a fleeting impulse but a stable convergence of conscious preference and unconscious behavior. This is pattern recognition, not a personality quiz.

**Diagnostic Pathway for This Brand:** The vector converged rapidly on the Magician quadrant after Q2 (Matte vs Glass — answer: «Glass, with light refraction»). Q5 (Temperature — answer: «Cool, crystalline 7500K») reinforced the Magician/Creator edge. Behavioral telemetry confirmed: scroll dynamics showed fluid, exploration-heavy patterns (Explorer-adjacent), while mouse kinematics revealed precise, deliberate clicks on transformation-focused metaphors — consistent with the Magician's deliberate wonder.

---

## 📜 Manifesto

> *«Мы не продаём продукт. Мы создаём пространство, где невозможное становится реальностью. Каждое взаимодействие с брендом — это трансформация: от обыденного к волшебному, от известного к непознанному. Наш интерфейс — не инструмент, а портал. Мы — алхимики пользовательского опыта.»*

*— ArchetypeOS Brand Strategy Division*

---

## 🎯 Strategic Positioning

| Dimension | Directive |
|---|---|
| **Behavior Model** | `Transformational` — бренд не обслуживает потребность, он меняет состояние пользователя |
| **UX Architecture** | Layered revelation — информация раскрывается не линейно, а портально: каждый слой глубже предыдущего, создавая ощущение открытия |
| **User Relationship** | Mentor-Guide — бренд ведёт пользователя через трансформацию, но не командует; он предлагает путь и даёт инструменты |

### Brand Promise

**«Откройте то, что скрыто.»**

*Discover what lies beneath the surface. Every interaction reveals a new layer of possibility.*

**Primary CTA:** «Начать трансформацию» / «Begin the Transformation»

---

## 🎨 UI Tokens — Full Design System

### Color Palette

```css
/* === Primary Identity === */
/* Magician archetype: deep lapis lazuli with amethyst undertones,
   inspired by Jābir ibn Ḥayyān's alchemical tradition */
--primary:         #3F51B5;  /* Lapis lazuli — wisdom, depth, transformation */
--primary-dim:     #303F9F;  /* Deeper lapis for hover/active states */

/* === Secondary & Accent === */
--accent-warm:     #FFC107;  /* Alchemical gold — the transmutation target */
--accent-warm-dim: #FFA000;  /* Aged gold for secondary emphasis */
--accent-cool:     #9C27B0;  /* Amethyst — mystical, transformative */
--accent-cool-dim: #7B1FA2;  /* Deep amethyst for depth */

/* === Background Hierarchy (Deep → Panel → Glass) === */
--bg-deep:         #0A0A1A;  /* Midnight void — the unknown before revelation */
--bg-graphite:     #12122A;  /* Elevated surfaces — deep indigo */
--bg-panel:        rgba(18, 18, 42, 0.85); /* Interactive containers */
--bg-glass:        rgba(63, 81, 181, 0.08); /* Frosted overlays — lapis tint */
--bg-glass-strong: rgba(63, 81, 181, 0.15); /* Modal glass — stronger lapis presence */

/* === Borders === */
--border-subtle:   rgba(156, 39, 176, 0.15); /* Amethyst dividers */
--border-mid:      rgba(156, 39, 176, 0.4);  /* Active edges — glow of transformation */

/* === Text Hierarchy === */
--text-primary:    #E8EAF6;  /* Near-white indigo — high readability on deep bg */
--text-secondary:  #9FA8DA;  /* Softened indigo for metadata */
--text-tertiary:   #5C6BC0;  /* Muted lapis for disabled states */

/* === Glow & Effects === */
--glow-ambient:    rgba(156, 39, 176, 0.2);  /* Amethyst ambient radiance */
--glow-strong:     rgba(255, 193, 7, 0.4);   /* Gold active glow — the alchemical flash */
```

### Typography System

| Token | Value | Application |
|---|---|---|
| **Font Stack** | `'Manrope', 'Inter', system-ui, sans-serif` | Brand primary + system fallbacks. Thin weights (200–400) preferred for Magician — elegance through lightness |
| **Style Character** | Mysterious, elegant, flowing — thin weights with generous line-height; headings feel like incantations |
| **h1** | 2.5rem / 200 / −0.02em | Hero, manifesto — thin, airy, almost weightless |
| **h2** | 1.75rem / 300 / −0.01em | Section headers — understated authority |
| **h3** | 1.25rem / 400 / 0 | Panel titles — regular weight for clarity |
| **body** | 1rem / 400 / 0 | Primary content — clean readability |
| **label** | 0.8125rem / 500 / +0.06em | UI labels, HUD — expanded tracking for tech feel |
| **caption** | 0.6875rem / 300 / +0.04em | Metadata, footnotes — light and airy |

**Weight Hierarchy:** The Magician demands refined lightness. Bold weights are reserved for moments of revelation — the alchemical «flash». Standard UI uses thin-to-regular (200–400). The typographic spirit: *«Letters are vessels for transformation. The thinner the vessel, the more magic it can hold.»*

### Spatial System

**Border Radius Tokens:**

| Token | Value | Character |
|---|---|---|
| `--radius-sm` | 12px | Buttons, inputs, chips — softly rounded, inviting touch |
| `--radius-md` | 22px | Cards, panels, modals — flowing organic geometry |
| `--radius-lg` | 36px | Hero sections, featured containers — dramatic curves |

**Spacing Scale** (4 px base grid):

```
xs:  4px    sm:  8px    md:  16px
lg:  24px   xl:  32px   2xl: 48px
3xl: 64px   4xl: 96px
```

**Panel Transparency Levels:**

| Layer | Opacity | Use |
|---|---|---|
| Glass (light) | 0.45–0.55 | Hover overlays, subtle sections — magician's veil |
| Glass (strong) | 0.65–0.80 | Modals, dialogs — the reveal layer |

### Motion Language

**Easing Curves:**

| Preset | Curve | Character | Use |
|---|---|---|---|
| `--ease-magic` | `cubic-bezier(0.3, 0, 0.7, 1)` | Fluid wave — particles drifting through ether | Default transitions, panel reveals |
| `--ease-reveal` | `cubic-bezier(0.1, 0, 0, 1)` | Slow emergence — something materializing from nothing | Modal entrances, first-time reveals |
| `--ease-flash` | `cubic-bezier(0.4, 0, 0.2, 1)` | Controlled burst — the alchemical moment | Harmony Flash (when score > 90%), CTA emphasis |
| `--ease-morph` | `cubic-bezier(0.5, 0, 0.5, 1)` | Continuous transformation | 3D core geometry transitions |

**Duration Tokens:**

| Token | Value | Character |
|---|---|---|
| `--duration-fast` | 0.3s | Quick micro-interactions — particle responses |
| `--duration-normal` | 0.6s | Standard transitions — panel reveals, tab switches |
| `--duration-slow` | 0.9s | Transformations — core geometry morph, aura emergence |

### Visual Effects

```css
/* Backdrop Filter — Magician's depth */
--backdrop-blur:      30px;   /* Deep blur — the world beyond the veil */
--backdrop-saturate:  190%;   /* Vibrant bleed — magic saturates its container */

/* Glass opacity */
--glass-opacity:      0.6;    /* Semi-transparent — seeing through, not seeing clearly */

/* Glow — the Magician's signature */
--glow-intensity:     0.75;   /* Strong ambient radiance */

/* Particles — alchemical atmosphere */
--particle-density:   2.5;    /* Dense particle field — motes of magic */

/* Grid — subtle geometric underlay */
--grid-opacity:       0.04;   /* Barely visible — like ley lines */

/* Color — cool, transformative */
--color-temperature:  7500K;  /* Cool crystalline — the light of revelation */
--color-interpolation: oklch; /* Perceptually smooth gradients */
```

---

## 🧠 UX Logic — The Psychology

### Emotional Target

**Primary Emotion:** Wonder (удивление, دهشة)

**Secondary Emotion:** Curiosity → Revelation

The user should progress through the interface feeling they are **discovering secrets**, not consuming content. Each scroll, each click, should feel like turning a page in a grimoire.

**Emotional Arc:**
1. **Intrigue** (onboarding) — «What is this place?»
2. **Fascination** (questions 1–4) — «These questions see something in me…»
3. **Revelation** (questions 5–8) — «I'm understanding something about my brand I couldn't articulate before»
4. **Empowerment** (result + export) — «I have a tool. I can use this.»

### Behavioral Target

- **Dwell time:** Extended — users should want to stay and explore. Average session: 4–8 minutes.
- **Return rate:** High — the diagnostic should feel deep enough to revisit with different hypothetical brands.
- **Share behavior:** High — the result should feel like a secret worth passing on: «Look what this tool revealed about my brand.»
- **Export conversion:** > 40% — users should want to take the Brand Passport with them.

### Pitfalls to Avoid — The Shadow Side

| Shadow | Risk | Mitigation |
|---|---|---|
| **Manipulator** | Interface feels manipulative — «tricking» users into results | Always show the math. The Radar Chart and 4D vector are visible throughout. Transparency is the antidote to manipulation. |
| **Obscurantist** | Too mysterious — user doesn't understand what's happening | Progressive disclosure with clear microcopy. Onboarding hints. «Why this question?» tooltips. |
| **Disconnected** | Beautiful but impractical — form over function | Every visual effect must serve a diagnostic purpose. No decorative-only elements. |

### Decision Architecture

- **No wrong answers.** Every answer is a valid expression of brand identity. The system doesn't judge — it reveals.
- **Reversible exploration.** Users can go back to any question and change their answer. The 3D core morphs in real-time — immediate, visible consequence.
- **The «Aha» moment.** Q8 (Brand Aura) is designed as the climactic question where everything clicks. The aura visualization should be the most dramatic visual effect in the entire experience.

---

## 🌍 Cross-Cultural Adaptation Notes

### RU — Русский

**Metaphor:** «Алхимик в лаборатории чудес»

**Tone Shift:** The Russian Magician carries overtones of the fairy-tale wizard — Baba Yaga to Firebird transformation. More narrative, less clinical than the English version.

**Typography:** Thin Cyrillic weights (Manrope 200–300). Cyrillic italics differ from Latin — ensure the font supports Cyrillic italic glyphs for emphasis.

**Color:** Deeper purple (#7B1FA2) — the Russian magical tradition associates purple with mystery more than blue.

**Spacing:** Russian text is ~8% longer than English equivalents — account for this in panel widths.

### EN — English

**Metaphor:** «Alchemist in a laboratory of wonders»

**Tone:** Merlin/Gandalf archetype. Wonder through transformation. The English Magician is a guide — wise, slightly removed, offering tools rather than commands.

**Typography:** Thin Latin weights. Title case acceptable for headings but avoid ALL-CAPS — the Magician doesn't shout.

**Color:** Lapis (#3F51B5) with amethyst (#9C27B0) accents. Silver (#E0E0E0) for UI chrome.

### AR — العربية (RTL)

**Metaphor:** «كيميائي في مختبر العجائب، سرّ التحويل» (Alchemist in a laboratory of wonders, secret of transmutation)

**Cultural Root:** Rooted in the Islamic alchemical tradition of **Jābir ibn Ḥayyān** (Geber) — the historical father of chemistry. This is not fantasy magic; it is the **science of transformation**.

**Typography:** Diwani-inspired flowing curves for headings. Naskh for body. The act of writing as visual alchemy — calligraphic strokes that morph and transform.

**Color:** Lapis lazuli (#3F51B5) — historically traded along the Silk Road, deeply associated with Islamic manuscript illumination. Alchemical gold (#FFC107) for accents.

**Spatial:** Alchemical-laboratory layout: transmutation circles, geometric star tessellations that morph (square → octagon → star), light-beams through mashrabiya lattices.

**Motion:** Geometric-star morphing sequences. Tessellation-dissolve transitions — patterns that complete and then dissolve into new configurations.

**Key Difference from Western Magician:** NOT fantasy magic. The Arabic Magician is the **scientist-transformer** — geometry as transformative secret. The wonder comes from mathematical beauty, not supernatural intervention.

**RTL CSS Overrides:**

```css
[dir="rtl"] {
  /* Shadow falls to the left — light source from top-right */
  --box-shadow-h-offset-multiplier: -1;

  /* Entrances from the right */
  --animation-enter-from: right;

  /* Geometric stars rotate clockwise in RTL (mirrored from LTR) */
  --star-rotation-direction: -1;

  /* Border-radius origin at top-right */
  --border-radius-origin: top-right;
}
```

---

## 📊 4D Vector Profile

| Dimension | Score | Interpretation |
|---|---|---|
| **Control** | 38/100 | Low control — the Magician doesn't command; he suggests, reveals, transforms |
| **Energy** | 78/100 | High energy — transformation requires active force. Not aggressive energy, but alchemical intensity |
| **Focus** | 62/100 | Moderate-high focus — the Magician has a clear vision but remains open to unexpected transmutations |
| **Method** | 85/100 | Very high method — the Magician's «magic» is actually systematic knowledge. Transformation follows rules, even if they're hidden |

### Dimensional Interpretation Guide

- **Control (38):** The brand does not impose order. It creates conditions where transformation emerges naturally. Think: a catalyst, not a commander.
- **Energy (78):** High transformative energy. The brand is active, not passive. It drives change rather than waiting for it.
- **Focus (62):** The brand knows what it wants to achieve but leaves room for serendipity. The alchemist has a goal (gold) but is open to discovering new elements along the way.
- **Method (85):** This is the key insight: the Magician's power is **systematic**. The «magic» is actually deep expertise applied with precision. The interface should feel intuitive to the user but be rigorously engineered underneath.

---

## 🔗 Implementation Map

### CSS Variable File Reference

```
File: diagnostic-expanded.json → css_variable_registry
Keys to apply:
  --radius-sm:        12px   (magician: 12)
  --radius-md:        22px   (magician: 22)
  --radius-lg:        36px   (magician: 36)
  --backdrop-blur:    30px   (magician: 30)
  --backdrop-saturate: 190%  (magician: 190)
  --glass-opacity:    0.6    (magician: 0.6)
  --color-interpolation: oklch
  --transition-easing: wave  (cubic-bezier(0.3, 0, 0.7, 1))
  --transition-duration-normal: 0.6s
  --glow-intensity:   0.75
  --grid-opacity:     0.04
  --particle-density: 2.5
  --color-temperature: 7500K
```

### Three.js / Canvas Targets

```
File: diagnostic-expanded.json → threejs_targets
Apply:
  coreMesh.geometry:   metaball (fluid, morphing)
  coreMesh.frequency:  1.5 (mid-frequency noise — fluid waves)
  coreMesh.amplitude:  0.3 (significant but not shattering deformation)
  particleField.density: 2.5
  particleField.speed:   0.7 (slow, drifting particles)
  particleField.color:   lapis → amethyst gradient
  lightRig.kelvin:       7500K (cool crystalline)
  lightRig.intensity:    1.2 (bright but not harsh)
  lightRig.type:         specular (caustic light patterns — light through crystal)
  wireframe.opacity:     0.15 (subtle geometric skeleton visible underneath)
```

### Animation Preset Reference

```
File: diagnostic-expanded.json → css_animation_presets
Active presets:
  wave:  cubic-bezier(0.3, 0, 0.7, 1) — fluid, continuous
         Character: morphing particles, drifting ether
  pulse: cubic-bezier(0.4, 0, 0.2, 1) — controlled burst
         Character: alchemical flash, revelation moments
```

---

## 📋 Archetype Quick-Reference Matrix

| Archetype | Dominance % | 2D Position (x, y) | Color Anchor | Shape Language |
|---|---|---|---|---|
| **Magician** | **83%** | (0.5, −0.8) | Lapis #3F51B5 | Fluid metaballs, morphing geometry |
| Creator | 71% | (0.5, 0.8) | Violet #673AB7 | Organic, expressive asymmetry |
| Explorer | 58% | (1.0, 0.5) | Teal #00838F | Open horizons, star particles |
| Sage | 42% | (−0.5, 0.8) | Slate #4A6B7C | Clean grids, manuscript texture |
| Jester | 38% | (−1.0, −0.5) | Orange #E65100 | Irregular, bouncy |
| Lover | 35% | (−0.8, 0.0) | Ruby #9B1B30 | Curves, rhythmic patterns |
| Ruler | 28% | (0.0, 1.0) | Brass #B5A642 | Symmetry, geometric order |
| Innocent | 25% | (−1.0, 0.5) | Dawn peach #FFCCBC | Simple, pure |
| Hero | 22% | (1.0, −0.5) | Desert gold #D4A017 | Diagonals, sharp angles |
| Caregiver | 20% | (−0.5, 0.5) | Jade #1B7A3D | Organic, enveloping |
| Everyman | 18% | (0.0, 0.0) | Sandstone #A0866B | Honest, unpretentious |
| Rebel | 15% | (−0.5, −0.8) | Ember #D84315 | Broken grids, fragments |

---

## 📐 Production Notes

### Template Variable Map

This Brand Passport is generated programmatically. Each `[VARIABLE]` maps to:
- Archetype weights → `src/react-engine/archetypeWeights.ts`
- CSS token values → `diagnostic-expanded.json → css_variable_registry`
- Three.js parameters → `diagnostic-expanded.json → threejs_targets`
- Cross-cultural adaptations → `culture_logic.json`
- Manifesto text → Generated by AIAdvisor with archetype + locale + secondary archetype as context

### Export Formats

1. **JSON** (Figma-ready) — `generateDesignTokens.ts` → clipboard
2. **URL** (Shareable) — LZ-compressed state hash
3. **PDF** (Brand Passport) — This document, rendered to PDF
4. **Tilda** — Inline CSS variables ready for Tilda Custom CSS field

### Version

- **Engine:** ArchetypeOS v2.0
- **Diagnostic Protocol:** `diagnostic-expanded.json` v2.0
- **Cultural Layer:** `culture_logic.json` v1.0
- **React Shell:** DashboardShell v2
- **Generated:** 2025-06-27T12:00:00Z
- **Session ID:** `magician-lapis-9f3a`
