// ==================== QUIZ ENGINE — Block 1: Core (12 questions) ====================
// Replaces the controllers panel with an interactive quiz.
// Each answer shifts the 4D userVector; the canvas field reacts live.

const QuizEngine = {
  // ---- State ----
  _active: false,
  _questionIndex: 0,
  _answers: [], // { questionIndex, value, delta }
  _baseVector: { control: 50, energy: 50, focus: 50, method: 50 },
  _runningVector: { control: 50, energy: 50, focus: 50, method: 50 },
  _originalPanelContent: null,
  _container: null,

  // ---- Questions: 6 A-vs-B + 6 Likert ----
  questions: [
    // === A-vs-B (axis oppositions) ===
    {
      type: "dual",
      text: "Когда бренд сталкивается с кризисом...",
      optionA: {
        label: "Берёт управление и ведёт",
        delta: { control: 12, focus: 8 },
      },
      optionB: {
        label: "Адаптируется и ищет новые пути",
        delta: { control: -12, focus: -8 },
      },
    },
    {
      type: "dual",
      text: "Энергетика нашего бренда...",
      optionA: {
        label: "Яркая, взрывная, провокационная",
        delta: { energy: 12, method: -8 },
      },
      optionB: {
        label: "Сдержанная, глубокая, стабильная",
        delta: { energy: -12, method: 8 },
      },
    },
    {
      type: "dual",
      text: "Наша стратегия...",
      optionA: {
        label: "Стрелка в одной цели — чёткий фокус",
        delta: { focus: 12, control: 4 },
      },
      optionB: {
        label: "Широкий взгляд — исследуем всё",
        delta: { focus: -12, control: -4 },
      },
    },
    {
      type: "dual",
      text: "В работе мы...",
      optionA: {
        label: "Следуем проверенным процессам",
        delta: { method: 12, energy: -4 },
      },
      optionB: {
        label: "Импровизируем и изобретаем на ходу",
        delta: { method: -12, energy: 4 },
      },
    },
    {
      type: "dual",
      text: "Что важнее для бренда...",
      optionA: {
        label: "Порядок, структура, предсказуемость",
        delta: { control: 10, method: 6 },
      },
      optionB: {
        label: "Свобода, гибкость, открытость",
        delta: { control: -10, method: -6 },
      },
    },
    {
      type: "dual",
      text: "Наш бренд общается так, чтобы...",
      optionA: {
        label: "Вдохновлять и зажигать эмоции",
        delta: { energy: 10, focus: -4 },
      },
      optionB: {
        label: "Объяснять чётко и структурировать",
        delta: { energy: -10, focus: 8 },
      },
    },
    // === Likert (scenario statements) ===
    {
      type: "likert",
      text: "Наш бренд всегда берёт ответственность, даже когда это трудно",
      map: (v) => ({ control: (v - 3) * 5 }),
    },
    {
      type: "likert",
      text: "Мы готовы нарушить правила ради прорыва",
      map: (v) => ({ control: (3 - v) * 4, energy: (v - 3) * 4 }),
    },
    {
      type: "likert",
      text: "Наше сообщение строится вокруг одного чёткого обещания",
      map: (v) => ({ focus: (v - 3) * 5 }),
    },
    {
      type: "likert",
      text: "Мы принимаем решения на основе данных, а не интуиции",
      map: (v) => ({ method: (v - 3) * 5 }),
    },
    {
      type: "likert",
      text: "Мы вдохновляем аудиторию мечтать о невозможном",
      map: (v) => ({ energy: (v - 3) * 4, focus: (v - 3) * 2 }),
    },
    {
      type: "likert",
      text: "Последовательность и надёжность — наш главный актив",
      map: (v) => ({ control: (v - 3) * 3, method: (v - 3) * 3 }),
    },
  ],

  // ==================== INIT ====================
  init() {
    this._buildLaunchButton();
    console.log("[QuizEngine] Initialized — Block 1 ready (12 questions).");
  },

  // ==================== LAUNCH BUTTON ====================
  _buildLaunchButton() {
    const btn = document.getElementById("quiz-launch-btn");
    if (!btn) {
      console.warn("[QuizEngine] Launch button not found in DOM.");
      return;
    }
    btn.addEventListener("click", () => this.start());
  },

  // ==================== START ====================
  start() {
    if (this._active) return;
    this._active = true;
    this._questionIndex = 0;
    this._answers = [];
    this._runningVector = { ...this._baseVector };

    // Reset engine vector to center for clean quiz start
    userVector = { ...this._baseVector };
    updateBrandPositionFromVector();
    updateAll();

    // Hide original panel content, show quiz
    this._swapPanel(true);

    // Render first question
    this._renderQuestion();

    // Update HUD status
    const statusText = document.getElementById("hud-status-text");
    if (statusText) statusText.textContent = "Тест: Блок 1";

    console.log("[QuizEngine] Quiz started.");
  },

  // ==================== STOP / EXIT ====================
  stop() {
    if (!this._active) return;
    this._active = false;
    this._swapPanel(false);

    const statusText = document.getElementById("hud-status-text");
    if (statusText) statusText.textContent = "Готов";

    console.log("[QuizEngine] Quiz stopped.");
  },

  // ==================== PANEL SWAP ====================
  _swapPanel(showQuiz) {
    const panel = document.getElementById("panel-controllers");
    if (!panel) return;

    const children = Array.from(panel.children);
    children.forEach((el) => {
      if (el.classList.contains("quiz-launch-btn")) {
        el.style.display = showQuiz ? "none" : "";
      } else if (el.id === "quiz-container") {
        el.style.display = showQuiz ? "flex" : "none";
      } else {
        el.style.display = showQuiz ? "none" : "";
      }
    });

    if (showQuiz && !document.getElementById("quiz-container")) {
      this._container = document.createElement("div");
      this._container.id = "quiz-container";
      this._container.className = "quiz-container";
      panel.appendChild(this._container);
    }

    if (showQuiz) {
      this._container = document.getElementById("quiz-container");
      this._container.style.display = "flex";
    }
  },

  // ==================== RENDER QUESTION ====================
  _renderQuestion() {
    if (!this._container) return;
    const q = this.questions[this._questionIndex];
    const total = this.questions.length;
    const progress = (this._questionIndex / total) * 100;

    let html = `
      <div class="quiz-header">
        <div class="quiz-block-label">БЛОК 1 · ЯДРО</div>
        <div class="quiz-progress">
          <div class="quiz-progress-track">
            <div class="quiz-progress-fill" style="width:${progress}%"></div>
          </div>
          <div class="quiz-counter">${this._questionIndex + 1} / ${total}</div>
        </div>
      </div>
      <div class="quiz-card">
        <div class="quiz-question">${q.text}</div>
    `;

    if (q.type === "dual") {
      html += `
        <div class="quiz-options-dual">
          <button class="quiz-option-btn quiz-option-a" data-val="A">
            <span class="quiz-option-label">${q.optionA.label}</span>
          </button>
          <div class="quiz-or">или</div>
          <button class="quiz-option-btn quiz-option-b" data-val="B">
            <span class="quiz-option-label">${q.optionB.label}</span>
          </button>
        </div>
      `;
    } else if (q.type === "likert") {
      html += `
        <div class="quiz-options-likert">
          <button class="quiz-likert-btn" data-val="1">
            <span class="quiz-likert-num">1</span>
            <span class="quiz-likert-label">Не согласен</span>
          </button>
          <button class="quiz-likert-btn" data-val="2">
            <span class="quiz-likert-num">2</span>
          </button>
          <button class="quiz-likert-btn" data-val="3">
            <span class="quiz-likert-num">3</span>
            <span class="quiz-likert-label">Нейтрально</span>
          </button>
          <button class="quiz-likert-btn" data-val="4">
            <span class="quiz-likert-num">4</span>
          </button>
          <button class="quiz-likert-btn" data-val="5">
            <span class="quiz-likert-num">5</span>
            <span class="quiz-likert-label">Согласен</span>
          </button>
        </div>
      `;
    }

    html += `
      </div>
      <div class="quiz-footer">
        <button class="quiz-exit-btn" id="quiz-exit">✕ Завершить тест</button>
      </div>
    `;

    this._container.innerHTML = html;

    // Bind answers
    const btns = this._container.querySelectorAll("[data-val]");
    btns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const val = e.currentTarget.dataset.val;
        this._handleAnswer(val);
      });
    });

    // Bind exit
    const exitBtn = this._container.querySelector("#quiz-exit");
    if (exitBtn) {
      exitBtn.addEventListener("click", () => this.stop());
    }
  },

  // ==================== HANDLE ANSWER ====================
  _handleAnswer(value) {
    const q = this.questions[this._questionIndex];
    let delta = { control: 0, energy: 0, focus: 0, method: 0 };

    if (q.type === "dual") {
      const choice = value === "A" ? q.optionA : q.optionB;
      Object.entries(choice.delta).forEach(([dim, d]) => {
        delta[dim] = d;
      });
    } else if (q.type === "likert") {
      const v = parseInt(value, 10);
      const mapped = q.map(v);
      Object.entries(mapped).forEach(([dim, d]) => {
        delta[dim] = d;
      });
    }

    // Store answer
    this._answers.push({ index: this._questionIndex, value, delta });

    // Apply to running vector (with clamp)
    ["control", "energy", "focus", "method"].forEach((dim) => {
      this._runningVector[dim] = clamp(
        this._runningVector[dim] + delta[dim],
        0,
        100,
      );
    });

    // Animate engine vector to running vector
    animateToVector({ ...this._runningVector }, () => {
      updateBrandPositionFromVector();
      updateAll();
    });

    // Brief transition before next question
    this._questionIndex++;
    if (this._questionIndex < this.questions.length) {
      this._showTransition(() => this._renderQuestion());
    } else {
      this._showResults();
    }
  },

  // ==================== TRANSITION ====================
  _showTransition(onComplete) {
    if (!this._container) return;
    const q = this.questions[this._questionIndex - 1];

    // Show a brief "impulse" flash
    const flash = document.createElement("div");
    flash.className = "quiz-transition-flash";
    flash.textContent = "Импульс зафиксирован";
    this._container.appendChild(flash);

    // Trigger subtle scan using existing Pivot if available
    if (typeof Pivot !== "undefined" && Pivot._playScanAnimation) {
      // Light scan — just a quick line, no full theme change
      const overlay = document.querySelector(".pivot-scan-overlay");
      if (overlay) {
        overlay.classList.add("active");
        const line = overlay.querySelector(".pivot-scan-line");
        if (line) {
          line.style.background =
            "linear-gradient(180deg, transparent, rgba(110,231,255,0.4), rgba(110,231,255,0.6), rgba(110,231,255,0.4), transparent)";
          line.style.boxShadow = "0 0 20px rgba(110,231,255,0.3)";
        }
        setTimeout(() => overlay.classList.remove("active"), 350);
      }
    }

    setTimeout(() => {
      if (flash.parentNode) flash.parentNode.removeChild(flash);
      if (onComplete) onComplete();
    }, 280);
  },

  // ==================== SHOW RESULTS ====================
  _showResults() {
    if (!this._container) return;

    const r = getRankings();
    const total = this.questions.length;

    // Compute a simple confidence: how concentrated is the top score
    const gap = r.all[1].distance - r.all[0].distance;
    const confidence = Math.min(Math.round((gap / 60) * 100), 100);

    let html = `
      <div class="quiz-header">
        <div class="quiz-block-label">БЛОК 1 ЗАВЕРШЁН</div>
        <div class="quiz-progress">
          <div class="quiz-progress-track">
            <div class="quiz-progress-fill" style="width:100%"></div>
          </div>
        </div>
      </div>
      <div class="quiz-result-card">
        <div class="quiz-result-title">Промежуточный профиль</div>
        <div class="quiz-vector-hud">
          <div class="quiz-vector-item">
            <span class="quiz-vector-dim">Control</span>
            <span class="quiz-vector-val">${userVector.control}</span>
          </div>
          <div class="quiz-vector-item">
            <span class="quiz-vector-dim">Energy</span>
            <span class="quiz-vector-val">${userVector.energy}</span>
          </div>
          <div class="quiz-vector-item">
            <span class="quiz-vector-dim">Focus</span>
            <span class="quiz-vector-val">${userVector.focus}</span>
          </div>
          <div class="quiz-vector-item">
            <span class="quiz-vector-dim">Method</span>
            <span class="quiz-vector-val">${userVector.method}</span>
          </div>
        </div>

        <div class="quiz-top3">
          <div class="quiz-top3-item quiz-top3-primary">
            <div class="quiz-top3-dot" style="background:${r.primary.color};box-shadow:0 0 10px ${r.primary.color}"></div>
            <div class="quiz-top3-info">
              <div class="quiz-top3-label">PRIMARY</div>
              <div class="quiz-top3-name">${r.primary.nameRu}</div>
            </div>
          </div>
          <div class="quiz-top3-item quiz-top3-secondary">
            <div class="quiz-top3-dot" style="background:${r.secondary.color};box-shadow:0 0 8px ${r.secondary.color}"></div>
            <div class="quiz-top3-info">
              <div class="quiz-top3-label">SECONDARY</div>
              <div class="quiz-top3-name">${r.secondary.nameRu}</div>
            </div>
          </div>
          <div class="quiz-top3-item quiz-top3-tertiary">
            <div class="quiz-top3-dot" style="background:${r.all[2].color};box-shadow:0 0 6px ${r.all[2].color}"></div>
            <div class="quiz-top3-info">
              <div class="quiz-top3-label">TERTIARY</div>
              <div class="quiz-top3-name">${r.all[2].nameRu}</div>
            </div>
          </div>
        </div>

        <div class="quiz-confidence">
          <span class="quiz-confidence-label">Уверенность</span>
          <span class="quiz-confidence-val">${confidence}%</span>
        </div>
      </div>
      <div class="quiz-footer">
        <button class="quiz-action-btn quiz-action-primary" id="quiz-continue">Продолжить к Блоку 2</button>
        <button class="quiz-action-btn quiz-action-secondary" id="quiz-back">Вернуться к ручному режиму</button>
      </div>
    `;

    this._container.innerHTML = html;

    // Bind buttons
    const continueBtn = this._container.querySelector("#quiz-continue");
    if (continueBtn) {
      continueBtn.addEventListener("click", () => {
        alert("Блок 2 (Мотивация) будет доступен в следующей версии.");
      });
    }

    const backBtn = this._container.querySelector("#quiz-back");
    if (backBtn) {
      backBtn.addEventListener("click", () => this.stop());
    }

    // Trigger a scan animation for the primary archetype
    if (typeof Pivot !== "undefined" && Pivot.execute) {
      setTimeout(() => {
        Pivot.execute(r.primary.id);
      }, 400);
    }

    console.log(
      `[QuizEngine] Block 1 complete. Primary: ${r.primary.nameRu}, Confidence: ${confidence}%`,
    );
  },
};
