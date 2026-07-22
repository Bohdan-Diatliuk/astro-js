import { useState } from "react";
import Celebration from "./Celebration";
import EnvelopeArt from "./EnvelopeArt";

interface Props {
  date: string;
  formattedDate: string;
  lat: number;
  lng: number;
  locationLabel: string;
  mapsLink: string;
}

type Status = "idle" | "loading" | "success" | "error";

export default function ConfirmCard({
  date,
  formattedDate,
  lat,
  lng,
  locationLabel,
  mapsLink,
}: Props) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleConfirm() {
    setStatus("loading");
    try {
      const response = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, location: { lat, lng } }),
      });

      if (!response.ok) throw new Error("request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const isSuccess = status === "success";

  return (
    <div className="grid items-center gap-12 lg:grid-cols-2">
      {isSuccess && <Celebration />}

      <div className="rounded-[28px] bg-card px-8 py-10 text-center shadow-[0_30px_60px_-15px_rgba(61,44,46,0.22)] sm:px-10">
        <div className="flex justify-center gap-2" aria-hidden="true">
          {[0, 1, 2, 3].map((segment) => (
            <span
              key={segment}
              className="h-0.5 w-8 rounded-full bg-accent/50"
            />
          ))}
        </div>

        <h1 className="mt-6 font-display text-3xl text-accent sm:text-4xl">
          {isSuccess ? "Готово!" : "Все вірно?"}
        </h1>
        <p className="mt-3 text-ink-soft">
          {isSuccess
            ? "Запрошення надіслано. Лишається чекати нашого побачення!"
            : "Перевір деталі перед тим, як надіслати запрошення."}
        </p>

        <div className="mt-7 grid grid-cols-2 gap-3 text-left">
          <div className="rounded-2xl bg-canvas-start/70 p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-accent">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path strokeLinecap="round" d="M8 3v4M16 3v4M3 10h18" />
              </svg>
            </span>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Дата
            </p>
            <p className="font-display text-lg text-ink">{formattedDate}</p>
          </div>
          <div className="rounded-2xl bg-canvas-start/70 p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-accent">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M12 2C7.6 2 4 5.6 4 10c0 6 8 12 8 12s8-6 8-12c0-4.4-3.6-8-8-8zm0 11a3 3 0 110-6 3 3 0 010 6z" />
              </svg>
            </span>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Місце
            </p>
            <a
              href={mapsLink}
              target="_blank"
              rel="noreferrer"
              className="line-clamp-2 font-display text-base text-ink underline decoration-accent-soft"
            >
              {locationLabel}
            </a>
          </div>
        </div>

        {isSuccess ? (
          <div className="mt-7 rounded-full bg-accent/15 px-8 py-3 font-medium text-accent-dark">
            Запрошення надіслано ✓
          </div>
        ) : (
          <button
            type="button"
            onClick={handleConfirm}
            disabled={status === "loading"}
            className="mt-7 w-full rounded-full bg-accent px-8 py-3 font-medium text-white shadow-[0_10px_20px_-8px_rgba(197,67,62,0.6)] transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === "loading" ? "Надсилаю…" : "Підтвердити"}
          </button>
        )}

        {status === "error" && (
          <p className="mt-3 text-sm text-red-600">
            Щось пішло не так, спробуй ще раз.
          </p>
        )}
        {isSuccess && <p className="mt-4 text-accent">До зустрічі! 💌</p>}
      </div>

      <EnvelopeArt open={isSuccess} />
    </div>
  );
}
