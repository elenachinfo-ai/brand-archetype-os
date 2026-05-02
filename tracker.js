// ==================== BEHAVIOR TRACKER ====================
// Passive sensors: scroll, mouse, attention, decision speed.
// All signals normalized to [-1, 1].

const Tracker = {
  // ---- Raw sensor state ----
  mouse: {
    x: 0, y: 0,
    prevX: 0, prevY: 0,
    speed: 0,                // px/frame
    totalDistance: 0,
    straightDistance: 0,
    directness: 1,           // 0..1, 1 = straight line
    stationary: 0,           // ms stationary
    samples: [],             // last N positions for smoothness
  },

  scroll: {
    speed: 0,                // px/s
    prevScrollY: 0,
    prevTime: 0,
    totalDelta: 0,
    directionChanges: 0,
    lastDirection: 0,
    smoothness: 1,           // 0..1
    samples: [],             // last N speeds for variance
  },

  attention: {
    currentSection: null,    // { id, type, enteredAt }
    sections: {},            // id → { totalTime, visits, lastDwell }
    lastSwitch: 0,
  },

  decision: {
    ctaAppearedAt: 0,        // timestamp when CTA became visible
    ctaClickedAt: 0,
    speed: 0,                // ms
    history: [],             // last N decision speeds
  },

  // ---- Derived signals [−1, 1] ----
  signals: {
    control: 0,
    energy: 0,
    focus: 0,
    method: 0,
  },

  // ---- Config ----
  config: {
    sampleWindow: 5,         // number of snapshots for smoothing
    dwellThreshold: 3000,    // ms to count as "dwelling"
    fastScrollThreshold: 800,// px/s
    fastClickThreshold: 1000,// ms
    slowClickThreshold: 5000,// ms
  },

  // ---- Internal ----
  _frameId: null,
  _lastFrameTime: 0,
  _snapshots: [],            // ring buffer of {control, energy, focus, method}
  _maxSnapshots: 20,

  // ==================== INIT ====================
  init() {
    this._lastFrameTime = performance.now();
    this.scroll.prevTime = performance.now();
    this._bindMouse();
    this._bindScroll();
    this._bindClicks();
    this._startLoop();
    console.log("[Tracker] Sensors active — tracking mouse, scroll, attention, decisions.");
  },

  // ==================== MOUSE ====================
  _bindMouse() {
    document.addEventListener("mousemove", (e) => {
      const prevX = this.mouse.x;
      const prevY = this.mouse.y;
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      const dx = this.mouse.x - prevX;
      const dy = this.mouse.y - prevY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      this.mouse.totalDistance += dist;
      this.mouse.prevX = prevX;
      this.mouse.prevY = prevY;

      // Track samples for directness
      this.mouse.samples.push({ x: this.mouse.x, y: this.mouse.y });
      if (this.mouse.samples.length > 30) this.mouse.samples.shift();
    });

    // Track stationary time
    let stationaryTimer = null;
    document.addEventListener("mousemove", () => {
      this.mouse.stationary = 0;
      if (stationaryTimer) clearTimeout(stationaryTimer);
      stationaryTimer = setTimeout(() => {
        this.mouse.stationary = this.config.dwellThreshold;
      }, this.config.dwellThreshold);
    });
  },

  // ==================== SCROLL ====================
  _bindScroll() {
    let scrollTick = null;
    window.addEventListener("scroll", () => {
      if (!scrollTick) {
        scrollTick = requestAnimationFrame(() => {
          const now = performance.now();
          const currentY = window.scrollY;
          const dt = (now - this.scroll.prevTime) / 1000; // seconds
          const dy = currentY - this.scroll.prevScrollY;

          if (dt > 0.001) {
            const instantSpeed = Math.abs(dy) / dt;
            this.scroll.speed = instantSpeed;

            // Track direction changes
            const dir = Math.sign(dy);
            if (dir !== 0 && dir !== this.scroll.lastDirection) {
              this.scroll.directionChanges++;
            }
            if (dir !== 0) this.scroll.lastDirection = dir;

            // Smoothness: variance of recent speeds
            this.scroll.samples.push(instantSpeed);
            if (this.scroll.samples.length > 10) this.scroll.samples.shift();

            if (this.scroll.samples.length >= 2) {
              const mean = this.scroll.samples.reduce((a, b) => a + b, 0) / this.scroll.samples.length;
              const variance = this.scroll.samples.reduce((s, v) => s + (v - mean) ** 2, 0) / this.scroll.samples.length;
              const stddev = Math.sqrt(variance);
              // Smoothness: low variance = high smoothness
              this.scroll.smoothness = Math.max(0, 1 - stddev / 600);
            }

            this.scroll.totalDelta += Math.abs(dy);
          }

          this.scroll.prevScrollY = currentY;
          this.scroll.prevTime = now;
          scrollTick = null;
        });
      }
    }, { passive: true });
  },

  // ==================== CLICKS (Decision Speed) ====================
  _bindClicks() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("button, .btn-export, .cta, [data-cta]");
      if (!btn) return;

      const now = performance.now();
      // If we've been tracking a CTA appearance
      if (this.decision.ctaAppearedAt > 0) {
        this.decision.ctaClickedAt = now;
        this.decision.speed = now - this.decision.ctaAppearedAt;
        this.decision.history.push(this.decision.speed);
        if (this.decision.history.length > 10) this.decision.history.shift();

        console.log(
          `[Tracker] Decision speed: ${this.decision.speed.toFixed(0)}ms ` +
          `(${this.decision.speed < this.config.fastClickThreshold ? 'FAST → Hero/Rebel' :
             this.decision.speed > this.config.slowClickThreshold ? 'SLOW → Sage/Magician' :
             'MEDIUM → Ruler/Creator'})`
        );
      }
    });
  },

  /** Call when a CTA element becomes visible to the user */
  ctaAppeared() {
    this.decision.ctaAppearedAt = performance.now();
  },

  // ==================== ATTENTION (IntersectionObserver) ====================
  registerSections(sectionDefs) {
    // sectionDefs: [{ id, element, type: 'text'|'image'|'interactive' }]
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.dataset.trackerSection;
          if (!id) return;

          if (entry.isIntersecting) {
            // Entered section
            if (this.attention.currentSection && this.attention.currentSection.id !== id) {
              // Record dwell on previous section
              const prev = this.attention.currentSection;
              const dwell = performance.now() - prev.enteredAt;
              if (!this.attention.sections[prev.id]) {
                this.attention.sections[prev.id] = { totalTime: 0, visits: 0, lastDwell: 0, type: prev.type };
              }
              this.attention.sections[prev.id].totalTime += dwell;
              this.attention.sections[prev.id].visits++;
              this.attention.sections[prev.id].lastDwell = dwell;
            }

            const type = entry.target.dataset.trackerType || "unknown";
            this.attention.currentSection = {
              id,
              type,
              enteredAt: performance.now(),
            };
            this.attention.lastSwitch = performance.now();

            if (!this.attention.sections[id]) {
              this.attention.sections[id] = { totalTime: 0, visits: 0, lastDwell: 0, type };
            }
          } else {
            // Exited section
            if (this.attention.currentSection && this.attention.currentSection.id === id) {
              const dwell = performance.now() - this.attention.currentSection.enteredAt;
              if (!this.attention.sections[id]) {
                this.attention.sections[id] = { totalTime: 0, visits: 0, lastDwell: 0, type: this.attention.currentSection.type };
              }
              this.attention.sections[id].totalTime += dwell;
              this.attention.sections[id].lastDwell = dwell;
              this.attention.currentSection = null;
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    sectionDefs.forEach((def) => {
      if (def.element) {
        def.element.dataset.trackerSection = def.id;
        def.element.dataset.trackerType = def.type;
        observer.observe(def.element);
      }
    });

    console.log(`[Tracker] Observing ${sectionDefs.length} sections.`);
  },

  // ==================== LOOP: Compute signals every frame ====================
  _startLoop() {
    const loop = (now) => {
      if (!this._lastFrameTime) this._lastFrameTime = now;
      const dt = Math.max((now - this._lastFrameTime) / 1000, 0.001); // seconds
      this._lastFrameTime = now;

      // ---- Compute mouse speed & directness ----
      if (this.mouse.samples.length >= 2) {
        const first = this.mouse.samples[0];
        const last = this.mouse.samples[this.mouse.samples.length - 1];
        const straightDist = Math.sqrt((last.x - first.x) ** 2 + (last.y - first.y) ** 2);
        const pathDist = this.mouse.totalDistance;
        this.mouse.straightDistance = straightDist;
        this.mouse.directness = pathDist > 0 ? Math.min(1, straightDist / Math.max(pathDist, 1)) : 1;
        this.mouse.speed = pathDist / Math.max(this.mouse.samples.length / 60, 0.016);
      }

      // ---- Compute normalized signals ----
      this._computeSignals(dt);

      // ---- Take snapshot ----
      this._snapshots.push({
        control: this.signals.control,
        energy: this.signals.energy,
        focus: this.signals.focus,
        method: this.signals.method,
        timestamp: now,
      });
      if (this._snapshots.length > this._maxSnapshots) this._snapshots.shift();

      this._frameId = requestAnimationFrame(loop);
    };

    this._frameId = requestAnimationFrame(loop);
  },

  // ==================== SIGNAL COMPUTATION ====================
  _computeSignals(_dt) {
    // ---- CONTROL signal ----
    // + : smooth scroll, high directness, dwelling on structured content
    // − : chaotic mouse, rapid direction changes
    let ctrl = 0;

    // Scroll smoothness (0..1) → maps to (−0.5, +0.5)
    ctrl += (this.scroll.smoothness - 0.5) * 0.8;

    // Mouse directness (0..1) → maps to (−0.4, +0.4)
    ctrl += (this.mouse.directness - 0.5) * 0.6;

    // Direction changes penalty
    const dirChangeRate = this.scroll.directionChanges / Math.max(this._snapshots.length, 1);
    ctrl -= Math.min(dirChangeRate * 0.3, 0.4);

    this.signals.control = this._clampSignal(ctrl);


    // ---- ENERGY signal ----
    // + : fast scroll, fast mouse, quick clicks
    // − : stationary, slow everything
    let nrg = 0;

    // Scroll speed (normalized: 0..2000 px/s → 0..1)
    const scrollNorm = Math.min(this.scroll.speed / this.config.fastScrollThreshold, 1.5);
    nrg += (scrollNorm - 0.3) * 0.8;

    // Mouse speed contribution
    const mouseNorm = Math.min(this.mouse.speed / 400, 1.5);
    nrg += (mouseNorm - 0.25) * 0.5;

    // Decision speed (fast = high energy)
    if (this.decision.speed > 0) {
      const decisionNorm = 1 - Math.min(this.decision.speed / this.config.slowClickThreshold, 1);
      nrg += (decisionNorm - 0.5) * 0.4;
    }

    // Stationary penalty
    if (this.mouse.stationary > this.config.dwellThreshold) {
      nrg -= 0.3;
    }

    this.signals.energy = this._clampSignal(nrg);


    // ---- FOCUS signal ----
    // + : long dwell on text, re-visiting sections, studying
    // − : quick scanning, only looking at images
    let fcs = 0;

    // Dwell time on text sections
    const textSections = Object.values(this.attention.sections)
      .filter((s) => s.type === "text");
    if (textSections.length > 0) {
      const totalTextTime = textSections.reduce((s, sec) => s + sec.totalTime, 0);
      const textDwellNorm = Math.min(totalTextTime / 30000, 1); // 0..30s → 0..1
      fcs += (textDwellNorm - 0.3) * 0.7;
    }

    // Re-visits to any section
    const allSections = Object.values(this.attention.sections);
    if (allSections.length > 0) {
      const avgVisits = allSections.reduce((s, sec) => s + sec.visits, 0) / allSections.length;
      fcs += (Math.min(avgVisits, 3) / 3 - 0.33) * 0.4;
    }

    // Image-only penalty
    const imageSections = allSections.filter((s) => s.type === "image");
    const textSectionCount = textSections.length;
    if (imageSections.length > textSectionCount) {
      fcs -= 0.2;
    }

    this.signals.focus = this._clampSignal(fcs);


    // ---- METHOD signal ----
    // + : sequential flow, exploring all sections, studying process
    // − : jumping to CTA, skipping sections, result-oriented
    let mth = 0;

    // Exploration breadth: ratio of visited sections to total
    if (allSections.length > 0) {
      const visitedRatio = allSections.filter((s) => s.visits > 0).length / allSections.length;
      mth += (visitedRatio - 0.5) * 0.6;
    }

    // Sequential vs. skipping: low direction changes = more methodical
    const dirChangeScore = Math.max(0, 1 - dirChangeRate * 0.5);
    mth += (dirChangeScore - 0.5) * 0.5;

    // Studying interactive/"how it works" sections
    const interactiveSections = allSections.filter((s) => s.type === "interactive");
    if (interactiveSections.length > 0) {
      const interactiveTime = interactiveSections.reduce((s, sec) => s + sec.totalTime, 0);
      const interactiveNorm = Math.min(interactiveTime / 20000, 1);
      mth += (interactiveNorm - 0.3) * 0.4;
    }

    this.signals.method = this._clampSignal(mth);
  },

  _clampSignal(v) {
    return Math.max(-1, Math.min(1, v));
  },

  // ==================== PUBLIC API ====================

  /** Get current 4D vector derived from behavior signals */
  getBehaviorVector() {
    // Map signals [−1, 1] → vector values [0, 100]
    // Starting from 50, each signal contributes ±up to 40
    return {
      control:  Math.round(50 + this.signals.control * 40),
      energy:   Math.round(50 + this.signals.energy * 40),
      focus:    Math.round(50 + this.signals.focus * 40),
      method:   Math.round(50 + this.signals.method * 40),
    };
  },

  /** Confidence: inverse of vector volatility */
  getConfidence() {
    const window = this._snapshots.slice(-8);
    if (window.length < 3) return 0;

    const dims = ["control", "energy", "focus", "method"];
    let totalVariance = 0;

    dims.forEach((d) => {
      const values = window.map((s) => s[d]);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
      totalVariance += variance;
    });

    const avgStdDev = Math.sqrt(totalVariance / dims.length);
    // Normalize: stddev of 15 or more = 0 confidence, 0 = 100% confidence
    const confidence = Math.max(0, 1 - avgStdDev / 15);
    return Math.round(confidence * 100);
  },

  /** Check if archetype should be locked */
  isLocked() {
    return this.getConfidence() >= 75;
  },

  /** Get live analytics summary for HUD */
  getAnalytics() {
    return {
      scrollSpeed: Math.round(this.scroll.speed),
      mouseSpeed: Math.round(this.mouse.speed),
      section: this.attention.currentSection
        ? `${this.attention.currentSection.id} (${this.attention.currentSection.type})`
        : "—",
      confidence: this.getConfidence(),
      signals: { ...this.signals },
      vector: this.getBehaviorVector(),
    };
  },

  /** Reset all trackers (for a new session) */
  reset() {
    this.mouse.totalDistance = 0;
    this.mouse.stationary = 0;
    this.mouse.samples = [];
    this.scroll.totalDelta = 0;
    this.scroll.directionChanges = 0;
    this.scroll.samples = [];
    this.attention.sections = {};
    this.attention.currentSection = null;
    this.decision.speed = 0;
    this.decision.ctaAppearedAt = 0;
    this._snapshots = [];
    console.log("[Tracker] Reset.");
  },
};
