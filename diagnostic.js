// ArchetypeOS Diagnostic v5 — 12 tracks × 4 statements × 1-5 scale
// No popups. Everything in left panel. Right panel = live visualization.

var HolographicQuest = {
  _scores: {}, // { archetypeId: [score1, score2, score3, score4] }
  _activeTrack: null, // which archetype track is expanded
  _savedLeft: "",
  _savedRight: "",

  // 12 archetypes, 4 statements each
  tracks: [
    {
      id: "hero",
      name: "Герой",
      icon: "⚔️",
      color: "#b87060",
      statements: [
        "Мы действуем решительно и достигаем целей",
        "Наша команда видит себя победителями",
        "Мы берёмся за сложные задачи и побеждаем",
        "Клиенты чувствуют себя сильнее с нами",
      ],
    },
    {
      id: "magician",
      name: "Маг",
      icon: "✨",
      color: "#a090b8",
      statements: [
        "Мы трансформируем реальность клиентов",
        "Инновации — наша суперсила",
        "Чудеса случаются благодаря нашей работе",
        "Люди приходят к нам за преображением",
      ],
    },
    {
      id: "ruler",
      name: "Правитель",
      icon: "👑",
      color: "#c4a87c",
      statements: [
        "Мы устанавливаем стандарты в отрасли",
        "Порядок и структура — основа успеха",
        "Клиенты доверяют нашему авторитету",
        "Контроль качества — наш приоритет",
      ],
    },
    {
      id: "caregiver",
      name: "Заботливый",
      icon: "🤲",
      color: "#8aaa8a",
      statements: [
        "Забота о клиентах — наша главная ценность",
        "Мы создаём безопасное пространство",
        "Наша команда поддерживает друг друга",
        "Клиенты чувствуют себя защищёнными",
      ],
    },
    {
      id: "lover",
      name: "Эстет",
      icon: "💋",
      color: "#c48090",
      statements: [
        "Красота и эстетика в каждой детали",
        "Мы создаём эмоциональную связь",
        "Наши продукты дарят наслаждение",
        "Клиенты влюбляются в наш бренд",
      ],
    },
    {
      id: "jester",
      name: "Шут",
      icon: "🎉",
      color: "#c89860",
      statements: [
        "Мы приносим радость и лёгкость",
        "Юмор и игра — часть нашей культуры",
        "Скука — наш главный враг",
        "Клиенты улыбаются, взаимодействуя с нами",
      ],
    },
    {
      id: "everyman",
      name: "Свой",
      icon: "🤝",
      color: "#a09080",
      statements: [
        "Мы честны и понятны без прикрас",
        "Каждый клиент — часть нашего сообщества",
        "Простота и доступность — наши принципы",
        "Мы не строим из себя элиту",
      ],
    },
    {
      id: "explorer",
      name: "Исследователь",
      icon: "🧭",
      color: "#7aaa9a",
      statements: [
        "Мы открываем новые горизонты",
        "Свобода и приключения ведут нас",
        "Рутина нам противопоказана",
        "Клиенты отправляются с нами в путь",
      ],
    },
    {
      id: "rebel",
      name: "Бунтарь",
      icon: "🔥",
      color: "#c87050",
      statements: [
        "Правила созданы чтобы их нарушать",
        "Мы бросаем вызов статус-кво",
        "Смелость и дерзость — наши инструменты",
        "Клиенты чувствуют свободу с нами",
      ],
    },
    {
      id: "creator",
      name: "Творец",
      icon: "🎨",
      color: "#8878a8",
      statements: [
        "Творчество лежит в основе всего",
        "Мы создаём уникальные продукты",
        "Самовыражение — ключ к успеху",
        "Клиенты вдохновляются нашими идеями",
      ],
    },
    {
      id: "sage",
      name: "Мудрец",
      icon: "📚",
      color: "#8898a0",
      statements: [
        "Знания и экспертиза — наша валюта",
        "Мы исследуем, анализируем, понимаем",
        "Истина важнее мнений",
        "Клиенты приходят к нам за мудростью",
      ],
    },
    {
      id: "innocent",
      name: "Невинный",
      icon: "🌿",
      color: "#a0b898",
      statements: [
        "Чистота и простота — наша философия",
        "Мы верим в лучшее в людях",
        "Оптимизм и надежда ведут нас",
        "Клиенты чувствуют свет и радость",
      ],
    },
  ],

  // ==================== INIT ====================
  init: function () {
    var left = document.getElementById("panel-controllers");
    if (!left) return;
    this._savedLeft = left.innerHTML;

    // Reset scores
    this._scores = {};
    for (var i = 0; i < this.tracks.length; i++) {
      this._scores[this.tracks[i].id] = [0, 0, 0, 0];
    }

    this._renderTracks();
  },

  // ==================== RENDER ALL TRACKS ====================
  _renderTracks: function () {
    var left = document.getElementById("panel-controllers");
    if (!left) return;

    var totalAnswered = this._countAnswered();
    var totalQuestions = 48;
    var progress = Math.round((totalAnswered / totalQuestions) * 100);

    var html =
      "<div class='quest-panel-header'>АРХЕТИПЫ БРЕНДА</div>" +
      "<div style='display:flex;align-items:center;gap:8px;margin-bottom:4px;'>" +
      "<div style='flex:1;height:3px;background:rgba(255,255,255,0.06);border-radius:2px;'>" +
      "<div style='height:100%;width:" +
      progress +
      "%;background:var(--accent-blue);border-radius:2px;transition:width 0.3s;'></div>" +
      "</div>" +
      "<span style='font-size:10px;color:var(--text-tertiary);'>" +
      totalAnswered +
      "/48</span>" +
      "</div>";

    // Render tracks
    html +=
      "<div style='display:flex;flex-direction:column;gap:4px;margin-top:8px;'>";
    for (var i = 0; i < this.tracks.length; i++) {
      var t = this.tracks[i];
      var scores = this._scores[t.id];
      var answered = 0;
      for (var j = 0; j < 4; j++) {
        if (scores[j] > 0) answered++;
      }

      var isExpanded = this._activeTrack === t.id;
      var trackStyle = isExpanded
        ? "background:rgba(255,255,255,0.04);border:1px solid " +
          t.color +
          "44;"
        : "background:rgba(255,255,255,0.02);border:1px solid transparent;";

      html +=
        "<div class='track-row' data-track='" +
        t.id +
        "' style='" +
        trackStyle +
        "border-radius:8px;padding:8px 10px;cursor:pointer;transition:all 0.2s;'>" +
        // Track header
        "<div style='display:flex;align-items:center;gap:8px;'>" +
        "<span style='font-size:16px;width:24px;text-align:center;'>" +
        t.icon +
        "</span>" +
        "<span style='flex:1;font-size:12px;font-weight:500;color:var(--text-primary);'>" +
        t.name +
        "</span>" +
        "<span style='font-size:10px;color:" +
        t.color +
        ";'>" +
        (answered === 4 ? "✓" : answered + "/4") +
        "</span>" +
        "</div>";

      // Expanded: show statements with 1-5 dots
      if (isExpanded) {
        html +=
          "<div style='margin-top:8px;display:flex;flex-direction:column;gap:6px;'>";
        for (var s = 0; s < 4; s++) {
          html +=
            "<div style='display:flex;align-items:center;gap:8px;'>" +
            "<span style='flex:1;font-size:11px;color:var(--text-secondary);line-height:1.4;'>" +
            t.statements[s] +
            "</span>" +
            "<div style='display:flex;gap:3px;'>";
          for (var r = 1; r <= 5; r++) {
            var active = scores[s] >= r;
            html +=
              "<span class='score-dot' data-track='" +
              t.id +
              "' data-statement='" +
              s +
              "' data-value='" +
              r +
              "' " +
              "style='width:16px;height:16px;border-radius:50%;border:1px solid " +
              t.color +
              "44;" +
              (active
                ? "background:" + t.color + ";"
                : "background:transparent;") +
              "cursor:pointer;display:inline-block;'></span>";
          }
          html += "</div></div>";
        }
        html += "</div>";
      }

      html += "</div>";
    }
    html += "</div>";

    // Submit button
    html +=
      "<button id='submit-diag-btn' style='margin-top:12px;width:100%;padding:12px;background:var(--accent-blue);color:#fff;border:none;border-radius:8px;font-family:inherit;font-size:13px;font-weight:500;cursor:pointer;" +
      (totalAnswered < 4 ? "opacity:0.4;pointer-events:none;" : "") +
      "'>Показать результат (" +
      totalAnswered +
      "/48)</button>";

    left.innerHTML = html;

    // Bind events
    var self = this;
    var tracks = document.querySelectorAll(".track-row");
    for (var i = 0; i < tracks.length; i++) {
      tracks[i].onclick = function (e) {
        // Don't toggle if clicking a score dot
        if (e.target.classList.contains("score-dot")) return;
        var trackId = this.getAttribute("data-track");
        self._activeTrack = self._activeTrack === trackId ? null : trackId;
        self._renderTracks();
      };
    }

    // Bind score dots
    var dots = document.querySelectorAll(".score-dot");
    for (var d = 0; d < dots.length; d++) {
      dots[d].onclick = function (e) {
        e.stopPropagation();
        var trackId = this.getAttribute("data-track");
        var stmt = parseInt(this.getAttribute("data-statement"));
        var val = parseInt(this.getAttribute("data-value"));

        // If clicking the same value, deselect
        if (self._scores[trackId][stmt] === val) {
          self._scores[trackId][stmt] = 0;
        } else {
          self._scores[trackId][stmt] = val;
        }

        self._renderTracks();
        self._updateVisualization();
      };
    }

    // Submit
    var submitBtn = document.getElementById("submit-diag-btn");
    if (submitBtn) {
      submitBtn.onclick = function () {
        self._finish();
      };
    }
  },

  _countAnswered: function () {
    var count = 0;
    for (var id in this._scores) {
      for (var i = 0; i < 4; i++) {
        if (this._scores[id][i] > 0) count++;
      }
    }
    return count;
  },

  _updateVisualization: function () {
    // Convert scores to vector
    var vector = { control: 50, energy: 50, focus: 50, method: 50 };

    // Map each track's score sum to vector dimensions
    var weights = {
      hero: { control: 2, energy: 3, focus: 2, method: 0 },
      magician: { control: 0, energy: 2, focus: 2, method: 3 },
      ruler: { control: 3, energy: 0, focus: 2, method: 1 },
      caregiver: { control: 1, energy: -1, focus: 1, method: 2 },
      lover: { control: 0, energy: 2, focus: 0, method: 2 },
      jester: { control: -1, energy: 3, focus: -1, method: 0 },
      everyman: { control: 0, energy: 0, focus: 0, method: 1 },
      explorer: { control: -1, energy: 2, focus: -1, method: 1 },
      rebel: { control: -2, energy: 3, focus: -2, method: -1 },
      creator: { control: 0, energy: 1, focus: 2, method: 2 },
      sage: { control: 2, energy: -2, focus: 3, method: 1 },
      innocent: { control: -1, energy: -1, focus: -1, method: 1 },
    };

    var d = ["control", "energy", "focus", "method"];
    for (var id in this._scores) {
      var sum = 0;
      for (var i = 0; i < 4; i++) {
        sum += this._scores[id][i];
      }
      // Normalize: max sum is 20, map to ±30 influence
      var influence = (sum / 20) * 30;
      if (weights[id]) {
        for (var j = 0; j < d.length; j++) {
          vector[d[j]] += weights[id][d[j]] * influence * 0.3;
        }
      }
    }

    // Clamp
    for (var k = 0; k < d.length; k++) {
      vector[d[k]] = Math.max(5, Math.min(95, Math.round(vector[d[k]])));
    }

    // Update global
    if (typeof userVector !== "undefined") {
      userVector.control = vector.control;
      userVector.energy = vector.energy;
      userVector.focus = vector.focus;
      userVector.method = vector.method;
    }
    if (typeof updateBrandPositionFromVector === "function")
      updateBrandPositionFromVector();
    if (typeof updateAll === "function") updateAll();
  },

  _finish: function () {
    var self = this;
    var left = document.getElementById("panel-controllers");
    var right = document.getElementById("panel-output");

    // Calculate final vector
    this._updateVisualization();

    var primary = null;
    if (typeof getRankings === "function") {
      var r = getRankings();
      if (r) primary = r.primary;
    }

    if (left && primary) {
      var color = primary.color || "#c4a87c";
      var dims = ["control", "energy", "focus", "method"];
      var labels = {
        control: "Контроль",
        energy: "Энергия",
        focus: "Фокус",
        method: "Метод",
      };
      var vecHTML = "";
      for (var i = 0; i < dims.length; i++) {
        var dv = dims[i];
        var v = typeof userVector !== "undefined" ? userVector[dv] : 50;
        vecHTML +=
          "<div class='quest-vector-row'><span class='quest-vector-label'>" +
          labels[dv] +
          "</span>" +
          "<div class='quest-vector-track'><div class='quest-vector-fill' style='width:" +
          v +
          "%;background:" +
          color +
          ";'></div></div>" +
          "<span class='quest-vector-val'>" +
          v +
          "</span></div>";
      }

      left.innerHTML =
        "<div class='quest-panel-header'>РЕЗУЛЬТАТ</div>" +
        "<div class='quest-right-card' style='border-color:" +
        color +
        "44;text-align:center;padding:20px;'>" +
        "<div style='font-size:40px;margin-bottom:8px;'>" +
        (
          (function(tracks, id) { for (var i = 0; i < tracks.length; i++) { if (tracks[i].id === id) return tracks[i]; } return { icon: '◈' }; })(this.tracks, primary.id)
            return t.id === primary.id;
          }) || { icon: "◈" }
        ).icon +
        "</div>" +
        "<div class='quest-right-archetype' style='color:" +
        color +
        ";font-size:22px;'>" +
        primary.nameRu +
        "</div>" +
        "<div class='quest-right-sub'>" +
        (primary.behavior_model || "") +
        "</div>" +
        "</div>" +
        "<div class='quest-right-section-title'>4D-ВЕКТОР</div>" +
        vecHTML +
        "<button class='quest-next-btn' style='margin-top:12px;' id='restart-btn'>← Пройти заново</button>" +
        "<button class='quest-next-btn' style='margin-top:8px;background:var(--accent-blue);color:#fff;' id='show-passport-btn'>Открыть Brand Passport</button>";

      document.getElementById("restart-btn").onclick = function () {
        HolographicQuest.init();
      };
      document.getElementById("show-passport-btn").onclick = function () {
        if (typeof ArchetypeResult !== "undefined" && primary) {
          var finalVector = {
            control:
              typeof userVector !== "undefined" ? userVector.control : 50,
            energy: typeof userVector !== "undefined" ? userVector.energy : 50,
            focus: typeof userVector !== "undefined" ? userVector.focus : 50,
            method: typeof userVector !== "undefined" ? userVector.method : 50,
          };
          ArchetypeResult.show(primary, finalVector, []);
        }
      };
    }
  },
};

// Auto-show
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    HolographicQuest.init();
  }, 400);
});
