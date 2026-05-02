// ==================== BEHAVIOR INTERPRETER ====================
// Bridges Tracker signals → userVector (engine.js) via EMA.
// Handles confidence gating and "moment of truth" trigger.

const Interpreter = {
  // ---- Config ----
  config: {
    alpha: 0.12,              // EMA learning rate
    updateInterval: 500,      // ms between vector updates
    confidenceThreshold: 75,  // % to lock archetype
    lockStreakRequired: 3,    // consecutive ticks above threshold
    maxDelta: 15,             // max single-step vector change
  },

  // ---- State ----
  _intervalId: null,
  _lockStreak: 0,
  _locked: false,
  _lockedArchetype: null,
  _onLockCallbacks: [],
  _onUpdateCallbacks: [],
  _hudEls: null,

  // ==================== INIT ====================
  init(hudElements) {
    this._hudEls = hudElements || {};
    this._startUpdateLoop();
    console.log("[Interpreter] Bridge active — behavior → vector EMA, confidence gating.");
  },

  _startUpdateLoop() {
    this._intervalId = setInterval(() => {
      this._tick();
    }, this.config.updateInterval);
  },

  // ==================== MAIN TICK ====================
  _tick() {
    if (this._locked) {
      // Locked: keep vector pinned to archetype, just update HUD
      this._updateHUD();
      return;
    }

    const behaviorVector = Tracker.getBehaviorVector();
    const confidence = Tracker.getConfidence();

    // EMA: smoothly blend current userVector toward behavior vector
    const dims = ["control", "energy", "focus", "method"];
    dims.forEach((d) => {
      const current = userVector[d];
      const target = behaviorVector[d];

      // Clamp delta to avoid jumps
      let delta = target - current;
      if (Math.abs(delta) > this.config.maxDelta) {
        delta = Math.sign(delta) * this.config.maxDelta;
      }

      // Exponential Moving Average
      userVector[d] = Math.round(current + delta * this.config.alpha);
      // Clamp to [0, 100]
      userVector[d] = Math.max(0, Math.min(100, userVector[d]));
    });

    // Update brand position from vector
    updateBrandPositionFromVector();
    updateAll();

    // ---- Confidence gating ----
    if (confidence >= this.config.confidenceThreshold) {
      this._lockStreak++;
      if (this._lockStreak >= this.config.lockStreakRequired) {
        this._lockArchetype();
      }
    } else {
      this._lockStreak = Math.max(0, this._lockStreak - 1);
    }

    // Fire update callbacks
    this._onUpdateCallbacks.forEach((cb) => cb(userVector, confidence));

    // Update HUD
    this._updateHUD();
  },

  // ==================== LOCK / UNLOCK ====================
  _lockArchetype() {
    if (this._locked) return;

    const r = getRankings();
    this._locked = true;
    this._lockedArchetype = r.primary;

    // Snap vector to archetype
    const target = { ...this._lockedArchetype.vector };
    animateToVector(target, () => {
      console.log(`[Interpreter] 🔒 ARCHETYPE LOCKED: ${this._lockedArchetype.nameRu}`);
      console.log(`  Confidence: ${Tracker.getConfidence()}%`);
      console.log(`  Vector: [${target.control}, ${target.energy}, ${target.focus}, ${target.method}]`);

      // Fire lock callbacks
      this._onLockCallbacks.forEach((cb) => cb(this._lockedArchetype));
    });

    // Flash HUD status
    const statusEl = document.getElementById("hud-status-text");
    if (statusEl) {
      statusEl.textContent = `🔒 ${this._lockedArchetype.nameRu}`;
      statusEl.style.color = this._lockedArchetype.color;
    }
  },

  unlock() {
    this._locked = false;
    this._lockedArchetype = null;
    this._lockStreak = 0;
    Tracker.reset();

    const statusEl = document.getElementById("hud-status-text");
    if (statusEl) {
      statusEl.textContent = "Анализ…";
      statusEl.style.color = "";
    }
    console.log("[Interpreter] 🔓 Unlocked — resuming behavior tracking.");
  },

  /** Register callback for when archetype locks */
  onLock(callback) {
    this._onLockCallbacks.push(callback);
  },

  /** Register callback for every vector update tick */
  onUpdate(callback) {
    this._onUpdateCallbacks.push(callback);
  },

  // ==================== HUD ====================
  _updateHUD() {
    const a = Tracker.getAnalytics();

    // If we have HUD elements injected into DOM, update them
    const els = {
      "hud-scroll-speed": a.scrollSpeed + " px/s",
      "hud-mouse-speed": a.mouseSpeed + " px/s",
      "hud-section": a.section,
      "hud-confidence": a.confidence + "%",
      "hud-signal-control": a.signals.control.toFixed(2),
      "hud-signal-energy": a.signals.energy.toFixed(2),
      "hud-signal-focus": a.signals.focus.toFixed(2),
      "hud-signal-method": a.signals.method.toFixed(2),
    };

    Object.entries(els).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    });
  },

  // ==================== PUBLIC QUERIES ====================
  isLocked() {
    return this._locked;
  },

  getLockedArchetype() {
    return this._lockedArchetype;
  },
};
