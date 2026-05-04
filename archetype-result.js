// ArchetypeOS Result v4.1 — minimal, reliable
var ArchetypeResult = {
  show: function (archetype, vector, answers) {
    if (!archetype) return;

    var arch = null;
    if (typeof archetypes !== "undefined") {
      for (var i = 0; i < archetypes.length; i++) {
        if (archetypes[i].id === archetype.id) {
          arch = archetypes[i];
          break;
        }
      }
    }
    if (!arch) arch = archetype;

    var theme = null;
    if (typeof ArchetypeThemes !== "undefined") {
      theme = ArchetypeThemes[arch.id];
    }
    var color = arch.color || "#c4a87c";

    // Build modal
    var overlay = document.createElement("div");
    overlay.className = "result-overlay";
    overlay.id = "result-overlay";
    overlay.innerHTML =
      "<div class='result-backdrop' id='result-backdrop'></div>" +
      "<div class='result-modal'>" +
      "<button class='result-close' id='result-close'>&times;</button>" +
      "<div class='result-header'>" +
      "<div class='result-badge' style='background:" +
      color +
      "22;color:" +
      color +
      ";border:1px solid " +
      color +
      "44;'>ПАСПОРТ БРЕНДА</div>" +
      "<h1 class='result-name' style='color:" +
      color +
      "'>" +
      arch.nameRu +
      "</h1>" +
      "<p class='result-model'>" +
      (arch.behavior_model || "") +
      "</p>" +
      "</div>" +
      "<div class='result-body'>" +
      this._section("Психологический профиль", this._psych(arch)) +
      this._section(
        "Типографика",
        "<p><strong>Стиль:</strong> " +
          (arch.ui_rules ? arch.ui_rules.typography : "") +
          "</p>",
      ) +
      this._section(
        "Структура",
        "<p><strong>UX:</strong> " +
          (arch.ux_rules ? arch.ux_rules.structure : "") +
          "</p><p><strong>Поведение:</strong> " +
          (arch.ux_rules ? arch.ux_rules.behavior : "") +
          "</p>",
      ) +
      this._section(
        "Движение",
        "<p><strong>Анимация:</strong> " +
          (arch.ui_rules ? arch.ui_rules.motion : "") +
          "</p><p><strong>Визуальный стиль:</strong> " +
          (arch.ui_rules ? arch.ui_rules.visual : "") +
          "</p>",
      ) +
      this._section("4D-Вектор", this._vectorBars(vector, color)) +
      this._section("Кодекс бренда", this._codex(arch)) +
      "</div>" +
      "<div class='result-footer'>" +
      "<button class='result-btn-primary' id='result-download' style='background:" +
      color +
      ";'>Скачать Brand Passport + прототип</button>" +
      "<button class='result-btn-secondary' id='result-pivot'>Применить стиль к интерфейсу</button>" +
      "<button class='result-btn-ghost' id='result-close-btn'>Закрыть</button>" +
      "</div>" +
      "</div>";

    document.body.appendChild(overlay);

    // Animate in
    requestAnimationFrame(function () {
      overlay.style.opacity = "1";
      var modal = overlay.querySelector(".result-modal");
      if (modal) modal.style.transform = "translateY(0)";
    });

    // Close
    var doClose = function () {
      overlay.style.opacity = "0";
      var modal = overlay.querySelector(".result-modal");
      if (modal) modal.style.transform = "translateY(20px)";
      setTimeout(function () {
        if (overlay.parentNode) overlay.remove();
      }, 400);
    };

    overlay.querySelector("#result-close").onclick = doClose;
    overlay.querySelector("#result-close-btn").onclick = doClose;
    overlay.querySelector("#result-backdrop").onclick = doClose;

    overlay.querySelector("#result-download").onclick = function () {
      if (typeof generateSite === "function") generateSite();
      doClose();
    };

    overlay.querySelector("#result-pivot").onclick = function () {
      if (typeof Pivot !== "undefined") Pivot.execute(arch.id);
      doClose();
    };

    console.log("[Result] " + arch.nameRu + " — Brand Passport displayed.");
  },

  _section: function (title, body) {
    return (
      "<div class='result-section'><h3>" + title + "</h3>" + body + "</div>"
    );
  },

  _psych: function (arch) {
    var profiles = {
      hero: "Ваш бренд ведёт клиента к победе. Вы — катализатор действий. Люди приходят к вам за силой преодолеть препятствия. Главная опасность — высокомерие.",
      magician:
        "Ваш бренд — проводник в мир возможностей. Вы трансформируете реальность клиента через инновации. Опасность — отрыв от реальности.",
      ruler:
        "Ваш бренд — воплощение порядка и контроля. Вы даёте клиенту структуру в хаотичном мире. Опасность — отчуждение.",
      caregiver:
        "Ваш бренд — источник заботы и безопасности. Клиент чувствует себя защищённым. Опасность — самопожертвование.",
      lover:
        "Ваш бренд строит глубокие эмоциональные связи. Вы пробуждаете желание и страсть. Опасность — поверхностность.",
      jester:
        "Ваш бренд приносит радость и разрушает скуку. Жизнь — это игра. Опасность — несерьёзность.",
      everyman:
        "Ваш бренд — свой среди своих. Честность и простота. Опасность — незаметность.",
      explorer:
        "Ваш бренд открывает новые горизонты. Свобода и аутентичность. Опасность — бесцельность.",
      rebel:
        "Ваш бренд ломает правила и создаёт новые. Голос перемен. Опасность — разрушение без созидания.",
      creator:
        "Ваш бренд — пространство для самовыражения. Инструменты творить. Опасность — перфекционизм.",
      sage: "Ваш бренд — источник знаний и истины. Экспертиза и ясность. Опасность — догматизм.",
      innocent:
        "Ваш бренд возвращает веру в простые радости. Чистота и надежда. Опасность — наивность.",
    };
    return (
      "<p class='result-psych'>" +
      (profiles[arch.id] || "Уникальный архетип бренда.") +
      "</p>"
    );
  },

  _vectorBars: function (vector, color) {
    var dims = [
      { key: "control", label: "Контроль" },
      { key: "energy", label: "Энергия" },
      { key: "focus", label: "Фокус" },
      { key: "method", label: "Метод" },
    ];
    var html = "";
    for (var i = 0; i < dims.length; i++) {
      var d = dims[i];
      var val = vector ? vector[d.key] || 50 : 50;
      html +=
        "<div class='result-vector-bar'>" +
        "<span class='result-vector-label'>" +
        d.label +
        "</span>" +
        "<div class='result-vector-track'><div class='result-vector-fill' style='width:" +
        val +
        "%;background:" +
        color +
        ";'></div></div>" +
        "<span class='result-vector-val'>" +
        val +
        "</span>" +
        "</div>";
    }
    return "<div class='result-vector'>" + html + "</div>";
  },

  _codex: function (arch) {
    var data = {
      hero: {
        do: "Резкие контрасты • Чёткие CTA • Социальные доказательства",
        dont: "Размытые формулировки • Длинные формы • Пассивные состояния",
      },
      magician: {
        do: "Градиенты и частицы • Reveal-анимации • Метафоры трансформации",
        dont: "Плоский минимализм • Предсказуемые шаблоны • Объяснение магии",
      },
      ruler: {
        do: "Симметрия и порядок • Золотые акценты • Иерархическая навигация",
        dont: "Асимметрия и хаос • Демократичный тон • Избыток эмоций",
      },
      caregiver: {
        do: "Органические формы • Поддерживающие тексты • Тёплые тона",
        dont: "Холодная эстетика • Агрессивные попапы • Игнорирование accessibility",
      },
      lover: {
        do: "Чувственная типографика • Насыщенные цвета • Тактильные эффекты",
        dont: "Безликий corporate стиль • Грубые формы • Спешка",
      },
      jester: {
        do: "Неожиданные взаимодействия • Яркие цвета • Игривый тон",
        dont: "Скучные лейауты • Формальный язык • Шутки ради шуток",
      },
      everyman: {
        do: "Честные формулировки • Интуитивные паттерны • Фото реальных людей",
        dont: "Элитарный язык • Сверх-полированный глянец • Сложные концепции",
      },
      explorer: {
        do: "Просторные лейауты • Элементы навигации • Природные тона",
        dont: "Тесные сетки • Ограничивающие рамки • Индустриальный стиль",
      },
      rebel: {
        do: "Сломанные сетки • Высокий контраст • Провокационные заголовки",
        dont: "Традиционные лейауты • Нейтральная палитра • Осторожный тон",
      },
      creator: {
        do: "Пространство для творчества • Кастомизация • Вдохновляющие примеры",
        dont: "Жёсткие рамки • Шаблонные решения • Скудная палитра",
      },
      sage: {
        do: "Чёткая архитектура • Данные и факты • Аналитическая эстетика",
        dont: "Эмоциональные манипуляции • Поверхностный контент • Кричащие цвета",
      },
      innocent: {
        do: "Пастельная палитра • Простые формы • Позитивный тон",
        dont: "Тёмные темы • Сложная навигация • Цинизм и сарказм",
      },
    };
    var c = data[arch.id] || {
      do: "Аутентичность • Последовательность • Качество",
      dont: "Хаотичность • Непоследовательность • Шаблонность",
    };
    return (
      "<div class='result-codex'>" +
      "<div class='result-codex-col result-codex-do'><span class='result-codex-label' style='color:" +
      (arch.color || "#c4a87c") +
      ";'>Усиливает</span><span class='result-codex-item'>" +
      c.do +
      "</span></div>" +
      "<div class='result-codex-col result-codex-dont'><span class='result-codex-label'>Ослабляет</span><span class='result-codex-item'>" +
      c.dont +
      "</span></div>" +
      "</div>"
    );
  },
};
