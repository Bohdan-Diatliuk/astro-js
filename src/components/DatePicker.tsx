import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { uk } from "react-day-picker/locale";
import "react-day-picker/style.css";

function toISODate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function DatePicker() {
  const [selected, setSelected] = useState<Date | undefined>(undefined);

  return (
    <div className="rounded-[28px] bg-card p-6 shadow-[0_30px_60px_-15px_rgba(61,44,46,0.18)] sm:p-8">
      <p className="mb-4 text-sm text-ink-soft">Обери бажану дату</p>
      <DayPicker
        mode="single"
        locale={uk}
        selected={selected}
        onSelect={setSelected}
        disabled={{ before: new Date() }}
      />
      <div className="mt-6 flex justify-end">
        {selected ? (
          <a
            href={`/map?date=${toISODate(selected)}`}
            className="rounded-full bg-accent px-8 py-3 font-medium text-white shadow-[0_10px_20px_-8px_rgba(197,67,62,0.6)] transition hover:bg-accent-dark"
          >
            Далі
          </a>
        ) : (
          <span className="cursor-not-allowed rounded-full bg-outline/40 px-8 py-3 font-medium text-ink-soft">
            Далі
          </span>
        )}
      </div>
    </div>
  );
}
