// ==================== HOLOGRAPHIC QUEST ====================
// Canvas-native brand archetype diagnostic.
// Questions float as holographic bubbles over the field.
// Mouse proximity + click selects answers.
// Includes sound wave step. Integrated with tracker + engine.

const HolographicQuest = {
  // ---- State ----
  _active: false,
  _step: 0, // 0=welcome, 1-6=questions, 7=sound, 8=result
  _answers: [],
  _mouseX: 0,
  _mouseY: 0,
  _fieldRect: null,
  _bubbles: [], // current floating answer bubbles
  _particles: [],
  _selectedIdx: -1,
  _hoveredIdx: -1,
  _confirmTimer: null,
  _animFrame: null,
  _onComplete: null,

  // ---- 5 questions + sound wave ----
  questions: [
    {
      id: "motive",
      title: "Что движет брендом?",
      answers: [
        {
          icon: "⚔️",
          label: "Победа",
          text: "Достигать, быть первыми",
          delta: { control: +8, energy: +10, focus: +4, method: 0 },
        },
        {
          icon: "✨",
          label: "Магия",
          text: "Трансформировать, вдохновлять",
          delta: { control: 0, energy: +8, focus: +2, method: +8 },
        },
        {
          icon: "👑",
          label: "Порядок",
          text: "Управлять, строить системы",
          delta: { control: +10, energy: -2, focus: +8, method: +6 },
        },
        {
          icon: "🤲",
          label: "Забота",
          text: "Поддерживать, делать жизнь лучше",
          delta: { control: -4, energy: -6, focus: +2, method: +4 },
        },
      ],
    },
    {
      id: "emotion",
      title: "Какие эмоции вызывает бренд?",
      answers: [
        {
          icon: "🎉",
          label: "Восторг",
          text: "Радость, удивление, лёгкость",
          delta: { control: -4, energy: +10, focus: -6, method: -2 },
        },
        {
          icon: "🏠",
          label: "Доверие",
          text: "Спокойствие, чувство «как дома»",
          delta: { control: +2, energy: -4, focus: 0, method: 0 },
        },
        {
          icon: "💋",
          label: "Страсть",
          text: "Желание, эстетическое наслаждение",
          delta: { control: -2, energy: +6, focus: -2, method: +4 },
        },
        {
          icon: "📚",
          label: "Уважение",
          text: "Ясность, уверенность в экспертизе",
          delta: { control: +6, energy: -6, focus: +8, method: +6 },
        },
      ],
    },
    {
      id: "voice",
      title: "Как бренд общается?",
      answers: [
        {
          icon: "🔥",
          label: "Вызов",
          text: "Прямо, смело, без фильтров",
          delta: { control: -6, energy: +8, focus: -4, method: -6 },
        },
        {
          icon: "🎨",
          label: "Творчество",
          text: "Вдохновляюще, с воображением",
          delta: { control: 0, energy: +4, focus: +4, method: +6 },
        },
        {
          icon: "🤝",
          label: "Честность",
          text: "Просто, без прикрас и пафоса",
          delta: { control: 0, energy: -2, focus: -2, method: 0 },
        },
        {
          icon: "🥂",
          label: "Престиж",
          text: "Элегантно, с чувством превосходства",
          delta: { control: +8, energy: 0, focus: +2, method: +4 },
        },
      ],
    },
    {
      id: "need",
      title: "Что ищет ваш клиент?",
      answers: [
        {
          icon: "🧭",
          label: "Свободу",
          text: "Приключения, новые горизонты",
          delta: { control: -4, energy: +6, focus: -6, method: 0 },
        },
        {
          icon: "🔍",
          label: "Истину",
          text: "Знания, понимание, мудрость",
          delta: { control: +4, energy: -8, focus: +10, method: +6 },
        },
        {
          icon: "🛡️",
          label: "Безопасность",
          text: "Заботу, тепло и защиту",
          delta: { control: +2, energy: -6, focus: 0, method: +4 },
        },
        {
          icon: "🏆",
          label: "Признание",
          text: "Статус, уважение, достижения",
          delta: { control: +8, energy: +6, focus: +4, method: 0 },
        },
      ],
    },
    {
      id: "product",
      title: "Характер вашего продукта?",
      answers: [
        {
          icon: "🔮",
          label: "Инновация",
          text: "Магический — преображает реальность",
          delta: { control: 0, energy: +6, focus: +4, method: +8 },
        },
        {
          icon: "⚙️",
          label: "Надёжность",
          text: "Качественный, проверенный временем",
          delta: { control: +4, energy: -4, focus: 0, method: +2 },
        },
        {
          icon: "💥",
          label: "Дерзость",
          text: "Ломает правила и стандарты",
          delta: { control: -8, energy: +10, focus: -4, method: -4 },
        },
        {
          icon: "💎",
          label: "Красота",
          text: "Чувственный — им хочется обладать",
          delta: { control: +2, energy: +4, focus: -2, method: +6 },
        },
      ],
    },
  ],

  soundWaves: [
    {
      id: "deep",
      label: "Глубокий ритм",
      desc: "Низкие частоты — уверенность, основательность",
      icon: "🅵",
      delta: { control: +6, energy: -2, focus: +4, method: +4 },
    },
    {
      id: "dynamic",
      label: "Динамичный пульс",
      desc: "Быстрый темп — энергия, движение, драйв",
      icon: "🅼",
      delta: { control: -2, energy: +10, focus: -2, method: 0 },
    },
    {
      id: "harmonic",
      label: "Гармоничный поток",
      desc: "Плавные волны — забота, комфорт, тепло",
      icon: "🅻",
      delta: { control: +2, energy: -6, focus: 0, method: +2 },
    },
    {
      id: "crystal",
      label: "Кристальный звон",
      desc: "Высокие чистые тона — инновации, ясность, магия",
      icon: "🅷",
      delta: { control: 0, energy: +4, focus: +6, method: +8 },
    },
  ],

  // ==================== INIT ====================
  start(onComplete) {
    if (this._active) return;
    this._active = true;
    this._step = 0;
    this._answers = [];
    this._selectedIdx = -1;
    this._hoveredIdx = -1;
    this._onComplete = onComplete;

    // Get field rect for positioning
    const field = document.getElementById("panel-field");
    this._fieldRect = field ? field.getBoundingClientRect() : null;

    // Create bubble container
    this._createContainer();
    // Start welcome step
    this._renderStep();
    // Start animation loop
    this._loop();

    console.log(
      "[HoloQuest] 🌀 Holographic quest started — move your mouse over the field.",
    );
  },

  _createContainer() {
    let c = document.getElementById("holo-bubbles");
    if (!c) {
      c = document.createElement("div");
      c.id = "holo-bubbles";
      c.style.cssText =
        "position:absolute;inset:0;pointer-events:none;z-index:50;";
      const field = document.getElementById("panel-field");
      if (field) field.appendChild(c);
    }
    this._container = c;
  },

  // ==================== STEP RENDERER ====================
  _renderStep() {
    const field = document.getElementById("panel-field");
    if (field) this._fieldRect = field.getBoundingClientRect();

    // Status update
    const statusEl = document.getElementById("hud-status-text");
    if (statusEl)
      statusEl.textContent =
        this._step === 0 ? "Начните движение" : `Вопрос ${this._step}/7`;

    this._bubbles = [];
    this._selectedIdx = -1;
    if (this._confirmTimer) clearTimeout(this._confirmTimer);

    if (this._step === 0) {
      // Welcome — single central bubble
      this._bubbles = [
        {
          type: "welcome",
          x: 0.5,
          y: 0.45,
          text: "Двигайте мышь\nпо голографическому полю",
          sub: "Система калибруется под ваш паттерн поведения",
        },
      ];
    } else if (this._step >= 1 && this._step <= 5) {
      // Questions 1-5
      const q = this.questions[this._step - 1];
      const positions = [
        { x: 0.25, y: 0.3 }, // top-left
        { x: 0.75, y: 0.3 }, // top-right
        { x: 0.25, y: 0.7 }, // bottom-left
        { x: 0.75, y: 0.7 }, // bottom-right
      ];
      // Title bubble
      this._bubbles.push({
        type: "title",
        x: 0.5,
        y: 0.15,
        text: q.title,
      });
      // Answer bubbles
      q.answers.forEach((a, i) => {
        this._bubbles.push({
          type: "answer",
          idx: i,
          x: positions[i].x,
          y: positions[i].y,
          icon: a.icon,
          label: a.label,
          text: a.text,
          delta: a.delta,
        });
      });
    } else if (this._step === 6) {
      // Sound wave step
      this._bubbles.push({
        type: "title",
        x: 0.5,
        y: 0.1,
        text: "Выберите звуковую волну бренда",
        sub: "Какая частота резонирует с вашим брендом?",
      });
      const sPositions = [
        { x: 0.2, y: 0.4 },
        { x: 0.8, y: 0.4 },
        { x: 0.2, y: 0.75 },
        { x: 0.8, y: 0.75 },
      ];
      this.soundWaves.forEach((sw, i) => {
        this._bubbles.push({
          type: "sound",
          idx: i,
          x: sPositions[i].x,
          y: sPositions[i].y,
          icon: sw.icon,
          label: sw.label,
          text: sw.desc,
          delta: sw.delta,
          waveId: sw.id,
        });
      });
    }
  },

  // ==================== LOOP ====================
  _loop() {
    if (!this._active) return;

    // Update mouse position relative to field
    const field = document.getElementById("panel-field");
    if (field) {
      this._fieldRect = field.getBoundingClientRect();
    }

    // Check proximity hover
    if (this._step >= 0) {
      this._checkProximity();
    }

    // Render bubbles
    this._drawBubbles();

    this._animFrame = requestAnimationFrame(() => this._loop());
  },

  _checkProximity() {
    if (!this._fieldRect || this._selectedIdx >= 0) return;
    const rx = (this._mouseX - this._fieldRect.left) / this._fieldRect.width;
    const ry = (this._mouseY - this._fieldRect.top) / this._fieldRect.height;

    let closest = -1;
    let closestDist = Infinity;

    this._bubbles.forEach((b, i) => {
      if (b.type === "answer" || b.type === "sound") {
        const dx = rx - b.x;
        const dy = ry - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.12 && dist < closestDist) {
          closestDist = dist;
          closest = b.idx !== undefined ? b.idx : i;
        }
      }
      if (b.type === "welcome" && this._step === 0) {
        const dx = rx - b.x;
        const dy = ry - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.2) {
          // Auto-advance from welcome
          this._step = 1;
          this._renderStep();
        }
      }
    });

    this._hoveredIdx = closest;
  },

  // ==================== DRAW BUBBLES ====================
  _drawBubbles() {
    const container = this._container;
    if (!container || !this._fieldRect) return;

    const W = this._fieldRect.width;
    const H = this._fieldRect.height;

    container.innerHTML = "";
    this._bubbles.forEach((b) => {
      const el = document.createElement("div");
      const px = b.x * W;
      const py = b.y * H;

      if (b.type === "welcome") {
        el.className = "holo-bubble holo-welcome";
        el.innerHTML = `<div class="holo-pulse-ring"></div><div class="holo-welcome-text">${b.text.replace(/\n/g, "<br>")}</div><div class="holo-welcome-sub">${b.sub}</div>`;
      } else if (b.type === "title") {
        el.className = "holo-bubble holo-title";
        el.innerHTML = `<span>${b.text}</span>${b.sub ? `<small>${b.sub}</small>` : ""}`;
      } else if (b.type === "answer") {
        const isHovered = b.idx === this._hoveredIdx;
        const isSelected = b.idx === this._selectedIdx;
        el.className = `holo-bubble holo-answer${isHovered ? " hovered" : ""}${isSelected ? " selected" : ""}`;
        el.innerHTML = `<span class="holo-answer-icon">${b.icon}</span><span class="holo-answer-label">${b.label}</span><span class="holo-answer-text">${b.text}</span>`;
        el.style.cursor = "pointer";
        el.style.pointerEvents = "auto";
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          this._select(b.idx);
        });
      } else if (b.type === "sound") {
        const isHovered = b.idx === this._hoveredIdx;
        const isSelected = b.idx === this._selectedIdx;
        el.className = `holo-bubble holo-sound${isHovered ? " hovered" : ""}${isSelected ? " selected" : ""}`;
        el.innerHTML = `<div class="holo-waveform" data-wave="${b.waveId}"><svg width="80" height="24" viewBox="0 0 80 24"><rect x="0" y="11" width="2" height="2" rx="1" fill="currentColor" opacity="0.3"/><rect x="3" y="9" width="2" height="6" rx="1" fill="currentColor" opacity="0.5"/><rect x="6" y="6" width="2" height="12" rx="1" fill="currentColor" opacity="0.7"/><rect x="9" y="3" width="2" height="18" rx="1" fill="currentColor"/><rect x="12" y="2" width="2" height="20" rx="1" fill="currentColor"/><rect x="15" y="1" width="2" height="22" rx="1" fill="currentColor"/><rect x="18" y="2" width="2" height="20" rx="1" fill="currentColor"/><rect x="21" y="4" width="2" height="16" rx="1" fill="currentColor" opacity="0.9"/><rect x="24" y="6" width="2" height="12" rx="1" fill="currentColor" opacity="0.7"/><rect x="27" y="8" width="2" height="8" rx="1" fill="currentColor" opacity="0.5"/><rect x="30" y="9" width="2" height="6" rx="1" fill="currentColor" opacity="0.3"/></svg></div><span class="holo-answer-label">${b.label}</span><span class="holo-answer-text">${b.text}</span>`;
        el.style.cursor = "pointer";
        el.style.pointerEvents = "auto";
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          this._select(b.idx);
        });
      }

      el.style.left = px + "px";
      el.style.top = py + "px";
      el.style.position = "absolute";
      el.style.transform = "translate(-50%, -50%)";
      container.appendChild(el);
    });
  },

  // ==================== SELECT ====================
  _select(idx) {
    if (this._selectedIdx >= 0 || idx < 0) return;
    this._selectedIdx = idx;

    // Find the answer/sound data
    let delta = null;
    let label = "";
    if (this._step >= 1 && this._step <= 5) {
      const q = this.questions[this._step - 1];
      delta = q.answers[idx].delta;
      label = q.answers[idx].label;
    } else if (this._step === 6) {
      delta = this.soundWaves[idx].delta;
      label = this.soundWaves[idx].label;
    }

    if (delta) {
      this._answers.push({ step: this._step, idx, label, delta });
      // Apply to vector
      ["control", "energy", "focus", "method"].forEach((d) => {
        if (typeof userVector !== "undefined" && userVector[d] !== undefined) {
          userVector[d] = Math.max(0, Math.min(100, userVector[d] + delta[d]));
        }
      });
      if (typeof updateBrandPositionFromVector === "function")
        updateBrandPositionFromVector();
      if (typeof updateAll === "function") updateAll();
    }

    // Advance after pause
    this._confirmTimer = setTimeout(() => {
      this._step++;
      if (this._step >= 7) {
        this._finish();
      } else {
        this._renderStep();
      }
    }, 800);
  },

  // ==================== FINISH ====================
  _finish() {
    this._active = false;
    if (this._animFrame) cancelAnimationFrame(this._animFrame);

    // Clean up bubbles
    const container = document.getElementById("holo-bubbles");
    if (container) container.innerHTML = "";

    // Compute final vector
    const finalVector = { control: 50, energy: 50, focus: 50, method: 50 };
    this._answers.forEach((a) => {
      ["control", "energy", "focus", "method"].forEach((d) => {
        finalVector[d] = Math.max(
          0,
          Math.min(100, finalVector[d] + a.delta[d]),
        );
      });
    });

    // Also blend in tracker signal (20% weight)
    if (typeof Tracker !== "undefined") {
      const tv = Tracker.getBehaviorVector();
      ["control", "energy", "focus", "method"].forEach((d) => {
        finalVector[d] = Math.round(finalVector[d] * 0.8 + tv[d] * 0.2);
      });
    }

    // Set engine
    if (typeof userVector !== "undefined") {
      ["control", "energy", "focus", "method"].forEach((d) => {
        userVector[d] = finalVector[d];
      });
    }
    if (typeof updateBrandPositionFromVector === "function")
      updateBrandPositionFromVector();
    if (typeof updateAll === "function") updateAll();

    let primary = null;
    if (typeof getRankings === "function") {
      const rankings = getRankings();
      primary = rankings.primary;
    }

    // Show result popup
    if (typeof ArchetypeResult !== "undefined") {
      ArchetypeResult.show(primary, finalVector, this._answers);
    }

    // Fire callback (for Pivot)
    if (this._onComplete) {
      this._onComplete(finalVector, primary);
    }

    console.log(
      `%c[HoloQuest] ✅ ${primary ? primary.nameRu : "—"}`,
      `color:${primary?.color || "#fff"};font-size:16px;font-weight:bold;`,
    );
  },

  // ==================== MOUSE TRACKING ====================
  _bindMouse() {
    document.addEventListener("mousemove", (e) => {
      this._mouseX = e.clientX;
      this._mouseY = e.clientY;
    });
  },
};

// Bind mouse globally
document.addEventListener("mousemove", (e) => {
  if (HolographicQuest._active) {
    HolographicQuest._mouseX = e.clientX;
    HolographicQuest._mouseY = e.clientY;
  }
});
