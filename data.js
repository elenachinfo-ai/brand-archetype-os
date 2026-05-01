/* ============================================================
   Brand Archetype OS — Data Layer
   ============================================================
   Содержит:
   - Массив из 12 архетипов (archetypes)
   Каждый архетип включает:
     id              — строковой идентификатор
     name / nameRu   — название (EN / RU)
     vector          — 4D-вектор {control, energy, focus, method} (0-100)
     weights         — веса для расчёта distance
     color           — HEX-акцент
     ux_rules        — UX-правила {structure, behavior}
     ui_rules        — UI-правила {typography, spacing, motion, visual}
     behavior_model  — модель поведения (A → B → C → D)
     heroText        — текст hero section
     heroSub         — подзаголовок hero
     ctaText         — текст CTA кнопки
   ============================================================ */

archetypes = [
  {
    id: "hero",
    name: "Hero",
    nameRu: "Герой",
    vector: { control: 75, energy: 90, focus: 80, method: 60 },
    weights: { control: 1.0, energy: 1.2, focus: 1.0, method: 1.1 },
    color: "#e74c3c",
    ux_rules: {
      structure: "Прямолинейная навигация, чёткий путь к цели",
      behavior:
        "Пользователь — на пути к победе, каждое действие даёт прогресс",
    },
    ui_rules: {
      typography: "Bold, uppercase, strong contrast",
      spacing: "Generous, empowering",
      motion: "Decisive, forward-moving",
      visual: "Sharp angles, high contrast, action-oriented",
    },
    behavior_model: "Challenge → Action → Victory → Recognition",
    heroText: "Создайте легенду вместе с нами",
    heroSub:
      "Мы помогаем брендам становиться героями своих историй через смелые решения.",
    ctaText: "Начать путь к победе",
  },
  {
    id: "magician",
    name: "Magician",
    nameRu: "Маг",
    vector: { control: 60, energy: 85, focus: 70, method: 90 },
    weights: { control: 1.0, energy: 1.2, focus: 1.0, method: 1.1 },
    color: "#9b59b6",
    ux_rules: {
      structure: "Трансформационный флоу, reveal-on-scroll",
      behavior: "Пользователь открывает потенциал через взаимодействие",
    },
    ui_rules: {
      typography: "Elegant, mysterious, flowing",
      spacing: "Dramatic, theatrical",
      motion: "Morphing, transforming, magical",
      visual: "Gradients, particles, ethereal effects",
    },
    behavior_model: "Desire → Transformation → Wonder → Mastery",
    heroText: "Преобразите свою реальность",
    heroSub:
      "Трансформируйте амбиции в реальность через инновации и магию дизайна.",
    ctaText: "Совершить трансформацию",
  },
  {
    id: "ruler",
    name: "Ruler",
    nameRu: "Правитель",
    vector: { control: 95, energy: 60, focus: 90, method: 85 },
    weights: { control: 1.0, energy: 1.2, focus: 1.0, method: 1.1 },
    color: "#f39c12",
    ux_rules: {
      structure: "Иерархическая, авторитетная, структурированная",
      behavior: "Пользователь получает контроль и порядок",
    },
    ui_rules: {
      typography: "Classical, authoritative, refined",
      spacing: "Regal, spacious, controlled",
      motion: "Stately, deliberate, commanding",
      visual: "Gold accents, symmetry, premium materials",
    },
    behavior_model: "Chaos → Order → Control → Legacy",
    heroText: "Возьмите контроль в свои руки",
    heroSub:
      "Структура, порядок и авторитет — три столпа великих империй брендов.",
    ctaText: "Взять под контроль",
  },
  {
    id: "caregiver",
    name: "Caregiver",
    nameRu: "Заботливый",
    vector: { control: 50, energy: 40, focus: 60, method: 70 },
    weights: { control: 1.0, energy: 1.2, focus: 1.0, method: 1.1 },
    color: "#27ae60",
    ux_rules: {
      structure: "Поддерживающая, доступная, терпеливая",
      behavior: "Пользователь чувствует заботу и понимание",
    },
    ui_rules: {
      typography: "Warm, friendly, approachable",
      spacing: "Comfortable, breathing room",
      motion: "Gentle, reassuring, soft",
      visual: "Organic shapes, warm greens, soft textures",
    },
    behavior_model: "Need → Care → Support → Gratitude",
    heroText: "Забота, которая изменит всё",
    heroSub:
      "Каждое взаимодействие наполнено вниманием, потому что ваш успех — наша забота.",
    ctaText: "Почувствовать заботу",
  },
  {
    id: "lover",
    name: "Lover",
    nameRu: "Любовник",
    vector: { control: 40, energy: 80, focus: 50, method: 60 },
    weights: { control: 1.0, energy: 1.2, focus: 1.0, method: 1.1 },
    color: "#e91e63",
    ux_rules: {
      structure: "Сенсорная, эмоциональная, интимная",
      behavior: "Пользователь формирует эмоциональную связь",
    },
    ui_rules: {
      typography: "Sensual, flowing, intimate",
      spacing: "Close, personal, warm",
      motion: "Seductive, lingering, passionate",
      visual: "Rich colors, curves, luxurious textures",
    },
    behavior_model: "Attraction → Connection → Intimacy → Devotion",
    heroText: "Найдите свою страсть",
    heroSub:
      "Создавайте глубокие эмоциональные связи через искренность и страсть.",
    ctaText: "Создать связь",
  },
  {
    id: "jester",
    name: "Jester",
    nameRu: "Шут",
    vector: { control: 30, energy: 95, focus: 30, method: 40 },
    weights: { control: 1.0, energy: 1.2, focus: 1.0, method: 1.1 },
    color: "#ff9800",
    ux_rules: {
      structure: "Игривая, непредсказуемая, весёлая",
      behavior: "Пользователь развлекается и удивляется",
    },
    ui_rules: {
      typography: "Playful, quirky, irregular",
      spacing: "Dynamic, unexpected",
      motion: "Bouncy, elastic, surprising",
      visual: "Bright colors, irregular shapes, fun patterns",
    },
    behavior_model: "Boredom → Play → Joy → Laughter",
    heroText: "Жизнь слишком коротка для скуки",
    heroSub:
      "Юмор, неожиданность и радость — ингредиенты бренда, который запоминается.",
    ctaText: "Развлечься",
  },
  {
    id: "everyman",
    name: "Everyman",
    nameRu: "Простой человек",
    vector: { control: 45, energy: 50, focus: 50, method: 50 },
    weights: { control: 1.0, energy: 1.2, focus: 1.0, method: 1.1 },
    color: "#795548",
    ux_rules: {
      structure: "Прямая, честная, без претензий",
      behavior: "Пользователь чувствует принадлежность",
    },
    ui_rules: {
      typography: "Clean, honest, readable",
      spacing: "Balanced, familiar",
      motion: "Steady, reliable, unpretentious",
      visual: "Neutral tones, familiar patterns, honest materials",
    },
    behavior_model: "Isolation → Belonging → Community → Friendship",
    heroText: "Просто. Честно. По-настоящему.",
    heroSub: "Без претензий и пафоса — честный бренд для честных людей.",
    ctaText: "Присоединиться",
  },
  {
    id: "explorer",
    name: "Explorer",
    nameRu: "Исследователь",
    vector: { control: 35, energy: 75, focus: 40, method: 55 },
    weights: { control: 1.0, energy: 1.2, focus: 1.0, method: 1.1 },
    color: "#00bcd4",
    ux_rules: {
      structure: "Открытая, неограниченная, исследовательская",
      behavior: "Пользователь открывает новые горизонты",
    },
    ui_rules: {
      typography: "Adventurous, wide, free",
      spacing: "Expansive, liberating",
      motion: "Flowing, wandering, discovering",
      visual: "Natural tones, maps, expansive imagery",
    },
    behavior_model: "Confined → Discovery → Freedom → Authenticity",
    heroText: "Откройте мир заново",
    heroSub: "Исследуйте неизведанное и оставайтесь верными себе.",
    ctaText: "Отправиться в путь",
  },
  {
    id: "rebel",
    name: "Rebel",
    nameRu: "Бунтарь",
    vector: { control: 20, energy: 90, focus: 30, method: 25 },
    weights: { control: 1.0, energy: 1.2, focus: 1.0, method: 1.1 },
    color: "#ff5722",
    ux_rules: {
      structure: "Разрушительная, провокационная, смелая",
      behavior: "Пользователь бросает вызов статус-кво",
    },
    ui_rules: {
      typography: "Aggressive, disruptive, bold",
      spacing: "Tight, intense, confrontational",
      motion: "Jarring, sudden, rebellious",
      visual: "High contrast, broken grids, disruptive elements",
    },
    behavior_model: "Oppression → Rebellion → Revolution → Liberation",
    heroText: "Нарушайте правила. Создавайте будущее.",
    heroSub: "Бросьте вызов устоявшимся нормам и создайте революцию.",
    ctaText: "Бросить вызов",
  },
  {
    id: "creator",
    name: "Creator",
    nameRu: "Творец",
    vector: { control: 55, energy: 70, focus: 75, method: 80 },
    weights: { control: 1.0, energy: 1.2, focus: 1.0, method: 1.1 },
    color: "#673ab7",
    ux_rules: {
      structure: "Гибкая, вдохновляющая, творческая",
      behavior: "Пользователь создаёт и выражает себя",
    },
    ui_rules: {
      typography: "Artistic, expressive, unique",
      spacing: "Inspired, varied, creative",
      motion: "Organic, generative, artistic",
      visual: "Vibrant palettes, artistic layouts, creative tools",
    },
    behavior_model: "Inspiration → Creation → Expression → Vision",
    heroText: "Ваше видение. Наша платформа.",
    heroSub: "Инструменты для творцов, пространство для самовыражения.",
    ctaText: "Начать творить",
  },
  {
    id: "sage",
    name: "Sage",
    nameRu: "Мудрец",
    vector: { control: 70, energy: 30, focus: 90, method: 85 },
    weights: { control: 1.0, energy: 1.2, focus: 1.0, method: 1.1 },
    color: "#607d8b",
    ux_rules: {
      structure: "Аналитическая, информативная, глубокая",
      behavior: "Пользователь ищет знания и истину",
    },
    ui_rules: {
      typography: "Scholarly, precise, clear",
      spacing: "Methodical, organized, spacious",
      motion: "Calm, deliberate, thoughtful",
      visual: "Muted tones, clean data, academic feel",
    },
    behavior_model: "Ignorance → Question → Understanding → Wisdom",
    heroText: "Знание — сила. Истина — путь.",
    heroSub: "Глубокие знания и аналитика — фундамент правильных решений.",
    ctaText: "Обрести мудрость",
  },
  {
    id: "innocent",
    name: "Innocent",
    nameRu: "Невинный",
    vector: { control: 25, energy: 40, focus: 35, method: 45 },
    weights: { control: 1.0, energy: 1.2, focus: 1.0, method: 1.1 },
    color: "#8bc34a",
    ux_rules: {
      structure: "Простая, чистая, оптимистичная",
      behavior: "Пользователь чувствует безопасность и радость",
    },
    ui_rules: {
      typography: "Simple, pure, optimistic",
      spacing: "Airy, light, uncomplicated",
      motion: "Gentle, innocent, hopeful",
      visual: "Pastels, simple shapes, clear skies",
    },
    behavior_model: "Cynicism → Hope → Joy → Paradise",
    heroText: "Чистота. Надежда. Свет.",
    heroSub: "Возвращаем веру в простые радости и светлое будущее.",
    ctaText: "Обрести надежду",
  },
];
