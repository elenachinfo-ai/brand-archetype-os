// ArchetypeOS v7 — Cosmic Swipe Diagnostic
// Tinder-style cards + star map visualization
var HolographicQuest = {
  _step: 0, // 0=intro, 1-48=questions, 49=result
  _scores: {}, // {trackId: [0,0,0,0]}
  _cards: [], // all 48 question cards
  _selVal: 0, // currently selected value
  _selIdx: -1, // currently selected track index for expanded card

  // 12 archetypes × 4 statements
  tracks: [
    {
      id: "hero",
      name: "Герой",
      icon: "⚔️",
      c: "#ff6b6b",
      q: [
        "Действуем решительно",
        "Видим себя победителями",
        "Берёмся за сложные задачи",
        "Клиенты чувствуют силу с нами",
      ],
    },
    {
      id: "ruler",
      name: "Правитель",
      icon: "👑",
      c: "#ffd700",
      q: [
        "Устанавливаем стандарты",
        "Порядок — основа успеха",
        "Клиенты доверяют авторитету",
        "Контроль качества — приоритет",
      ],
    },
    {
      id: "magician",
      name: "Маг",
      icon: "✨",
      c: "#b8a0ff",
      q: [
        "Трансформируем реальность",
        "Инновации — суперсила",
        "Чудеса случаются",
        "Клиенты приходят за преображением",
      ],
    },
    {
      id: "caregiver",
      name: "Заботливый",
      icon: "🤲",
      c: "#4aff9e",
      q: [
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
      c: "#ff79c6",
      q: [
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
      c: "#ffb86c",
      q: [
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
      c: "#8899aa",
      q: [
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
      c: "#45e6d0",
      q: [
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
      c: "#ff5555",
      q: [
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
      c: "#9d7cd8",
      q: [
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
      c: "#7ec8e3",
      q: [
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
      c: "#a8e6cf",
      q: [
        "Чистота — философия",
        "Верим в лучшее",
        "Оптимизм ведёт",
        "Клиенты чувствуют свет",
      ],
    },
  ],

  init: function () {
    this._scores = {};
    for (var i = 0; i < this.tracks.length; i++) {
      this._scores[this.tracks[i].id] = [0, 0, 0, 0];
    }
    this._cards = [];
    for (var t = 0; t < this.tracks.length; t++) {
      for (var q = 0; q < 4; q++) {
        this._cards.push({ trackIdx: t, qIdx: q });
      }
    }
    this._step = 0;
    this._selVal = 0;
    this._render();
  },

  _render: function () {
    var left = document.getElementById("panel-controllers");
    if (!left) return;
    if (this._step === 0) this._renderIntro(left);
    else if (this._step <= 48) this._renderCard(left);
    else this._renderResult(left);
  },

  // ==================== INTRO (COSMIC) ====================
  _renderIntro: function (left) {
    left.innerHTML =
      "<div style='text-align:center;padding:40px 20px;display:flex;flex-direction:column;height:100%;justify-content:center;'>" +
      "<div style='font-size:8px;letter-spacing:0.3em;color:var(--accent-blue);margin-bottom:12px;'>ARCHEYPEOS COSMIC</div>" +
      "<div style='font-size:48px;margin-bottom:8px;filter:drop-shadow(0 0 20px var(--accent-blue));'>◈</div>" +
      "<h2 style='font-weight:200;font-size:24px;color:var(--text-primary);margin:0 0 4px;'>Brand DNA Scan</h2>" +
      "<p style='font-size:12px;color:var(--text-secondary);margin:0 0 20px;'>48 карточек • 12 архетипов • Свайп-интерфейс</p>" +
      "<div style='background:rgba(110,231,255,0.04);border:1px solid rgba(110,231,255,0.12);border-radius:12px;padding:14px;margin-bottom:16px;text-align:left;'>" +
      "<p style='font-size:11px;color:var(--text-secondary);margin:0 0 6px;'><span style='color:var(--accent-blue);'>◄</span> Свайп влево — не согласен</p>" +
      "<p style='font-size:11px;color:var(--text-secondary);margin:0;'><span style='color:var(--accent-blue);'>►</span> Свайп вправо — согласен</p>" +
      "</div>" +
      "<button id='start-btn' style='width:100%;padding:16px;background:transparent;color:var(--accent-blue);border:1px solid var(--accent-blue);border-radius:10px;font-family:inherit;font-size:15px;font-weight:400;cursor:pointer;letter-spacing:0.05em;'>INITIATE SCAN</button>" +
      "</div>";
    document.getElementById("start-btn").onclick = function () {
      HolographicQuest._step = 1;
      HolographicQuest._render();
    };
  },

  // ==================== SWIPE CARD ====================
  _renderCard: function (left) {
    var cardIdx = this._step - 1;
    var card = this._cards[cardIdx];
    var track = this.tracks[card.trackIdx];
    var qText = track.q[card.qIdx];
    var prevScore = this._scores[track.id][card.qIdx];
    var progress = Math.round((cardIdx / 48) * 100);
    var color = track.c;

    left.innerHTML =
      "<div style='display:flex;flex-direction:column;height:100%;padding:16px 20px;'>" +
      // Progress
      "<div style='display:flex;align-items:center;gap:8px;margin-bottom:4px;'>" +
      "<span style='font-size:9px;letter-spacing:0.15em;color:var(--accent-blue);'>CARD " +
      this._step +
      "/48</span>" +
      "<div style='flex:1;height:1px;background:rgba(110,231,255,0.12);'><div style='height:100%;width:" +
      progress +
      "%;background:var(--accent-blue);box-shadow:0 0 4px var(--accent-blue);'></div></div>" +
      "<span style='font-size:9px;color:var(--text-tertiary);'>" +
      progress +
      "%</span>" +
      "</div>" +
      // Archetype label
      "<div style='display:flex;align-items:center;gap:6px;margin-bottom:8px;'>" +
      "<span style='font-size:18px;'>" +
      track.icon +
      "</span>" +
      "<span style='font-size:10px;color:" +
      color +
      ";letter-spacing:0.08em;'>" +
      track.name.toUpperCase() +
      "</span>" +
      "</div>" +
      // Question card
      "<div style='flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;margin-bottom:12px;'>" +
      "<p style='font-size:20px;color:var(--text-primary);line-height:1.4;font-weight:300;max-width:320px;'>" +
      qText +
      "</p>" +
      "</div>" +
      // Score display (current)
      "<div style='text-align:center;margin-bottom:10px;'>" +
      "<span style='font-size:10px;color:var(--text-tertiary);letter-spacing:0.1em;'>" +
      (prevScore > 0 ? "SCORE: " + prevScore + "/5" : "TAP TO RATE") +
      "</span>" +
      "</div>" +
      // Rating dots (big, tappable)
      "<div style='display:flex;justify-content:center;gap:14px;margin-bottom:12px;'>";
    for (var r = 1; r <= 5; r++) {
      var active = prevScore === r;
      left.innerHTML +=
        "<span class='rate-dot' data-val='" +
        r +
        "' style='width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.15s;" +
        "border:1px solid " +
        (active ? color : "rgba(110,231,255,0.2)") +
        ";" +
        "background:" +
        (active ? color : "transparent") +
        ";" +
        "color:" +
        (active ? "#020510" : "var(--text-tertiary)") +
        ";" +
        "font-size:18px;font-weight:" +
        (active ? "600" : "300") +
        ";'>" +
        r +
        "</span>";
    }
    left.innerHTML +=
      "</div>" +
      // Nav buttons
      "<div style='display:flex;gap:8px;'>" +
      (this._step > 1
        ? "<button id='prev-btn' style='flex:1;padding:12px;background:transparent;border:1px solid rgba(110,231,255,0.15);border-radius:8px;color:var(--text-secondary);font-family:inherit;font-size:13px;cursor:pointer;'>← PREV</button>"
        : "") +
      "<button id='next-btn' style='flex:1;padding:12px;background:transparent;border:1px solid var(--accent-blue);border-radius:8px;color:var(--accent-blue);font-family:inherit;font-size:13px;cursor:pointer;'>" +
      (this._step === 48 ? "RESULTS →" : "NEXT →") +
      "</button>" +
      "</div>" +
      "</div>";

    // Bind
    var self = this;
    var dots = left.querySelectorAll(".rate-dot");
    for (var d = 0; d < dots.length; d++) {
      dots[d].onclick = function (e) {
        e.stopPropagation();
        var val = parseInt(this.getAttribute("data-val"));
        var cIdx = self._step - 1;
        var crd = self._cards[cIdx];
        if (self._scores[crd.trackIdx] === undefined)
          self._scores[crd.trackIdx] = [0, 0, 0, 0];
        // Toggle: if same value, deselect
        if (self._scores[crd.trackIdx][crd.qIdx] === val) {
          self._scores[crd.trackIdx][crd.qIdx] = 0;
        } else {
          self._scores[crd.trackIdx][crd.qIdx] = val;
        }
        self._updateVector();
        self._render();
      };
    }
    var prev = document.getElementById("prev-btn");
    if (prev)
      prev.onclick = function () {
        self._step--;
        self._render();
      };
    var next = document.getElementById("next-btn");
    if (next)
      next.onclick = function () {
        if (self._step >= 48) {
          self._step = 49;
          self._render();
        } else {
          self._step++;
          self._render();
        }
      };
  },

  // ==================== RESULT ====================
  _renderResult: function (left) {
    this._updateVector();
    var best = this._getBest();
    if (!best) return;
    var p = best.primary;
    var c = p.color;
    var icon = best.icon;
    var totalAns = this._countAll();

    var top3 = this._getTop3();
    var t3html = "";
    for (var i = 0; i < top3.length; i++) {
      t3html +=
        "<div style='display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid rgba(110,231,255,0.06);'>" +
        "<span style='font-size:12px;color:" +
        top3[i].color +
        ";font-weight:600;'>" +
        (i + 1) +
        "</span>" +
        "<span style='flex:1;font-size:14px;color:var(--text-primary);'>" +
        top3[i].nameRu +
        "</span>" +
        "<span style='font-size:10px;color:var(--text-tertiary);'>" +
        top3[i].sum +
        "/20</span></div>";
    }

    left.innerHTML =
      "<div style='padding:20px;'>" +
      "<div style='text-align:center;padding:24px 16px;border:1px solid " +
      c +
      "33;border-radius:16px;margin-bottom:14px;background:linear-gradient(180deg," +
      c +
      "08,transparent);'>" +
      "<div style='font-size:8px;letter-spacing:0.3em;color:var(--text-tertiary);margin-bottom:10px;'>SCAN COMPLETE</div>" +
      "<div style='font-size:48px;margin-bottom:10px;filter:drop-shadow(0 0 20px " +
      c +
      "44);'>" +
      icon +
      "</div>" +
      "<div style='font-size:24px;font-weight:200;color:" +
      c +
      ";letter-spacing:-0.01em;'>" +
      p.nameRu +
      "</div>" +
      "<div style='font-size:10px;color:var(--text-tertiary);margin-top:6px;'>" +
      (p.behavior_model || "") +
      "</div>" +
      "<div style='margin-top:10px;font-size:10px;color:var(--accent-blue);'>" +
      totalAns +
      "/48 answered</div>" +
      "</div>" +
      "<div style='font-size:8px;letter-spacing:0.15em;color:var(--text-tertiary);margin-bottom:4px;'>TOP-3</div>" +
      "<div style='background:rgba(110,231,255,0.03);border:1px solid rgba(110,231,255,0.08);border-radius:10px;padding:4px 12px;margin-bottom:14px;'>" +
      t3html +
      "</div>" +
      "<button id='dl-btn' style='width:100%;padding:14px;background:" +
      c +
      ";color:#020510;border:none;border-radius:10px;font-family:inherit;font-size:14px;font-weight:500;cursor:pointer;margin-bottom:6px;'>DOWNLOAD BRAND PASSPORT</button>" +
      "<a href='https://t.me/Elenach_com' target='_blank' style='display:block;width:100%;padding:12px;border:1px solid rgba(110,231,255,0.12);border-radius:10px;color:var(--text-secondary);text-align:center;text-decoration:none;font-size:13px;margin-bottom:6px;'>@Elenach_com</a>" +
      "<a href='https://elenach.com' target='_blank' style='display:block;width:100%;padding:10px;color:var(--text-tertiary);text-align:center;text-decoration:none;font-size:11px;'>elenach.com</a>" +
      "<button id='restart-btn' style='width:100%;padding:10px;background:transparent;border:none;color:var(--text-tertiary);font-size:11px;cursor:pointer;margin-top:4px;'>← RESTART</button>" +
      "</div>";
    var self = this;
    document.getElementById("restart-btn").onclick = function () {
      HolographicQuest.init();
    };
    document.getElementById("dl-btn").onclick = function () {
      self._download(p, top3, totalAns);
    };
  },

  // ==================== HELPERS ====================
  _countAll: function () {
    var c = 0;
    for (var i = 0; i < this.tracks.length; i++) {
      var s = this._scores[this.tracks[i].id];
      for (var j = 0; j < 4; j++) {
        if (s[j] > 0) c++;
      }
    }
    return c;
  },
  _getBest: function () {
    var bestId = null,
      bestSum = -1;
    for (var i = 0; i < this.tracks.length; i++) {
      var id = this.tracks[i].id,
        s = this._scores[id],
        sum = 0;
      for (var j = 0; j < 4; j++) sum += s[j];
      if (sum > bestSum) {
        bestSum = sum;
        bestId = id;
      }
    }
    if (!bestId) return null;
    var p = null,
      icon = "◈";
    if (typeof archetypes !== "undefined") {
      for (var a = 0; a < archetypes.length; a++) {
        if (archetypes[a].id === bestId) {
          p = archetypes[a];
          break;
        }
      }
    }
    for (var t = 0; t < this.tracks.length; t++) {
      if (this.tracks[t].id === bestId) {
        icon = this.tracks[t].icon;
        break;
      }
    }
    return { primary: p, icon: icon };
  },
  _getTop3: function () {
    var r = [];
    for (var i = 0; i < this.tracks.length; i++) {
      var id = this.tracks[i].id,
        s = this._scores[id],
        sum = 0;
      for (var j = 0; j < 4; j++) sum += s[j];
      r.push({ id: id, sum: sum });
    }
    r.sort(function (a, b) {
      return b.sum - a.sum;
    });
    var res = [];
    for (var k = 0; k < 3 && k < r.length; k++) {
      var arch = null;
      if (typeof archetypes !== "undefined") {
        for (var a = 0; a < archetypes.length; a++) {
          if (archetypes[a].id === r[k].id) {
            arch = archetypes[a];
            break;
          }
        }
      }
      if (arch)
        res.push({ nameRu: arch.nameRu, color: arch.color, sum: r[k].sum });
    }
    return res;
  },
  _updateVector: function () {
    var v = { control: 50, energy: 50, focus: 50, method: 50 };
    var w = {
      hero: { c: 2, e: 3, f: 2, m: 0 },
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
      magician: { c: 0, e: 2, f: 2, m: 3 },
    };
    for (var i = 0; i < this.tracks.length; i++) {
      var id = this.tracks[i].id,
        s = this._scores[id],
        sum = 0;
      for (var j = 0; j < 4; j++) sum += s[j];
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
  _download: function (p, top3, totalAns) {
    var c = p.color;
    var html =
      "<!doctype html><html lang=ru><head><meta charset=UTF-8><title>Brand Passport — " +
      p.nameRu +
      "</title>" +
      "<style>body{font-family:Inter,Manrope,sans-serif;background:#020510;color:#e0f0ff;max-width:640px;margin:0 auto;padding:48px 24px;}" +
      "h1{font-weight:200;font-size:32px;color:" +
      c +
      ";margin:0 0 4px;}h2{font-weight:300;font-size:16px;color:#8090b0;margin:0 0 8px;}" +
      "h3{font-weight:500;font-size:10px;letter-spacing:0.15em;color:#506080;margin:32px 0 10px;}" +
      ".badge{display:inline-block;padding:6px 16px;border:1px solid " +
      c +
      "44;border-radius:20px;font-size:9px;color:" +
      c +
      ";letter-spacing:0.15em;margin-bottom:16px;}" +
      ".card{background:rgba(110,231,255,0.03);border:1px solid rgba(110,231,255,0.08);border-radius:14px;padding:20px;margin-bottom:14px;}" +
      "p{font-size:14px;color:#8090b0;line-height:1.8;margin:0 0 10px;}" +
      ".footer{font-size:10px;color:#506080;margin-top:40px;text-align:center;padding-top:20px;border-top:1px solid rgba(110,231,255,0.08);}" +
      "a{color:" +
      c +
      ";}</style></head><body>" +
      "<div class=badge>BRAND DNA PASSPORT</div><h1>" +
      p.nameRu +
      "</h1><h2>" +
      (p.behavior_model || "") +
      "</h2>" +
      "<p style=font-size:12px;color:#506080;>" +
      totalAns +
      "/48 questions answered</p>" +
      "<h3>DESIGN TOKENS</h3><div class=card><p><strong>Typography:</strong> " +
      (p.ui_rules ? p.ui_rules.typography : "") +
      "</p>" +
      "<p><strong>Structure:</strong> " +
      (p.ux_rules ? p.ux_rules.structure : "") +
      "</p>" +
      "<p><strong>Motion:</strong> " +
      (p.ui_rules ? p.ui_rules.motion : "") +
      "</p>" +
      "<p><strong>Visual:</strong> " +
      (p.ui_rules ? p.ui_rules.visual : "") +
      "</p></div>" +
      "<h3>TOP-3</h3><div class=card>";
    for (var i = 0; i < top3.length; i++)
      html +=
        "<p>" +
        (i + 1) +
        ". " +
        top3[i].nameRu +
        " (" +
        top3[i].sum +
        "/20)</p>";
    html +=
      "</div><div class=footer>ArchetypeOS · Elena Charlesworth<br><a href=https://t.me/Elenach_com>@Elenach_com</a> · <a href=https://elenach.com>elenach.com</a></div></body></html>";
    var b = new Blob([html], { type: "text/html" });
    var u = URL.createObjectURL(b);
    var a = document.createElement("a");
    a.href = u;
    a.download = "Brand_Passport_" + p.nameRu + ".html";
    a.click();
    setTimeout(function () {
      URL.revokeObjectURL(u);
    }, 1000);
  },
};
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    HolographicQuest.init();
  }, 400);
});
