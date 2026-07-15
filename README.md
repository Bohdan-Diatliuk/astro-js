# Date Invitation

Інтерактивне запрошення на побачення — чотирикроковий флоу на Astro з React-острівцями.

## Флоу

1. `/` — "Ти підеш зі мною на побачення?" Кнопка "Так" веде на `/calendar`, кнопка "Ні" тікає від курсора.
2. `/calendar` — вибір дати (react-day-picker), передається в URL як `?date=`.
3. `/map` — вибір точки на мапі (Leaflet + OpenStreetMap), координати (і реальна адреса через зворотне геокодування Nominatim) додаються в URL.
4. `/confirm` — підсумок, кнопка "Підтвердити" шле POST на `/api/notify`.
5. `/api/notify` — серверний endpoint, надсилає повідомлення в Telegram через Bot API.

Стан між кроками передається виключно через query-параметри URL — без бекенду чи localStorage.

## Локальна розробка

```sh
npm install
cp .env.example .env   # і заповни TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID
npm run dev
```

Або в background-режимі (див. `AGENTS.md`):

```sh
astro dev --background
astro dev logs
astro dev stop
```

Сайт буде на `http://localhost:4321`.

## Змінні середовища

Дивись `.env.example`. Обидві потрібні лише на сервері (`src/pages/api/notify.ts`), у клієнтський бандл не потрапляють:

- `TELEGRAM_BOT_TOKEN` — токен бота, отримати в [@BotFather](https://t.me/BotFather) командою `/newbot`.
- `TELEGRAM_CHAT_ID` — id чату, куди бот надсилатиме повідомлення. Напиши своєму боту будь-що, тоді відкрий `https://api.telegram.org/bot<TOKEN>/getUpdates` і візьми `message.chat.id`. Або простіше — напиши [@userinfobot](https://t.me/userinfobot), він одразу покаже твій числовий id.

## Деплой на Vercel

Проєкт налаштований з `@astrojs/vercel` адаптером (`astro.config.mjs`).

1. Заведи новий проєкт на [vercel.com](https://vercel.com) з цього репозиторію — Vercel сам розпізнає Astro.
2. У Project Settings → Environment Variables додай `TELEGRAM_BOT_TOKEN` і `TELEGRAM_CHAT_ID`.
3. Deploy. Сторінки `/`, `/calendar` лишаються статичними; `/map`, `/confirm` і `/api/notify` рендеряться на вимогу (в них є `export const prerender = false`, бо їм потрібні query-параметри запиту й серверні секрети).

## Стек

- [Astro](https://docs.astro.build) (TypeScript)
- React-острівці (`@astrojs/react`) для інтерактивних частин
- Tailwind CSS v4
- [react-day-picker](https://daypicker.dev) — вибір дати
- [Leaflet](https://leafletjs.com) + OpenStreetMap — вибір локації
