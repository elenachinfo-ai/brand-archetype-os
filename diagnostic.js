// ArchetypeOS Diagnostic v5.1
// Flow: Intro → Phased Test (3 stages × 4 tracks) → Result → Download / Telegram
var HolographicQuest = {
  _scores: {},
  _activeTrack: null,
  _stage: 0, // 0=intro, 1=stage1, 2=stage2, 3=stage3
  _stages: [
    { name: "Действие", tracks: ["hero", "rebel", "explorer", "jester"] },
    { name: "Структура", tracks: ["ruler", "sage", "creator", "magician"] },
    { name: "Связь", tracks: ["caregiver", "lover", "everyman", "innocent"] },
  ],

  tracks: [
    {
      id: "hero",
      name: "Герой",
      icon: "⚔️",
      color: "#b87060",
      statements: [
        "Действуем решительно",
        "Видим себя победителями",
        "Берёмся за сложные задачи",
        "Клиенты чувствуют силу с нами",
      ],
    },
    {
      id: "magician",
      name: "Маг",
      icon: "✨",
      color: "#a090b8",
      statements: [
        "Трансформируем реальность",
        "Инновации — суперсила",
        "Чудеса случаются",
        "Клиенты приходят за преображением",
      ],
    },
    {
      id: "ruler",
      name: "Правитель",
      icon: "👑",
      color: "#c4a87c",
      statements: [
        "Устанавливаем стандарты",
        "Порядок — основа успеха",
        "Клиенты доверяют авторитету",
        "Контроль качества — приоритет",
      ],
    },
    {
      id: "caregiver",
      name: "Заботливый",
      icon: "🤲",
      color: "#8aaa8a",
      statements: [
        "Забота — главная ценность",
        "Создаём безопасность",
        "Поддерживаем друг друга",
        "Клиенты защищены",
      ],
    },
    {
      id: "lover",
      name: "Эстет",
      icon: "💋",
      color: "#c48090",
      statements: [
        "Красота в каждой детали",
        "Эмоциональная связь",
        "Продукты дарят наслаждение",
        "В наш бренд влюбляются",
      ],
    },
    {
      id: "jester",
      name: "Шут",
      icon: "🎉",
      color: "#c89860",
      statements: [
        "Приносим радость",
        "Юмор — часть культуры",
        "Скука — враг",
        "Клиенты улыбаются",
      ],
    },
    {
      id: "everyman",
      name: "Свой",
      icon: "🤝",
      color: "#a09080",
      statements: [
        "Честны без прикрас",
        "Клиент — часть сообщества",
        "Простота и доступность",
        "Не строим элиту",
      ],
    },
    {
      id: "explorer",
      name: "Исследователь",
      icon: "🧭",
      color: "#7aaa9a",
      statements: [
        "Открываем горизонты",
        "Свобода ведёт нас",
        "Рутина противопоказана",
        "Клиенты в пути с нами",
      ],
    },
    {
      id: "rebel",
      name: "Бунтарь",
      icon: "🔥",
      color: "#c87050",
      statements: [
        "Правила чтобы нарушать",
        "Бросаем вызов статус-кво",
        "Смелость — инструмент",
        "Клиенты чувствуют свободу",
      ],
    },
    {
      id: "creator",
      name: "Творец",
      icon: "🎨",
      color: "#8878a8",
      statements: [
        "Творчество в основе",
        "Создаём уникальное",
        "Самовыражение — ключ",
        "Клиенты вдохновляются",
      ],
    },
    {
      id: "sage",
      name: "Мудрец",
      icon: "📚",
      color: "#8898a0",
      statements: [
        "Знания — валюта",
        "Исследуем и понимаем",
        "Истина важнее мнений",
        "Клиенты за мудростью",
      ],
    },
    {
      id: "innocent",
      name: "Невинный",
      icon: "🌿",
      color: "#a0b898",
      statements: [
        "Чистота — философия",
        "Верим в лучшее",
        "Оптимизм ведёт",
        "Клиенты чувствуют свет",
      ],
    },
  ],

  // ==================== RENDER ====================
  init: function () {
    this._scores = {};
    for (var i = 0; i < this.tracks.length; i++) {
      this._scores[this.tracks[i].id] = [0, 0, 0, 0];
    }
    this._stage = 0;
    this._activeTrack = null;
    this._render();
  },

  _render: function () {
    var left = document.getElementById("panel-controllers");
    if (!left) return;

    if (this._stage === 0) {
      this._renderIntro(left);
    } else if (this._stage <= 3) {
      this._renderStage(left);
    } else {
      this._renderResult(left);
    }
  },

  // ==================== INTRO ====================
  _renderIntro: function (left) {
    left.innerHTML =
      "<div style='text-align:center;padding:40px 20px;'>" +
      "<div style='font-size:40px;margin-bottom:12px;'>◈</div>" +
      "<h2 style='font-weight:300;font-size:20px;color:var(--text-primary);margin:0 0 6px;'>ArchetypeOS</h2>" +
      "<p style='font-size:11px;color:var(--text-tertiary);letter-spacing:0.1em;margin:0 0 16px;'>BRAND DNA DIAGNOSTIC</p>" +
      "<p style='font-size:12px;color:var(--text-secondary);line-height:1.7;margin:0 0 6px;'>48 утверждений • 12 архетипов • 3 этапа</p>" +
      "<p style='font-size:12px;color:var(--text-secondary);line-height:1.7;margin:0 0 20px;'>Оцените утверждения по шкале 1–5.<br>Справа — живая карта архетипов.</p>" +
      "<div style='display:flex;gap:6px;justify-content:center;margin-bottom:20px;'>" +
      "<span style='font-size:10px;color:var(--text-tertiary);background:rgba(255,255,255,0.03);padding:4px 8px;border-radius:4px;'>Действие</span>" +
      "<span style='font-size:10px;color:var(--text-tertiary);'>→</span>" +
      "<span style='font-size:10px;color:var(--text-tertiary);background:rgba(255,255,255,0.03);padding:4px 8px;border-radius:4px;'>Структура</span>" +
      "<span style='font-size:10px;color:var(--text-tertiary);'>→</span>" +
      "<span style='font-size:10px;color:var(--text-tertiary);background:rgba(255,255,255,0.03);padding:4px 8px;border-radius:4px;'>Связь</span>" +
      "</div>" +
      "<button id='start-test-btn' style='padding:14px 40px;background:var(--accent-blue);color:#fff;border:none;border-radius:10px;font-family:inherit;font-size:14px;font-weight:500;cursor:pointer;'>Начать диагностику</button>" +
      "<p style='font-size:10px;color:var(--text-tertiary);margin-top:12px;'>~5 минут</p>" +
      "</div>";
    document.getElementById("start-test-btn").onclick = function () {
      HolographicQuest._stage = 1;
      HolographicQuest._render();
    };
  },

  // ==================== STAGE ====================
  _renderStage: function (left) {
    var stage = this._stages[this._stage - 1];
    var tracks = [];
    for (var i = 0; i < stage.tracks.length; i++) {
      for (var j = 0; j < this.tracks.length; j++) {
        if (this.tracks[j].id === stage.tracks[i]) {
          tracks.push(this.tracks[j]);
          break;
        }
      }
    }

    var totalStages = 3;
    var answered = this._countAnswered();
    var stageTotal = 0;
    var stageAnswered = 0;
    for (var k = 0; k < tracks.length; k++) {
      var sc = this._scores[tracks[k].id];
      for (var s = 0; s < 4; s++) {
        stageTotal++;
        if (sc[s] > 0) stageAnswered++;
      }
    }
    var stageDone = stageAnswered >= stageTotal;

    var html = "";
    // Header
    html +=
      "<div style='display:flex;align-items:center;gap:10px;margin-bottom:12px;'>" +
      "<span style='font-size:10px;font-weight:600;letter-spacing:0.12em;color:var(--accent-blue);'>ЭТАП " +
      this._stage +
      "/3</span>" +
      "<span style='font-size:12px;color:var(--text-primary);font-weight:500;'>" +
      stage.name +
      "</span>" +
      "<span style='margin-left:auto;font-size:10px;color:var(--text-tertiary);'>" +
      stageAnswered +
      "/" +
      stageTotal +
      "</span>" +
      "</div>";

    // Progress bar
    html +=
      "<div style='height:2px;background:rgba(255,255,255,0.06);border-radius:1px;margin-bottom:10px;'>" +
      "<div style='height:100%;width:" +
      (stageAnswered / Math.max(stageTotal, 1)) * 100 +
      "%;background:var(--accent-blue);border-radius:1px;transition:width 0.3s;'></div>" +
      "</div>";

    // Current archetype hint
    var hint = this._getCurrentArchetype();
    if (hint) {
      html +=
        "<div style='font-size:10px;color:var(--text-tertiary);margin-bottom:8px;'>Текущий архетип: <span style='color:" +
        hint.color +
        ";'>" +
        hint.name +
        "</span></div>";
    }

    // Tracks
    html += "<div style='display:flex;flex-direction:column;gap:3px;'>";
    for (var t = 0; t < tracks.length; t++) {
      var tr = tracks[t];
      var scores = this._scores[tr.id];
      var ans = 0;
      for (var a = 0; a < 4; a++) {
        if (scores[a] > 0) ans++;
      }
      var expanded = this._activeTrack === tr.id;
      var style = expanded
        ? "background:rgba(255,255,255,0.04);border:1px solid " +
          tr.color +
          "44;"
        : "background:rgba(255,255,255,0.02);border:1px solid transparent;";

      html +=
        "<div class='track-row' data-track='" +
        tr.id +
        "' style='" +
        style +
        "border-radius:7px;padding:7px 9px;cursor:pointer;transition:all 0.2s;'>" +
        "<div style='display:flex;align-items:center;gap:8px;'>" +
        "<span style='font-size:15px;width:22px;text-align:center;'>" +
        tr.icon +
        "</span>" +
        "<span style='flex:1;font-size:11px;font-weight:500;color:var(--text-primary);'>" +
        tr.name +
        "</span>" +
        "<span style='font-size:10px;color:" +
        tr.color +
        ";'>" +
        (ans === 4 ? "✓" : ans + "/4") +
        "</span>" +
        "</div>";

      if (expanded) {
        html +=
          "<div style='margin-top:6px;display:flex;flex-direction:column;gap:4px;'>";
        for (var s = 0; s < 4; s++) {
          html +=
            "<div style='display:flex;align-items:center;gap:6px;'>" +
            "<span style='flex:1;font-size:10px;color:var(--text-secondary);line-height:1.3;'>" +
            tr.statements[s] +
            "</span>" +
            "<div style='display:flex;gap:2px;'>";
          for (var r = 1; r <= 5; r++) {
            var active = scores[s] >= r;
            html +=
              "<span class='score-dot' data-track='" +
              tr.id +
              "' data-stmt='" +
              s +
              "' data-val='" +
              r +
              "' " +
              "style='width:14px;height:14px;border-radius:50%;border:1px solid " +
              tr.color +
              "44;" +
              (active
                ? "background:" + tr.color + ";"
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

    // Navigation
    html += "<div style='display:flex;gap:8px;margin-top:10px;'>";
    if (this._stage > 1) {
      html +=
        "<button id='prev-stage-btn' style='flex:1;padding:10px;background:rgba(255,255,255,0.03);border:1px solid var(--border-subtle);border-radius:8px;color:var(--text-secondary);font-family:inherit;font-size:12px;cursor:pointer;'>← Назад</button>";
    }
    html +=
      "<button id='next-stage-btn' style='flex:1;padding:10px;background:" +
      (stageDone ? "var(--accent-blue)" : "rgba(255,255,255,0.03)") +
      ";color:" +
      (stageDone ? "#fff" : "var(--text-tertiary)") +
      ";border:1px solid " +
      (stageDone ? "var(--accent-blue)" : "var(--border-subtle)") +
      ";border-radius:8px;font-family:inherit;font-size:12px;cursor:" +
      (stageDone ? "pointer" : "default") +
      ";'>" +
      (this._stage === 3 ? "Результат →" : "Далее →") +
      "</button>";
    html += "</div>";

    left.innerHTML = html;

    // Bind
    var self = this;
    var rows = left.querySelectorAll(".track-row");
    for (var i = 0; i < rows.length; i++) {
      rows[i].onclick = function (e) {
        if (e.target.classList.contains("score-dot")) return;
        var tid = this.getAttribute("data-track");
        self._activeTrack = self._activeTrack === tid ? null : tid;
        self._render();
      };
    }
    var dots = left.querySelectorAll(".score-dot");
    for (var d = 0; d < dots.length; d++) {
      dots[d].onclick = function (e) {
        e.stopPropagation();
        var tid = this.getAttribute("data-track");
        var st = parseInt(this.getAttribute("data-stmt"));
        var vl = parseInt(this.getAttribute("data-val"));
        if (self._scores[tid][st] === vl) {
          self._scores[tid][st] = 0;
        } else {
          self._scores[tid][st] = vl;
        }
        self._render();
        self._updateVector();
      };
    }
    var prev = document.getElementById("prev-stage-btn");
    if (prev)
      prev.onclick = function () {
        self._stage--;
        self._activeTrack = null;
        self._render();
      };
    var next = document.getElementById("next-stage-btn");
    if (next && stageDone)
      next.onclick = function () {
        self._activeTrack = null;
        if (self._stage >= 3) {
          self._stage = 4;
          self._render();
        } else {
          self._stage++;
          self._render();
        }
      };
  },

  // ==================== RESULT ====================
  _renderResult: function (left) {
    this._updateVector();
    var best = this._getBestArchetype();
    if (!best) {
      left.innerHTML = "<p>Нужно больше оценок</p>";
      return;
    }

    var primary = best.primary;
    var color = primary.color;
    var icon = best.icon;

    // Top 3
    var top3 = this._getTop3();
    var top3html = "";
    for (var i = 0; i < top3.length; i++) {
      top3html +=
        "<div style='display:flex;align-items:center;gap:8px;padding:5px 0;'>" +
        "<span style='font-size:11px;color:" +
        top3[i].color +
        ";'>" +
        (i + 1) +
        ".</span>" +
        "<span style='font-size:12px;color:var(--text-primary);'>" +
        top3[i].nameRu +
        "</span>" +
        "<span style='font-size:10px;color:var(--text-tertiary);margin-left:auto;'>" +
        top3[i].sum +
        "/20</span></div>";
    }

    // Vector
    var dims = ["control", "energy", "focus", "method"];
    var labels = {
      control: "Контроль",
      energy: "Энергия",
      focus: "Фокус",
      method: "Метод",
    };
    var vecHTML = "";
    for (var v = 0; v < dims.length; v++) {
      var dv = dims[v];
      var val = typeof userVector !== "undefined" ? userVector[dv] : 50;
      vecHTML +=
        "<div style='display:flex;align-items:center;gap:6px;margin-bottom:3px;'>" +
        "<span style='font-size:10px;color:var(--text-secondary);width:60px;'>" +
        labels[dv] +
        "</span>" +
        "<div style='flex:1;height:3px;background:rgba(255,255,255,0.06);border-radius:1px;overflow:hidden;'>" +
        "<div style='height:100%;width:" +
        val +
        "%;background:" +
        color +
        ";border-radius:1px;'></div></div>" +
        "<span style='font-size:10px;color:var(--text-primary);width:24px;text-align:right;'>" +
        val +
        "</span></div>";
    }

    left.innerHTML =
      "<div class='quest-panel-header'>РЕЗУЛЬТАТ ДИАГНОСТИКИ</div>" +
      "<div style='text-align:center;padding:16px;border:1px solid " +
      color +
      "44;border-radius:12px;margin-bottom:12px;'>" +
      "<div style='font-size:36px;margin-bottom:6px;'>" +
      icon +
      "</div>" +
      "<div style='font-size:20px;font-weight:400;color:" +
      color +
      ";margin-bottom:4px;'>" +
      primary.nameRu +
      "</div>" +
      "<div style='font-size:10px;color:var(--text-tertiary);'>" +
      (primary.behavior_model || "") +
      "</div>" +
      "</div>" +
      "<div class='quest-right-section-title'>ТОП-3 АРХЕТИПА</div>" +
      top3html +
      "<div class='quest-right-section-title'>4D-ВЕКТОР</div>" +
      vecHTML +
      "<button id='download-btn' style='width:100%;padding:12px;margin-top:12px;background:var(--accent-blue);color:#fff;border:none;border-radius:8px;font-family:inherit;font-size:13px;font-weight:500;cursor:pointer;'>📥 Скачать Brand Passport</button>" +
      "<a href='https://t.me/Elenach_com' target='_blank' style='display:block;width:100%;padding:10px;margin-top:6px;background:rgba(255,255,255,0.03);border:1px solid var(--border-mid);border-radius:8px;color:var(--text-secondary);font-family:inherit;font-size:12px;text-align:center;text-decoration:none;cursor:pointer;'>💬 Заказать консультацию @Elenach_com</a>" +
      "<button id='restart-btn' style='width:100%;padding:8px;margin-top:6px;background:transparent;border:none;color:var(--text-tertiary);font-family:inherit;font-size:11px;cursor:pointer;'>← Пройти заново</button>";

    var self = this;
    document.getElementById("restart-btn").onclick = function () {
      HolographicQuest.init();
    };
    document.getElementById("download-btn").onclick = function () {
      self._download(primary, top3);
    };
  },

  // ==================== HELPERS ====================
  _countAnswered: function () {
    var c = 0;
    for (var id in this._scores) {
      for (var i = 0; i < 4; i++) {
        if (this._scores[id][i] > 0) c++;
      }
    }
    return c;
  },

  _getCurrentArchetype: function () {
    var best = null;
    var bestSum = 0;
    for (var id in this._scores) {
      var sum = 0;
      for (var i = 0; i < 4; i++) {
        sum += this._scores[id][i];
      }
      if (sum > bestSum) {
        bestSum = sum;
        best = id;
      }
    }
    if (!best || bestSum === 0) return null;
    for (var t = 0; t < this.tracks.length; t++) {
      if (this.tracks[t].id === best) return this.tracks[t];
    }
    return null;
  },

  _getBestArchetype: function () {
    var bestId = null;
    var bestSum = 0;
    for (var id in this._scores) {
      var sum = 0;
      for (var i = 0; i < 4; i++) {
        sum += this._scores[id][i];
      }
      if (sum > bestSum) {
        bestSum = sum;
        bestId = id;
      }
    }
    if (!bestId) return null;
    var primary = null;
    if (typeof archetypes !== "undefined") {
      for (var a = 0; a < archetypes.length; a++) {
        if (archetypes[a].id === bestId) {
          primary = archetypes[a];
          break;
        }
      }
    }
    var icon = "◈";
    for (var t = 0; t < this.tracks.length; t++) {
      if (this.tracks[t].id === bestId) {
        icon = this.tracks[t].icon;
        break;
      }
    }
    return { primary: primary, icon: icon };
  },

  _getTop3: function () {
    var ranked = [];
    for (var id in this._scores) {
      var s = 0;
      for (var i = 0; i < 4; i++) {
        s += this._scores[id][i];
      }
      ranked.push({ id: id, sum: s });
    }
    ranked.sort(function (a, b) {
      return b.sum - a.sum;
    });
    var result = [];
    for (var r = 0; r < 3 && r < ranked.length; r++) {
      var arch = null;
      if (typeof archetypes !== "undefined") {
        for (var a = 0; a < archetypes.length; a++) {
          if (archetypes[a].id === ranked[r].id) {
            arch = archetypes[a];
            break;
          }
        }
      }
      if (arch)
        result.push({
          nameRu: arch.nameRu,
          color: arch.color,
          sum: ranked[r].sum,
        });
    }
    return result;
  },

  _updateVector: function () {
    var v = { control: 50, energy: 50, focus: 50, method: 50 };
    var w = {
      hero: { c: 2, e: 3, f: 2, m: 0 },
      magician: { c: 0, e: 2, f: 2, m: 3 },
      ruler: { c: 3, e: 0, f: 2, m: 1 },
      caregiver: { c: 1, e: -1, f: 1, m: 2 },
      lover: { c: 0, e: 2, f: 0, m: 2 },
      jester: { c: -1, e: 3, f: -1, m: 0 },
      everyman: { c: 0, e: 0, f: 0, m: 1 },
      explorer: { c: -1, e: 2, f: -1, m: 1 },
      rebel: { c: -2, e: 3, f: -2, m: -1 },
      creator: { c: 0, e: 1, f: 2, m: 2 },
      sage: { c: 2, e: -2, f: 3, m: 1 },
      innocent: { c: -1, e: -1, f: -1, m: 1 },
    };
    for (var id in this._scores) {
      var sum = 0;
      for (var i = 0; i < 4; i++) {
        sum += this._scores[id][i];
      }
      var inf = (sum / 20) * 30;
      if (w[id]) {
        v.control += w[id].c * inf * 0.3;
        v.energy += w[id].e * inf * 0.3;
        v.focus += w[id].f * inf * 0.3;
        v.method += w[id].m * inf * 0.3;
      }
    }
    v.control = Math.max(5, Math.min(95, Math.round(v.control)));
    v.energy = Math.max(5, Math.min(95, Math.round(v.energy)));
    v.focus = Math.max(5, Math.min(95, Math.round(v.focus)));
    v.method = Math.max(5, Math.min(95, Math.round(v.method)));
    if (typeof userVector !== "undefined") {
      userVector.control = v.control;
      userVector.energy = v.energy;
      userVector.focus = v.focus;
      userVector.method = v.method;
    }
    if (typeof updateBrandPositionFromVector === "function")
      updateBrandPositionFromVector();
    if (typeof updateAll === "function") updateAll();
  },

  // ==================== DOWNLOAD ====================
  _download: function (primary, top3) {
    var color = primary.color;
    var recs = this._getRecommendations(primary.id);
    var html =
      "<!doctype html><html lang='ru'><head><meta charset='UTF-8'><title>Brand Passport — " +
      primary.nameRu +
      "</title>" +
      "<style>" +
      "body{font-family:Manrope,Inter,sans-serif;background:#0a0a0e;color:#e8e6e0;max-width:600px;margin:0 auto;padding:40px 20px;}" +
      "h1{font-weight:300;font-size:28px;color:" +
      color +
      ";margin:0 0 4px;}" +
      "h2{font-weight:300;font-size:16px;color:#9a9890;margin:0 0 20px;}" +
      "h3{font-weight:500;font-size:12px;letter-spacing:0.1em;color:#6a6860;margin:24px 0 8px;text-transform:uppercase;}" +
      ".badge{display:inline-block;padding:4px 12px;border:1px solid " +
      color +
      "44;border-radius:20px;font-size:10px;color:" +
      color +
      ";letter-spacing:0.1em;margin-bottom:12px;}" +
      ".card{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:16px;margin-bottom:12px;}" +
      "p{font-size:12px;color:#9a9890;line-height:1.7;margin:0 0 8px;}" +
      "li{font-size:12px;color:#9a9890;line-height:1.6;margin-bottom:4px;}" +
      ".footer{font-size:10px;color:#6a6860;margin-top:30px;text-align:center;}" +
      "a{color:" +
      color +
      ";}" +
      "</style></head><body>" +
      "<div class='badge'>BRAND PASSPORT</div>" +
      "<h1>" +
      primary.nameRu +
      "</h1>" +
      "<h2>" +
      (primary.behavior_model || "") +
      "</h2>" +
      "<h3>Психологический профиль</h3>" +
      "<div class='card'><p>" +
      recs.profile +
      "</p></div>" +
      "<h3>Рекомендации по дизайну сайта</h3>" +
      "<div class='card'><p><strong>Типографика:</strong> " +
      (primary.ui_rules ? primary.ui_rules.typography : "") +
      "</p>" +
      "<p><strong>Структура:</strong> " +
      (primary.ux_rules ? primary.ux_rules.structure : "") +
      "</p>" +
      "<p><strong>Поведение:</strong> " +
      (primary.ux_rules ? primary.ux_rules.behavior : "") +
      "</p>" +
      "<p><strong>Анимация:</strong> " +
      (primary.ui_rules ? primary.ui_rules.motion : "") +
      "</p>" +
      "<p><strong>Визуальный стиль:</strong> " +
      (primary.ui_rules ? primary.ui_rules.visual : "") +
      "</p></div>" +
      "<h3>Цветовая палитра</h3>" +
      "<div class='card'><p>Акцентный: <span style='color:" +
      color +
      ";'>" +
      color +
      "</span></p></div>" +
      "<h3>Что усиливает архетип</h3>" +
      "<div class='card'><ul>" +
      recs.do
        .map(function (x) {
          return "<li>" + x + "</li>";
        })
        .join("") +
      "</ul></div>" +
      "<h3>Что ослабляет архетип</h3>" +
      "<div class='card'><ul>" +
      recs.dont
        .map(function (x) {
          return "<li>" + x + "</li>";
        })
        .join("") +
      "</ul></div>" +
      "<div class='footer'>ArchetypeOS • Elena Charlesworth<br><a href='https://t.me/Elenach_com'>@Elenach_com</a></div>" +
      "</body></html>";

    var blob = new Blob([html], { type: "text/html" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "Brand_Passport_" + primary.nameRu + ".html";
    a.click();
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  },

  _getRecommendations: function (id) {
    var data = {
      hero: {
        profile:
          "Ваш бренд ведёт клиента к победе. Вы — катализатор действий. Люди приходят к вам за силой. Главная опасность — высокомерие.",
        do: ["Резкие контрасты", "Чёткие CTA", "Социальные доказательства"],
        dont: ["Размытые формулировки", "Длинные формы", "Пассивные состояния"],
      },
      magician: {
        profile:
          "Ваш бренд трансформирует реальность. Инновации — ваша суперсила. Опасность — отрыв от реальности.",
        do: ["Градиенты и частицы", "Reveal-анимации", "Метафоры"],
        dont: ["Плоский минимализм", "Шаблоны", "Объяснение магии"],
      },
      ruler: {
        profile:
          "Ваш бренд — воплощение порядка. Вы даёте структуру в хаотичном мире. Опасность — отчуждение.",
        do: ["Симметрия и порядок", "Золотые акценты", "Иерархия"],
        dont: ["Асимметрия", "Демократичный тон", "Избыток эмоций"],
      },
      caregiver: {
        profile:
          "Ваш бренд — источник заботы. Клиент чувствует себя защищённым. Опасность — самопожертвование.",
        do: ["Органические формы", "Тёплые тона", "Поддержка"],
        dont: ["Холодная эстетика", "Агрессивные попапы"],
      },
      lover: {
        profile:
          "Ваш бренд строит эмоциональные связи. Красота и страсть. Опасность — поверхностность.",
        do: ["Чувственная типографика", "Насыщенные цвета", "Тактильность"],
        dont: ["Безликий стиль", "Грубые формы", "Спешка"],
      },
      jester: {
        profile:
          "Ваш бренд приносит радость. Жизнь — игра. Опасность — несерьёзность.",
        do: ["Неожиданные взаимодействия", "Яркие цвета", "Игривый тон"],
        dont: ["Скучные лейауты", "Формальный язык"],
      },
      everyman: {
        profile:
          "Ваш бренд — свой среди своих. Честность и простота. Опасность — незаметность.",
        do: ["Честные формулировки", "Интуитивные паттерны", "Фото людей"],
        dont: ["Элитарный язык", "Глянец", "Сложные концепции"],
      },
      explorer: {
        profile:
          "Ваш бренд открывает горизонты. Свобода и аутентичность. Опасность — бесцельность.",
        do: ["Просторные лейауты", "Природные тона", "Навигация"],
        dont: ["Тесные сетки", "Ограничения", "Индустриальный стиль"],
      },
      rebel: {
        profile:
          "Ваш бренд ломает правила. Голос перемен. Опасность — разрушение без созидания.",
        do: ["Сломанные сетки", "Высокий контраст", "Провокация"],
        dont: ["Традиционные лейауты", "Нейтральная палитра"],
      },
      creator: {
        profile:
          "Ваш бренд — пространство для творчества. Опасность — перфекционизм.",
        do: ["Свобода выражения", "Кастомизация", "Вдохновение"],
        dont: ["Жёсткие рамки", "Шаблоны", "Скудная палитра"],
      },
      sage: {
        profile:
          "Ваш бренд — источник знаний. Экспертиза и ясность. Опасность — догматизм.",
        do: ["Чёткая архитектура", "Данные", "Аналитика"],
        dont: ["Манипуляции", "Поверхностность", "Кричащие цвета"],
      },
      innocent: {
        profile:
          "Ваш бренд возвращает веру в простые радости. Чистота и надежда. Опасность — наивность.",
        do: ["Пастельная палитра", "Простые формы", "Позитив"],
        dont: ["Тёмные темы", "Сложная навигация", "Цинизм"],
      },
    };
    return (
      data[id] || {
        profile: "Уникальный архетип.",
        do: ["Аутентичность"],
        dont: ["Хаотичность"],
      }
    );
  },
};

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    HolographicQuest.init();
  }, 400);
});
