# Brand Archetype OS — Документация по деплою

## Как разместить сайт через Git на хостинг

Твой проект уже на GitHub: `elenachinfo-ai/brand-archetype-os`
GitHub Pages включён, сайт доступен по адресу:
👉 **https://elenachinfo-ai.github.io/brand-archetype-os/**

---

## Процесс обновления сайта

### 1. Внести изменения в файлы

Отредактируй нужные файлы в папке проекта:
```
C:\Users\lena\work\Archetypeos\
├── index.html    — разметка и слои
├── styles.css    — дизайн-система
├── data.js       — данные 12 архетипов
└── engine.js     — логика и шаблонизатор
```

### 2. Сохранить изменения в Git

Открой терминал (PowerShell или CMD) в папке проекта и выполни:

```sh
cd C:\Users\lena\work\Archetypeos

# Добавить все изменённые файлы
git add -A

# Создать коммит с описанием изменений
git commit -m "Описание того, что поменяла"

# Отправить на GitHub
git push
```

### 3. Готово

GitHub Pages **автоматически** пересоберёт сайт в течение 1-2 минут.  
Изменения сразу появятся по адресу `https://elenachinfo-ai.github.io/brand-archetype-os/`.

---

## Как это работает с Tilda

На странице Tilda у тебя HTML-виджет с iframe:

```html
<iframe src="https://elenachinfo-ai.github.io/brand-archetype-os/"
        style="width:100%;height:100vh;border:none">
</iframe>
```

Когда ты пушишь изменения в Git — они автоматом попадают на GitHub Pages, а Tilda через iframe сразу показывает новую версию. **Ничего не нужно делать вручную в редакторе Tilda.**

---

## Если что-то пошло не так

```sh
# Проверить статус файлов
git status

# Посмотреть историю коммитов
git log --oneline

# Отменить незакоммиченные изменения
git checkout -- имя_файла

# Если push не проходит — подтянуть свежую версию
git pull origin main
```

---

## Как добавить новый файл в проект

```sh
# Создал новый файл — добавь его в Git
git add новый-файл.js

# Закоммить
git commit -m "Добавил новый-файл.js"

# Запушить
git push
```

---

## Быстрые ссылки

| Что | Ссылка |
|---|---|
| Репозиторий | `https://github.com/elenachinfo-ai/brand-archetype-os` |
| Живой сайт | `https://elenachinfo-ai.github.io/brand-archetype-os/` |
| Настройки Pages | `https://github.com/elenachinfo-ai/brand-archetype-os/settings/pages` |

---

## Резюме — три команды для обновления

```
git add -A
git commit -m "что поменяла"
git push
```

Всё.
