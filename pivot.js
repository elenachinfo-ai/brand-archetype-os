// ==================== UI PIVOT ENGINE ====================
// Transforms the entire interface when an archetype is locked.
// Applies CSS variables, canvas colors, and "moment of truth" animation.

const Pivot = {
  // ---- State ----
  _currentArchetypeId: null,
  _isTransitioning: false,
  _overlayEl: null,

  // ==================== INIT ====================
  init() {
    // Create scanning overlay (hidden by default)
    this._overlayEl = document.createElement("div");
    this._overlayEl.className = "pivot-scan-overlay";
    this._overlayEl.innerHTML = `
      <div class="pivot-scan-line"></div>
      <div class="pivot-scan-text"></div>
    `;
    document.body.appendChild(this._overlayEl);

    console.log("[Pivot] Ready — UI transformation engine initialized.");
  },

  // ==================== EXECUTE PIVOT ====================
  /**
   * @param {string} archetypeId — e.g. "hero", "magician"
   */
  execute(archetypeId) {
    if (this._isTransitioning) return;
    if (this._currentArchetypeId === archetypeId) return;

    const theme = ArchetypeThemes[archetypeId];
    if (!theme) {
      console.warn(`[Pivot] Unknown archetype: ${archetypeId}`);
      return;
    }

    this._isTransitioning = true;
    this._currentArchetypeId = archetypeId;

    const arch = archetypes.find((a) => a.id === archetypeId);
    const label = arch ? arch.nameRu : theme.label;
    const color = arch ? arch.color : theme.vars["--accent-blue"];

    console.log(
      `%c[Pivot] 🔄 TRANSFORMING → ${label}`,
      `color: ${color}; font-size: 13px; font-weight: bold;`,
    );

    // ---- Phase 1: Scan animation (300ms) ----
    this._playScanAnimation(label, color, () => {
      // ---- Phase 2: Apply theme (CSS variables) ----
      this._applyTheme(theme);

      // ---- Phase 3: Update canvas ----
      this._updateCanvas(theme.canvas);

      // ---- Phase 4: Update engine output ----
      this._updateEngineOutput(arch);

      // ---- Phase 5: Body font ----
      document.body.style.fontFamily = theme.vars["--font-body"] || "";

      // ---- Phase 6: Reveal ----
      this._reveal(600);
    });
  },

  // ==================== RESET TO DEFAULT ====================
  resetToDefault() {
    const root = document.documentElement;
    const defaults = {
      "--bg-deep": "#0d0d12",
      "--bg-graphite": "#1a1a1f",
      "--bg-panel": "#15151a",
      "--bg-glass": "rgba(22, 22, 28, 0.65)",
      "--bg-glass-strong": "rgba(28, 28, 36, 0.85)",
      "--border-subtle": "rgba(255, 255, 255, 0.06)",
      "--border-mid": "rgba(255, 255, 255, 0.1)",
      "--text-primary": "#e8e8ed",
      "--text-secondary": "#9a9aa8",
      "--text-tertiary": "#606070",
      "--accent-blue": "#7bbcd4",
      "--accent-beige": "#d4c4b0",
      "--accent-green": "#a5d6a7",
      "--accent-blue-dim": "rgba(123, 188, 212, 0.18)",
      "--accent-beige-dim": "rgba(212, 196, 176, 0.18)",
      "--accent-green-dim": "rgba(165, 214, 167, 0.18)",
      "--glow-blue": "rgba(123, 188, 212, 0.4)",
      "--glow-strong": "rgba(123, 188, 212, 0.7)",
      "--radius-sm": "10px",
      "--radius-md": "14px",
      "--radius-lg": "20px",
      "--transition-fast": "0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      "--transition-normal": "0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      "--font-body": "'Manrope', 'Inter', sans-serif",
    };

    Object.entries(defaults).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });

    document.body.style.fontFamily = "";
    this._currentArchetypeId = null;
    console.log("[Pivot] ↺ Reset to default holographic theme.");
  },

  // ==================== INTERNAL ====================

  _applyTheme(theme) {
    const root = document.documentElement;
    Object.entries(theme.vars).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });
  },

  _updateCanvas(canvasColors) {
    // Store canvas overrides so drawField() can pick them up
    window.__pivotCanvas = canvasColors;
  },

  _updateEngineOutput(arch) {
    if (!arch) return;
    // Trigger engine update to reflect new primary archetype
    if (typeof updateAll === "function") {
      updateAll();
    }
  },

  // ---- Scan animation overlay ----
  _playScanAnimation(label, color, onComplete) {
    const overlay = this._overlayEl;
    const line = overlay.querySelector(".pivot-scan-line");
    const text = overlay.querySelector(".pivot-scan-text");

    // Style the scan line
    line.style.background = `linear-gradient(180deg, transparent, ${color}80, ${color}cc, ${color}80, transparent)`;
    line.style.height = "2px";
    line.style.width = "100%";
    line.style.position = "absolute";
    line.style.top = "0";
    line.style.left = "0";
    line.style.boxShadow = `0 0 20px ${color}, 0 0 60px ${color}40`;

    // Style text
    text.textContent = label;
    text.style.fontFamily = "'Manrope', 'Inter', sans-serif";
    text.style.fontSize = "18px";
    text.style.fontWeight = "300";
    text.style.letterSpacing = "0.3em";
    text.style.color = "#ffffff";
    text.style.position = "absolute";
    text.style.top = "50%";
    text.style.left = "50%";
    text.style.transform = "translate(-50%, -50%)";
    text.style.opacity = "0";
    text.style.textTransform = "uppercase";

    // Show overlay
    overlay.classList.add("active");

    // Animate scan line: sweep from top to bottom
    const duration = 400; // ms
    const start = performance.now();

    const sweep = (now) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const y = t * 100; // 0% to 100%

      line.style.top = y + "%";

      // Text fades in at 50% of sweep
      if (t > 0.4) {
        const textT = (t - 0.4) / 0.6;
        text.style.opacity = Math.min(textT, 1);
      }

      if (t < 1) {
        requestAnimationFrame(sweep);
      } else {
        // Hold for a moment, then complete
        setTimeout(() => {
          overlay.classList.remove("active");
          text.style.opacity = "0";
          if (onComplete) onComplete();
        }, 200);
      }
    };

    requestAnimationFrame(sweep);
  },

  _reveal(duration) {
    // Brief "bloom" — all elements fade back in
    this._isTransitioning = false;

    const root = document.documentElement;
    root.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;

    setTimeout(() => {
      root.style.transition = "";
    }, duration + 50);
  },
};
