# Бот: приветствие после /start

Маленький обработчик для Telegram-бота на **Cloudflare Workers** (бесплатный тариф).
Без базы данных и без постоянно работающего сервера: Telegram присылает сообщение,
воркер сразу отвечает.

Что делает:
- `/start` и `/help` — приветствие: тренировки в mini app, приложение бесплатное,
  кнопки «Открыть тренировки» и «Предложить идею»;
- `/feedback` — ссылка для предложений;
- любое другое сообщение — короткая подсказка с кнопкой mini app.

## Настройка

1. В `wrangler.toml` укажите `WEBAPP_URL` (адрес mini app) и `FEEDBACK_URL`
   (например `https://t.me/ваш_ник`, группа или Google Form). Пустой `FEEDBACK_URL` — кнопки нет.
   Ту же ссылку впишите в `FEEDBACK_URL` в `index.html`.
2. Другие боты: добавьте их в массив `OTHER_BOTS` в `worker.js` — они появятся
   в приветствии отдельным списком.
3. Разверните воркер:

```bash
cd bot
npx wrangler deploy
npx wrangler secret put WEBHOOK_SECRET
```

4. Подключите webhook (подставьте токен бота, адрес воркера и тот же секрет):

```bash
curl "https://api.telegram.org/bot<TOKEN>/setWebhook" -d "url=https://six-weeks-bot.<account>.workers.dev" -d "secret_token=<WEBHOOK_SECRET>"
```

5. Команды в меню бота:

```bash
curl "https://api.telegram.org/bot<TOKEN>/setMyCommands" -H "content-type: application/json" -d '{"commands":[{"command":"start","description":"Начать"},{"command":"feedback","description":"Предложить идею"}]}'
```

Токен бота в воркер не нужен: ответ отправляется в теле ответа на webhook.

## Описание до /start (по желанию)

В @BotFather → `Edit Bot` → `Edit Description` можно задать текст, который видно
в пустом чате до нажатия «Старт», например:

> Бесплатный тренер «6 недель»: отжимания, подтягивания, пресс и приседания. Тренировки — в мини-приложении.
