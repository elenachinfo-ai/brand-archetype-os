# ArchetypeOS — Стартовый контекст

## Что это
Brand Archetype OS — интерактивный движок для определения архетипа бренда через 4D-вектор (Control, Energy, Focus, Method). HUD-интерфейс: canvas-поле с 12 точками-архетипами, jog-dial регуляторы, live analytics, экспорт Brand Passport.

## Стек
- HTML5, CSS3 (custom properties), Vanilla ES6+
- Canvas 2D API
- Без сборки, без фреймворков
- Локальный сервер: `node dev-server.js` → http://localhost:8000/

## Ключевые файлы
- `index.html` — точка входа, разметка HUD
- `styles.css` — дизайн-система (~2200 строк)
- `data.js` — 12 архетипов (vector, weights, color, rules, texts)
- `engine.js` — **ядро**: canvas, ranking, drag, presets, export (~750 строк)
- `tracker.js` — behavior sensors (~460 строк)
- `interpreter.js` — EMA-bridge signals → userVector (~170 строк)
- `pivot.js` — UI-трансформация по lock (~210 строк)
- `archetype-themes.js` — 12 тем (CSS vars + canvas colors) (~440 строк)
- `diagnostic.js` — 12-карточный тест HolographicQuest (~430 строк)
- `archetype-result.js` — модальное окно Brand Passport (~260 строк)
- `init-tracking.js` — инициализация трекера + pivot (~65 строк)
- `dev-server.js` — локальный Node-сервер для разработки

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
- `data.js` — единственный источник правды об архетипах
- Все интерактивные элементы должны работать с мышью и тачем

## Текущее состояние проекта (Сессия 1 завершена)

### Что сделано
- Создана ветка `archetypes96`
- Инициализирована многосессионная структура (AGENTS.md + .ai-context/)
- Запущен локальный dev-сервер (`node dev-server.js` на :8000)
- Проведено исследование популярных тестов на архетипы бренда
- Создан исследовательский документ: `.ai-context/research-quiz-examples.md`

### Исследование: ключевые находки
| Тест | Вопросов | Формат | UI |
|------|----------|--------|-----|
| 16personalities | 60 | Likert 5-point, 1 вопрос = 1 экран | Progress bar, плавные анимации — золотой стандарт |
| Brand Personality Quiz | 7 | Drag-and-drop 12 вариантов | Clean, сценарные вопросы |
| How to Fascinate | ~28 | A vs B (дуальный) | Яркие цвета, heat map |
| PMAI (Pearson-Marr) | **96** | Likert scale | Профессиональный референс |

### Рекомендуемая структура нового теста
Разбить 96 вопросов на 5 блоков (~16 мин):
1. **Ядро** (12 вопросов) — A-vs-B + Likert → примерный топ-3
2. **Мотивация** (24) — цели, страхи, ценности
3. **Поведение** (24) — решения, коммуникация, кризис
4. **Визуальная идентичность** (24) — цвета, тон, UX
5. **Валидация** (12) — проверочные + самооценка → confidence score

### Планируемая архитектура интерфейса
- **Левая панель** = карточка вопроса (свайп/кнопки)
- **Правая панель** = canvas-поле, точка бренда живо реагирует на каждый ответ
- **HUD** = progress-индикатор в стиле jog-dial
- Между блоками — scan-анимация (есть в pivot.js)

### Что сделано в Сессии 2
- Создан прототип тестового модуля `quiz-engine.js` — Блок 1 (12 вопросов)
- 6 A-vs-B + 6 Likert, каждый ответ влияет на 4D-вектор
- Живая обратная связь на canvas: каждый ответ = точка бренда движется
- Progress bar, scan-анимация между вопросами, итоговый экран с top-3
- QuizEngine интегрирован через статическую кнопку в хедере (избегает конфликта с HolographicQuest)
- Стили добавлены в `styles.css` (адаптивные)
- Dev-сервер работает на :8000, есть `start-server.bat` для Windows
- Коммит `a3cc722` запушен в `main` через `archetypes96`
- GitHub Actions деплой на reg.ru починен и работает (`FTP_PASSWORD` + `v4.3.5` action)
- `gh` CLI установлен и авторизован

### Следующий шаг
- Проверить интерактив квиза на продакшене (reg.ru)
- При необходимости откалибровать дельты вопросов
- Масштабировать на Блок 2 (Мотивация, 24 вопроса)
