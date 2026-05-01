/* ============================================================
   Brand Archetype OS — Application Engine
   ============================================================
   Содержит:
   - Состояние приложения (userVector, currentLayer, dragTarget, isDragging)
   - Математическую модель (calculateDistance, getRankings)
   - Обновление UI (updateUI, updateConstruction, updatePreview, updateResultOutput)
   - Текстовый движок (getHeroText, getHeroSubtext, getCTAText)
   - Навигацию по слоям (goToLayer)
   - Drag-взаимодействия (поле + кривые, mouse + touch)
   - Управление зонами влияния (updateZoneInfluences)
   - Подсветку компонентов (highlightComponent)
   - Генерацию сайта (generateSite)
   - Инициализацию
   ============================================================ */

// ==================== STATE ====================
let userVector = { control: 50, energy: 50, focus: 50, method: 50 };
let currentLayer = 0;
let dragTarget = null;
let isDragging = false;

// ==================== DISTANCE CALCULATION ====================
function calculateDistance(user, archetype) {
  return (
    Math.abs(user.control - archetype.vector.control) *
      archetype.weights.control +
    Math.abs(user.energy - archetype.vector.energy) * archetype.weights.energy +
    Math.abs(user.focus - archetype.vector.focus) * archetype.weights.focus +
    Math.abs(user.method - archetype.vector.method) * archetype.weights.method
  );
}

function getRankings() {
  const ranked = archetypes
    .map((a) => ({
      ...a,
      distance: calculateDistance(userVector, a),
    }))
    .sort((a, b) => a.distance - b.distance);

  return {
    primary: ranked[0],
    secondary: ranked[1],
    conflict: ranked[ranked.length - 1],
    all: ranked,
  };
}

// ==================== UI UPDATES ====================
function updateUI() {
  const rankings = getRankings();
  const { primary, secondary, conflict } = rankings;

  // Update nav
  document.getElementById("current-archetype").textContent = primary.nameRu;

  // Update field feedback
  document.getElementById("field-primary").textContent = primary.nameRu;
  document.getElementById("field-conflict").textContent = conflict.nameRu;
  const confidence = Math.max(0, 100 - primary.distance / 3);
  document.getElementById("field-confidence").style.width = confidence + "%";

  // Update synthesis values
  document.getElementById("val-control").textContent = Math.round(
    userVector.control,
  );
  document.getElementById("val-energy").textContent = Math.round(
    userVector.energy,
  );
  document.getElementById("val-focus").textContent = Math.round(
    userVector.focus,
  );
  document.getElementById("val-method").textContent = Math.round(
    userVector.method,
  );

  document.getElementById("vec-control").textContent = Math.round(
    userVector.control,
  );
  document.getElementById("vec-energy").textContent = Math.round(
    userVector.energy,
  );
  document.getElementById("vec-focus").textContent = Math.round(
    userVector.focus,
  );
  document.getElementById("vec-method").textContent = Math.round(
    userVector.method,
  );

  // Update morph shape
  const morphShape = document.getElementById("morph-shape");
  morphShape.style.background = `linear-gradient(135deg,
        hsl(${primary.color}, 20%, 90%),
        hsl(${secondary.color}, 20%, 95%))`;
  document.getElementById("morph-label").textContent =
    `${primary.nameRu} + ${secondary.nameRu}`;

  // Update ranking
  const rankingContainer = document.getElementById("archetype-ranking");
  rankingContainer.innerHTML = rankings.all
    .slice(0, 5)
    .map(
      (a, i) => `
        <div class="flex items-center gap-4">
            <div class="w-8 text-right text-sm text-gray-400">${i + 1}</div>
            <div class="flex-1">
                <div class="flex justify-between mb-1">
                    <span class="text-sm font-medium">${a.nameRu}</span>
                    <span class="text-xs text-gray-400">${Math.round(100 - a.distance / 4)}%</span>
                </div>
                <div class="rank-bar">
                    <div class="rank-fill" style="width: ${Math.max(5, 100 - a.distance / 4)}%; background: ${a.color}"></div>
                </div>
            </div>
        </div>
    `,
    )
    .join("");

  // Update construction layer
  updateConstruction(rankings);
}

function updateConstruction(rankings) {
  const { primary, secondary } = rankings;

  // Components library
  const components = [
    { name: "Hero Section", type: "hero" },
    { name: "Navigation", type: "nav" },
    { name: "Content Block", type: "content" },
    { name: "CTA Button", type: "cta" },
    { name: "Footer", type: "footer" },
    { name: "Card Grid", type: "cards" },
  ];

  document.getElementById("components-library").innerHTML = components
    .map(
      (c) => `
        <div class="component-card glass rounded-xl p-4 cursor-pointer" onclick="highlightComponent('${c.type}')">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background: ${primary.color}15">
                    <div class="w-4 h-4 rounded" style="background: ${primary.color}"></div>
                </div>
                <div>
                    <div class="text-sm font-medium">${c.name}</div>
                    <div class="text-xs text-gray-400">${primary.nameRu} стиль</div>
                </div>
            </div>
        </div>
    `,
    )
    .join("");

  // Rules engine
  document.getElementById("rules-engine").innerHTML = `
        <div class="space-y-4">
            <div>
                <div class="text-xs text-gray-400 uppercase tracking-wider mb-2">Поведение</div>
                <div class="text-sm leading-relaxed">${primary.behavior_model}</div>
            </div>
            <div>
                <div class="text-xs text-gray-400 uppercase tracking-wider mb-2">UX Структура</div>
                <div class="text-sm leading-relaxed">${primary.ux_rules.structure}</div>
            </div>
            <div>
                <div class="text-xs text-gray-400 uppercase tracking-wider mb-2">Типографика</div>
                <div class="text-sm leading-relaxed">${primary.ui_rules.typography}</div>
            </div>
            <div>
                <div class="text-xs text-gray-400 uppercase tracking-wider mb-2">Motion</div>
                <div class="text-sm leading-relaxed">${primary.ui_rules.motion}</div>
            </div>
        </div>
    `;

  // Live preview
  updatePreview(primary, secondary);

  // Result output
  updateResultOutput(rankings);
}

function updatePreview(primary, secondary) {
  const preview = document.getElementById("live-preview");
  const accentColor = primary.color;

  preview.innerHTML = `
        <div class="h-full flex flex-col" style="color: #1a1a1a;">
            <!-- Nav -->
            <div class="flex justify-between items-center py-4 border-b" style="border-color: ${accentColor}20">
                <div class="text-lg font-medium tracking-tight">Brand</div>
                <div class="flex gap-6 text-sm text-gray-500">
                    <span>О нас</span>
                    <span>Услуги</span>
                    <span>Контакты</span>
                </div>
            </div>

            <!-- Hero -->
            <div class="py-16 text-center">
                <div class="inline-block px-4 py-1 rounded-full text-xs mb-6" style="background: ${accentColor}15; color: ${accentColor}">
                    ${primary.nameRu} Архетип
                </div>
                <h1 class="text-4xl text-thin mb-4 leading-tight">
                    ${getHeroText(primary.id)}
                </h1>
                <p class="text-gray-500 max-w-md mx-auto mb-8 text-light">
                    ${getHeroSubtext(primary.id)}
                </p>
                <button class="px-8 py-3 rounded-xl text-white text-sm" style="background: ${accentColor}">
                    ${getCTAText(primary.id)}
                </button>
            </div>

            <!-- Content blocks -->
            <div class="grid grid-cols-2 gap-4 flex-1">
                <div class="rounded-2xl p-6" style="background: ${accentColor}08">
                    <div class="w-12 h-12 rounded-xl mb-4" style="background: ${accentColor}20"></div>
                    <div class="text-sm font-medium mb-2">${primary.ux_rules.structure.split(",")[0]}</div>
                    <div class="text-xs text-gray-400 leading-relaxed">${primary.ui_rules.visual}</div>
                </div>
                <div class="rounded-2xl p-6" style="background: ${secondary.color}08">
                    <div class="w-12 h-12 rounded-xl mb-4" style="background: ${secondary.color}20"></div>
                    <div class="text-sm font-medium mb-2">${secondary.ux_rules.structure.split(",")[0]}</div>
                    <div class="text-xs text-gray-400 leading-relaxed">${secondary.ui_rules.visual}</div>
                </div>
            </div>

            <!-- Footer CTA -->
            <div class="mt-8 p-6 rounded-2xl text-center" style="background: ${accentColor}10">
                <div class="text-sm font-medium mb-2">${primary.behavior_model.split(" → ").pop()}</div>
                <div class="text-xs text-gray-400">Создано с Brand Archetype OS</div>
            </div>
        </div>
    `;
}

// ==================== TEXT ENGINE ====================
function getHeroText(archetypeId) {
  const texts = {
    hero: "Создайте легенду вместе с нами",
    magician: "Преобразите свою реальность",
    ruler: "Возьмите контроль в свои руки",
    caregiver: "Забота, которая изменит всё",
    lover: "Найдите свою страсть",
    jester: "Жизнь слишком коротка для скуки",
    everyman: "Просто. Честно. По-настоящему.",
    explorer: "Откройте мир заново",
    rebel: "Нарушайте правила. Создавайте будущее.",
    creator: "Ваше видение. Наша платформа.",
    sage: "Знание — сила. Истина — путь.",
    innocent: "Чистота. Надежда. Свет.",
  };
  return texts[archetypeId] || "Создайте что-то удивительное";
}

function getHeroSubtext(archetypeId) {
  const texts = {
    hero: "Мы помогаем брендам становиться героями своих историй через смелые решения и неуклонное движение к цели.",
    magician:
      "Трансформируйте свои амбиции в реальность с помощью инновационных технологий и магии дизайна.",
    ruler:
      "Структура, порядок и авторитет — три столпа, на которых строятся великие империи брендов.",
    caregiver:
      "Каждое взаимодействие наполнено вниманием и заботой, потому что ваш успех — наша забота.",
    lover:
      "Создавайте глубокие эмоциональные связи с аудиторией через искренность и страсть.",
    jester:
      "Юмор, неожиданность и радость — ингредиенты бренда, который запоминается навсегда.",
    everyman:
      "Без претензий и лишнего пафоса — просто честный бренд для честных людей.",
    explorer:
      "Исследуйте неизведанное, открывайте новые горизонты и оставайтесь верными себе.",
    rebel:
      "Бросьте вызов устоявшимся нормам и создайте революцию в своей индустрии.",
    creator:
      "Инструменты для творцов, платформа для вдохновения, пространство для самовыражения.",
    sage: "Глубокие знания, аналитика и понимание — фундамент принятия правильных решений.",
    innocent:
      "Возвращаем веру в простые радости, чистые намерения и светлое будущее.",
  };
  return texts[archetypeId] || "Постройте уникальный бренд с помощью архетипов";
}

function getCTAText(archetypeId) {
  const texts = {
    hero: "Начать путь к победе",
    magician: "Совершить трансформацию",
    ruler: "Взять под контроль",
    caregiver: "Почувствовать заботу",
    lover: "Создать связь",
    jester: "Развлечься",
    everyman: "Присоединиться",
    explorer: "Отправиться в путь",
    rebel: "Бросить вызов",
    creator: "Начать творить",
    sage: "Обрести мудрость",
    innocent: "Обрести надежду",
  };
  return texts[archetypeId] || "Начать";
}

// ==================== RESULT OUTPUT ====================
function updateResultOutput(rankings) {
  const { primary, secondary, conflict } = rankings;

  document.getElementById("result-output").innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
                <div class="text-xs text-gray-400 uppercase tracking-wider mb-6">Архетип результата</div>
                <div class="space-y-4 mb-8">
                    <div class="flex items-center gap-3">
                        <div class="archetype-badge" style="--accent: ${primary.color}">
                            Primary: ${primary.nameRu}
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="archetype-badge" style="--accent: ${secondary.color}">
                            Secondary: ${secondary.nameRu}
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="archetype-badge" style="--accent: ${conflict.color}">
                            Conflict: ${conflict.nameRu}
                        </div>
                    </div>
                </div>

                <div class="text-xs text-gray-400 uppercase tracking-wider mb-4">Интерпретация бренда</div>
                <div class="space-y-3 text-sm leading-relaxed text-gray-600">
                    <p><strong>Поведение:</strong> ${primary.behavior_model}</p>
                    <p><strong>Мышление:</strong> ${primary.ux_rules.behavior}</p>
                    <p><strong>Взаимодействие:</strong> ${primary.ux_rules.structure}</p>
                </div>
            </div>

            <div>
                <div class="text-xs text-gray-400 uppercase tracking-wider mb-6">UX & UI Стратегия</div>

                <div class="space-y-6">
                    <div>
                        <div class="text-sm font-medium mb-2">UX Структура</div>
                        <div class="text-sm text-gray-500 leading-relaxed">${primary.ux_rules.structure}</div>
                        <div class="text-sm text-gray-500 leading-relaxed mt-1">${primary.ux_rules.behavior}</div>
                    </div>

                    <div>
                        <div class="text-sm font-medium mb-2">UI Стратегия</div>
                        <div class="space-y-2 text-sm text-gray-500">
                            <div><span class="text-gray-400">Типографика:</span> ${primary.ui_rules.typography}</div>
                            <div><span class="text-gray-400">Spacing:</span> ${primary.ui_rules.spacing}</div>
                            <div><span class="text-gray-400">Motion:</span> ${primary.ui_rules.motion}</div>
                            <div><span class="text-gray-400">Визуальный язык:</span> ${primary.ui_rules.visual}</div>
                        </div>
                    </div>

                    <div>
                        <div class="text-sm font-medium mb-2">Wireframe сайта</div>
                        <div class="space-y-2">
                            <div class="wireframe-block text-xs">
                                <strong>Hero Section:</strong> ${getHeroText(primary.id)}
                            </div>
                            <div class="wireframe-block text-xs">
                                <strong>Content Blocks:</strong> ${primary.ui_rules.visual}
                            </div>
                            <div class="wireframe-block text-xs">
                                <strong>CTA Logic:</strong> ${getCTAText(primary.id)} → ${primary.behavior_model.split(" → ").pop()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ==================== LAYER NAVIGATION ====================
function goToLayer(index) {
  document.querySelectorAll(".layer").forEach((l, i) => {
    l.classList.toggle("active", i === index);
  });
  document.querySelectorAll(".nav-dot").forEach((d, i) => {
    d.classList.toggle("active", i === index);
  });
  currentLayer = index;

  // Re-trigger animations on construction layer
  if (index === 2) {
    updateConstruction(getRankings());
  }

  // Re-trigger template preview on export layer
  if (index === 3) {
    renderTemplatePreview();
  }
}

// ==================== INTERACTIONS ====================
function updateZoneInfluences(x, y) {
  const zones = document.querySelectorAll(".zone-influence");
  zones.forEach((zone, i) => {
    const archetype = archetypes[i];
    if (!archetype) return;

    const dist = Math.sqrt(
      Math.pow(x * 100 - archetype.vector.method, 2) +
        Math.pow((1 - y) * 100 - archetype.vector.control, 2),
    );
    const opacity = Math.max(0, 1 - dist / 80);
    zone.style.opacity = opacity * 0.6;
  });
}

function highlightComponent(type) {
  // Visual feedback for component selection
  const preview = document.getElementById("live-preview");
  preview.style.transform = "scale(0.98)";
  setTimeout(() => {
    preview.style.transform = "scale(1)";
  }, 200);
}

// ==================== 12-TEMPLATE AUTO-GENERATOR ====================

// CSS-база общая для всех 12 шаблонов
const SHARED_CSS = `
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',-apple-system,sans-serif;background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;line-height:1.6}
:root{--bg:#faf9f7;--text:#1a1a1a;--muted:#777;--card:#fff;--glass:rgba(255,255,255,0.72)}
.container{max-width:1200px;margin:0 auto;padding:0 24px}
.nav{display:flex;justify-content:space-between;align-items:center;padding:20px 32px;position:sticky;top:0;z-index:100;background:rgba(250,249,247,0.85);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}
.nav .logo{font-weight:600;font-size:18px;letter-spacing:-0.02em}
.nav .links{display:flex;gap:32px;font-size:14px;color:var(--muted)}
.hero{text-align:center;padding:120px 24px 80px}
.hero .badge{display:inline-block;padding:6px 16px;border-radius:20px;font-size:13px;font-weight:500;background:var(--accent)15;color:var(--accent);margin-bottom:24px}
.hero h1{font-size:clamp(2rem,5vw,3.5rem);font-weight:200;line-height:1.2;margin-bottom:16px}
.hero p{max-width:560px;margin:0 auto 32px;font-size:17px;color:var(--muted)}
.section{padding:80px 0}
.section h2{text-align:center;font-size:2rem;font-weight:300;margin-bottom:16px}
.section .subtitle{text-align:center;color:var(--muted);margin-bottom:48px;font-size:16px}
.grid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px}
.grid3{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px}
.grid4{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px}
.card{background:var(--card);border-radius:20px;padding:32px;border:1px solid rgba(0,0,0,0.06);transition:transform 0.3s ease,box-shadow 0.3s ease}
.card:hover{transform:translateY(-4px);box-shadow:0 16px 48px rgba(0,0,0,0.08)}
.card .icon{width:56px;height:56px;border-radius:16px;display:flex;align-items:center;justify-content:center;margin-bottom:16px;font-size:24px}
.card h3{font-weight:500;margin-bottom:8px;font-size:18px}
.card p{font-size:14px;color:var(--muted)}
.btn{display:inline-block;padding:14px 32px;border-radius:12px;font-weight:500;letter-spacing:0.02em;cursor:pointer;transition:all 0.3s ease;text-decoration:none;border:none;font-size:15px}
.btn-primary{background:var(--accent);color:white}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 24px var(--accent)40}
.btn-outline{background:transparent;color:var(--accent);border:2px solid var(--accent)}
.btn-outline:hover{background:var(--accent);color:white}
.cta-block{text-align:center;padding:80px 0}
.cta-block .card{padding:48px;text-align:center}
.stats{display:flex;justify-content:center;gap:64px;flex-wrap:wrap;margin:48px 0}
.stats .stat{text-align:center}
.stats .num{font-size:3rem;font-weight:200;color:var(--accent)}
.stats .label{font-size:14px;color:var(--muted);margin-top:4px}
.testimonial{text-align:center;padding:48px 24px;background:var(--accent)08;border-radius:24px;margin:48px 0}
.testimonial blockquote{font-size:20px;font-weight:300;font-style:italic;max-width:700px;margin:0 auto 16px}
.testimonial cite{font-size:14px;color:var(--muted);font-style:normal}
.pricing-card{border:2px solid transparent;transition:all 0.3s ease}
.pricing-card.featured{border-color:var(--accent);box-shadow:0 0 0 4px var(--accent)10}
.price{font-size:3rem;font-weight:200;color:var(--accent)}
.footer{text-align:center;padding:48px 24px;background:var(--accent)08;border-radius:24px;margin-top:48px}
.footer .tag{font-size:13px;color:var(--muted);margin-top:8px}
.footer .tag a{color:var(--accent);text-decoration:none}
.feature-list{list-style:none;max-width:480px;margin:0 auto}
.feature-list li{padding:12px 0;border-bottom:1px solid rgba(0,0,0,0.05);display:flex;align-items:center;gap:12px}
.feature-list li::before{content:"✓";color:var(--accent);font-weight:700;width:20px;text-align:center;flex-shrink:0}
`;

/* Генератор полноценного лендинга под архетип */
function generateFullTemplate(primary, secondary) {
  const c = primary.color;
  const c2 = secondary.color;
  const sid = primary.id;

  // Общие переменные
  const vars = {
    hero: getHeroText(sid),
    sub: getHeroSubtext(sid),
    cta: getCTAText(sid),
    struct: primary.ux_rules.structure.split(",")[0],
    struct2: secondary.ux_rules.structure.split(",")[0],
    visual: primary.ui_rules.visual,
    visual2: secondary.ui_rules.visual,
    behavior: primary.ux_rules.behavior,
    model: primary.behavior_model,
    modelSteps: primary.behavior_model.split(" → "),
    name: primary.nameRu,
    name2: secondary.nameRu,
    spacing: primary.ui_rules.spacing,
    motion: primary.ui_rules.motion,
    typography: primary.ui_rules.typography,
  };

  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${vars.name} — Шаблон сайта | Brand Archetype OS</title>
<style>
:root{--accent:${c};--accent2:${c2}}
${SHARED_CSS}
</style>
</head>
<body>

<!-- NAV -->
<nav class="nav"><div class="logo">${vars.name}</div><div class="links"><span>О нас</span><span>Услуги</span><span>Контакты</span></div></nav>

<!-- HERO -->
<section class="hero">
  <div class="badge">${vars.name} Архетип</div>
  <h1>${vars.hero}</h1>
  <p>${vars.sub}</p>
  <button class="btn btn-primary">${vars.cta}</button>
</section>

<!-- FEATURES -->
<section class="section"><div class="container">
  <h2>${vars.struct}</h2>
  <p class="subtitle">${vars.visual}</p>
  <div class="grid3">
    <div class="card"><div class="icon" style="background:${c}15">⚡</div><h3>${vars.struct}</h3><p>${vars.visual}</p></div>
    <div class="card"><div class="icon" style="background:${c2}15">✦</div><h3>${vars.struct2}</h3><p>${vars.visual2}</p></div>
    <div class="card"><div class="icon" style="background:${c}15">→</div><h3>${vars.modelSteps[3] || vars.modelSteps[1]}</h3><p>${vars.behavior}</p></div>
  </div>
</div></section>

<!-- HOW IT WORKS -->
<section class="section" style="background:${c}05"><div class="container">
  <h2>Как это работает</h2>
  <p class="subtitle">${vars.motion}</p>
  <div class="grid4">
    ${vars.modelSteps
      .map(
        (step, i) => `
    <div class="card" style="text-align:center">
      <div class="icon" style="background:${c}15;margin:0 auto 16px;border-radius:50%;width:48px;height:48px;font-size:20px">${i + 1}</div>
      <h3 style="font-size:16px">${step.trim()}</h3>
      <p style="font-size:13px">${i === 0 ? "Начало пути" : i === vars.modelSteps.length - 1 ? "Результат" : "Шаг " + (i + 1)}</p>
    </div>`,
      )
      .join("")}
  </div>
</div></section>

<!-- STATS -->
<section class="section"><div class="container">
  <div class="stats">
    <div class="stat"><div class="num">98%</div><div class="label">Довольных клиентов</div></div>
    <div class="stat"><div class="num">${Math.round(userVector.energy)}</div><div class="label">Энергия бренда</div></div>
    <div class="stat"><div class="num">24/7</div><div class="label">Поддержка</div></div>
  </div>
</div></section>

<!-- PRICING -->
<section class="section" style="background:${c}05"><div class="container">
  <h2>Выберите план</h2>
  <p class="subtitle">${vars.spacing}</p>
  <div class="grid3">
    <div class="card pricing-card"><div class="price">₽990</div><h3>Старт</h3><ul class="feature-list"><li>Базовый доступ</li><li>${vars.struct}</li><li>Email поддержка</li></ul><br><button class="btn btn-outline">Начать</button></div>
    <div class="card pricing-card featured"><div class="price">₽2990</div><h3>Профи</h3><ul class="feature-list"><li>Полный доступ</li><li>${vars.typography.split(",")[0] || "Премиум стиль"}</li><li>Приоритетная поддержка</li><li>${vars.motion}</li></ul><br><button class="btn btn-primary">${vars.cta}</button></div>
    <div class="card pricing-card"><div class="price">₽5990</div><h3>VIP</h3><ul class="feature-list"><li>Всё из Профи</li><li>Персональный менеджер</li><li>Индивидуальные настройки</li></ul><br><button class="btn btn-outline">Связаться</button></div>
  </div>
</div></section>

<!-- TESTIMONIAL -->
<section class="section"><div class="container">
  <div class="testimonial">
    <blockquote>«${vars.sub.split(".")[0]}»</blockquote>
    <cite>— Клиент из категории «${vars.name}»</cite>
  </div>
</div></section>

<!-- CTA -->
<section class="cta-block"><div class="container">
  <div class="card">
    <div class="badge">Готовы начать?</div>
    <h2 style="margin-bottom:16px">${vars.cta}</h2>
    <p style="max-width:480px;margin:0 auto 24px;color:var(--muted)">${vars.modelSteps.slice(0, 2).join(" → ")}</p>
    <button class="btn btn-primary">${vars.cta}</button>
  </div>
</div></section>

<!-- FOOTER -->
<div class="footer container">
  <p style="font-weight:500">${vars.name}</p>
  <p class="tag">Создано с <a href="#">Brand Archetype OS</a> • Made on Tilda</p>
</div>

</body>
</html>`;
}

// Конфигурация для Tilda (JSON-токены)
function generateTildaConfig(rankings) {
  const { primary, secondary, conflict } = rankings;
  return {
    archetype: {
      primary: { id: primary.id, name: primary.nameRu, color: primary.color },
      secondary: {
        id: secondary.id,
        name: secondary.nameRu,
        color: secondary.color,
      },
      conflict: {
        id: conflict.id,
        name: conflict.nameRu,
        color: conflict.color,
      },
    },
    vector: {
      control: Math.round(userVector.control),
      energy: Math.round(userVector.energy),
      focus: Math.round(userVector.focus),
      method: Math.round(userVector.method),
    },
    design_tokens: {
      accent_color: primary.color,
      secondary_color: secondary.color,
      background: "#faf9f7",
      text_primary: "#1a1a1a",
      text_secondary: "#777777",
    },
    typography: {
      heading: primary.ui_rules.typography,
      spacing: primary.ui_rules.spacing,
      motion: primary.ui_rules.motion,
      visual: primary.ui_rules.visual,
    },
    ux_strategy: {
      structure: primary.ux_rules.structure,
      behavior: primary.ux_rules.behavior,
      behavior_model: primary.behavior_model,
    },
    copy: {
      hero: getHeroText(primary.id),
      hero_subtext: getHeroSubtext(primary.id),
      cta: getCTAText(primary.id),
    },
  };
}

/* Генерация всех 12 шаблонов сразу */
function generateAll12Templates() {
  return archetypes.map((primary) => {
    const secondary = archetypes[(archetypes.indexOf(primary) + 1) % 12];
    return {
      id: primary.id,
      name: primary.nameRu,
      color: primary.color,
      html: generateFullTemplate(primary, secondary),
      config: generateTildaConfig({
        primary,
        secondary,
        conflict: archetypes[archetypes.indexOf(primary) === 0 ? 11 : 0],
        all: archetypes,
      }),
    };
  });
}

// Кэш последнего сгенерированного шаблона
let _lastTemplateHTML = null;
let _lastTemplatePrimary = null;

function renderTemplatePreview() {
  const rankings = getRankings();
  const { primary, secondary } = rankings;
  _lastTemplateHTML = generateFullTemplate(primary, secondary);
  _lastTemplatePrimary = primary;
  const container = document.getElementById("template-visual-container");
  const label = document.getElementById("template-archetype-label");
  if (label)
    label.textContent =
      "Архетип: " + primary.nameRu + " • Цвет: " + primary.color;
  if (container) {
    container.innerHTML =
      '<iframe src="about:blank" style="width:100%;height:80vh;border:none;border-radius:12px" id="template-iframe"></iframe>';
    const iframe = document.getElementById("template-iframe");
    if (iframe) iframe.srcdoc = _lastTemplateHTML;
  }
}

function downloadCurrentTemplate() {
  if (!_lastTemplateHTML) {
    const r = getRankings();
    _lastTemplateHTML = generateFullTemplate(r.primary, r.secondary);
    _lastTemplatePrimary = r.primary;
  }
  downloadFile(
    (_lastTemplatePrimary ? _lastTemplatePrimary.id : "template") +
      "-landing.html",
    _lastTemplateHTML,
    "text/html",
  );
}

function openCurrentTemplate() {
  if (!_lastTemplateHTML) {
    const r = getRankings();
    _lastTemplateHTML = generateFullTemplate(r.primary, r.secondary);
    _lastTemplatePrimary = r.primary;
  }
  const w = window.open("", "_blank");
  if (w) {
    w.document.write(_lastTemplateHTML);
    w.document.close();
  }
}

// Основная функция — вызывается по кнопке «Создать сайт»
function generateSite() {
  goToLayer(3);
  renderTemplatePreview();
}

// Модальное окно экспорта
function showExportModal(primary, html, configJSON) {
  const existing = document.getElementById("export-modal-overlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "export-modal-overlay";
  overlay.innerHTML = `
    <div class="export-modal-glass">
      <div class="export-modal-header">
        <div>
          <div class="export-modal-title">🎨 Шаблон «${primary.nameRu}» готов</div>
          <div class="export-modal-subtitle">
            Цвет: <span style="color:${primary.color};font-weight:600">${primary.color}</span> •
            Поведение: ${primary.behavior_model.split(" → ").slice(0, 2).join(" → ")}
          </div>
        </div>
        <button class="export-modal-close" onclick="closeExportModal()">✕</button>
      </div>
      <div class="export-modal-body">
        <div class="export-tabs">
          <button class="export-tab active" data-tab="tab-html">📄 HTML-шаблон</button>
          <button class="export-tab" data-tab="tab-json">📊 JSON-конфиг</button>
          <button class="export-tab" data-tab="tab-tilda">🚀 В Tilda</button>
        </div>

        <div class="export-tab-content active" id="tab-html">
          <div class="export-info">Полноценный лендинг с Hero, Features, Stats, Pricing, CTA — скопируйте и вставьте в Tilda HTML-виджет</div>
          <div class="export-code-wrapper"><pre class="export-code" id="export-html-code">${escapeHTML(html)}</pre></div>
          <div class="export-buttons">
            <button class="btn-primary export-btn" onclick="copyToClipboard('export-html-code')">📋 Копировать HTML</button>
            <button class="btn-secondary export-btn" onclick="downloadFile('${primary.id}-landing.html', document.getElementById('export-html-code').textContent, 'text/html')">💾 Скачать .html</button>
            <button class="btn-secondary export-btn" onclick="openPreview('${primary.id}')">👁 Предпросмотр</button>
          </div>
        </div>

        <div class="export-tab-content" id="tab-json">
          <div class="export-info">JSON-конфигурация: дизайн-токены, копирайтинг, UX/UI-стратегия</div>
          <div class="export-code-wrapper"><pre class="export-code" id="export-json-code">${escapeHTML(configJSON)}</pre></div>
          <div class="export-buttons">
            <button class="btn-primary export-btn" onclick="copyToClipboard('export-json-code')">📋 Копировать JSON</button>
            <button class="btn-secondary export-btn" onclick="downloadFile('${primary.id}-config.json', document.getElementById('export-json-code').textContent, 'application/json')">💾 Скачать .json</button>
          </div>
        </div>

        <div class="export-tab-content" id="tab-tilda">
          <div class="export-instruction">
            <h3>🚀 Автоматически — вставка в Tilda</h3>
            <ol>
              <li>Скопируйте HTML из вкладки <strong>«HTML-шаблон»</strong></li>
              <li>В редакторе Tilda: <strong>+ Блок → Другое → HTML-код</strong></li>
              <li>Вставьте код → опубликуйте страницу</li>
            </ol>
            <h3>⚡ Через Netlify (мгновенный деплой)</h3>
            <ol>
              <li>Скачайте .html файл → перетащите на <a href="https://app.netlify.com/drop" target="_blank">Netlify Drop</a></li>
              <li>Получите URL → вставьте в Tilda HTML-виджет как iframe:<br>
                <code>&lt;iframe src="ВАШ_URL" style="width:100%;height:100vh;border:none"&gt;&lt;/iframe&gt;</code>
              </li>
            </ol>
            <h3>🎨 Рекомендации по Tilda-блокам</h3>
            <p><strong>Акцентный цвет:</strong> <span style="color:${primary.color};font-weight:600">${primary.color}</span></p>
            <p><strong>Типографика:</strong> ${primary.ui_rules.typography}</p>
            <p><strong>Motion:</strong> ${primary.ui_rules.motion}</p>
            <p><strong>Spacing:</strong> ${primary.ui_rules.spacing}</p>
            <p><strong>Структура:</strong> ${primary.ux_rules.structure}</p>
            <h3>🔗 Все 12 шаблонов</h3>
            <div class="all-templates-grid" id="all-templates-grid">Загрузка...</div>
          </div>
        </div>
      </div>
    </div>`;

  document.body.appendChild(overlay);

  // Привязка табов
  overlay.querySelectorAll(".export-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      overlay
        .querySelectorAll(".export-tab")
        .forEach((t) => t.classList.remove("active"));
      overlay
        .querySelectorAll(".export-tab-content")
        .forEach((c) => c.classList.remove("active"));
      tab.classList.add("active");
      const target = overlay.querySelector("#" + tab.dataset.tab);
      if (target) target.classList.add("active");

      // Генерация сетки всех 12 шаблонов
      if (tab.dataset.tab === "tab-tilda") {
        const grid = overlay.querySelector("#all-templates-grid");
        if (grid && !grid.dataset.filled) {
          grid.dataset.filled = "1";
          const all = generateAll12Templates();
          grid.innerHTML = all
            .map((t) => {
              const encoded = encodeURIComponent(t.html);
              return `<div class="all-template-item" style="border-left:3px solid ${t.color};padding:8px 12px;margin:4px 0;background:${t.color}08;border-radius:6px;cursor:pointer;font-size:13px;display:flex;justify-content:space-between;align-items:center" data-tpl="${encoded}" data-name="${t.name}" data-id="${t.id}"><span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${t.color};margin-right:8px"></span>${t.name}</span><span style="color:${t.color};font-size:11px">💾 Скачать</span></div>`;
            })
            .join("");
          grid.querySelectorAll(".all-template-item").forEach((item) => {
            item.addEventListener("click", function () {
              const html = decodeURIComponent(this.dataset.tpl);
              downloadFile(
                this.dataset.id + "-landing.html",
                html,
                "text/html",
              );
              alert("Шаблон «" + this.dataset.name + "» скачан!");
            });
          });
        }
      }
    });
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeExportModal();
  });
  const escHandler = (e) => {
    if (e.key === "Escape") {
      closeExportModal();
      document.removeEventListener("keydown", escHandler);
    }
  };
  document.addEventListener("keydown", escHandler);
}

function closeExportModal() {
  const overlay = document.getElementById("export-modal-overlay");
  if (overlay) overlay.remove();
}

function openPreview(archetypeId) {
  const all = generateAll12Templates();
  const tpl = all.find((t) => t.id === archetypeId);
  if (!tpl) return;
  const w = window.open("", "_blank");
  if (w) {
    w.document.write(tpl.html);
    w.document.close();
  }
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function copyToClipboard(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  navigator.clipboard
    .writeText(el.textContent)
    .then(() => {
      const btns = document.querySelectorAll(".export-btn");
      btns.forEach((b) => {
        if (b.textContent.includes("Копировать"))
          b.textContent = "✓ Скопировано!";
      });
      setTimeout(() => {
        btns.forEach((b) => {
          if (b.textContent.includes("Скопировано"))
            b.textContent =
              "📋 Копировать " + (elementId.includes("html") ? "HTML" : "JSON");
        });
      }, 2000);
    })
    .catch(() =>
      alert("Не удалось скопировать. Попробуйте выделить код вручную."),
    );
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ==================== EVENT BINDINGS ====================
document.addEventListener("DOMContentLoaded", () => {
  // ---- Navigation dots ----
  document.querySelectorAll(".nav-dot").forEach((dot) => {
    dot.addEventListener("click", () => goToLayer(parseInt(dot.dataset.layer)));
  });

  // ---- Field drag (mouse) ----
  const fieldContainer = document.getElementById("field-container");
  const brandPoint = document.getElementById("brand-point");

  brandPoint.addEventListener("mousedown", (e) => {
    isDragging = true;
    dragTarget = "field";
    e.preventDefault();
  });

  // ---- Curve drag (mouse) ----
  document.querySelectorAll(".curve-handle").forEach((handle) => {
    handle.addEventListener("mousedown", (e) => {
      isDragging = true;
      dragTarget = handle.dataset.dim;
      e.preventDefault();
    });
  });

  // ---- Global mouse move ----
  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    if (dragTarget === "field") {
      const rect = fieldContainer.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

      brandPoint.style.left = x * 100 + "%";
      brandPoint.style.top = y * 100 + "%";

      userVector.control = Math.round((1 - y) * 100);
      userVector.energy = Math.round(y * 100);
      userVector.focus = Math.round((1 - x) * 100);
      userVector.method = Math.round(x * 100);

      updateZoneInfluences(x, y);
    } else if (["control", "energy", "focus", "method"].includes(dragTarget)) {
      const svg = document.getElementById(`svg-${dragTarget}`);
      const rect = svg.getBoundingClientRect();
      const x = Math.max(0, Math.min(300, e.clientX - rect.left));
      const y = Math.max(0, Math.min(100, e.clientY - rect.top));
      const value = Math.round((1 - y / 100) * 100);

      userVector[dragTarget] = value;

      const handle = document.querySelector(`[data-dim="${dragTarget}"]`);
      handle.setAttribute("cx", x);
      handle.setAttribute("cy", y);

      // Update curve path
      const path = svg.querySelector("path");
      path.setAttribute(
        "d",
        `M 0,${100 - value} Q ${x},${y} 150,${y} T 300,${100 - value}`,
      );
    }

    updateUI();
  });

  // ---- Global mouse up ----
  document.addEventListener("mouseup", () => {
    isDragging = false;
    dragTarget = null;
  });

  // ---- Touch: field ----
  brandPoint.addEventListener(
    "touchstart",
    (e) => {
      isDragging = true;
      dragTarget = "field";
      e.preventDefault();
    },
    { passive: false },
  );

  // ---- Touch: curve handles ----
  document.querySelectorAll(".curve-handle").forEach((handle) => {
    handle.addEventListener(
      "touchstart",
      (e) => {
        isDragging = true;
        dragTarget = handle.dataset.dim;
        e.preventDefault();
      },
      { passive: false },
    );
  });

  // ---- Touch move ----
  document.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging) return;
      const touch = e.touches[0];

      if (dragTarget === "field") {
        const rect = fieldContainer.getBoundingClientRect();
        const x = Math.max(
          0,
          Math.min(1, (touch.clientX - rect.left) / rect.width),
        );
        const y = Math.max(
          0,
          Math.min(1, (touch.clientY - rect.top) / rect.height),
        );

        brandPoint.style.left = x * 100 + "%";
        brandPoint.style.top = y * 100 + "%";

        userVector.control = Math.round((1 - y) * 100);
        userVector.energy = Math.round(y * 100);
        userVector.focus = Math.round((1 - x) * 100);
        userVector.method = Math.round(x * 100);

        updateZoneInfluences(x, y);
      }

      updateUI();
    },
    { passive: false },
  );

  // ---- Touch end ----
  document.addEventListener("touchend", () => {
    isDragging = false;
    dragTarget = null;
  });

  // ---- Initialize ----
  updateUI();
  updateZoneInfluences(0.5, 0.5);
});
