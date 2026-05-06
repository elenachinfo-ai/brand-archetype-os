// ArchetypeOS v8 — 12-карточный экспресс-тест. Один клик = оценка архетипа.
var HolographicQuest = {
  _scores: {}, // {id: 0..5}
  _result: false,

  tracks: [
    {
      id: "hero",
      n: "Герой",
      i: "⚔️",
      c: "#ff6b6b",
      q: "Действовать решительно, побеждать, вести за собой",
    },
    {
      id: "ruler",
      n: "Правитель",
      i: "👑",
      c: "#ffd700",
      q: "Контролировать, управлять, устанавливать стандарты",
    },
    {
      id: "magician",
      n: "Маг",
      i: "✨",
      c: "#b8a0ff",
      q: "Трансформировать, удивлять, создавать чудеса",
    },
    {
      id: "caregiver",
      n: "Заботливый",
      i: "🤲",
      c: "#4aff9e",
      q: "Заботиться, защищать, создавать безопасность",
    },
    {
      id: "lover",
      n: "Эстет",
      i: "💋",
      c: "#ff79c6",
      q: "Очаровывать, создавать красоту и близость",
    },
    {
      id: "jester",
      n: "Шут",
      i: "🎉",
      c: "#ffb86c",
      q: "Радовать, развлекать, разрушать скуку",
    },
    {
      id: "everyman",
      n: "Свой",
      i: "🤝",
      c: "#8899aa",
      q: "Быть честным, простым, своим для всех",
    },
    {
      id: "explorer",
      n: "Исследователь",
      i: "🧭",
      c: "#45e6d0",
      q: "Открывать новое, искать свободу и приключения",
    },
    {
      id: "rebel",
      n: "Бунтарь",
      i: "🔥",
      c: "#ff5555",
      q: "Ломать правила, бросать вызов, менять мир",
    },
    {
      id: "creator",
      n: "Творец",
      i: "🎨",
      c: "#9d7cd8",
      q: "Создавать, выражать себя, воплощать идеи",
    },
    {
      id: "sage",
      n: "Мудрец",
      i: "📚",
      c: "#7ec8e3",
      q: "Исследовать, понимать, находить истину",
    },
    {
      id: "innocent",
      n: "Невинный",
      i: "🌿",
      c: "#a8e6cf",
      q: "Дарить надежду, чистоту и простую радость",
    },
  ],

  init: function () {
    this._scores = {};
    for (var i = 0; i < this.tracks.length; i++)
      this._scores[this.tracks[i].id] = 0;
    this._result = false;
    this._render();
  },

  _render: function () {
    var left = document.getElementById("panel-controllers");
    if (!left) return;
    if (this._result) return this._renderResult(left);
    this._renderGrid(left);
  },

  // ==================== GRID OF 12 CARDS ====================
  _renderGrid: function (left) {
    var rated = 0;
    for (var i = 0; i < this.tracks.length; i++)
      if (this._scores[this.tracks[i].id] > 0) rated++;

    var html =
      "<div style='padding:14px;'>" +
      "<div style='display:flex;align-items:center;gap:8px;margin-bottom:10px;'>" +
      "<span style='font-size:9px;letter-spacing:0.15em;color:var(--accent-blue);'>ARCHEYPEOS</span>" +
      "<div style='flex:1;height:1px;background:rgba(110,231,255,0.12);'><div style='height:100%;width:" +
      (rated / 12) * 100 +
      "%;background:var(--accent-blue);box-shadow:0 0 4px var(--accent-blue);'></div></div>" +
      "<span style='font-size:9px;color:var(--text-tertiary);'>" +
      rated +
      "/12</span>" +
      "</div>" +
      "<p style='font-size:13px;color:var(--text-secondary);margin:0 0 4px;'>Оцените каждый архетип по шкале от 1 до 5:</p>" +
      "<p style='font-size:10px;color:var(--text-tertiary);margin:0 0 10px;'>1 — совсем не про вас • 5 — это точно вы</p>" +
      "<div style='display:flex;flex-direction:column;gap:4px;'>";

    for (var i = 0; i < this.tracks.length; i++) {
      var t = this.tracks[i];
      var s = this._scores[t.id];
      html +=
        "<div style='display:flex;align-items:center;gap:6px;padding:6px 8px;background:" +
        (s > 0 ? t.c + "10" : "transparent") +
        ";border:1px solid " +
        (s > 0 ? t.c + "22" : "rgba(110,231,255,0.06)") +
        ";border-radius:8px;transition:all 0.2s;'>" +
        "<span style='font-size:18px;width:26px;text-align:center;'>" +
        t.i +
        "</span>" +
        "<span style='flex:1;font-size:12px;font-weight:" +
        (s > 0 ? "500" : "400") +
        ";color:" +
        (s > 0 ? t.c : "var(--text-primary)") +
        ";'>" +
        t.n +
        "</span>" +
        "<span style='font-size:9px;color:var(--text-tertiary);max-width:140px;text-align:right;line-height:1.2;display:none;'>" +
        t.q +
        "</span>" +
        "<div style='display:flex;gap:3px;'>";
      for (var r = 1; r <= 5; r++) {
        html +=
          "<span class='r' data-id='" +
          t.id +
          "' data-v='" +
          r +
          "' style='width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:11px;font-weight:" +
          (s === r ? "600" : "400") +
          ";border:1px solid " +
          (s === r ? t.c : "rgba(110,231,255,0.15)") +
          ";background:" +
          (s === r ? t.c : "transparent") +
          ";color:" +
          (s === r ? "#020510" : "var(--text-tertiary)") +
          ";transition:all 0.1s;'>" +
          r +
          "</span>";
      }
      html += "</div></div>";
    }
    html +=
      "</div>" +
      "<button id='finish-btn' style='width:100%;padding:14px;margin-top:8px;background:" +
      (rated >= 4 ? "var(--accent-blue)" : "rgba(110,231,255,0.08)") +
      ";color:" +
      (rated >= 4 ? "#020510" : "var(--text-tertiary)") +
      ";border:none;border-radius:10px;font-family:inherit;font-size:14px;font-weight:500;cursor:" +
      (rated >= 4 ? "pointer" : "default") +
      ";'>" +
      (rated >= 4 ? "ПОКАЗАТЬ РЕЗУЛЬТАТ" : "Оцените хотя бы 4 архетипа") +
      "</button>" +
      "</div>";

    left.innerHTML = html;

    var self = this;
    var dots = left.querySelectorAll(".r");
    for (var d = 0; d < dots.length; d++) {
      dots[d].onclick = function () {
        var id = this.getAttribute("data-id");
        var v = parseInt(this.getAttribute("data-v"));
        if (self._scores[id] === v) {
          self._scores[id] = 0;
        } else {
          self._scores[id] = v;
        }
        self._updateVector();
        self._render();
      };
    }
    var fb = document.getElementById("finish-btn");
    if (fb && rated >= 4)
      fb.onclick = function () {
        self._result = true;
        self._render();
      };
  },

  // ==================== RESULT ====================
  _renderResult: function (left) {
    this._updateVector();
    var best = this._getBest();
    if (!best) return;
    var p = best.primary,
      c = p.color,
      icon = best.icon,
      totalAns = this._countAll();
    var top3 = this._getTop3(),
      t3html = "";
    for (var i = 0; i < top3.length; i++)
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
        "/5</span></div>";

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
      ";'>" +
      p.nameRu +
      "</div>" +
      "<div style='font-size:10px;color:var(--text-tertiary);margin-top:6px;'>" +
      (p.behavior_model || "") +
      "</div>" +
      "<div style='margin-top:10px;font-size:10px;color:var(--accent-blue);'>" +
      totalAns +
      "/12 rated</div>" +
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
    document.getElementById("restart-btn").onclick = function () {
      HolographicQuest.init();
    };
    document.getElementById("dl-btn").onclick = function () {
      HolographicQuest._download(p, top3, totalAns);
    };
  },

  _countAll: function () {
    var c = 0;
    for (var i = 0; i < this.tracks.length; i++)
      if (this._scores[this.tracks[i].id] > 0) c++;
    return c;
  },
  _getBest: function () {
    var bi = null,
      bs = -1;
    for (var i = 0; i < this.tracks.length; i++) {
      var id = this.tracks[i].id,
        s = this._scores[id];
      if (s > bs) {
        bs = s;
        bi = id;
      }
    }
    if (!bi) return null;
    var p = null,
      icon = "◈";
    if (typeof archetypes !== "undefined")
      for (var a = 0; a < archetypes.length; a++)
        if (archetypes[a].id === bi) {
          p = archetypes[a];
          break;
        }
    for (var t = 0; t < this.tracks.length; t++)
      if (this.tracks[t].id === bi) {
        icon = this.tracks[t].i;
        break;
      }
    return { primary: p, icon: icon };
  },
  _getTop3: function () {
    var r = [];
    for (var i = 0; i < this.tracks.length; i++)
      r.push({ id: this.tracks[i].id, sum: this._scores[this.tracks[i].id] });
    r.sort(function (a, b) {
      return b.sum - a.sum;
    });
    var res = [];
    for (var k = 0; k < 3 && k < r.length; k++) {
      var arch = null;
      if (typeof archetypes !== "undefined")
        for (var a = 0; a < archetypes.length; a++)
          if (archetypes[a].id === r[k].id) {
            arch = archetypes[a];
            break;
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
        s = this._scores[id];
      var inf = (s / 5) * 30;
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
      "</title><style>body{font-family:Inter,sans-serif;background:#020510;color:#e0f0ff;max-width:640px;margin:0 auto;padding:48px 24px;}h1{font-weight:200;font-size:32px;color:" +
      c +
      ";}h2{font-weight:300;font-size:16px;color:#8090b0;}h3{font-weight:500;font-size:10px;letter-spacing:0.15em;color:#506080;margin:32px 0 10px;}.badge{display:inline-block;padding:6px 16px;border:1px solid " +
      c +
      "44;border-radius:20px;font-size:9px;color:" +
      c +
      ";letter-spacing:0.15em;}.card{background:rgba(110,231,255,0.03);border:1px solid rgba(110,231,255,0.08);border-radius:14px;padding:20px;margin-bottom:14px;}p{font-size:14px;color:#8090b0;line-height:1.8;}.footer{font-size:10px;color:#506080;margin-top:40px;text-align:center;padding-top:20px;border-top:1px solid rgba(110,231,255,0.08);}a{color:" +
      c +
      ";}</style></head><body><div class=badge>BRAND DNA PASSPORT</div><h1>" +
      p.nameRu +
      "</h1><h2>" +
      (p.behavior_model || "") +
      "</h2><p style=font-size:12px;color:#506080;>" +
      totalAns +
      "/12 rated</p><h3>DESIGN TOKENS</h3><div class=card><p><strong>Typography:</strong> " +
      (p.ui_rules ? p.ui_rules.typography : "") +
      "</p><p><strong>Structure:</strong> " +
      (p.ux_rules ? p.ux_rules.structure : "") +
      "</p><p><strong>Motion:</strong> " +
      (p.ui_rules ? p.ui_rules.motion : "") +
      "</p><p><strong>Visual:</strong> " +
      (p.ui_rules ? p.ui_rules.visual : "") +
      "</p></div><h3>TOP-3</h3><div class=card>";
    for (var i = 0; i < top3.length; i++)
      html +=
        "<p>" +
        (i + 1) +
        ". " +
        top3[i].nameRu +
        " (" +
        top3[i].sum +
        "/5)</p>";
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
