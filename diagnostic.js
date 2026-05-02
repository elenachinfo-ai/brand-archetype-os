// ==================== HOLOGRAPHIC QUEST v2 ====================
// Obvious start → non-blocking floating cards → persistent help → result.
// Questions appear as small cards at field edges, never block the canvas.

const HolographicQuest = {
  _active: false,
  _step: 0,
  _answers: [],
  _mouseX: 0,
  _mouseY: 0,
  _fieldRect: null,
  _container: null,
  _helpEl: null,
  _selectedIdx: -1,
  _hoveredIdx: -1,
  _confirmTimer: null,
  _animFrame: null,
  _onComplete: null,

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
      title: "Какие эмоции вызывает?",
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
          text: "Спокойствие, «как дома»",
          delta: { control: +2, energy: -4, focus: 0, method: 0 },
        },
        {
          icon: "💋",
          label: "Страсть",
          text: "Желание, наслаждение",
          delta: { control: -2, energy: +6, focus: -2, method: +4 },
        },
        {
          icon: "📚",
          label: "Уважение",
          text: "Ясность, экспертиза",
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
          text: "Просто, без прикрас",
          delta: { control: 0, energy: -2, focus: -2, method: 0 },
        },
        {
          icon: "🥂",
          label: "Престиж",
          text: "Элегантно, с достоинством",
          delta: { control: +8, energy: 0, focus: +2, method: +4 },
        },
      ],
    },
    {
      id: "need",
      title: "Что ищет клиент?",
      answers: [
        {
          icon: "🧭",
          label: "Свободу",
          text: "Приключения, горизонты",
          delta: { control: -4, energy: +6, focus: -6, method: 0 },
        },
        {
          icon: "🔍",
          label: "Истину",
          text: "Знания, мудрость",
          delta: { control: +4, energy: -8, focus: +10, method: +6 },
        },
        {
          icon: "🛡️",
          label: "Безопасность",
          text: "Заботу, тепло, защиту",
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
      title: "Характер продукта?",
      answers: [
        {
          icon: "🔮",
          label: "Инновация",
          text: "Магический, преображает",
          delta: { control: 0, energy: +6, focus: +4, method: +8 },
        },
        {
          icon: "⚙️",
          label: "Надёжность",
          text: "Качественный, проверенный",
          delta: { control: +4, energy: -4, focus: 0, method: +2 },
        },
        {
          icon: "💥",
          label: "Дерзость",
          text: "Ломает правила",
          delta: { control: -8, energy: +10, focus: -4, method: -4 },
        },
        {
          icon: "💎",
          label: "Красота",
          text: "Чувственный, желанный",
          delta: { control: +2, energy: +4, focus: -2, method: +6 },
        },
      ],
    },
  ],

  soundWaves: [
    {
      id: "deep",
      label: "Глубокий ритм",
      desc: "Низкие частоты — уверенность",
      icon: "🅵",
      delta: { control: +6, energy: -2, focus: +4, method: +4 },
    },
    {
      id: "dynamic",
      label: "Динамичный пульс",
      desc: "Быстрый темп — энергия, драйв",
      icon: "🅼",
      delta: { control: -2, energy: +10, focus: -2, method: 0 },
    },
    {
      id: "harmonic",
      label: "Гармоничный поток",
      desc: "Плавные волны — забота, комфорт",
      icon: "🅻",
      delta: { control: +2, energy: -6, focus: 0, method: +2 },
    },
    {
      id: "crystal",
      label: "Кристальный звон",
      desc: "Высокие тона — инновации, магия",
      icon: "🅷",
      delta: { control: 0, energy: +4, focus: +6, method: +8 },
    },
  ],

  // ==================== START SCREEN ====================
  showStartScreen() {
    // Remove existing
    const ex = document.getElementById("quest-start-overlay");
    if (ex) ex.remove();

    const overlay = document.createElement("div");
    overlay.id = "quest-start-overlay";
    overlay.className = "quest-start-overlay";
    overlay.innerHTML = `
      <div class="quest-start-backdrop"></div>
      <div class="quest-start-card">
        <div class="quest-start-icon">🔮</div>
        <h1 class="quest-start-title">Определите архетип<br>вашего бренда</h1>
        <p class="quest-start-sub">7 шагов — и вы получите персональный стиль сайта:<br>цвета, шрифты, анимацию и структуру лендинга</p>
        <button class="quest-start-btn" id="quest-start-btn">
          <span>🚀</span> Пройти тест
        </button>
        <p class="quest-start-hint">Займёт ~2 минуты</p>
      </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById("quest-start-btn").addEventListener("click", () => {
      overlay.style.opacity = "0";
      overlay.style.transition = "opacity 0.3s ease";
      setTimeout(() => {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 300);
      this.start();
    });
  },

  // ==================== START QUEST ====================
  start(onComplete) {
    if (this._active) return;
    this._active = true;
    this._step = 1;
    this._answers = [];
    this._selectedIdx = -1;
    this._hoveredIdx = -1;
    this._onComplete = onComplete;

    this._createContainer();
    this._createHelpButton();
    this._renderStep();
    this._loop();

    const statusEl = document.getElementById("hud-status-text");
    if (statusEl) statusEl.textContent = "Шаг 1/7";

    console.log("[HoloQuest] 🌀 Started.");
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

  _createHelpButton() {
    let btn = document.getElementById("quest-help-btn");
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "quest-help-btn";
      btn.className = "quest-help-btn";
      btn.innerHTML = "?";
      btn.title = "Как это работает";
      btn.addEventListener("click", () => this._showHelp());
      document.body.appendChild(btn);
    }
    this._helpEl = btn;
    btn.style.display = "flex";
  },

  _showHelp() {
    const help = document.createElement("div");
    help.className = "quest-help-popup";
    help.innerHTML = `
      <div class="quest-help-inner">
        <strong>Как это работает</strong>
        <p>Вы отвечаете на 6 вопросов о своём бренде + выбираете звуковую волну.</p>
        <p>Каждый ответ сдвигает белую точку на голографическом поле — вы видите, как определяется архетип.</p>
        <p>В конце — детальный разбор с цветами, шрифтами и рекомендациями для сайта.</p>
        <button class="quest-help-close">Понятно</button>
      </div>
    `;
    document.body.appendChild(help);
    help
      .querySelector(".quest-help-close")
      .addEventListener("click", () => help.remove());
    help.addEventListener("click", (e) => {
      if (e.target === help) help.remove();
    });
  },

  // ==================== RENDER STEP ====================
  _renderStep() {
    const field = document.getElementById("panel-field");
    if (field) this._fieldRect = field.getBoundingClientRect();

    const statusEl = document.getElementById("hud-status-text");
    if (statusEl) {
      if (this._step <= 5) statusEl.textContent = `Вопрос ${this._step}/7`;
      else if (this._step === 6) statusEl.textContent = "Звуковая волна 6/7";
    }

    this._bubbles = [];
    this._selectedIdx = -1;
    if (this._confirmTimer) clearTimeout(this._confirmTimer);

    if (this._step >= 1 && this._step <= 5) {
      const q = this.questions[this._step - 1];
      // Title at top
      this._bubbles.push({
        type: "title",
        x: 0.5,
        y: 0.08,
        text: q.title,
        step: this._step,
      });
      // 4 answer cards — 2 columns, 2 rows, positioned at edges
      const pos = [
        { x: 0.18, y: 0.38 }, // left-top
        { x: 0.82, y: 0.38 }, // right-top
        { x: 0.18, y: 0.72 }, // left-bottom
        { x: 0.82, y: 0.72 }, // right-bottom
      ];
      q.answers.forEach((a, i) => {
        this._bubbles.push({
          type: "answer",
          idx: i,
          x: pos[i].x,
          y: pos[i].y,
          icon: a.icon,
          label: a.label,
          text: a.text,
          delta: a.delta,
        });
      });
    } else if (this._step === 6) {
      this._bubbles.push({
        type: "title",
        x: 0.5,
        y: 0.06,
        text: "Выберите звуковую волну",
        step: 6,
        sub: "Какая частота резонирует с брендом?",
      });
      const sp = [
        { x: 0.18, y: 0.35 },
        { x: 0.82, y: 0.35 },
        { x: 0.18, y: 0.7 },
        { x: 0.82, y: 0.7 },
      ];
      this.soundWaves.forEach((sw, i) => {
        this._bubbles.push({
          type: "sound",
          idx: i,
          x: sp[i].x,
          y: sp[i].y,
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
    const field = document.getElementById("panel-field");
    if (field) this._fieldRect = field.getBoundingClientRect();
    if (this._step >= 1) this._checkProximity();
    this._drawBubbles();
    this._animFrame = requestAnimationFrame(() => this._loop());
  },

  _checkProximity() {
    if (!this._fieldRect || this._selectedIdx >= 0) return;
    const rx = (this._mouseX - this._fieldRect.left) / this._fieldRect.width;
    const ry = (this._mouseY - this._fieldRect.top) / this._fieldRect.height;
    let closest = -1,
      closestDist = Infinity;
    this._bubbles.forEach((b) => {
      if (b.type === "answer" || b.type === "sound") {
        const dx = rx - b.x,
          dy = ry - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.12 && dist < closestDist) {
          closestDist = dist;
          closest = b.idx;
        }
      }
    });
    this._hoveredIdx = closest;
  },

  _drawBubbles() {
    const c = this._container;
    if (!c || !this._fieldRect) return;
    const W = this._fieldRect.width,
      H = this._fieldRect.height;
    c.innerHTML = "";
    this._bubbles.forEach((b) => {
      const el = document.createElement("div");
      el.style.left = b.x * W + "px";
      el.style.top = b.y * H + "px";
      el.style.position = "absolute";
      el.style.transform = "translate(-50%, -50%)";

      if (b.type === "title") {
        el.className = "holo-bubble holo-title";
        el.innerHTML = `<span>${b.text}</span>${b.sub ? `<small>${b.sub}</small>` : ""}<div class="holo-step-badge">${b.step}/7</div>`;
      } else if (b.type === "answer") {
        const hov = b.idx === this._hoveredIdx;
        const sel = b.idx === this._selectedIdx;
        el.className = `holo-bubble holo-answer${hov ? " hovered" : ""}${sel ? " selected" : ""}`;
        el.innerHTML = `<span class="holo-answer-icon">${b.icon}</span><span class="holo-answer-label">${b.label}</span><span class="holo-answer-text">${b.text}</span>`;
        el.style.cursor = "pointer";
        el.style.pointerEvents = "auto";
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          this._select(b.idx);
        });
      } else if (b.type === "sound") {
        const hov = b.idx === this._hoveredIdx;
        const sel = b.idx === this._selectedIdx;
        el.className = `holo-bubble holo-sound${hov ? " hovered" : ""}${sel ? " selected" : ""}`;
        el.innerHTML = `<div class="holo-waveform"><svg width="64" height="20" viewBox="0 0 64 20"><rect x="0" y="9" width="2" height="2" rx="1" fill="currentColor" opacity="0.3"/><rect x="3" y="7" width="2" height="6" rx="1" fill="currentColor" opacity="0.5"/><rect x="6" y="4" width="2" height="12" rx="1" fill="currentColor" opacity="0.7"/><rect x="9" y="2" width="2" height="16" rx="1" fill="currentColor"/><rect x="12" y="1" width="2" height="18" rx="1" fill="currentColor"/><rect x="15" y="2" width="2" height="16" rx="1" fill="currentColor"/><rect x="18" y="4" width="2" height="12" rx="1" fill="currentColor" opacity="0.9"/><rect x="21" y="7" width="2" height="6" rx="1" fill="currentColor" opacity="0.5"/><rect x="24" y="9" width="2" height="2" rx="1" fill="currentColor" opacity="0.3"/></svg></div><span class="holo-answer-label">${b.label}</span><span class="holo-answer-text">${b.text}</span>`;
        el.style.cursor = "pointer";
        el.style.pointerEvents = "auto";
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          this._select(b.idx);
        });
      }
      c.appendChild(el);
    });
  },

  // ==================== SELECT ====================
  _select(idx) {
    if (this._selectedIdx >= 0 || idx < 0) return;
    this._selectedIdx = idx;
    let delta = null,
      label = "";
    if (this._step <= 5) {
      const q = this.questions[this._step - 1];
      delta = q.answers[idx].delta;
      label = q.answers[idx].label;
    } else if (this._step === 6) {
      delta = this.soundWaves[idx].delta;
      label = this.soundWaves[idx].label;
    }
    if (delta) {
      this._answers.push({ step: this._step, idx, label, delta });
      ["control", "energy", "focus", "method"].forEach((d) => {
        if (typeof userVector !== "undefined") {
          userVector[d] = Math.max(0, Math.min(100, userVector[d] + delta[d]));
        }
      });
      if (typeof updateBrandPositionFromVector === "function")
        updateBrandPositionFromVector();
      if (typeof updateAll === "function") updateAll();
    }
    this._confirmTimer = setTimeout(() => {
      this._step++;
      if (this._step >= 7) this._finish();
      else this._renderStep();
    }, 700);
  },

  // ==================== FINISH ====================
  _finish() {
    this._active = false;
    if (this._animFrame) cancelAnimationFrame(this._animFrame);
    if (this._helpEl) this._helpEl.style.display = "none";
    const c = document.getElementById("holo-bubbles");
    if (c) c.innerHTML = "";
    const statusEl = document.getElementById("hud-status-text");
    if (statusEl) statusEl.textContent = "Готово";

    const finalVector = { control: 50, energy: 50, focus: 50, method: 50 };
    this._answers.forEach((a) => {
      ["control", "energy", "focus", "method"].forEach((d) => {
        finalVector[d] = Math.max(
          0,
          Math.min(100, finalVector[d] + a.delta[d]),
        );
      });
    });
    if (typeof Tracker !== "undefined") {
      const tv = Tracker.getBehaviorVector();
      ["control", "energy", "focus", "method"].forEach((d) => {
        finalVector[d] = Math.round(finalVector[d] * 0.8 + tv[d] * 0.2);
      });
    }
    if (typeof userVector !== "undefined") {
      ["control", "energy", "focus", "method"].forEach((d) => {
        userVector[d] = finalVector[d];
      });
    }
    if (typeof updateBrandPositionFromVector === "function")
      updateBrandPositionFromVector();
    if (typeof updateAll === "function") updateAll();

    let primary = null;
    if (typeof getRankings === "function") primary = getRankings().primary;

    // Show rich result
    if (typeof ArchetypeResult !== "undefined")
      ArchetypeResult.show(primary, finalVector, this._answers);
    // Also fire pivot
    if (this._onComplete) this._onComplete(finalVector, primary);
    if (typeof Pivot !== "undefined" && primary) Pivot.execute(primary.id);

    console.log(
      `%c[HoloQuest] ✅ ${primary?.nameRu || "—"}`,
      `color:${primary?.color || "#fff"};font-size:16px;font-weight:bold;`,
    );
  },
};

// Global mouse tracking for quest
document.addEventListener("mousemove", (e) => {
  if (HolographicQuest._active) {
    HolographicQuest._mouseX = e.clientX;
    HolographicQuest._mouseY = e.clientY;
  }
});

// Auto-show start screen on load
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    // Only show if not already in a session
    const already = document.getElementById("quest-start-overlay");
    if (!already) HolographicQuest.showStartScreen();
  }, 1200);
});
