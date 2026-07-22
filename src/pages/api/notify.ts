import type { APIRoute } from "astro";

export const prerender = false;

interface NotifyBody {
  date: string;
  location: { lat: number; lng: number };
}

function isValidBody(value: unknown): value is NotifyBody {
  if (typeof value !== "object" || value === null) return false;
  const body = value as Record<string, unknown>;

  if (typeof body.date !== "string" || body.date.trim() === "") return false;

  const location = body.location as Record<string, unknown> | undefined;
  if (typeof location !== "object" || location === null) return false;

  return Number.isFinite(location.lat) && Number.isFinite(location.lng);
}

export const POST: APIRoute = async ({ request }) => {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
    });
  }

  if (!isValidBody(payload)) {
    return new Response(JSON.stringify({ error: "Invalid payload" }), {
      status: 400,
    });
  }

  const botToken = import.meta.env.TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return new Response(JSON.stringify({ error: "Server is not configured" }), {
      status: 500,
    });
  }

  const { date, location } = payload;
  const formattedDate = new Intl.DateTimeFormat("uk-UA", {
    dateStyle: "long",
  }).format(new Date(`${date}T00:00:00`));
  const mapsLink = `https://www.google.com/maps?q=${location.lat},${location.lng}`;

  const text = [
    "💌 Хтось погодився на побачення!",
    `📅 Дата: ${formattedDate}`,
    `📍 Місце: ${mapsLink}`,
  ].join("\n");

  const telegramResponse = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    },
  );

  if (!telegramResponse.ok) {
    return new Response(JSON.stringify({ error: "Failed to notify" }), {
      status: 502,
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
