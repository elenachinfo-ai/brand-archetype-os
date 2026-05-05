// ArchetypeOS Diagnostic v4.1 — minimal, clean
var HolographicQuest = {
  _active: false,
  _step: 0,
  _answers: [],
  _selectedIdx: -1,
  _onComplete: null,
  _savedLeftHTML: "",
  _savedRightHTML: "",

  questions: [
    {
      id: "market_position",
      title: "Как ваш бренд занимает рынок?",
      answers: [
        {
          icon: "◈",
          label: "Доминирование",
          text: "Мы задаём стандарты",
          delta: { control: 12, energy: 4, focus: 8, method: 2 },
        },
        {
          icon: "◈",
          label: "Инновация",
          text: "Создаём новое",
          delta: { control: 0, energy: 8, focus: 4, method: 10 },
        },
        {
          icon: "◈",
          label: "Сервис",
          text: "Точка доверия",
          delta: { control: 4, energy: -4, focus: 2, method: 6 },
        },
        {
          icon: "◈",
          label: "Вызов",
          text: "Ломаем правила",
          delta: { control: -6, energy: 10, focus: -4, method: -4 },
        },
      ],
    },
    {
      id: "client_relationship",
      title: "Как клиент чувствует ваш бренд?",
      answers: [
        {
          icon: "◈",
          label: "На равных",
          text: "Партнёры, честный диалог",
          delta: { control: 0, energy: 0, focus: 0, method: 2 },
        },
        {
          icon: "◈",
          label: "Снизу вверх",
          text: "Мы — авторитет",
          delta: { control: 10, energy: -2, focus: 8, method: 4 },
        },
        {
          icon: "◈",
          label: "Объятия",
          text: "Семья, тепло, забота",
          delta: { control: 0, energy: -6, focus: 2, method: 4 },
        },
        {
          icon: "◈",
          label: "Восхищение",
          text: "Объект желания",
          delta: { control: 2, energy: 6, focus: -2, method: 6 },
        },
      ],
    },
    {
      id: "decision_logic",
      title: "Как клиент принимает решение?",
      answers: [
        {
          icon: "◈",
          label: "Мгновенно",
          text: "Увидел — купил",
          delta: { control: -4, energy: 10, focus: -6, method: -2 },
        },
        {
          icon: "◈",
          label: "Аналитически",
          text: "Изучил — сравнил",
          delta: { control: 8, energy: -8, focus: 10, method: 8 },
        },
        {
          icon: "◈",
          label: "Через доверие",
          text: "Проверил репутацию",
          delta: { control: 4, energy: -4, focus: 2, method: 4 },
        },
        {
          icon: "◈",
          label: "Через историю",
          text: "Вдохновился",
          delta: { control: 0, energy: 4, focus: 0, method: 6 },
        },
      ],
    },
    {
      id: "value_anchor",
      title: "За что клиент платит вам деньги?",
      answers: [
        {
          icon: "◈",
          label: "За власть",
          text: "Контроль и порядок",
          delta: { control: 10, energy: 2, focus: 6, method: 4 },
        },
        {
          icon: "◈",
          label: "За трансформацию",
          text: "Стать другим",
          delta: { control: 0, energy: 8, focus: 4, method: 8 },
        },
        {
          icon: "◈",
          label: "За красоту",
          text: "Эстетика и статус",
          delta: { control: 4, energy: 4, focus: 0, method: 6 },
        },
        {
          icon: "◈",
          label: "За правду",
          text: "Знания и ясность",
          delta: { control: 6, energy: -6, focus: 8, method: 6 },
        },
      ],
    },
    {
      id: "brand_voice",
      title: "Как звучит голос вашего бренда?",
      answers: [
        {
          icon: "◈",
          label: "Тихо и веско",
          text: "Нас слышат потому что мы правы",
          delta: { control: 8, energy: -6, focus: 8, method: 4 },
        },
        {
          icon: "◈",
          label: "Громко и дерзко",
          text: "Голос перемен",
          delta: { control: -4, energy: 12, focus: -2, method: -4 },
        },
        {
          icon: "◈",
          label: "Тепло и душевно",
          text: "С нами комфортно",
          delta: { control: 2, energy: -4, focus: 0, method: 2 },
        },
        {
          icon: "◈",
          label: "Остроумно и легко",
          text: "Мы — праздник",
          delta: { control: -2, energy: 8, focus: -4, method: 0 },
        },
      ],
    },
  ],

    showStartScreen: function(onComplete) { this.start(onComplete); },



  showWelcome: function() {
    var left = document.getElementById("panel-controllers");
    if (!left) return;
    left.innerHTML = "<div style='text-align:center;padding:50px 20px;'>" +
      "<div style='font-size:40px;margin-bottom:14px;'>◈</div>" +
      "<h2 style='font-weight:300;font-size:18px;color:var(--text-primary);margin:0 0 8px;'>ArchetypeOS</h2>" +
      "<p style='font-size:11px;color:var(--text-tertiary);letter-spacing:0.1em;margin:0 0 16px;'>BRAND DNA DIAGNOSTIC</p>" +
      "<p style='font-size:12px;color:var(--text-secondary);line-height:1.6;margin:0 0 24px;'>12 архетипов. 5 вопросов.<br>Тихая роскошь. Воздух в кадре.</p>" +
      "<button id='welcome-start-btn' style='padding:12px 36px;background:var(--accent-blue);color:#fff;border:none;border-radius:8px;font-family:inherit;font-size:14px;font-weight:500;cursor:pointer;'>Начать диагностику</button>" +
    "</div>";
    document.getElementById("welcome-start-btn").onclick = function() {
      HolographicQuest.showStartScreen();
    };
  },

  start: function (onComplete) {
    this._active = true;
    this._step = 1;
    this._answers = [];
    this._selectedIdx = -1;
    this._onComplete = onComplete || null;
    var left = document.getElementById("panel-controllers");
    var right = document.getElementById("panel-output");
    if (left) this._savedLeftHTML = left.innerHTML;
    if (right) this._savedRightHTML = right.innerHTML;
    var statusEl = document.getElementById("hud-status-text");
    if (statusEl) statusEl.textContent = "Шаг 1/5";
    this._renderStep();
  },

  _renderStep: function () {
    this._selectedIdx = -1;
    var left = document.getElementById("panel-controllers");
    var right = document.getElementById("panel-output");
    if (!left || !right) return;
    var statusEl = document.getElementById("hud-status-text");
    var totalSteps = 5;

    if (this._step <= 5) {
      var q = this.questions[this._step - 1];
      if (statusEl)
        statusEl.textContent = "Вопрос " + this._step + "/" + totalSteps;

      var answersHTML = "";
      for (var i = 0; i < q.answers.length; i++) {
        var a = q.answers[i];
        answersHTML +=
          "<div class='quest-answer-card' data-idx='" +
          i +
          "' id='quest-ans-" +
          i +
          "'>" +
          "<span class='quest-ans-icon'>" +
          a.icon +
          "</span>" +
          "<div class='quest-ans-content'>" +
          "<span class='quest-ans-label'>" +
          a.label +
          "</span>" +
          "<span class='quest-ans-text'>" +
          a.text +
          "</span>" +
          "</div>" +
          "</div>";
      }

      // Store result data for the Brand Passport button
      self._lastResult = { primary: primary, vector: finalVector };
      left.innerHTML =
        "<div class='quest-panel-header'>АРХЕТИП БРЕНДА</div>" +
        "<div class='quest-question-block'>" +
        "<div class='quest-q-num'>Шаг " +
        this._step +
        " из " +
        totalSteps +
        "</div>" +
        "<div class='quest-q-title'>" +
        q.title +
        "</div>" +
        "<div class='quest-q-bar'><div class='quest-q-bar-fill' style='width:" +
        (this._step / totalSteps) * 100 +
        "%'></div></div>" +
        "<div class='quest-answers-list' id='quest-answers-list'>" +
        answersHTML +
        "</div>" +
        "<button class='quest-next-btn' id='quest-next-btn' disabled>Выберите вариант ↑</button>" +
        "</div>";

      var self = this;
      var cards = document.querySelectorAll(".quest-answer-card");
      for (var j = 0; j < cards.length; j++) {
        (function (idx) {
          cards[j].addEventListener("click", function () {
            self._selectAnswer(idx);
          });
        })(j);
      }

      this._renderRightPanel(right, totalSteps);
    }
  },

  _renderRightPanel: function (right, total) {
    var r = typeof getRankings === "function" ? getRankings() : null;
    var primaryName = r ? r.primary.nameRu : "—";
    var primaryColor = r ? r.primary.color : "var(--accent-blue)";
    var dims = ["control", "energy", "focus", "method"];
    var labels = { control: "Контроль", energy: "Энергия", focus: "Фокус", method: "Метод" };

    var barsHTML = "";
    for (var i = 0; i < dims.length; i++) {
      var d = dims[i];
      var val = typeof userVector !== "undefined" ? userVector[d] : 50;
      barsHTML += "<div class='quest-vector-row'>" +
        "<span class='quest-vector-label'>" + labels[d] + "</span>" +
        "<div class='quest-vector-track'><div class='quest-vector-fill' style='width:" + val + "%;background:" + primaryColor + ";'></div></div>" +
        "<span class='quest-vector-val'>" + val + "</span></div>";
    }

    var stepsHTML = "";
    for (var s = 0; s < total; s++) {
      var done = s + 1 <= this._step ? " done" : "";
      var current = s + 1 === this._step ? " current" : "";
      var mark = s + 1 <= this._step ? "✓" : (s + 1);
      stepsHTML += "<div class='quest-step-dot" + done + current + "'>" + mark + "</div>";
    }

    right.innerHTML =
      "<div class='output-header'>АРХЕТИП</div>" +
      "<div class='quest-right-card' style='border-color:" + primaryColor + "44;'>" +
        "<div class='quest-right-archetype' style='color:" + primaryColor + "'>" + primaryName + "</div>" +
        "<div class='quest-right-sub'>определяется...</div>" +
      "</div>" +
      "<div class='quest-right-section-title'>4D-ВЕКТОР</div>" +
      barsHTML +
      "<div class='quest-right-section-title'>ШАГИ</div>" +
      "<div class='quest-right-steps'>" + stepsHTML + "</div>";
  },

  _selectAnswer: function (idx) {
    if (this._selectedIdx >= 0) return;
    this._selectedIdx = idx;

    var cards = document.querySelectorAll(".quest-answer-card");
    for (var i = 0; i < cards.length; i++) {
      if (i === idx) {
        cards[i].classList.add("selected");
      } else {
        cards[i].style.opacity = "0.35";
        cards[i].style.pointerEvents = "none";
      }
    }

    var nextBtn = document.getElementById("quest-next-btn");
    if (nextBtn) {
      nextBtn.disabled = false;
      nextBtn.textContent = "Далее →";
      var self = this;
      nextBtn.onclick = function () {
        self._advance();
      };
    }

    var a = this.questions[this._step - 1].answers[idx];
    var delta = a.delta;
    var label = a.label;

    if (delta) {
      this._answers.push({
        step: this._step,
        idx: idx,
        label: label,
        delta: delta,
      });
      var dims = ["control", "energy", "focus", "method"];
      for (var i = 0; i < dims.length; i++) {
        var d = dims[i];
        if (typeof userVector !== "undefined") {
          userVector[d] = Math.max(0, Math.min(100, userVector[d] + delta[d]));
        }
      }
      if (typeof updateBrandPositionFromVector === "function")
        updateBrandPositionFromVector();
      if (typeof updateAll === "function") updateAll();

      var right = document.getElementById("panel-output");
      if (right) this._renderRightPanel(right, 5);
    }
  },

  _advance: function () {
    if (this._step >= 5) {
      this._finish();
      return;
    }
    this._step++;
    this._renderStep();
  },

  _finish: function () {
    var self = this;
    this._active = false;
    var statusEl = document.getElementById("hud-status-text");
    if (statusEl) statusEl.textContent = "Готово";

    // Use the already-accumulated userVector (same as what right panel shows)
    var finalVector = { control: 50, energy: 50, focus: 50, method: 50 };
    if (typeof userVector !== "undefined") {
      finalVector.control = userVector.control;
      finalVector.energy = userVector.energy;
      finalVector.focus = userVector.focus;
      finalVector.method = userVector.method;
    }
    if (typeof updateBrandPositionFromVector === "function")
      updateBrandPositionFromVector();
    if (typeof updateAll === "function") updateAll();

    var primary = null;
    if (typeof getRankings === "function") {
      var r = getRankings();
      if (r) primary = r.primary;
    }

    // Show result in LEFT panel (replaces test)
    var left = document.getElementById("panel-controllers");
    if (left && primary) {
      var color = primary.color || "#c4a87c";
      var dims = ["control", "energy", "focus", "method"];
      var labels = { control: "Контроль", energy: "Энергия", focus: "Фокус", method: "Метод" };
      var vecHTML = "";
      for (var i = 0; i < dims.length; i++) {
        var d = dims[i];
        var v = finalVector[d] || 50;
        vecHTML += "<div class='quest-vector-row'><span class='quest-vector-label'>" + labels[d] + "</span>" +
          "<div class='quest-vector-track'><div class='quest-vector-fill' style='width:" + v + "%;background:" + color + ";'></div></div>" +
          "<span class='quest-vector-val'>" + v + "</span></div>";
      }
      // Store result data for the Brand Passport button
      self._lastResult = { primary: primary, vector: finalVector };
      left.innerHTML =
        "<div class='quest-panel-header'>РЕЗУЛЬТАТ ДИАГНОСТИКИ</div>" +
        "<div class='quest-right-card' style='border-color:" + color + "44;'>" +
          "<div class='quest-right-archetype' style='color:" + color + ";font-size:22px;'>" + primary.nameRu + "</div>" +
          "<div class='quest-right-sub'>" + (primary.behavior_model || "") + "</div>" +
        "</div>" +
        "<div class='quest-right-section-title'>4D-ВЕКТОР</div>" + vecHTML +
        "<p style='font-size:11px;color:var(--text-secondary);margin-top:8px;'>" + (primary.ui_rules ? primary.ui_rules.visual : "") + "</p>" +
        "<button class='quest-next-btn' style='margin-top:12px;' id='result-show-passport'>Открыть Brand Passport</button>";
    }

    // Bind Brand Passport button
    setTimeout(function() {
      var btn = document.getElementById("result-show-passport");
      if (btn && self._lastResult) {
        btn.onclick = function() {
          if (typeof ArchetypeResult !== "undefined") {
            var r = self._lastResult;
            ArchetypeResult.show(r.primary, r.vector, self._answers);
          }
        };
      }
    }, 50);

    // Restore right panel
    var right = document.getElementById("panel-output");
    if (right && this._savedRightHTML) right.innerHTML = this._savedRightHTML;

    // Force canvas redraw
    setTimeout(function () {
      if (typeof updateAll === "function") updateAll();
      if (typeof initJogDials === "function") initJogDials();
      if (typeof initPresets === "function") initPresets();
    }, 100);

    var self = this;
    if (self._onComplete) self._onComplete(finalVector, primary);

    console.log("[HoloQuest] Done: " + (primary ? primary.nameRu : "---"));
  },
};

document.addEventListener("DOMContentLoaded", function() { setTimeout(function() { HolographicQuest.showWelcome(); }, 400); });
