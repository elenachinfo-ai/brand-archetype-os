// ==================== BRAND ARCHETYPE DIAGNOSTIC ====================
// Quest-based questionnaire: 6 questions → 4D vector → archetype.
// Each answer contributes delta values to {control, energy, focus, method}.

const Diagnostic = {
  // ---- State ----
  _currentQuestion: 0,
  _answers: [],       // array of {questionIndex, answerIndex, delta}
  _overlayEl: null,
  _onComplete: null,

  // ---- Questions (6) × Answers (4) ----
  questions: [
    {
      id: "motivation",
      title: "Что движет вашим брендом?",
      subtitle: "Выберите утверждение, которое точнее всего описывает главный импульс вашей компании.",
      answers: [
        { text: "Побеждать, достигать целей, быть первыми на рынке",   icon: "⚔️", label: "Победа",      delta: { control: +8, energy: +10, focus: +4, method:  0 } },
        { text: "Трансформировать реальность, вдохновлять, удивлять", icon: "✨", label: "Магия",       delta: { control:  0, energy:  +8, focus: +2, method: +8 } },
        { text: "Создавать порядок, выстраивать системы, управлять",  icon: "👑", label: "Порядок",     delta: { control: +10, energy: -2, focus: +8, method: +6 } },
        { text: "Заботиться, поддерживать, делать жизнь комфортнее",  icon: "🤲", label: "Забота",      delta: { control: -4, energy: -6, focus: +2, method: +4 } },
      ],
    },
    {
      id: "emotion",
      title: "Какие эмоции вы хотите вызывать у клиентов?",
      subtitle: "Представьте первую реакцию человека на ваш бренд — что он чувствует?",
      answers: [
        { text: "Восторг, удивление, радость и лёгкость",   icon: "🎉", label: "Радость",     delta: { control: -4, energy: +10, focus: -6, method: -2 } },
        { text: "Доверие, спокойствие, чувство «я дома»",   icon: "🏠", label: "Доверие",     delta: { control: +2, energy: -4, focus:  0, method:  0 } },
        { text: "Желание, страсть, эстетическое наслаждение", icon: "💋", label: "Страсть",     delta: { control: -2, energy: +6, focus: -2, method: +4 } },
        { text: "Уважение, ясность, уверенность в экспертизе", icon: "📚", label: "Уважение",    delta: { control: +6, energy: -6, focus: +8, method: +6 } },
      ],
    },
    {
      id: "communication",
      title: "Как ваш бренд общается с аудиторией?",
      subtitle: "Выберите тон и манеру коммуникации, наиболее близкие вашему бренду.",
      answers: [
        { text: "Прямо, смело, без компромиссов и фильтров",      icon: "🔥", label: "Вызов",      delta: { control: -6, energy: +8, focus: -4, method: -6 } },
        { text: "Вдохновляюще, творчески, с воображением",        icon: "🎨", label: "Творчество",  delta: { control:  0, energy: +4, focus: +4, method: +6 } },
        { text: "Честно, просто, без прикрас и пафоса",            icon: "🤝", label: "Честность",   delta: { control:  0, energy: -2, focus: -2, method:  0 } },
        { text: "Элегантно, изысканно, с чувством превосходства", icon: "🥂", label: "Элегантность", delta: { control: +8, energy:  0, focus: +2, method: +4 } },
      ],
    },
    {
      id: "need",
      title: "Что ваш клиент ищет в первую очередь?",
      subtitle: "Определите глубинную потребность, которую закрывает ваш бренд.",
      answers: [
        { text: "Приключения, свободу, новые горизонты",        icon: "🧭", label: "Свобода",    delta: { control: -4, energy: +6, focus: -6, method:  0 } },
        { text: "Знания, понимание, истину и мудрость",        icon: "🔍", label: "Истина",     delta: { control: +4, energy: -8, focus: +10, method: +6 } },
        { text: "Безопасность, заботу и душевное тепло",       icon: "🛡️", label: "Безопасность", delta: { control: +2, energy: -6, focus:  0, method: +4 } },
        { text: "Признание, статус, уважение и достижения",    icon: "🏆", label: "Признание",   delta: { control: +8, energy: +6, focus: +4, method:  0 } },
      ],
    },
    {
      id: "product",
      title: "Как бы вы описали ваш идеальный продукт?",
      subtitle: "Не функциональность — а характер. Какими качествами он обладает?",
      answers: [
        { text: "Инновационный, почти магический — он преображает реальность", icon: "🔮", label: "Инновация",  delta: { control:  0, energy: +6, focus: +4, method: +8 } },
        { text: "Надёжный, качественный, проверенный временем",                 icon: "⚙️", label: "Надёжность", delta: { control: +4, energy: -4, focus:  0, method: +2 } },
        { text: "Дерзкий, ломающий правила и стандарты индустрии",             icon: "💥", label: "Дерзость",   delta: { control: -8, energy: +10, focus: -4, method: -4 } },
        { text: "Красивый, чувственный — им хочется обладать",                  icon: "💎", label: "Красота",    delta: { control: +2, energy: +4, focus: -2, method: +6 } },
      ],
    },
    {
      id: "role",
      title: "Какую роль ваш бренд играет в жизни клиента?",
      subtitle: "Последний штрих — определите ваше место в картине мира клиента.",
      answers: [
        { text: "Наставник и эксперт — я даю знания и направляю",     icon: "🎓", label: "Наставник", delta: { control: +6, energy: -6, focus: +8, method: +6 } },
        { text: "Друг и партнёр — я рядом, простой и понятный",      icon: "🤗", label: "Друг",      delta: { control: +2, energy:  0, focus:  0, method:  0 } },
        { text: "Творец и визионер — я помогаю создавать новое",     icon: "🌈", label: "Творец",    delta: { control:  0, energy: +4, focus: +6, method: +8 } },
        { text: "Герой и защитник — я веду к победе над проблемами", icon: "🚀", label: "Герой",     delta: { control: +6, energy: +8, focus: +4, method:  0 } },
      ],
    },
  ],

  // ==================== INIT ====================
  init(onComplete) {
    this._onComplete = onComplete;
    this._currentQuestion = 0;
    this._answers = [];
    this._createOverlay();
    this._renderQuestion();
    console.log("[Diagnostic] Quest started — 6 questions to brand archetype.");
  },

  // ==================== OVERLAY ====================
  _createOverlay() {
    // Remove existing if any
    const existing = document.getElementById("diagnostic-overlay");
    if (existing) existing.remove();

    this._overlayEl = document.createElement("div");
    this._overlayEl.id = "diagnostic-overlay";
    this._overlayEl.className = "diag-overlay";
    this._overlayEl.innerHTML = `
      <div class="diag-backdrop"></div>
      <div class="diag-container">
        <div class="diag-progress">
          <div class="diag-progress-bar" id="diag-progress-bar"></div>
        </div>
        <div class="diag-card" id="diag-card">
          <div class="diag-question">
            <div class="diag-question-num" id="diag-q-num">1/6</div>
            <h2 class="diag-question-title" id="diag-q-title"></h2>
            <p class="diag-question-subtitle" id="diag-q-subtitle"></p>
          </div>
          <div class="diag-answers" id="diag-answers"></div>
        </div>
        <div class="diag-footer">
          <span class="diag-footer-text">Brand Archetype Diagnostic</span>
          <button class="diag-skip" id="diag-skip">Пропустить →</button>
        </div>
      </div>
      <div class="diag-particles" id="diag-particles"></div>
    `;
    document.body.appendChild(this._overlayEl);

    // Skip button
    document.getElementById("diag-skip").addEventListener("click", () => this._skip());

    // Spawn ambient particles
    this._spawnParticles();
  },

  // ==================== RENDER ====================
  _renderQuestion() {
    const q = this.questions[this._currentQuestion];
    if (!q) return;

    // Progress
    const progressBar = document.getElementById("diag-progress-bar");
    if (progressBar) {
      progressBar.style.width = ((this._currentQuestion / this.questions.length) * 100) + "%";
    }

    // Question number
    const numEl = document.getElementById("diag-q-num");
    if (numEl) numEl.textContent = `${this._currentQuestion + 1}/${this.questions.length}`;

    // Title & subtitle
    const titleEl = document.getElementById("diag-q-title");
    if (titleEl) titleEl.textContent = q.title;

    const subEl = document.getElementById("diag-q-subtitle");
    if (subEl) subEl.textContent = q.subtitle;

    // Answers
    const answersEl = document.getElementById("diag-answers");
    if (!answersEl) return;

    // Clear & rebuild with animation
    answersEl.innerHTML = "";
    q.answers.forEach((a, i) => {
      const card = document.createElement("div");
      card.className = "diag-answer-card";
      card.style.animationDelay = `${i * 0.08}s`;
      card.innerHTML = `
        <div class="diag-answer-icon">${a.icon}</div>
        <div class="diag-answer-content">
          <div class="diag-answer-label">${a.label}</div>
          <div class="diag-answer-text">${a.text}</div>
        </div>
      `;
      card.addEventListener("click", () => this._selectAnswer(i));
      answersEl.appendChild(card);
    });
  },

  // ==================== SELECT ANSWER ====================
  _selectAnswer(index) {
    const q = this.questions[this._currentQuestion];
    const answer = q.answers[index];

    // Record answer
    this._answers.push({
      questionId: q.id,
      questionIndex: this._currentQuestion,
      answerIndex: index,
      label: answer.label,
      delta: answer.delta,
    });

    // Apply delta to userVector immediately (visual feedback)
    const dims = ["control", "energy", "focus", "method"];
    dims.forEach((d) => {
      if (typeof userVector !== "undefined" && userVector[d] !== undefined) {
        userVector[d] = Math.max(0, Math.min(100, userVector[d] + answer.delta[d]));
      }
    });

    // Update engine
    if (typeof updateBrandPositionFromVector === "function") updateBrandPositionFromVector();
    if (typeof updateAll === "function") updateAll();

    // Flash the selected card
    const cards = document.querySelectorAll(".diag-answer-card");
    cards.forEach((c, i) => {
      if (i === index) {
        c.classList.add("selected");
        c.style.borderColor = "var(--accent-green)";
        c.style.boxShadow = "0 0 20px var(--accent-green-dim)";
      } else {
        c.style.opacity = "0.3";
        c.style.pointerEvents = "none";
      }
    });

    // Advance after a pause
    setTimeout(() => {
      this._currentQuestion++;
      if (this._currentQuestion >= this.questions.length) {
        this._finish();
      } else {
        this._renderQuestion();
      }
    }, 600);
  },

  // ==================== SKIP ====================
  _skip() {
    if (this._currentQuestion >= this.questions.length) {
      this._finish();
      return;
    }
    this._currentQuestion++;
    if (this._currentQuestion >= this.questions.length) {
      this._finish();
    } else {
      this._renderQuestion();
    }
  },

  // ==================== FINISH ====================
  _finish() {
    console.log("[Diagnostic] Complete. Answers:", this._answers);

    // Compute final vector from all answers
    // Start from 50 (neutral) and apply all deltas
    const finalVector = { control: 50, energy: 50, focus: 50, method: 50 };
    this._answers.forEach((a) => {
      ["control", "energy", "focus", "method"].forEach((d) => {
        finalVector[d] = Math.max(0, Math.min(100, finalVector[d] + a.delta[d]));
      });
    });

    // Set engine vector and update
    if (typeof userVector !== "undefined") {
      ["control", "energy", "focus", "method"].forEach((d) => {
        userVector[d] = finalVector[d];
      });
    }
    if (typeof updateBrandPositionFromVector === "function") updateBrandPositionFromVector();
    if (typeof updateAll === "function") updateAll();

    // Get result
    let primaryArchetype = null;
    if (typeof getRankings === "function") {
      const rankings = getRankings();
      primaryArchetype = rankings.primary;
    }

    // Animate overlay out
    const overlay = document.getElementById("diagnostic-overlay");
    if (overlay) {
      overlay.style.opacity = "0";
      overlay.style.transition = "opacity 0.5s ease";
      setTimeout(() => {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 500);
    }

    // Fire callback
    if (this._onComplete) {
      this._onComplete(finalVector, primaryArchetype);
    }

    console.log(
      `%c[Diagnostic] ✅ Result: ${primaryArchetype ? primaryArchetype.nameRu : "—"}`,
      `color: ${primaryArchetype ? primaryArchetype.color : "#fff"}; font-size: 16px; font-weight: bold;`,
    );
    console.log("  Final vector:", finalVector);
  },

  // ==================== AMBIENT PARTICLES ====================
  _spawnParticles() {
    const container = document.getElementById("diag-particles");
    if (!container) return;

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div");
      particle.className = "diag-particle";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.top = Math.random() * 100 + "%";
      particle.style.animationDuration = (3 + Math.random() * 5) + "s";
      particle.style.animationDelay = Math.random() * 3 + "s";
      particle.style.width = (2 + Math.random() * 4) + "px";
      particle.style.height = particle.style.width;
      particle.style.opacity = 0.15 + Math.random() * 0.25;
      container.appendChild(particle);
    }
  },
};
