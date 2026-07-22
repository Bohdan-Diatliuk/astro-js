import { useRef, useState } from "react";

const DODGE_RADIUS = 120;
const VIEWPORT_MARGIN = 16;

export default function RunawayButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null,
  );

  function handlePointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = centerX - event.clientX;
    const dy = centerY - event.clientY;
    const distance = Math.hypot(dx, dy);

    if (distance > DODGE_RADIUS) return;

    const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.6;
    const jumpDistance = DODGE_RADIUS + Math.random() * 80;

    const maxX = window.innerWidth - rect.width - VIEWPORT_MARGIN;
    const maxY = window.innerHeight - rect.height - VIEWPORT_MARGIN;

    const nextX = clamp(
      centerX + Math.cos(angle) * jumpDistance - rect.width / 2,
      VIEWPORT_MARGIN,
      maxX,
    );
    const nextY = clamp(
      centerY + Math.sin(angle) * jumpDistance - rect.height / 2,
      VIEWPORT_MARGIN,
      maxY,
    );

    setPosition({ x: nextX, y: nextY });
  }

  const style: React.CSSProperties = position
    ? {
        position: "fixed",
        left: position.x,
        top: position.y,
        transition: "left 0.15s ease-out, top 0.15s ease-out",
      }
    : {};

  return (
    <button
      ref={buttonRef}
      type="button"
      onPointerMove={handlePointerMove}
      style={style}
      className="rounded-full border border-outline bg-card px-8 py-3 font-medium text-ink select-none"
    >
      Ні
    </button>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
