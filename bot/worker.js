/*
 * Telegram-бот для mini app «6 недель».
 * Cloudflare Worker, принимает обновления через webhook и отвечает
 * прямо в теле ответа — без исходящих запросов и без базы данных.
 *
 * Переменные (wrangler.toml / Cloudflare dashboard):
 *   WEBAPP_URL      — адрес mini app (https://...)
 *   FEEDBACK_URL    — ссылка для предложений (t.me/..., Google Form и т.п.); пусто — кнопки не будет
 *   WEBHOOK_SECRET  — секрет, тот же, что передан в setWebhook (secret_token)
 */

// Другие боты — появятся в приветствии, когда список не пустой.
// Пример: { name: 'Бег 5 км', url: 'https://t.me/run5k_bot', about: 'бег с нуля до 5 км' }
const OTHER_BOTS = [];

const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

function welcomeText() {
  let t =
    '👋 <b>Привет! Это бесплатный тренер по программе «6 недель».</b>\n\n' +
    '💪 Отжимания, подтягивания, пресс и приседания — по плану, который подстраивается под ваш уровень.\n\n' +
    '📱 Тренировки проходят в мини-приложении: нажмите «Открыть тренировки» ниже ' +
    'или кнопку меню рядом с полем ввода.\n\n' +
    '🆓 Приложение полностью бесплатное: без подписок, рекламы и регистрации. ' +
    'Прогресс сохраняется в вашем Telegram-аккаунте.';
  if (OTHER_BOTS.length) {
    t += '\n\n🤖 <b>Другие наши боты:</b>\n' + OTHER_BOTS
      .map((b) => `• <a href="${esc(b.url)}">${esc(b.name)}</a>${b.about ? ' — ' + esc(b.about) : ''}`)
      .join('\n');
  }
  return t;
}

function keyboard(env, withApp) {
  const rows = [];
  if (withApp && env.WEBAPP_URL) rows.push([{ text: '🏋️ Открыть тренировки', web_app: { url: env.WEBAPP_URL } }]);
  if (env.FEEDBACK_URL) rows.push([{ text: '💡 Предложить идею', url: env.FEEDBACK_URL }]);
  return rows.length ? { inline_keyboard: rows } : undefined;
}

function reply(chatId, text, markup) {
  const body = { method: 'sendMessage', chat_id: chatId, text, parse_mode: 'HTML', link_preview_options: { is_disabled: true } };
  if (markup) body.reply_markup = markup;
  return new Response(JSON.stringify(body), { headers: { 'content-type': 'application/json' } });
}

export function handleUpdate(update, env) {
  const msg = update && update.message;
  // web_app-кнопки работают только в личных чатах
  if (!msg || !msg.chat || msg.chat.type !== 'private' || typeof msg.text !== 'string') return new Response('ok');

  const cmd = msg.text.trim().split(/[\s@]/)[0].toLowerCase();
  const chatId = msg.chat.id;

  if (cmd === '/start' || cmd === '/help') return reply(chatId, welcomeText(), keyboard(env, true));

  if (cmd === '/feedback') {
    if (!env.FEEDBACK_URL) return reply(chatId, 'Раздел для предложений скоро появится.');
    return reply(chatId, '💡 Есть идея или нашли ошибку? Напишите нам — читаем всё.', keyboard(env, false));
  }

  return reply(chatId, 'Тренировки проходят в мини-приложении 👇', keyboard(env, true));
}

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') return new Response('ok');
    if (env.WEBHOOK_SECRET && request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== env.WEBHOOK_SECRET) {
      return new Response('forbidden', { status: 403 });
    }
    let update;
    try { update = await request.json(); } catch (e) { return new Response('ok'); }
    return handleUpdate(update, env);
  }
};
