// ==================== ARCHETYPE RESULT POPUP ====================
// Beautiful result modal: archetype name, psychological profile,
// visual recommendations (colors, fonts, layout, motion, effects).

const ArchetypeResult = {

  show(archetype, vector, answers) {
    if (!archetype) return;

    const arch = archetypes.find(a => a.id === archetype.id) || archetype;
    const theme = ArchetypeThemes[arch.id];
    const color = arch.color;

    // Build the modal
    const overlay = document.createElement("div");
    overlay.className = "result-overlay";
    overlay.id = "result-overlay";
    overlay.innerHTML = `
      <div class="result-backdrop" id="result-backdrop"></div>
      <div class="result-modal">
        <button class="result-close" id="result-close">&times;</button>

        <div class="result-header">
          <div class="result-badge" style="background:${color}22;color:${color};border:1px solid ${color}44;">
            ВАШ АРХЕТИП БРЕНДА
          </div>
          <h1 class="result-name" style="color:${color}">${arch.nameRu}</h1>
          <p class="result-model">${arch.behavior_model}</p>
        </div>

        <div class="result-body">
          <div class="result-section">
            <h3>🧠 Психологический профиль</h3>
            <p class="result-psych">${this._getPsychProfile(arch)}</p>
          </div>

          <div class="result-section">
            <h3>🎨 Цветовая палитра</h3>
            <div class="result-swatches">
              ${this._renderSwatches(theme)}
            </div>
          </div>

          <div class="result-section">
            <h3>📝 Типографика</h3>
            <p><strong>Стиль:</strong> ${arch.ui_rules.typography}</p>
            <p><strong>Шрифты:</strong> ${theme.vars["--font-body"]}</p>
          </div>

          <div class="result-section">
            <h3>📐 Пространство и лейаут</h3>
            <p><strong>Spacing:</strong> ${arch.ui_rules.spacing}</p>
            <p><strong>Скругления:</strong> ${theme.vars["--radius-sm"]} / ${theme.vars["--radius-md"]} / ${theme.vars["--radius-lg"]}</p>
            <p><strong>Структура:</strong> ${arch.ux_rules.structure}</p>
          </div>

          <div class="result-section">
            <h3>🎬 Анимация и движение</h3>
            <p><strong>Motion:</strong> ${arch.ui_rules.motion}</p>
            <p><strong>Кривые:</strong> ${theme.vars["--transition-fast"]} / ${theme.vars["--transition-normal"]}</p>
          </div>

          <div class="result-section">
            <h3>✨ Визуальные эффекты</h3>
            <p><strong>Стиль:</strong> ${arch.ui_rules.visual}</p>
            <p><strong>Фон:</strong> ${theme.vars["--bg-deep"]} / ${theme.vars["--bg-graphite"]}</p>
            <p><strong>Свечение:</strong> ${theme.vars["--glow-strong"]}</p>
          </div>

          <div class="result-section">
            <h3>📊 Вектор бренда</h3>
            <div class="result-vector">
              ${this._renderVectorBars(vector)}
            </div>
          </div>
        </div>

        <div class="result-footer">
          <button class="result-btn-primary" id="result-download" style="background:${color};">
            📥 Скачать руководство и прототип
          </button>
          <button class="result-btn-secondary" id="result-pivot">
            🔄 Применить стиль к интерфейсу
          </button>
          <button class="result-btn-ghost" id="result-close-btn">
            Закрыть
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Animate in
    requestAnimationFrame(() => {
      overlay.style.opacity = "1";
      overlay.querySelector(".result-modal").style.transform = "translateY(0)";
    });

    // Close handlers
    const close = () => {
      overlay.style.opacity = "0";
      overlay.querySelector(".result-modal").style.transform = "translateY(20px)";
      setTimeout(() => { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 400);
    };

    overlay.querySelector("#result-close").addEventListener("click", close);
    overlay.querySelector("#result-close-btn").addEventListener("click", close);
    overlay.querySelector("#result-backdrop").addEventListener("click", close);

    // Download button
    overlay.querySelector("#result-download").addEventListener("click", () => {
      if (typeof generateSite === "function") generateSite();
      close();
    });

    // Pivot button
    overlay.querySelector("#result-pivot").addEventListener("click", () => {
      if (typeof Pivot !== "undefined") Pivot.execute(arch.id);
      close();
    });

    console.log(`%c[Result] 📋 ${arch.nameRu} — full profile displayed.`,
      `color:${color};font-size:14px;`);
  },

  _getPsychProfile(arch) {
    const profiles = {
      hero: "Ваш бренд ведёт клиента к победе. Вы — катализатор действий. Люди приходят к вам за силой преодолеть препятствия. Ваша аудитория ценит решительность, прогресс и ощущение собственного могущества. Главная опасность — высокомерие: не забывайте, что герой силён только вместе с теми, кого ведёт за собой.",
      magician: "Ваш бренд — проводник в мир возможностей. Вы трансформируете реальность клиента. Люди приходят к вам за «магией» — инновациями, которые меняют их жизнь. Ваша аудитория ищет wonder и готова следовать за вами. Опасность — отрыв от реальности: магия должна приводить к конкретным результатам.",
      ruler: "Ваш бренд — воплощение порядка и контроля. Вы даёте клиенту структуру в хаотичном мире. Люди приходят к вам за стабильностью, премиальностью и чувством принадлежности к избранному кругу. Опасность — отчуждение: власть без эмпатии становится тиранией.",
      caregiver: "Ваш бренд — источник заботы и безопасности. Вы создаёте пространство, где клиент чувствует себя защищённым. Люди приходят к вам за поддержкой и комфортом. Опасность — самопожертвование: забота о других не должна истощать ваш бренд.",
      lover: "Ваш бренд строит глубокие эмоциональные связи. Вы пробуждаете желание и страсть к жизни. Люди приходят к вам за красотой, близостью и чувственными переживаниями. Опасность — поверхностность: страсть без глубины быстро угасает.",
      jester: "Ваш бренд приносит радость и разрушает скуку. Вы показываете, что жизнь — это игра. Люди приходят к вам за лёгкостью и неожиданными открытиями. Опасность — несерьёзность: веселье не должно подрывать доверие.",
      everyman: "Ваш бренд — свой среди своих. Вы строите принадлежность через честность и простоту. Люди приходят к вам, потому что узнают в вас себя. Опасность — незаметность: быть «как все» не значит быть невидимым.",
      explorer: "Ваш бренд открывает новые горизонты. Вы — компас для тех, кто ищет приключения. Люди приходят к вам за свободой и аутентичностью. Опасность — бесцельность: исследование ради исследования не приводит домой.",
      rebel: "Ваш бренд ломает правила и создаёт новые. Вы — голос перемен для тех, кто задыхается в рамках. Люди приходят к вам за освобождением. Опасность — разрушение без созидания: бунт должен предлагать альтернативу.",
      creator: "Ваш бренд — пространство для самовыражения. Вы даёте клиенту инструменты творить. Люди приходят к вам, чтобы создать что-то уникальное. Опасность — перфекционизм: бесконечное улучшение парализует запуск.",
      sage: "Ваш бренд — источник знаний и истины. Вы помогаете клиенту понять мир. Люди приходят к вам за экспертизой и ясностью. Опасность — догматизм: знание без открытости к новому становится застоем.",
      innocent: "Ваш бренд возвращает веру в простые радости. Вы — островок чистоты в циничном мире. Люди приходят к вам за надеждой и светом. Опасность — наивность: оптимизм должен опираться на реальность.",
    };
    return profiles[arch.id] || "Уникальный архетип бренда, сочетающий несколько измерений. Рекомендуем изучить детальный отчёт.";
  },

  _renderSwatches(theme) {
    const colors = [
      { label: "Фон", hex: theme.vars["--bg-deep"] },
      { label: "Акцент", hex: theme.vars["--accent-blue"] },
      { label: "Текст", hex: theme.vars["--text-primary"] },
      { label: "Свечение", hex: theme.vars["--glow-strong"] },
    ];
    return colors.map(c => `
      <div class="result-swatch">
        <div class="result-swatch-dot" style="background:${c.hex};"></div>
        <span>${c.label}</span>
        <code>${c.hex}</code>
      </div>
    `).join("");
  },

  _renderVectorBars(vector) {
    const dims = [
      { key: "control", label: "Контроль" },
      { key: "energy",  label: "Энергия" },
      { key: "focus",   label: "Фокус" },
      { key: "method",  label: "Метод" },
    ];
    return dims.map(d => `
      <div class="result-vector-bar">
        <span class="result-vector-label">${d.label}</span>
        <div class="result-vector-track">
          <div class="result-vector-fill" style="width:${vector[d.key]}%;background:var(--accent-blue);"></div>
        </div>
        <span class="result-vector-val">${vector[d.key]}</span>
      </div>
    `).join("");
  },
};
