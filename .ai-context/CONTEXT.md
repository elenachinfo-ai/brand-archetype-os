# ArchetypeOS — Стартовый контекст

## Что это
Brand Archetype OS — интерактивный движок для определения архетипа бренда через 4D-вектор (Control, Energy, Focus, Method). HUD-интерфейс: canvas-поле с 12 точками-архетипами, jog-dial регуляторы, live analytics, экспорт Brand Passport.

## Стек
- HTML5, CSS3 (custom properties), Vanilla ES6+
- Canvas 2D API
- Без сборки, без фреймворков

## Ключевые файлы
- `index.html` — точка входа, подключает все JS с кэшбастингом `?v=`
- `styles.css` — дизайн-система (~2200 строк, glassmorphism)
- `data.js` — 12 архетипов (vector, weights, color, rules, texts)
- `engine.js` — **ядро**: canvas, ranking, drag, presets, export (~750 строк)
- `tracker.js` — behavior sensors: мышь, скролл, внимание (~460 строк)
- `interpreter.js` — EMA-bridge signals → userVector (~170 строк)
- `pivot.js` — UI-трансформация по lock (~210 строк)
- `archetype-themes.js` — 12 тем (CSS vars + canvas colors) (~440 строк)
- `diagnostic.js` — 12-карточный тест HolographicQuest (~430 строк)
- `archetype-result.js` — модальное окно Brand Passport (~260 строк)
- `init-tracking.js` — инициализация трекера + pivot (~65 строк)

## Архитектура данных
```
userVector {control, energy, focus, method} → calcDistance → getRankings()
                                                    ↓
                                        Primary / Secondary / Conflict
                                                    ↓
                                        Canvas redraw + Output cards
```

## Глобальные API
- `archetypes[]` — из data.js
- `userVector{}` — из engine.js
- `Tracker`, `Interpreter`, `Pivot`, `ArchetypeThemes`, `HolographicQuest`, `ArchetypeResult`
- `updateAll()`, `updateBrandPositionFromVector()`, `animateToVector()`, `getRankings()`

## Важные ограничения
- Работаем в ветке `archetypes96`, `main` не трогаем
- `*.check` файлы не редактировать
- Кэшбастинг `?v=<timestamp>` в index.html при изменении JS
- `var` в старых модулях, `let/const` в новых
- Мышь + тач для всех интерактивных элементов

## Последнее состояние
Сессия 0: Создана ветка archetypes96, инициализирована структура многосессионной разработки (AGENTS.md + .ai-context/).
