// ==================== HOLOGRAPHIC QUEST v3 ====================
// Dashboard-native: questions in left panel, canvas always visible,
// right panel shows progress. "Next" button after each answer.
// Integrated into the existing dashboard structure.

const HolographicQuest = {
  _active: false,
  _step: 0,
  _answers: [],
  _selectedIdx: -1,
  _onComplete: null,
  _helpEl: null,

  // Saved panel states for restore
  _savedLeftHTML: "",
  _savedRightHTML: "",

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
          text: "Спокойствие, «как дома»",
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
        <p class="quest-start-hint">~2 минуты</p>
      </div>
    `;
    document.body.appendChild(overlay);
    document.getElementById("quest-start-btn").addEventListener("click", () => {
      overlay.style.opacity = "0";
      setTimeout(() => {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 300);
      this.start();
    });
  },

  // ==================== START ====================
  start(onComplete) {
    if (this._active) return;
    this._active = true;
    this._step = 1;
    this._answers = [];
    this._selectedIdx = -1;
    this._onComplete = onComplete;

    // Save panel states
    const left = document.getElementById("panel-controllers");
    const right = document.getElementById("panel-output");
    if (left) this._savedLeftHTML = left.innerHTML;
    if (right) this._savedRightHTML = right.innerHTML;

    this._createHelpButton();
    this._renderStep();

    const statusEl = document.getElementById("hud-status-text");
    if (statusEl) statusEl.textContent = "Шаг 1/7";

    console.log("[HoloQuest] 🌀 Quest started in dashboard panels.");
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
        <p>Вы отвечаете на 6 вопросов о бренде + выбираете звуковую волну.</p>
        <p>Каждый ответ сдвигает точку на голографическом поле — видно, как определяется архетип.</p>
        <p>В конце — детальный разбор с рекомендациями для сайта.</p>
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
    this._selectedIdx = -1;
    const left = document.getElementById("panel-controllers");
    const right = document.getElementById("panel-output");
    if (!left || !right) return;

    const statusEl = document.getElementById("hud-status-text");
    const totalSteps = 7;

    if (this._step <= 5) {
      const q = this.questions[this._step - 1];
      if (statusEl) statusEl.textContent = `Вопрос ${this._step}/${totalSteps}`;

      // LEFT PANEL: question + answers
      let answersHTML = q.answers
        .map(
          (a, i) => `
        <div class="quest-answer-card" data-idx="${i}" id="quest-ans-${i}">
          <span class="quest-ans-icon">${a.icon}</span>
          <div class="quest-ans-content">
            <span class="quest-ans-label">${a.label}</span>
            <span class="quest-ans-text">${a.text}</span>
          </div>
        </div>
      `,
        )
        .join("");

      left.innerHTML = `
        <div class="quest-panel-header">АРХЕТИП БРЕНДА</div>
        <div class="quest-question-block">
          <div class="quest-q-num">Шаг ${this._step} из ${totalSteps}</div>
          <div class="quest-q-title">${q.title}</div>
          <div class="quest-q-bar"><div class="quest-q-bar-fill" style="width:${(this._step / totalSteps) * 100}%"></div></div>
          <div class="quest-answers-list" id="quest-answers-list">
            ${answersHTML}
          </div>
          <button class="quest-next-btn" id="quest-next-btn" disabled>Выберите вариант ↑</button>
        </div>
      `;

      // Bind answer clicks
      document.querySelectorAll(".quest-answer-card").forEach((card) => {
        card.addEventListener("click", () => {
          const idx = parseInt(card.dataset.idx);
          this._selectAnswer(idx);
        });
      });

      // RIGHT PANEL: live status
      this._renderRightPanel(right, totalSteps);
    } else if (this._step === 6) {
      if (statusEl)
        statusEl.textContent = `Звуковая волна ${this._step}/${totalSteps}`;

      let wavesHTML = this.soundWaves
        .map(
          (sw, i) => `
        <div class="quest-answer-card quest-sound-card" data-idx="${i}" id="quest-ans-${i}">
          <div class="quest-waveform"><svg width="64" height="20" viewBox="0 0 64 20">
            <rect x="0" y="9" width="2" height="2" rx="1" fill="currentColor" opacity="0.3"/>
            <rect x="3" y="7" width="2" height="6" rx="1" fill="currentColor" opacity="0.5"/>
            <rect x="6" y="4" width="2" height="12" rx="1" fill="currentColor" opacity="0.7"/>
            <rect x="9" y="2" width="2" height="16" rx="1" fill="currentColor"/>
            <rect x="12" y="1" width="2" height="18" rx="1" fill="currentColor"/>
            <rect x="15" y="2" width="2" height="16" rx="1" fill="currentColor"/>
            <rect x="18" y="4" width="2" height="12" rx="1" fill="currentColor" opacity="0.9"/>
            <rect x="21" y="7" width="2" height="6" rx="1" fill="currentColor" opacity="0.5"/>
            <rect x="24" y="9" width="2" height="2" rx="1" fill="currentColor" opacity="0.3"/>
          </svg></div>
          <div class="quest-ans-content">
            <span class="quest-ans-label">${sw.label}</span>
            <span class="quest-ans-text">${sw.desc}</span>
          </div>
        </div>
      `,
        )
        .join("");

      left.innerHTML = `
        <div class="quest-panel-header">ЗВУКОВАЯ ВОЛНА</div>
        <div class="quest-question-block">
          <div class="quest-q-num">Шаг ${this._step} из ${totalSteps}</div>
          <div class="quest-q-title">Выберите звуковую волну бренда</div>
          <div class="quest-q-bar"><div class="quest-q-bar-fill" style="width:${(this._step / totalSteps) * 100}%"></div></div>
          <div class="quest-answers-list" id="quest-answers-list">
            ${wavesHTML}
          </div>
          <button class="quest-next-btn" id="quest-next-btn" disabled>Выберите вариант ↑</button>
        </div>
      `;

      document.querySelectorAll(".quest-answer-card").forEach((card) => {
        card.addEventListener("click", () => {
          const idx = parseInt(card.dataset.idx);
          this._selectAnswer(idx);
        });
      });

      this._renderRightPanel(right, totalSteps);
    }
  },

  _renderRightPanel(right, total) {
    const r = typeof getRankings === "function" ? getRankings() : null;
    const primaryName = r ? r.primary.nameRu : "—";
    const primaryColor = r ? r.primary.color : "var(--accent-blue)";
    const dims = ["control", "energy", "focus", "method"];
    const labels = {
      control: "Контроль",
      energy: "Энергия",
      focus: "Фокус",
      method: "Метод",
    };

    let barsHTML = dims
      .map((d) => {
        const val = typeof userVector !== "undefined" ? userVector[d] : 50;
        return `<div class="quest-vector-row">
        <span class="quest-vector-label">${labels[d]}</span>
        <div class="quest-vector-track"><div class="quest-vector-fill" style="width:${val}%;background:${primaryColor};"></div></div>
        <span class="quest-vector-val">${val}</span>
      </div>`;
      })
      .join("");

    right.innerHTML = `
      <div class="output-header">РЕЗУЛЬТАТ</div>
      <div class="quest-right-card" style="border-color:${primaryColor}44;">
        <div class="quest-right-archetype" style="color:${primaryColor}">${primaryName}</div>
        <div class="quest-right-sub">Текущий архетип</div>
      </div>
      <div class="quest-right-section">
        <div class="quest-right-section-title">4D-ВЕКТОР</div>
        ${barsHTML}
      </div>
      <div class="quest-right-section">
        <div class="quest-right-section-title">ПРОГРЕСС</div>
        <div class="quest-right-steps">
          ${Array.from(
            { length: total },
            (_, i) => `
            <div class="quest-step-dot ${i + 1 <= this._step ? "done" : ""} ${i + 1 === this._step ? "current" : ""}">
              ${i + 1 <= this._step ? "✓" : i + 1}
            </div>
          `,
          ).join("")}
        </div>
      </div>
    `;
  },

  // ==================== SELECT ANSWER ====================
  _selectAnswer(idx) {
    if (this._selectedIdx >= 0) return; // already selected
    this._selectedIdx = idx;

    // Highlight selected, dim others
    document.querySelectorAll(".quest-answer-card").forEach((card, i) => {
      if (i === idx) {
        card.classList.add("selected");
      } else {
        card.style.opacity = "0.35";
        card.style.pointerEvents = "none";
      }
    });

    // Enable next button
    const nextBtn = document.getElementById("quest-next-btn");
    if (nextBtn) {
      nextBtn.disabled = false;
      nextBtn.textContent = "Далее →";
      nextBtn.addEventListener("click", () => this._advance(), { once: true });
    }

    // Apply delta to vector
    let delta = null,
      label = "";
    if (this._step <= 5) {
      const a = this.questions[this._step - 1].answers[idx];
      delta = a.delta;
      label = a.label;
    } else if (this._step === 6) {
      const a = this.soundWaves[idx];
      delta = a.delta;
      label = a.label;
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

      // Update right panel live
      const right = document.getElementById("panel-output");
      if (right) this._renderRightPanel(right, 7);
    }
  },

  _advance() {
    this._step++;
    if (this._step >= 7) {
      this._finish();
    } else {
      this._renderStep();
    }
  },

  // ==================== FINISH ====================
  _finish() {
    this._active = false;
    if (this._helpEl) this._helpEl.style.display = "none";
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

    // Restore dashboard panels
    const left = document.getElementById("panel-controllers");
    const right = document.getElementById("panel-output");
    if (left && this._savedLeftHTML) left.innerHTML = this._savedLeftHTML;
    if (right && this._savedRightHTML) right.innerHTML = this._savedRightHTML;

    // Re-init jog dials & presets
    if (typeof initJogDials === "function") initJogDials();
    if (typeof initPresets === "function") initPresets();
    if (typeof updateAll === "function") updateAll();

    // Show result
    if (typeof ArchetypeResult !== "undefined")
      ArchetypeResult.show(primary, finalVector, this._answers);
    if (this._onComplete) this._onComplete(finalVector, primary);
    if (typeof Pivot !== "undefined" && primary) Pivot.execute(primary.id);

    console.log(
      `%c[HoloQuest] ✅ ${primary?.nameRu || "—"}`,
      `color:${primary?.color || "#fff"};font-size:16px;font-weight:bold;`,
    );
  },
};

// Auto-show start screen on load
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const already = document.getElementById("quest-start-overlay");
    if (!already) HolographicQuest.showStartScreen();
  }, 1200);
});
