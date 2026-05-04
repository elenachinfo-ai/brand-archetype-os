// ==================== HOLOGRAPHIC QUEST v4 ====================
// Dashboard-native: questions in left panel, canvas always visible,
// right panel shows progress. "Next" button after each answer.
// v4: Live CSS interpolation — each answer instantly transforms the UI.

const HolographicQuest = {
  _active: false,
  _step: 0,
  _answers: [],
  _selectedIdx: -1,
  _onComplete: null,
  _helpEl: null,
  _cssTransitionTimer: null,

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
          delta: { control: 8, energy: 10, focus: 4, method: 0 },
          css_commands: {
            "--radius-sm": "6px",
            "--radius-md": "10px",
            "--radius-lg": "16px",
            "--transition-fast": "0.22s cubic-bezier(0.4,0,0.6,1)",
            "--transition-normal": "0.45s cubic-bezier(0.4,0,0.6,1)",
            "--glow-strong": "rgba(231,76,60,0.8)",
            "--backdrop-blur": "blur(6px)",
            easing: "cubic-bezier(0.4,0,0.6,1)",
          },
        },
        {
          icon: "✨",
          label: "Магия",
          text: "Трансформировать, вдохновлять",
          delta: { control: 0, energy: 8, focus: 2, method: 8 },
          css_commands: {
            "--radius-sm": "12px",
            "--radius-md": "22px",
            "--radius-lg": "36px",
            "--transition-fast": "0.3s cubic-bezier(0.4,0,0.2,1.2)",
            "--transition-normal": "0.6s cubic-bezier(0.4,0,0.2,1.2)",
            "--glow-strong": "rgba(155,89,182,0.8)",
            "--backdrop-blur": "blur(14px)",
            "--grid-opacity": "0.04",
            easing: "cubic-bezier(0.4,0,0.2,1.2)",
          },
        },
        {
          icon: "👑",
          label: "Порядок",
          text: "Управлять, строить системы",
          delta: { control: 10, energy: -2, focus: 8, method: 6 },
          css_commands: {
            "--radius-sm": "4px",
            "--radius-md": "8px",
            "--radius-lg": "12px",
            "--transition-fast": "0.3s cubic-bezier(0.6,0,0.4,1)",
            "--transition-normal": "0.6s cubic-bezier(0.6,0,0.4,1)",
            "--glow-strong": "rgba(243,156,18,0.85)",
            "--backdrop-blur": "blur(8px)",
            "--grid-opacity": "0.1",
            easing: "cubic-bezier(0.6,0,0.4,1)",
          },
        },
        {
          icon: "🤲",
          label: "Забота",
          text: "Поддерживать, делать жизнь лучше",
          delta: { control: -4, energy: -6, focus: 2, method: 4 },
          css_commands: {
            "--radius-sm": "14px",
            "--radius-md": "24px",
            "--radius-lg": "38px",
            "--transition-fast": "0.35s ease-out",
            "--transition-normal": "0.7s ease-out",
            "--glow-strong": "rgba(39,174,96,0.7)",
            "--backdrop-blur": "blur(4px)",
            "--grid-opacity": "0.03",
            easing: "ease-out",
          },
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
          delta: { control: -4, energy: 10, focus: -6, method: -2 },
          css_commands: {
            "--radius-sm": "12px",
            "--radius-md": "20px",
            "--radius-lg": "30px",
            "--transition-fast": "0.2s cubic-bezier(0.2,1.2,0.6,1)",
            "--transition-normal": "0.4s cubic-bezier(0.2,1.2,0.6,1)",
            "--glow-strong": "rgba(255,152,0,0.8)",
            easing: "cubic-bezier(0.2,1.2,0.6,1)",
          },
        },
        {
          icon: "🏠",
          label: "Доверие",
          text: "Спокойствие, «как дома»",
          delta: { control: 2, energy: -4, focus: 0, method: 0 },
          css_commands: {
            "--radius-sm": "8px",
            "--radius-md": "14px",
            "--radius-lg": "20px",
            "--transition-fast": "0.25s ease",
            "--transition-normal": "0.5s ease",
            "--glow-strong": "rgba(121,85,72,0.6)",
            easing: "ease",
          },
        },
        {
          icon: "💋",
          label: "Страсть",
          text: "Желание, эстетическое наслаждение",
          delta: { control: -2, energy: 6, focus: -2, method: 4 },
          css_commands: {
            "--radius-sm": "16px",
            "--radius-md": "28px",
            "--radius-lg": "44px",
            "--transition-fast": "0.3s cubic-bezier(0.3,0,0.5,1)",
            "--transition-normal": "0.6s cubic-bezier(0.3,0,0.5,1)",
            "--glow-strong": "rgba(233,30,99,0.8)",
            "--backdrop-blur": "blur(18px)",
            easing: "cubic-bezier(0.3,0,0.5,1)",
          },
        },
        {
          icon: "📚",
          label: "Уважение",
          text: "Ясность, уверенность в экспертизе",
          delta: { control: 6, energy: -6, focus: 8, method: 6 },
          css_commands: {
            "--radius-sm": "4px",
            "--radius-md": "8px",
            "--radius-lg": "14px",
            "--transition-fast": "0.35s cubic-bezier(0.5,0,0.3,1)",
            "--transition-normal": "0.7s cubic-bezier(0.5,0,0.3,1)",
            "--glow-strong": "rgba(96,125,139,0.7)",
            "--backdrop-blur": "blur(10px)",
            easing: "cubic-bezier(0.5,0,0.3,1)",
          },
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
          delta: { control: -6, energy: 8, focus: -4, method: -6 },
          css_commands: {
            "--radius-sm": "2px",
            "--radius-md": "4px",
            "--radius-lg": "8px",
            "--transition-fast": "0.15s cubic-bezier(0.7,0,1,0.5)",
            "--transition-normal": "0.3s cubic-bezier(0.7,0,1,0.5)",
            "--glow-strong": "rgba(255,87,34,0.9)",
            "--backdrop-blur": "blur(2px)",
            easing: "cubic-bezier(0.7,0,1,0.5)",
          },
        },
        {
          icon: "🎨",
          label: "Творчество",
          text: "Вдохновляюще, с воображением",
          delta: { control: 0, energy: 4, focus: 4, method: 6 },
          css_commands: {
            "--radius-sm": "8px",
            "--radius-md": "16px",
            "--radius-lg": "26px",
            "--transition-fast": "0.25s cubic-bezier(0.4,0,0.2,1.1)",
            "--transition-normal": "0.5s cubic-bezier(0.4,0,0.2,1.1)",
            "--glow-strong": "rgba(103,58,183,0.8)",
            "--backdrop-blur": "blur(12px)",
            easing: "cubic-bezier(0.4,0,0.2,1.1)",
          },
        },
        {
          icon: "🤝",
          label: "Честность",
          text: "Просто, без прикрас и пафоса",
          delta: { control: 0, energy: -2, focus: -2, method: 0 },
          css_commands: {
            "--radius-sm": "8px",
            "--radius-md": "14px",
            "--radius-lg": "20px",
            "--transition-fast": "0.25s ease",
            "--transition-normal": "0.5s ease",
            "--glow-strong": "rgba(121,85,72,0.45)",
            easing: "ease",
          },
        },
        {
          icon: "🥂",
          label: "Престиж",
          text: "Элегантно, с чувством превосходства",
          delta: { control: 8, energy: 0, focus: 2, method: 4 },
          css_commands: {
            "--radius-sm": "4px",
            "--radius-md": "8px",
            "--radius-lg": "12px",
            "--transition-fast": "0.3s cubic-bezier(0.6,0,0.4,1)",
            "--transition-normal": "0.6s cubic-bezier(0.6,0,0.4,1)",
            "--glow-strong": "rgba(243,156,18,0.85)",
            "--heading-weight": "600",
            easing: "cubic-bezier(0.6,0,0.4,1)",
          },
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
          delta: { control: -4, energy: 6, focus: -6, method: 0 },
          css_commands: {
            "--radius-sm": "10px",
            "--radius-md": "18px",
            "--radius-lg": "28px",
            "--transition-fast": "0.28s cubic-bezier(0.3,0,0.7,1)",
            "--transition-normal": "0.55s cubic-bezier(0.3,0,0.7,1)",
            "--glow-strong": "rgba(0,188,212,0.75)",
            "--backdrop-blur": "blur(10px)",
            easing: "cubic-bezier(0.3,0,0.7,1)",
          },
        },
        {
          icon: "🔍",
          label: "Истину",
          text: "Знания, понимание, мудрость",
          delta: { control: 4, energy: -8, focus: 10, method: 6 },
          css_commands: {
            "--radius-sm": "4px",
            "--radius-md": "8px",
            "--radius-lg": "14px",
            "--transition-fast": "0.35s cubic-bezier(0.5,0,0.3,1)",
            "--transition-normal": "0.7s cubic-bezier(0.5,0,0.3,1)",
            "--glow-strong": "rgba(96,125,139,0.55)",
            "--backdrop-blur": "blur(12px)",
            "--grid-opacity": "0.08",
            easing: "cubic-bezier(0.5,0,0.3,1)",
          },
        },
        {
          icon: "🛡️",
          label: "Безопасность",
          text: "Заботу, тепло и защиту",
          delta: { control: 2, energy: -6, focus: 0, method: 4 },
          css_commands: {
            "--radius-sm": "14px",
            "--radius-md": "24px",
            "--radius-lg": "38px",
            "--transition-fast": "0.35s ease-out",
            "--transition-normal": "0.7s ease-out",
            "--glow-strong": "rgba(39,174,96,0.5)",
            "--backdrop-blur": "blur(4px)",
            easing: "ease-out",
          },
        },
        {
          icon: "🏆",
          label: "Признание",
          text: "Статус, уважение, достижения",
          delta: { control: 8, energy: 6, focus: 4, method: 0 },
          css_commands: {
            "--radius-sm": "6px",
            "--radius-md": "10px",
            "--radius-lg": "16px",
            "--transition-fast": "0.22s cubic-bezier(0.4,0,0.6,1)",
            "--transition-normal": "0.45s cubic-bezier(0.4,0,0.6,1)",
            "--glow-strong": "rgba(231,76,60,0.8)",
            "--heading-weight": "700",
            easing: "cubic-bezier(0.4,0,0.6,1)",
          },
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
          delta: { control: 0, energy: 6, focus: 4, method: 8 },
          css_commands: {
            "--radius-sm": "12px",
            "--radius-md": "22px",
            "--radius-lg": "36px",
            "--transition-fast": "0.3s cubic-bezier(0.4,0,0.2,1.2)",
            "--transition-normal": "0.6s cubic-bezier(0.4,0,0.2,1.2)",
            "--glow-strong": "rgba(155,89,182,0.85)",
            "--backdrop-blur": "blur(16px)",
            "--grid-opacity": "0.05",
            easing: "cubic-bezier(0.4,0,0.2,1.2)",
          },
        },
        {
          icon: "⚙️",
          label: "Надёжность",
          text: "Качественный, проверенный временем",
          delta: { control: 4, energy: -4, focus: 0, method: 2 },
          css_commands: {
            "--radius-sm": "6px",
            "--radius-md": "10px",
            "--radius-lg": "14px",
            "--transition-fast": "0.25s ease",
            "--transition-normal": "0.5s ease",
            "--glow-strong": "rgba(96,125,139,0.4)",
            "--backdrop-blur": "blur(6px)",
            easing: "ease",
          },
        },
        {
          icon: "💥",
          label: "Дерзость",
          text: "Ломает правила и стандарты",
          delta: { control: -8, energy: 10, focus: -4, method: -4 },
          css_commands: {
            "--radius-sm": "2px",
            "--radius-md": "4px",
            "--radius-lg": "8px",
            "--transition-fast": "0.15s cubic-bezier(0.7,0,1,0.5)",
            "--transition-normal": "0.3s cubic-bezier(0.7,0,1,0.5)",
            "--glow-strong": "rgba(255,87,34,1.0)",
            "--backdrop-blur": "blur(2px)",
            "--grid-opacity": "0.12",
            easing: "cubic-bezier(0.7,0,1,0.5)",
          },
        },
        {
          icon: "💎",
          label: "Красота",
          text: "Чувственный — им хочется обладать",
          delta: { control: 2, energy: 4, focus: -2, method: 6 },
          css_commands: {
            "--radius-sm": "16px",
            "--radius-md": "28px",
            "--radius-lg": "44px",
            "--transition-fast": "0.3s cubic-bezier(0.3,0,0.5,1)",
            "--transition-normal": "0.6s cubic-bezier(0.3,0,0.5,1)",
            "--glow-strong": "rgba(233,30,99,0.75)",
            "--backdrop-blur": "blur(18px)",
            "--transmission": "0.8",
            easing: "cubic-bezier(0.3,0,0.5,1)",
          },
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
      delta: { control: 6, energy: -2, focus: 4, method: 4 },
      css_commands: {
        "--radius-sm": "4px",
        "--radius-md": "8px",
        "--radius-lg": "14px",
        "--transition-fast": "0.3s cubic-bezier(0.6,0,0.4,1)",
        "--transition-normal": "0.6s cubic-bezier(0.6,0,0.4,1)",
        "--glow-strong": "rgba(accent,0.65)",
        easing: "cubic-bezier(0.6,0,0.4,1)",
      },
    },
    {
      id: "dynamic",
      label: "Динамичный пульс",
      desc: "Быстрый темп — энергия, драйв",
      icon: "🅼",
      delta: { control: -2, energy: 10, focus: -2, method: 0 },
      css_commands: {
        "--radius-sm": "2px",
        "--radius-md": "4px",
        "--radius-lg": "8px",
        "--transition-fast": "0.15s cubic-bezier(0.7,0,1,0.5)",
        "--transition-normal": "0.3s cubic-bezier(0.7,0,1,0.5)",
        "--glow-strong": "rgba(accent,0.9)",
        easing: "cubic-bezier(0.7,0,1,0.5)",
      },
    },
    {
      id: "harmonic",
      label: "Гармоничный поток",
      desc: "Плавные волны — забота, комфорт",
      icon: "🅻",
      delta: { control: 2, energy: -6, focus: 0, method: 2 },
      css_commands: {
        "--radius-sm": "14px",
        "--radius-md": "24px",
        "--radius-lg": "38px",
        "--transition-fast": "0.35s ease-out",
        "--transition-normal": "0.7s ease-out",
        "--glow-strong": "rgba(accent,0.4)",
        easing: "ease-out",
      },
    },
    {
      id: "crystal",
      label: "Кристальный звон",
      desc: "Высокие тона — инновации, магия",
      icon: "🅷",
      delta: { control: 0, energy: 4, focus: 6, method: 8 },
      css_commands: {
        "--radius-sm": "12px",
        "--radius-md": "22px",
        "--radius-lg": "36px",
        "--transition-fast": "0.3s cubic-bezier(0.4,0,0.2,1.2)",
        "--transition-normal": "0.6s cubic-bezier(0.4,0,0.2,1.2)",
        "--glow-strong": "rgba(accent,0.8)",
        "--backdrop-blur": "blur(14px)",
        easing: "cubic-bezier(0.4,0,0.2,1.2)",
      },
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
        <p>Интерфейс трансформируется в реальном времени: цвета, скругления, анимации.</p>
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

  // ==================== LIVE CSS INTERPOLATION (v4) ====================
  /** Interpolates CSS variables on :root toward target values with smooth 350ms transition. */
  _applyLiveCSS(cssCommands) {
    if (!cssCommands || typeof cssCommands !== "object") return;
    var root = document.documentElement;
    var keys = Object.keys(cssCommands).filter(function (k) {
      return k.indexOf("--") === 0;
    });
    if (keys.length === 0) return;

    // Enable smooth transition
    root.style.transition = "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)";

    // Apply each CSS custom property
    keys.forEach(function (key) {
      root.style.setProperty(key, cssCommands[key]);
    });

    // Easing override
    if (cssCommands.easing) {
      root.style.setProperty(
        "--transition-fast",
        "0.22s " + cssCommands.easing,
      );
      root.style.setProperty(
        "--transition-normal",
        "0.45s " + cssCommands.easing,
      );
    }

    // Clean up
    var self = this;
    clearTimeout(this._cssTransitionTimer);
    this._cssTransitionTimer = setTimeout(function () {
      root.style.transition = "";
    }, 380);

    // Mirror to Three.js canvas if pivot active
    if (typeof window !== "undefined" && window.__pivotCanvas) {
      var cc = window.__pivotCanvas;
      if (cssCommands["--glow-strong"])
        cc.dotGlow = cssCommands["--glow-strong"];
      if (cssCommands["--grid-opacity"])
        cc.grid = cssCommands["--grid-opacity"];
    }

    console.log(
      "%c[LiveCSS] " + keys.length + " vars → UI",
      "color: #a5d6a7; font-size: 11px;",
    );
  },

  // ==================== SELECT ANSWER ====================
  _selectAnswer(idx) {
    if (this._selectedIdx >= 0) return;
    this._selectedIdx = idx;

    // Highlight selected, dim others
    document.querySelectorAll(".quest-answer-card").forEach(function (card, i) {
      if (i === idx) {
        card.classList.add("selected");
      } else {
        card.style.opacity = "0.35";
        card.style.pointerEvents = "none";
      }
    });

    // Enable next button
    var nextBtn = document.getElementById("quest-next-btn");
    if (nextBtn) {
      nextBtn.disabled = false;
      nextBtn.textContent = "Далее →";
      nextBtn.addEventListener(
        "click",
        function () {
          this._advance();
        }.bind(this),
        { once: true },
      );
    }

    // Resolve answer
    var delta = null,
      label = "",
      cssCommands = null;
    if (this._step <= 5) {
      var a = this.questions[this._step - 1].answers[idx];
      delta = a.delta;
      label = a.label;
      cssCommands = a.css_commands || null;
    } else if (this._step === 6) {
      var a = this.soundWaves[idx];
      delta = a.delta;
      label = a.label;
      cssCommands = a.css_commands || null;
    }

    if (delta) {
      this._answers.push({
        step: this._step,
        idx: idx,
        label: label,
        delta: delta,
      });
      ["control", "energy", "focus", "method"].forEach(function (d) {
        if (typeof userVector !== "undefined") {
          userVector[d] = Math.max(0, Math.min(100, userVector[d] + delta[d]));
        }
      });
      if (typeof updateBrandPositionFromVector === "function")
        updateBrandPositionFromVector();
      if (typeof updateAll === "function") updateAll();

      // ---- LIVE CSS PREVIEW (ArchetypeOS v4) ----
      if (cssCommands) this._applyLiveCSS(cssCommands);

      // Update right panel
      var right = document.getElementById("panel-output");
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
  }, 800);
});
