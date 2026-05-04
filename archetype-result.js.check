// ==================== ARCHETYPE RESULT POPUP v4 ====================
// Brand Passport: Manifesto + UI Tokens + UX Logic + Codex.
// Expert conclusion, not a test result. Pentagram-style delivery.

const ArchetypeResult = {
  show(archetype, vector, answers) {
    if (!archetype) return;

    const arch =
      archetypes.find(function (a) {
        return a.id === archetype.id;
      }) || archetype;
    const theme = ArchetypeThemes[arch.id];
    const color = arch.color;
    const manifesto = this._getManifesto(arch);
    const codex = this._getCodex(arch);

    // Build the modal
    const overlay = document.createElement("div");
    overlay.className = "result-overlay";
    overlay.id = "result-overlay";
    overlay.innerHTML =
      '<div class="result-backdrop" id="result-backdrop"></div>' +
      '<div class="result-modal">' +
      '<button class="result-close" id="result-close">&times;</button>' +
      // ===== HEADER =====
      '<div class="result-header">' +
      '<div class="result-badge" style="background:' +
      color +
      "22;color:" +
      color +
      ";border:1px solid " +
      color +
      '44;">' +
      "ПАСПОРТ БРЕНДА" +
      "</div>" +
      '<h1 class="result-name" style="color:' +
      color +
      '">' +
      arch.nameRu +
      "</h1>" +
      '<p class="result-model">' +
      arch.behavior_model +
      "</p>" +
      "</div>" +
      '<div class="result-body">' +
      // ===== MANIFESTO =====
      '<div class="result-section result-section-manifesto">' +
      "<h3>📜 Манифест</h3>" +
      '<div class="result-manifesto-card" style="border-left:3px solid ' +
      color +
      ';">' +
      '<p class="result-manifesto-text">' +
      manifesto.text +
      "</p>" +
      '<div class="result-manifesto-meta">' +
      "<span><strong>Метафора:</strong> " +
      manifesto.metaphor +
      "</span>" +
      "<span><strong>Тень:</strong> " +
      manifesto.shadow +
      "</span>" +
      "</div>" +
      "</div>" +
      "</div>" +
      // ===== UI TOKENS =====
      '<div class="result-section">' +
      "<h3>🎨 UI Tokens</h3>" +
      '<div class="result-swatches">' +
      this._renderSwatches(theme) +
      "</div>" +
      '<div class="result-tokens-grid">' +
      this._renderTokenRow(
        "Скругления",
        theme.vars["--radius-sm"] +
          " / " +
          theme.vars["--radius-md"] +
          " / " +
          theme.vars["--radius-lg"],
      ) +
      this._renderTokenRow("Анимация", theme.vars["--transition-fast"]) +
      this._renderTokenRow("Свечение", theme.vars["--glow-strong"]) +
      this._renderTokenRow("Шрифты", theme.vars["--font-body"]) +
      this._renderTokenRow("Стекло", theme.vars["--bg-glass"]) +
      "</div>" +
      "</div>" +
      // ===== TYPOGRAPHY =====
      '<div class="result-section">' +
      "<h3>📝 Типографика</h3>" +
      "<p><strong>Стиль:</strong> " +
      arch.ui_rules.typography +
      "</p>" +
      "<p><strong>Шрифты:</strong> " +
      (theme.vars["--font-body"] || "Inter, Manrope") +
      "</p>" +
      "</div>" +
      // ===== UX LOGIC =====
      '<div class="result-section">' +
      "<h3>🧭 UX Logic</h3>" +
      "<p><strong>Структура:</strong> " +
      arch.ux_rules.structure +
      "</p>" +
      "<p><strong>Поведение:</strong> " +
      arch.ux_rules.behavior +
      "</p>" +
      "<p><strong>Spacing:</strong> " +
      arch.ui_rules.spacing +
      "</p>" +
      "<p><strong>Motion:</strong> " +
      arch.ui_rules.motion +
      "</p>" +
      "<p><strong>Визуальный стиль:</strong> " +
      arch.ui_rules.visual +
      "</p>" +
      "</div>" +
      // ===== CODEX =====
      '<div class="result-section">' +
      "<h3>⚖️ Кодекс бренда</h3>" +
      '<div class="result-codex">' +
      '<div class="result-codex-col result-codex-do">' +
      '<span class="result-codex-label" style="color:' +
      color +
      ';">✅ Усиливает</span>' +
      codex.do
        .map(function (item) {
          return '<span class="result-codex-item">' + item + "</span>";
        })
        .join("") +
      "</div>" +
      '<div class="result-codex-col result-codex-dont">' +
      '<span class="result-codex-label">🚫 Ослабляет</span>' +
      codex.dont
        .map(function (item) {
          return '<span class="result-codex-item">' + item + "</span>";
        })
        .join("") +
      "</div>" +
      "</div>" +
      "</div>" +
      // ===== VECTOR =====
      '<div class="result-section">' +
      "<h3>📊 4D-Вектор архетипа</h3>" +
      '<div class="result-vector">' +
      this._renderVectorBars(vector) +
      "</div>" +
      "</div>" +
      "</div>" + // .result-body
      // ===== FOOTER =====
      '<div class="result-footer">' +
      '<button class="result-btn-primary" id="result-download" style="background:' +
      color +
      ';">' +
      "📥 Скачать Brand Passport + прототип" +
      "</button>" +
      '<button class="result-btn-secondary" id="result-pivot">' +
      "🔄 Применить стиль архетипа к интерфейсу" +
      "</button>" +
      '<button class="result-btn-ghost" id="result-close-btn">' +
      "Закрыть" +
      "</button>" +
      "</div>" +
      "</div>"; // .result-modal

    document.body.appendChild(overlay);

    // Animate in
    requestAnimationFrame(function () {
      overlay.style.opacity = "1";
      overlay.querySelector(".result-modal").style.transform = "translateY(0)";
    });

    // Close handlers
    var close = function () {
      overlay.style.opacity = "0";
      overlay.querySelector(".result-modal").style.transform =
        "translateY(20px)";
      setTimeout(function () {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 400);
    };

    overlay.querySelector("#result-close").addEventListener("click", close);
    overlay.querySelector("#result-close-btn").addEventListener("click", close);
    overlay.querySelector("#result-backdrop").addEventListener("click", close);

    // Download button
    overlay
      .querySelector("#result-download")
      .addEventListener("click", function () {
        if (typeof generateSite === "function") generateSite();
        close();
      });

    // Pivot button
    overlay
      .querySelector("#result-pivot")
      .addEventListener("click", function () {
        if (typeof Pivot !== "undefined") Pivot.execute(arch.id);
        close();
      });

    console.log(
      "%c[Result] 📋 " + arch.nameRu + " — Brand Passport displayed.",
      "color:" + color + ";font-size:14px;",
    );
  },

  // ==================== MANIFESTO (экспертное заключение) ====================
  _getManifesto(arch) {
    var data = {
      hero: {
        text: "Ваш бренд — катализатор действий. Вы не продаёте продукт — вы ведёте клиента к победе. Аудитория приходит к вам не за товаром, а за силой преодолеть препятствия. Ваш голос звучит уверенно: «Ты сможешь», — и это правда, подкреплённая результатом.",
        metaphor: "Стальной клинок, рассекающий сомнения",
        shadow:
          "Высокомерие. Герой без тех, кого он ведёт — тиран. Не забывайте о команде.",
      },
      magician: {
        text: "Ваш бренд — проводник в мир возможностей. Вы трансформируете реальность клиента через инновации и магию дизайна. Люди приходят к вам за wonder — тем самым чувством, когда невозможное становится реальным.",
        metaphor: "Звёздный купол, под которым сбываются мечты",
        shadow:
          "Отрыв от реальности. Магия должна приводить к конкретным, измеримым результатам.",
      },
      ruler: {
        text: "Ваш бренд — воплощение порядка и контроля. В мире хаоса вы — остров структуры. Клиент приходит к вам за стабильностью, премиальностью и чувством принадлежности к избранному кругу. Ваше слово — закон.",
        metaphor: "Тронный зал из полированного мрамора",
        shadow:
          "Отчуждение. Власть без эмпатии становится тиранией. Премиум не значит недоступный.",
      },
      caregiver: {
        text: "Ваш бренд — источник заботы и безопасности. Вы создаёте пространство, где клиент чувствует себя защищённым и понятым. Каждое взаимодействие — акт поддержки. Ваш успех = успех клиента.",
        metaphor: "Тёплый очаг, где каждого ждут",
        shadow:
          "Самопожертвование. Забота о других не должна истощать ваш бренд. Помните о себе.",
      },
      lover: {
        text: "Ваш бренд строит глубокие эмоциональные связи. Вы пробуждаете желание, страсть и эстетическое наслаждение. Клиент не просто покупает — он влюбляется. Ваша сила — в создании intimacy.",
        metaphor: "Бархатная ночь, напоённая жасмином",
        shadow:
          "Поверхностность. Страсть без глубины быстро угасает. Красота должна быть содержательной.",
      },
      jester: {
        text: "Ваш бренд приносит радость и разрушает скуку. Вы показываете: жизнь — это игра, и в ней можно выигрывать с улыбкой. Люди приходят к вам за лёгкостью и неожиданными открытиями.",
        metaphor: "Карнавальная площадь, полная красок и смеха",
        shadow:
          "Несерьёзность. Веселье не должно подрывать доверие. Даже шут должен знать меру.",
      },
      everyman: {
        text: "Ваш бренд — свой среди своих. Вы строите принадлежность через честность и простоту. Без пафоса, без претензий. Люди узнают в вас себя — и это главная сила.",
        metaphor: "Общий стол, за которым место найдётся каждому",
        shadow:
          "Незаметность. Быть «как все» не значит быть невидимым. Найдите свою искру.",
      },
      explorer: {
        text: "Ваш бренд открывает новые горизонты. Вы — компас для тех, кто ищет приключения и аутентичность. Свобода — ваш продукт. Клиент приходит к вам, чтобы найти себя.",
        metaphor: "Бескрайний оазис под звёздным небом пустыни",
        shadow:
          "Бесцельность. Исследование ради исследования не приводит домой. Маршрут должен иметь цель.",
      },
      rebel: {
        text: "Ваш бренд ломает правила и создаёт новые. Вы — голос перемен для тех, кто задыхается в рамках. Ваша аудитория — те, кто готов к революции. Статус-кво — ваш враг.",
        metaphor: "Трещина, раскалывающая монолит",
        shadow:
          "Разрушение без созидания. Бунт должен предлагать альтернативу, а не просто хаос.",
      },
      creator: {
        text: "Ваш бренд — пространство для самовыражения. Вы даёте клиенту инструменты творить свою реальность. Каждое взаимодействие — акт созидания. Imagination is your currency.",
        metaphor: "Гончарный круг, рождающий форму из бесформенного",
        shadow:
          "Перфекционизм. Бесконечное улучшение парализует запуск. Done is better than perfect.",
      },
      sage: {
        text: "Ваш бренд — источник знаний и истины. Вы помогаете клиенту понять мир через экспертизу и ясность. Люди приходят к вам за ответами — и вы их даёте. Thinking is your product.",
        metaphor: "Библиотека, где свет пронзает пыльный воздух",
        shadow:
          "Догматизм. Знание без открытости к новому становится застоем. Будьте мудрецом, не всезнайкой.",
      },
      innocent: {
        text: "Ваш бренд возвращает веру в простые радости. В циничном мире вы — островок чистоты и надежды. Клиент приходит к вам за светом — и вы его дарите. Простота = сила.",
        metaphor: "Первый весенний цветок после долгой зимы",
        shadow:
          "Наивность. Оптимизм должен опираться на реальность, иначе он становится иллюзией.",
      },
    };
    return (
      data[arch.id] || {
        text: "Уникальный архетип бренда.",
        metaphor: "—",
        shadow: "—",
      }
    );
  },

  // ==================== CODEX (правила и анти-паттерны) ====================
  _getCodex(arch) {
    var data = {
      hero: {
        do: [
          "Резкие контрасты и чёткие CTA",
          "Социальные доказательства побед",
          "Короткий путь к цели — минимум шагов",
        ],
        dont: [
          "Размытые формулировки",
          "Длинные формы и бюрократия",
          "Пассивные состояния без прогресса",
        ],
      },
      magician: {
        do: [
          "Градиенты и частицы",
          "Reveal-анимации (появление из ничего)",
          "Метафоры трансформации",
        ],
        dont: [
          "Плоский минимализм без глубины",
          "Предсказуемые шаблоны",
          "Объяснение магии — пусть остаётся тайной",
        ],
      },
      ruler: {
        do: [
          "Симметрия и порядок",
          "Золотые/премиальные акценты",
          "Иерархическая навигация",
        ],
        dont: [
          "Асимметрия и хаос",
          "Слишком демократичный тон",
          "Избыток эмоций",
        ],
      },
      caregiver: {
        do: [
          "Органические формы, круглые углы",
          "Поддерживающие микро-тексты",
          "Тёплые зелёные/песочные тона",
        ],
        dont: [
          "Холодная, клиническая эстетика",
          "Агрессивные попапы и дедлайны",
          "Игнорирование accessibility",
        ],
      },
      lover: {
        do: [
          "Чувственная типографика с характером",
          "Глубокие, насыщенные цвета",
          "Тактильные hover-эффекты",
        ],
        dont: [
          "Безликий corporate стиль",
          "Грубые, угловатые формы",
          "Спешка — страсть требует времени",
        ],
      },
      jester: {
        do: [
          "Неожиданные микро-взаимодействия",
          "Яркие, живые цвета",
          "Игривый тон в UX-копирайтинге",
        ],
        dont: [
          "Скучные, предсказуемые лейауты",
          "Серьёзный, формальный язык",
          "Шутки ради шуток — юмор должен работать на цель",
        ],
      },
      everyman: {
        do: [
          "Честные, прямые формулировки",
          "Знакомые, интуитивные паттерны",
          "Фотографии реальных людей",
        ],
        dont: [
          "Элитарный язык и недоступность",
          "Сверх-полированный глянец",
          "Сложные абстрактные концепции",
        ],
      },
      explorer: {
        do: [
          "Просторные лейауты, много воздуха",
          "Элементы карт и навигации",
          "Природные, земляные тона",
        ],
        dont: [
          "Тесные, клаустрофобные сетки",
          "Ограничивающие рамки и правила",
          "Городской, индустриальный стиль",
        ],
      },
      rebel: {
        do: [
          "Сломанные сетки, асимметрия",
          "Высокий контраст, чёрный/красный",
          "Провокационные заголовки",
        ],
        dont: [
          "Традиционные, спокойные лейауты",
          "Нейтральная палитра",
          "Осторожный, политкорректный тон",
        ],
      },
      creator: {
        do: [
          "Пространство для самовыражения",
          "Инструменты кастомизации",
          "Вдохновляющие примеры и presets",
        ],
        dont: [
          "Жёсткие ограничения и рамки",
          "Шаблонные решения без вариативности",
          "Скудная цветовая палитра",
        ],
      },
      sage: {
        do: [
          "Чёткая информационная архитектура",
          "Данные, подкрепляющие утверждения",
          "Спокойная, аналитическая эстетика",
        ],
        dont: [
          "Эмоциональные манипуляции",
          "Поверхностный контент без глубины",
          "Кричащие цвета и анимации",
        ],
      },
      innocent: {
        do: [
          "Пастельная, светлая палитра",
          "Простые, чистые формы",
          "Позитивный, обнадёживающий тон",
        ],
        dont: [
          "Тёмные, мрачные темы",
          "Сложная навигация и скрытые смыслы",
          "Цинизм и сарказм в коммуникации",
        ],
      },
    };
    return (
      data[arch.id] || {
        do: ["Аутентичность", "Последовательность", "Качество"],
        dont: ["Хаотичность", "Непоследовательность", "Шаблонность"],
      }
    );
  },

  _getPsychProfile(arch) {
    const profiles = {
      hero: "Ваш бренд ведёт клиента к победе. Вы — катализатор действий. Люди приходят к вам за силой преодолеть препятствия. Ваша аудитория ценит решительность, прогресс и ощущение собственного могущества. Главная опасность — высокомерие: не забывайте, что герой силён только вместе с теми, кого ведёт за собой.",
      magician:
        "Ваш бренд — проводник в мир возможностей. Вы трансформируете реальность клиента. Люди приходят к вам за «магией» — инновациями, которые меняют их жизнь. Ваша аудитория ищет wonder и готова следовать за вами. Опасность — отрыв от реальности: магия должна приводить к конкретным результатам.",
      ruler:
        "Ваш бренд — воплощение порядка и контроля. Вы даёте клиенту структуру в хаотичном мире. Люди приходят к вам за стабильностью, премиальностью и чувством принадлежности к избранному кругу. Опасность — отчуждение: власть без эмпатии становится тиранией.",
      caregiver:
        "Ваш бренд — источник заботы и безопасности. Вы создаёте пространство, где клиент чувствует себя защищённым. Люди приходят к вам за поддержкой и комфортом. Опасность — самопожертвование: забота о других не должна истощать ваш бренд.",
      lover:
        "Ваш бренд строит глубокие эмоциональные связи. Вы пробуждаете желание и страсть к жизни. Люди приходят к вам за красотой, близостью и чувственными переживаниями. Опасность — поверхностность: страсть без глубины быстро угасает.",
      jester:
        "Ваш бренд приносит радость и разрушает скуку. Вы показываете, что жизнь — это игра. Люди приходят к вам за лёгкостью и неожиданными открытиями. Опасность — несерьёзность: веселье не должно подрывать доверие.",
      everyman:
        "Ваш бренд — свой среди своих. Вы строите принадлежность через честность и простоту. Люди приходят к вам, потому что узнают в вас себя. Опасность — незаметность: быть «как все» не значит быть невидимым.",
      explorer:
        "Ваш бренд открывает новые горизонты. Вы — компас для тех, кто ищет приключения. Люди приходят к вам за свободой и аутентичностью. Опасность — бесцельность: исследование ради исследования не приводит домой.",
      rebel:
        "Ваш бренд ломает правила и создаёт новые. Вы — голос перемен для тех, кто задыхается в рамках. Люди приходят к вам за освобождением. Опасность — разрушение без созидания: бунт должен предлагать альтернативу.",
      creator:
        "Ваш бренд — пространство для самовыражения. Вы даёте клиенту инструменты творить. Люди приходят к вам, чтобы создать что-то уникальное. Опасность — перфекционизм: бесконечное улучшение парализует запуск.",
      sage: "Ваш бренд — источник знаний и истины. Вы помогаете клиенту понять мир. Люди приходят к вам за экспертизой и ясностью. Опасность — догматизм: знание без открытости к новому становится застоем.",
      innocent:
        "Ваш бренд возвращает веру в простые радости. Вы — островок чистоты в циничном мире. Люди приходят к вам за надеждой и светом. Опасность — наивность: оптимизм должен опираться на реальность.",
    };
    return (
      profiles[arch.id] ||
      "Уникальный архетип бренда, сочетающий несколько измерений. Рекомендуем изучить детальный отчёт."
    );
  },

  _renderSwatches(theme) {
    var colors = [
      { label: "Фон", hex: theme.vars["--bg-deep"] },
      { label: "Акцент", hex: theme.vars["--accent-blue"] },
      { label: "Текст", hex: theme.vars["--text-primary"] },
      { label: "Свечение", hex: theme.vars["--glow-strong"] },
    ];
    return colors
      .map(function (c) {
        return (
          '<div class="result-swatch">' +
          '<div class="result-swatch-dot" style="background:' +
          c.hex +
          ';"></div>' +
          "<span>" +
          c.label +
          "</span>" +
          "<code>" +
          c.hex +
          "</code>" +
          "</div>"
        );
      })
      .join("");
  },

  _renderTokenRow(label, value) {
    return (
      '<div class="result-token-row">' +
      '<span class="result-token-label">' +
      label +
      "</span>" +
      '<code class="result-token-value">' +
      value +
      "</code>" +
      "</div>"
    );
  },

  _renderVectorBars(vector) {
    var dims = [
      { key: "control", label: "Контроль" },
      { key: "energy", label: "Энергия" },
      { key: "focus", label: "Фокус" },
      { key: "method", label: "Метод" },
    ];
    return dims
      .map(function (d) {
        return (
          '<div class="result-vector-bar">' +
          '<span class="result-vector-label">' +
          d.label +
          "</span>" +
          '<div class="result-vector-track"><div class="result-vector-fill" style="width:' +
          vector[d.key] +
          '%;background:var(--accent-blue);"></div></div>' +
          '<span class="result-vector-val">' +
          vector[d.key] +
          "</span>" +
          "</div>"
        );
      })
      .join("");
  },
};
