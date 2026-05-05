// ArchetypeOS Diagnostic v6 — 96 statements, Likert 1-5, professional UX
// Reference: brandarchetypes.com/questionnaire/
var HolographicQuest = {
  _scores: {},
  _page: 0, // 0=intro, 1-4=pages, 5=result
  _pages: [
    {
      title: "Действие и Влияние",
      desc: "Как бренд проявляет себя на рынке",
      tracks: ["hero", "ruler", "rebel", "magician"],
    },
    {
      title: "Структура и Порядок",
      desc: "Как бренд организует процессы",
      tracks: ["ruler", "sage", "creator", "everyman"],
    },
    {
      title: "Связь и Эмоции",
      desc: "Как бренд строит отношения",
      tracks: ["caregiver", "lover", "jester", "innocent"],
    },
    {
      title: "Свобода и Творчество",
      desc: "Как бренд исследует и создаёт",
      tracks: ["explorer", "rebel", "creator", "magician"],
    },
  ],
  // All 96 statements — 12 archetypes × 8 statements each
  statements: {
    hero: [
      "Правила не созданы чтобы их нарушать",
      "Индивидуальность клиентов — ключ к процессам",
      "Информация — это сила",
      "Мы стремимся быть надёжными",
      "Нестандартное мышление ценится",
      "Ценность строится через сбор информации",
      "Безопасность команды важна",
      "Независимое мышление имеет ценность",
    ],
    ruler: [
      "Продуктивность имеет высокую ценность",
      "Мы действуем как катализатор перемен",
      "Наша команда — победители",
      "Обычное мышление не для нас",
      "Чудеса случаются",
      "Победный настрой ведёт к успеху",
      "Независимость и индивидуальность важны",
      "Мы гордимся тем что меняем жизни",
    ],
    caregiver: [
      "Дружелюбие и соседство важны",
      "Мы создаём атмосферу заботы",
      "Эмоциональный интеллект важен для команды",
      "Мозговой штурм — это весело и безопасно",
      "Справедливость — ключ к успеху",
      "Страсть к продуктам жизненно важна",
      "Люди должны наслаждаться жизнью",
      "Наша команда — casual и без претензий",
    ],
    lover: [
      "Мы заботливы и поддерживаем",
      "Креативность во всём что мы делаем",
      "Наша сила позволяет доминировать на рынке",
      "Наша суть — служить клиентам",
      "Красивый дизайн имеет высокую ценность",
      "Нас уважают в индустрии",
      "У нас есть системы заботы о клиентах",
      "Самовыражение важно для команды",
    ],
    jester: [
      "У людей есть дикая сторона",
      "Уникальность нашего имиджа — наша гордость",
      "В жизни и бизнесе есть магия",
      "Наша команда процветает на достижении целей",
      "Мы процветаем на больших рисках",
      "Наши системы гибкие и отзывчивые",
      "Мы гордимся духом соперничества",
      "Революционные идеи исходят из нашего ядра",
    ],
    everyman: [
      "Мы видим клиентов как друзей и семью",
      "Быть необычным — это нормально",
      "Наши качества: предсказуемость и стабильность",
      "Наша команда эмоционально увлечена продуктом",
      "Большинству компаний стоит расслабиться",
      "Сильная этика ведёт к успеху",
      "Романтика важна для полноты жизни",
      "Бизнес может быть весёлым и успешным",
    ],
    explorer: [
      "Исследования ведут к открытиям",
      "Системы должны быть простыми для понимания",
      "Мы поощряем клиентов находить свой путь",
      "Мы поддерживаем постоянное обучение",
      "Мы даём ясные системы сотрудникам и клиентам",
      "Мы помогаем людям чувствовать себя уникальными",
      "Экспертиза критична для успеха",
      "Простые семейные ценности важны",
    ],
    rebel: [
      "Смелость в нашем ядре",
      "Мы создали простые для понимания системы",
      "Эмоциональный интеллект важен для команды",
      "Мозговой штурм — весело и безопасно",
      "Справедливость к клиентам и команде — ключ",
      "Страсть к продуктам жизненно важна",
      "Люди должны наслаждаться жизнью",
      "Наша команда — без претензий",
    ],
    creator: [
      "Мы ценим креативность во всём",
      "Наша сила позволяет нам доминировать",
      "Наша суть — служить клиентам",
      "Красивый дизайн продуктов имеет ценность",
      "Нас уважают и признают в индустрии",
      "У нас есть системы заботы о клиентах",
      "Самовыражение важно для здоровой команды",
      "Наша команда задаёт новые направления",
    ],
    sage: [
      "Знания и образование — наши ценности",
      "Люди с духом приключений вдохновляют",
      "Мы гордимся продуманными системами",
      "Мы ассоциируемся с добром и чистотой",
      "Нетворкинг жизненно важен",
      "Наш опыт и мудрость — важные активы",
      "Хаос в бизнесе нужно избегать",
      "Мы награждаем первопроходцев",
    ],
    innocent: [
      "Надёжность во всём",
      "Клиенты должны чувствовать себя особенными",
      "Наша команда — бесстрашные мыслители",
      "Мы избегаем жаргона и говорим понятно",
      "Наши клиенты — особенные люди",
      "Рабочее место полно энергии и веселья",
      "Смелость в нашем ядре",
      "Мы построили понятные системы",
    ],
    magician: [
      "Чудеса могут случаться",
      "Победный настрой ведёт к успеху",
      "Независимость и индивидуальность важны",
      "Мы гордимся трансформацией жизней клиентов",
      "Наша команда встречает все вызовы",
      "Радикальные идеи оживляют команду",
      "Будущее полно безграничных возможностей",
      "Эффективность критична для команды",
    ],
  },

  init: function () {
    this._scores = {};
    var ids = [
      "hero",
      "ruler",
      "caregiver",
      "lover",
      "jester",
      "everyman",
      "explorer",
      "rebel",
      "creator",
      "sage",
      "innocent",
      "magician",
    ];
    for (var i = 0; i < ids.length; i++) {
      this._scores[ids[i]] = [0, 0, 0, 0, 0, 0, 0, 0];
    }
    this._page = 0;
    this._render();
  },

  _render: function () {
    var left = document.getElementById("panel-controllers");
    if (!left) return;
    if (this._page === 0) this._renderIntro(left);
    else if (this._page <= 4) this._renderPage(left);
    else this._renderResult(left);
  },

  // ==================== INTRO ====================
  _renderIntro: function (left) {
    left.innerHTML =
      "<div style='padding:32px 24px;'>" +
      "<div style='font-size:11px;font-weight:600;letter-spacing:0.15em;color:var(--accent-blue);margin-bottom:16px;'>ARCHEYPEOS</div>" +
      "<h2 style='font-weight:300;font-size:22px;color:var(--text-primary);margin:0 0 8px;line-height:1.3;'>Диагностика ДНК бренда</h2>" +
      "<p style='font-size:15px;color:var(--text-secondary);line-height:1.6;margin:0 0 24px;'>96 утверждений • 12 архетипов • 4 страницы</p>" +
      "<div style='background:rgba(255,255,255,0.02);border:1px solid var(--border-subtle);border-radius:12px;padding:16px;margin-bottom:20px;'>" +
      "<p style='font-size:13px;color:var(--text-secondary);line-height:1.7;margin:0 0 12px;'>Оцените каждое утверждение по шкале от 1 до 5:</p>" +
      "<div style='display:flex;flex-direction:column;gap:6px;'>" +
      "<div style='display:flex;align-items:center;gap:8px;'><span style='width:16px;height:16px;border-radius:50%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);display:inline-block;'></span><span style='font-size:13px;color:var(--text-tertiary);'>1 — Почти никогда</span></div>" +
      "<div style='display:flex;align-items:center;gap:8px;'><span style='width:16px;height:16px;border-radius:50%;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);display:inline-block;'></span><span style='font-size:13px;color:var(--text-tertiary);'>2 — Редко</span></div>" +
      "<div style='display:flex;align-items:center;gap:8px;'><span style='width:16px;height:16px;border-radius:50%;background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.25);display:inline-block;'></span><span style='font-size:13px;color:var(--text-tertiary);'>3 — Иногда</span></div>" +
      "<div style='display:flex;align-items:center;gap:8px;'><span style='width:16px;height:16px;border-radius:50%;background:var(--accent-blue);opacity:0.6;border:1px solid var(--accent-blue);display:inline-block;'></span><span style='font-size:13px;color:var(--text-tertiary);'>4 — Обычно</span></div>" +
      "<div style='display:flex;align-items:center;gap:8px;'><span style='width:16px;height:16px;border-radius:50%;background:var(--accent-blue);border:1px solid var(--accent-blue);display:inline-block;'></span><span style='font-size:13px;color:var(--text-tertiary);'>5 — Почти всегда</span></div>" +
      "</div>" +
      "</div>" +
      "<p style='font-size:12px;color:var(--text-tertiary);line-height:1.7;margin:0 0 20px;'>Важно: низкие оценки — это нормально. Широкий разброс ответов помогает точнее определить архетип. Если большинство ответов 4–5, вернитесь и проверьте — возможно, вы слишком строги к себе.</p>" +
      "<button id='start-btn' style='width:100%;padding:16px;background:var(--accent-blue);color:#fff;border:none;border-radius:10px;font-family:inherit;font-size:15px;font-weight:500;cursor:pointer;'>Начать диагностику</button>" +
      "</div>";
    document.getElementById("start-btn").onclick = function () {
      HolographicQuest._page = 1;
      HolographicQuest._render();
    };
  },

  // ==================== QUESTION PAGE ====================
  _renderPage: function (left) {
    var page = this._pages[this._page - 1];
    var allStmts = [];
    for (var t = 0; t < page.tracks.length; t++) {
      var tid = page.tracks[t];
      var stmts = this.statements[tid];
      for (var s = 0; s < stmts.length; s++) {
        allStmts.push({ trackId: tid, index: s, text: stmts[s] });
      }
    }

    var totalAnswered = 0;
    for (var i = 0; i < allStmts.length; i++) {
      if (this._scores[allStmts[i].trackId][allStmts[i].index] > 0)
        totalAnswered++;
    }
    var total = allStmts.length;
    var progress = total > 0 ? Math.round((totalAnswered / total) * 100) : 0;

    var html = "";
    // Header
    html +=
      "<div style='padding:20px 20px 0;'>" +
      "<div style='display:flex;align-items:center;gap:8px;margin-bottom:6px;'>" +
      "<span style='font-size:10px;font-weight:600;letter-spacing:0.12em;color:var(--accent-blue);'>СТРАНИЦА " +
      this._page +
      "/4</span>" +
      "<span style='margin-left:auto;font-size:10px;color:var(--text-tertiary);'>" +
      totalAnswered +
      "/" +
      total +
      "</span>" +
      "</div>" +
      "<h3 style='font-weight:300;font-size:18px;color:var(--text-primary);margin:0 0 4px;'>" +
      page.title +
      "</h3>" +
      "<p style='font-size:12px;color:var(--text-tertiary);margin:0 0 10px;'>" +
      page.desc +
      "</p>" +
      "<div style='height:2px;background:rgba(255,255,255,0.06);border-radius:1px;margin-bottom:4px;'>" +
      "<div style='height:100%;width:" +
      progress +
      "%;background:var(--accent-blue);border-radius:1px;transition:width 0.3s;'></div>" +
      "</div>" +
      "<div style='display:flex;justify-content:space-between;font-size:9px;color:var(--text-tertiary);padding:2px 0 12px;'>" +
      "<span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>" +
      "</div>" +
      "</div>";

    // Statements
    html += "<div style='padding:0 20px;'>";
    for (var i = 0; i < allStmts.length; i++) {
      var stmt = allStmts[i];
      var score = this._scores[stmt.trackId][stmt.index];
      // Find track color
      var tcolor = "#c4a87c";
      for (var tt = 0; tt < page.tracks.length; tt++) {
        if (page.tracks[tt] === stmt.trackId) {
          // Find in our tracks array
          if (typeof archetypes !== "undefined") {
            for (var aa = 0; aa < archetypes.length; aa++) {
              if (archetypes[aa].id === stmt.trackId) {
                tcolor = archetypes[aa].color;
                break;
              }
            }
          }
          break;
        }
      }

      html +=
        "<div style='display:flex;align-items:center;gap:10px;padding:10px 8px;border-bottom:1px solid rgba(255,255,255,0.04);' + (i % 2 === 0 ? 'background:rgba(255,255,255,0.015);' : '') + '>" +
        "<span style='flex:1;font-size:15px;color:var(--text-primary);line-height:1.4;'>" +
        stmt.text +
        "</span>" +
        "<div style='display:flex;gap:6px;flex-shrink:0;'>";
      for (var r = 1; r <= 5; r++) {
        var active = score === r;
        html +=
          "<span class='score-btn' data-track='" +
          stmt.trackId +
          "' data-idx='" +
          stmt.index +
          "' data-val='" +
          r +
          "' " +
          "style='width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;" +
          "border:1px solid " +
          (active ? tcolor : "rgba(255,255,255,0.1)") +
          ";" +
          "background:" +
          (active ? tcolor : "transparent") +
          ";" +
          "color:" +
          (active ? "#fff" : "var(--text-tertiary)") +
          ";" +
          "font-size:12px;cursor:pointer;transition:all 0.15s;'>" +
          r +
          "</span>";
      }
      html += "</div></div>";
    }
    html += "</div>";

    // Navigation
    html += "<div style='display:flex;gap:8px;padding:16px 20px;position:sticky;bottom:0;background:var(--bg-panel);border-top:1px solid var(--border-subtle);z-index:5;'>";
    if (this._page > 1) {
      html +=
        "<button id='prev-btn' style='flex:1;padding:14px;background:rgba(255,255,255,0.03);border:1px solid var(--border-subtle);border-radius:8px;color:var(--text-secondary);font-family:inherit;font-size:14px;cursor:pointer;'>← Назад</button>";
    }
    var canProceed = true;
    html +=
      "<button id='next-btn' style='flex:1;padding:14px;border-radius:8px;font-family:inherit;font-size:14px;cursor:" +
      (canProceed ? "pointer" : "default") +
      ";" +
      "background:" +
      (canProceed ? "var(--accent-blue)" : "rgba(255,255,255,0.03)") +
      ";" +
      "color:" +
      (canProceed ? "#fff" : "var(--text-tertiary)") +
      ";" +
      "border:1px solid " +
      (canProceed ? "var(--accent-blue)" : "var(--border-subtle)") +
      ";'>" +
      (this._page === 4 ? "Результат →" : "Далее →") +
      "</button>";
    html += "</div>";

    left.innerHTML = html;

    // Bind score buttons
    var self = this;
    var btns = left.querySelectorAll(".score-btn");
    for (var b = 0; b < btns.length; b++) {
      btns[b].onclick = function (e) {
        e.stopPropagation();
        var tid = this.getAttribute("data-track");
        var idx = parseInt(this.getAttribute("data-idx"));
        var val = parseInt(this.getAttribute("data-val"));
        if (self._scores[tid][idx] === val) {
          self._scores[tid][idx] = 0;
        } else {
          self._scores[tid][idx] = val;
        }
        self._render();
        self._updateVisualization();
      };
    }

    // Navigation
    var prev = document.getElementById("prev-btn");
    if (prev)
      prev.onclick = function () {
        self._page--;
        self._render();
      };
    var next = document.getElementById("next-btn");
    if (next && canProceed)
      next.onclick = function () {
        if (self._page >= 4) {
          self._page = 5;
          self._render();
        } else {
          self._page++;
          self._render();
        }
      };
  },

  // ==================== RESULT ====================
    _renderResult: function (left) {
    this._updateVisualization();
    var best = this._getBest();
    if (!best) return;

    var p = best.primary;
    var c = p.color;
    var icon = best.icon;
    var totalAns = this._countAll();
    var maxAns = 96;

    var accuracyNote = "";
    if (totalAns < 24) accuracyNote = "Low accuracy — answer more questions for reliable results";
    else if (totalAns < 48) accuracyNote = "Medium accuracy — we recommend answering at least half";
    else if (totalAns < 72) accuracyNote = "Good accuracy — result is close to real brand profile";
    else accuracyNote = "High accuracy — brand DNA profile is reliably determined";

    var top3 = this._getTop3();
    var t3html = "";
    for (var i = 0; i < top3.length; i++) {
      t3html += "<div style='display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04);'>" +
        "<span style='font-size:14px;color:" + top3[i].color + ";font-weight:600;min-width:20px;'>" + (i+1) + "</span>" +
        "<span style='flex:1;font-size:15px;color:var(--text-primary);font-weight:400;'>" + top3[i].nameRu + "</span>" +
        "<span style='font-size:12px;color:var(--text-tertiary);'>" + top3[i].sum + "/40</span></div>";
    }

    var dims = ["control","energy","focus","method"];
    var labs = { control:"Control", energy:"Energy", focus:"Focus", method:"Method" };
    var vhtml = "";
    for (var v = 0; v < dims.length; v++) {
      var dv = dims[v];
      var val = (typeof userVector !== "undefined") ? userVector[dv] : 50;
      vhtml += "<div style='display:flex;align-items:center;gap:10px;margin-bottom:5px;'>" +
        "<span style='font-size:12px;color:var(--text-secondary);width:70px;font-weight:400;'>" + labs[dv] + "</span>" +
        "<div style='flex:1;height:5px;background:rgba(255,255,255,0.05);border-radius:3px;overflow:hidden;'>" +
          "<div style='height:100%;width:" + val + "%;background:" + c + ";border-radius:3px;box-shadow:0 0 8px " + c + "44;'></div></div>" +
        "<span style='font-size:12px;color:var(--text-primary);font-weight:500;min-width:28px;text-align:right;'>" + val + "</span></div>";
    }

    left.innerHTML =
      "<div style='padding:20px;'>" +
        "<div style='text-align:center;padding:28px 20px 20px;border:1px solid " + c + "33;border-radius:20px;margin-bottom:16px;background:linear-gradient(180deg, " + c + "10 0%, transparent 100%);position:relative;overflow:hidden;'>" +
          "<div style='position:absolute;top:10px;left:50%;transform:translateX(-50%);font-size:8px;letter-spacing:0.2em;color:var(--text-tertiary);'>ARCHEYPEOS</div>" +
          "<div style='font-size:52px;margin:8px 0 12px;filter:drop-shadow(0 0 20px " + c + "44);'>" + icon + "</div>" +
          "<div style='font-size:26px;font-weight:200;color:" + c + ";letter-spacing:-0.01em;margin-bottom:6px;'>" + p.nameRu + "</div>" +
          "<div style='font-size:11px;color:var(--text-tertiary);letter-spacing:0.05em;margin-bottom:4px;'>" + (p.behavior_model || "") + "</div>" +
          "<div style='margin-top:12px;display:inline-block;padding:6px 14px;border-radius:20px;background:" + c + "18;border:1px solid " + c + "33;font-size:11px;color:" + c + ";" + totalAns + " / " + maxAns + " answered</div>" +
        "</div>" +
        "<div style='background:rgba(255,255,255,0.02);border:1px solid var(--border-subtle);border-radius:10px;padding:10px 14px;margin-bottom:14px;font-size:11px;color:var(--text-tertiary);line-height:1.5;text-align:center;'>" + accuracyNote + "</div>" +
        "<div style='font-size:9px;font-weight:600;letter-spacing:0.12em;color:var(--text-tertiary);margin-bottom:6px;text-transform:uppercase;'>TOP-3 ARCHETYPES</div>" +
        "<div style='background:rgba(255,255,255,0.02);border:1px solid var(--border-subtle);border-radius:12px;padding:4px 14px;margin-bottom:16px;'>" + t3html + "</div>" +
        "<div style='font-size:9px;font-weight:600;letter-spacing:0.12em;color:var(--text-tertiary);margin-bottom:6px;text-transform:uppercase;'>4D BRAND VECTOR</div>" +
        "<div style='background:rgba(255,255,255,0.02);border:1px solid var(--border-subtle);border-radius:12px;padding:12px 14px;margin-bottom:16px;'>" + vhtml + "</div>" +
        "<button id='dl-btn' style='width:100%;padding:15px;background:" + c + ";color:#fff;border:none;border-radius:12px;font-family:inherit;font-size:15px;font-weight:500;cursor:pointer;margin-bottom:6px;'>Download Brand Passport</button>" +
        "<a href='https://t.me/Elenach_com' target='_blank' style='display:block;width:100%;padding:13px;background:rgba(255,255,255,0.03);border:1px solid var(--border-mid);border-radius:10px;color:var(--text-secondary);font-family:inherit;font-size:14px;text-align:center;text-decoration:none;margin-bottom:6px;'>@Elenach_com</a>" +
        "<a href='https://elenach.com' target='_blank' style='display:block;width:100%;padding:13px;background:rgba(255,255,255,0.02);border:1px solid var(--border-subtle);border-radius:10px;color:var(--text-tertiary);font-family:inherit;font-size:13px;text-align:center;text-decoration:none;margin-bottom:6px;'>elenach.com</a>" +
        "<button id='restart-btn' style='width:100%;padding:10px;background:transparent;border:none;color:var(--text-tertiary);font-family:inherit;font-size:12px;cursor:pointer;'>Restart</button>" +
      "</div>";

    var self = this;
    document.getElementById("restart-btn").onclick = function() { HolographicQuest.init(); };
    document.getElementById("dl-btn").onclick = function() { self._download(p, top3, totalAns, maxAns); };
  },  _countAll: function() {
    var cnt = 0;
    for (var id in this._scores) {
      for (var i = 0; i < 8; i++) { if (this._scores[id][i] > 0) cnt++; }
    }
    return cnt;
  },

  _getBest: function () {
    var bestId = null,
      bestSum = -1;
    for (var id in this._scores) {
      var sum = 0;
      for (var i = 0; i < 8; i++) sum += this._scores[id][i];
      if (sum > bestSum) {
        bestSum = sum;
        bestId = id;
      }
    }
    if (!bestId) return null;
    var primary = null,
      icon = "◈";
    if (typeof archetypes !== "undefined") {
      for (var a = 0; a < archetypes.length; a++) {
        if (archetypes[a].id === bestId) {
          primary = archetypes[a];
          break;
        }
      }
    }
    return { primary: primary, icon: icon, sum: bestSum };
  },

  _getTop3: function () {
    var ranked = [];
    for (var id in this._scores) {
      var s = 0;
      for (var i = 0; i < 8; i++) s += this._scores[id][i];
      ranked.push({ id: id, sum: s });
    }
    ranked.sort(function (a, b) {
      return b.sum - a.sum;
    });
    var r = [];
    for (var i = 0; i < 3 && i < ranked.length; i++) {
      var arch = null;
      if (typeof archetypes !== "undefined") {
        for (var a = 0; a < archetypes.length; a++) {
          if (archetypes[a].id === ranked[i].id) {
            arch = archetypes[a];
            break;
          }
        }
      }
      if (arch)
        r.push({ nameRu: arch.nameRu, color: arch.color, sum: ranked[i].sum });
    }
    return r;
  },

  _updateVisualization: function () {
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
    for (var id in this._scores) {
      var sum = 0;
      for (var i = 0; i < 8; i++) sum += this._scores[id][i];
      var inf = (sum / 40) * 30;
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

  _download: function (primary, top3, totalAns, maxAns) {
    var c = primary.color;
    var recs = {
      hero: {
        do: "Резкие контрасты • Чёткие CTA • Соцдоказательства",
        dont: "Размытость • Длинные формы • Пассив",
      },
      ruler: {
        do: "Симметрия • Золото • Иерархия",
        dont: "Асимметрия • Демократичность • Эмоции",
      },
      caregiver: {
        do: "Органика • Тепло • Поддержка",
        dont: "Холод • Агрессия • Игнор accessibility",
      },
      lover: {
        do: "Чувственность • Насыщенность • Тактильность",
        dont: "Безликость • Грубость • Спешка",
      },
      jester: {
        do: "Неожиданность • Яркость • Игра",
        dont: "Скука • Формальность • Шутки ради шуток",
      },
      everyman: {
        do: "Честность • Интуитивность • Фото людей",
        dont: "Элитарность • Глянец • Сложность",
      },
      explorer: {
        do: "Простор • Природа • Навигация",
        dont: "Теснота • Ограничения • Индустрия",
      },
      rebel: {
        do: "Асимметрия • Контраст • Провокация",
        dont: "Традиция • Нейтральность • Осторожность",
      },
      creator: {
        do: "Свобода • Кастомизация • Вдохновение",
        dont: "Рамки • Шаблоны • Скудость",
      },
      sage: {
        do: "Структура • Данные • Аналитика",
        dont: "Манипуляции • Поверхность • Крик",
      },
      innocent: {
        do: "Пастель • Простота • Позитив",
        dont: "Тьма • Сложность • Цинизм",
      },
      magician: {
        do: "Градиенты • Reveal • Метафоры",
        dont: "Плоскость • Шаблоны • Объяснения",
      },
    };
    var r = recs[primary.id] || { do: "Аутентичность", dont: "Хаос" };
    var html =
      "<!doctype html><html lang='ru'><head><meta charset='UTF-8'><title>Brand Passport — " +
      primary.nameRu +
      "</title>" +
      "<style>body{font-family:Manrope,Inter,sans-serif;background:#0a0a0e;color:#e8e6e0;max-width:640px;margin:0 auto;padding:48px 24px;}" +
      "h1{font-weight:300;font-size:32px;color:" +
      c +
      ";margin:0 0 4px;}h2{font-weight:300;font-size:18px;color:#9a9890;margin:0 0 28px;}" +
      "h3{font-weight:500;font-size:11px;letter-spacing:0.12em;color:#6a6860;margin:32px 0 10px;text-transform:uppercase;}" +
      ".badge{display:inline-block;padding:6px 16px;border:1px solid " +
      c +
      "44;border-radius:20px;font-size:10px;color:" +
      c +
      ";letter-spacing:0.1em;margin-bottom:16px;}" +
      ".card{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:20px;margin-bottom:14px;}" +
      "p{font-size:14px;color:#9a9890;line-height:1.8;margin:0 0 10px;}li{font-size:14px;color:#9a9890;line-height:1.7;}" +
      ".footer{font-size:10px;color:#6a6860;margin-top:40px;text-align:center;padding-top:20px;border-top:1px solid rgba(255,255,255,0.05);}" +
      "a{color:" +
      c +
      ";}</style></head><body>" +
      "<div class='badge'>BRAND DNA PASSPORT</div><h1>" +
      primary.nameRu +
      "</h1><h2>" +
      (primary.behavior_model || "") +
      "</h2>" +
      "<h3>Психологический профиль</h3><div class='card'><p>" +
      (primary.ux_rules ? primary.ux_rules.behavior : "") +
      "</p></div>" +
      "<h3>Дизайн-рекомендации</h3><div class='card'><p><strong>Типографика:</strong> " +
      (primary.ui_rules ? primary.ui_rules.typography : "") +
      "</p>" +
      "<p><strong>Структура:</strong> " +
      (primary.ux_rules ? primary.ux_rules.structure : "") +
      "</p>" +
      "<p><strong>Анимация:</strong> " +
      (primary.ui_rules ? primary.ui_rules.motion : "") +
      "</p>" +
      "<p><strong>Стиль:</strong> " +
      (primary.ui_rules ? primary.ui_rules.visual : "") +
      "</p></div>" +
      "<h3>Усиливает архетип</h3><div class='card'><p>" +
      r.do +
      "</p></div>" +
      "<h3>Ослабляет архетип</h3><div class='card'><p>" +
      r.dont +
      "</p></div>" +
      "<div class='footer'>ArchetypeOS • Elena Charlesworth<br><a href='https://t.me/Elenach_com'>@Elenach_com</a></div></body></html>";
    var b = new Blob([html], { type: "text/html" });
    var u = URL.createObjectURL(b);
    var a = document.createElement("a");
    a.href = u;
    a.download = "Brand_Passport_" + primary.nameRu + ".html";
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
