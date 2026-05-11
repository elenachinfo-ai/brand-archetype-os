# Brand Archetype OS — Agent Guide

## Проект

Brand Archetype OS — интерактивная ОС для определения архетипа бренда через 4D-вектор (Control, Energy, Focus, Method). Состоит из HUD-интерфейса с canvas-визуализацией, jog-dial контролов, behavior-трекинга и генерации Brand Passport.

**Репозиторий:** `elenachinfo-ai/brand-archetype-os`  
**Деплой:** GitHub Pages → https://elenachinfo-ai.github.io/brand-archetype-os/ + Tilda (iframe)  
**CI/CD:** `.github/workflows/deploy.yml` → FTP на reg.ru (только из `main`)  

**Ветка разработки:** `archetypes96` (мы здесь). `main` не трогаем без явного аппрува.

---

## Архитектура

```
┌─────────────────────────────────────────────────────────────┐
│  index.html          — Единая точка входа, разметка HUD     │
│  styles.css          — Дизайн-система, CSS-переменные       │
│  data.js             — 12 архетипов (вектора, правила, тексты)
├─────────────────────────────────────────────────────────────┤
│  ENGINE LAYER                                               │
│  ├── engine.js         — Canvas-поле, jog-dials, drag,      │
│  │                       ranking, presets, экспорт шаблона  │
│  ├── pivot.js          — UI-трансформация при lock (темы)   │
│  └── archetype-themes.js — CSS-темы для каждого архетипа    │
├─────────────────────────────────────────────────────────────┤
│  BEHAVIOR LAYER                                             │
│  ├── tracker.js        — Сенсоры: мышь, скролл, внимание,   │
│  │                       клики → raw signals                │
│  ├── interpreter.js    — EMA-bridge: signals → userVector   │
│  │                       confidence gating, lock/unlock     │
│  └── init-tracking.js  — Инициализация трекера + pivot      │
├─────────────────────────────────────────────────────────────┤
│  DIAGNOSTIC LAYER                                           │
│  ├── diagnostic.js     — 12-карточный экспресс-тест         │
│  │                       HolographicQuest                   │
│  └── archetype-result.js — Модальное окно Brand Passport    │
├─────────────────────────────────────────────────────────────┤
│  DATA ASSETS                                                │
│  ├── diagnostic_questions_v4.json — Полный набор вопросов   │
│  ├── culture_logic.json           — Культурные модификаторы │
│  └── variable_bindings.json       — Привязки переменных     │
└─────────────────────────────────────────────────────────────┘
```

### Поток данных

```
Пользователь → Jog Dial / Drag на поле / Прессет → userVector (engine.js)
                                        ↓
                              tracker.js (пассивно)
                                        ↓
                              interpreter.js (EMA, confidence)
                                        ↓
                              getRankings() → Primary / Secondary / Conflict
                                        ↓
                              Canvas redraw + Output cards + Pivot (если locked)
```

---

## Файловая карта

| Файл | Строк | Ответственность | Связи |
|------|-------|-----------------|-------|
| `index.html` | 441 | Разметка HUD: header, workspace (controllers, field, output), analytics, modal | Подключает все JS с `?v=` кэшбастингом |
| `styles.css` | 2230 | CSS-переменные, glassmorphism, анимации, адаптив | Использует переменные из pivot.js / themes |
| `data.js` | 62 | Массив `archetypes` — 12 объектов с vector, weights, color, ux_rules, ui_rules, behavior_model, heroText, heroSub, ctaText | Используется engine.js, diagnostic.js, archetype-result.js |
| `engine.js` | 746 | **Ядро:** state, calcDistance, getRankings, canvas drawField, brand drag, jog dial drag, updateAll, presets, export modal | Зависит от data.js, использует `window.__pivotCanvas` |
| `tracker.js` | 458 | Mouse/scroll/attention/decision tracking, signal computation, confidence | Чистый vanilla JS, singleton `Tracker` |
| `interpreter.js` | 168 | EMA-bridge: `Tracker.getBehaviorVector()` → `userVector`, lock streak, callbacks | Зависит от `Tracker`, `userVector`, `updateAll`, `animateToVector` |
| `pivot.js` | 206 | UI-трансформация: scan-анимация, применение CSS-переменных, canvas override | Зависит от `ArchetypeThemes`, `archetypes`, `updateAll` |
| `archetype-themes.js` | 437 | `ArchetypeThemes` — 12 тем с CSS vars + canvas colors для каждого архетипа | Используется pivot.js |
| `diagnostic.js` | 429 | `HolographicQuest` — 12-карточный экспресс-тест, inline HTML, scoring, download | Заменяет содержимое `#panel-controllers`, зависит от data.js |
| `archetype-result.js` | 255 | `ArchetypeResult.show()` — модальное окно с профилем, вектором, кодексом | Зависит от data.js, pivot.js, engine.js |
| `init-tracking.js` | 65 | `DOMContentLoaded` → init Pivot, Tracker, Interpreter, register sections | Точка сборки behavior layer |
| `diagnostic_questions_v4.json` | — | Полный набор диагностических вопросов | Не подключён напрямую в index.html (?) |
| `culture_logic.json` | — | Культурные модификаторы | — |
| `variable_bindings.json` | — | Привязки переменных | — |

### `.check` файлы

Файлы `*.js.check` — это хэш-контрольные суммы (вероятно, для ручной верификации целостности). **Не редактировать** — при изменении JS файла хэш устареет.

---

## Ключевые концепции

### 4D-вектор
Каждый архетип и позиция бренда описываются 4 измерениями (0-100):
- **Control** — степень контроля / структуры
- **Energy** — энергия / динамика
- **Focus** — фокус / целеустремлённость
- **Method** — метод / подход

### Ranking
Ближайший архетип вычисляется взвешенным манхэттенским расстоянием:
```js
calcDistance(user, a) = Σ |user[dim] - a.vector[dim]| * a.weights[dim]
```

### 2D-проекция поля
```js
X = (Control - Focus) / 100   // left=Focus, right=Control
Y = (Energy - Method) / 100   // top=Energy, bottom=Method
```

### Confidence / Lock
- `Tracker.getConfidence()` — обратная волатильности (0-100%)
- `Interpreter` требует 3 тика подряд с confidence ≥ 75% для lock
- При lock — UI pivot на тему архетипа (если включено)
- В текущей версии lock в `init-tracking.js` закомментирован

---

## Техстек

- **Frontend:** Vanilla HTML5, CSS3 (custom properties), ES6+ (без транспиляции)
- **Шрифты:** Google Fonts (Inter, Manrope)
- **Canvas API:** 2D context для поля архетипов
- **Сборка:** Нет (raw static files)
- **Деплой:** GitHub Pages + FTP (reg.ru)

---

## Правила работы

### Git
1. Работаем только в ветке `archetypes96`
2. `main` не трогаем без явного одобрения пользователя
3. Коммиты на русском или английском — как удобнее
4. Перед сложными изменениями — обсудить подход

### Код
1. **Vanilla JS only** — никаких фреймворков, никаких библиотек
2. Сохранять стиль: `var` в старых файлах (`diagnostic.js`, `archetype-result.js`), `let/const` в новых (`engine.js`, `tracker.js`)
3. CSS-переменные для цветов — обязательно
4. Кэшбастинг в `index.html`: `?v=<timestamp>` при изменении JS
5. Не трогать `*.check` файлы

### Архитектура
1. `data.js` — единственный источник правды об архетипах
2. Новые модули — отдельные JS-файлы, подключать в `index.html`
3. Глобальные переменные: `archetypes`, `userVector`, `Tracker`, `Interpreter`, `Pivot`, `ArchetypeThemes`, `HolographicQuest`, `ArchetypeResult`
4. Избегать циклических зависимостей между модулями

### Тестирование
1. Проверять на десктопе (Chrome/Edge) и мобильном (touch)
2. Canvas должен корректно ресайзиться (`resizeCanvas` на `window.resize`)
3. Jog-dials и brand dot должны работать с мышью и тачем

---

## Контекст многосессионной разработки

Сессионные заметки, TODO и архитектурные решения хранятся в `.ai-context/`:

| Файл | Назначение |
|------|------------|
| `.ai-context/CONTEXT.md` | Краткий стартовый контекст для новой сессии |
| `.ai-context/SESSIONS.md` | Лог сессий: что делали, что решили |
| `.ai-context/TODO.md` | Текущие задачи и бэклог |
| `.ai-context/DECISIONS.md` | Архитектурные и продуктовые решения |
| `.ai-context/sessions/` | Отдельные файлы по каждой сессии (если много) |

**Правило:** в начале каждой новой сессии AI должен прочитать `.ai-context/CONTEXT.md` и `.ai-context/TODO.md`.
