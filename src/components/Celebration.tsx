import { useEffect, useState } from 'react';

const BALLOON_COLORS = ['#c5433e', '#d8c08a', '#f6d9cf', '#8fb6c9', '#e29aa8'];

const BALLOONS = Array.from({ length: 12 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: (i % 6) * 0.18,
  drift: ((i % 5) - 2) * 30,
  color: BALLOON_COLORS[i % BALLOON_COLORS.length],
}));

export default function Celebration() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  if (!enabled) return null;

  return (
    <div className="celebration-overlay pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {BALLOONS.map((balloon, i) => (
        <svg
          key={i}
          viewBox="0 0 24 34"
          className="balloon absolute bottom-[-10%] h-14 w-10"
          style={{ left: `${balloon.left}%`, animationDelay: `${balloon.delay}s`, ['--drift' as string]: `${balloon.drift}px` }}
          aria-hidden="true"
        >
          <ellipse cx="12" cy="12" rx="10" ry="12" fill={balloon.color} />
          <path d="M12 24 L10 27 L14 29 L11 32" stroke={balloon.color} strokeWidth="1" fill="none" opacity="0.6" />
        </svg>
      ))}

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:hidden" style={{ perspective: '400px' }}>
        <svg viewBox="0 0 200 140" className="h-36 w-52 drop-shadow-xl" aria-hidden="true">
          <rect x="4" y="4" width="192" height="132" rx="14" fill="#ffffff" stroke="var(--color-outline)" strokeWidth="2" />
          <path d="M4 18 L100 90 L196 18" fill="none" stroke="var(--color-outline)" strokeWidth="2" />
          <path
            className="envelope-flap"
            d="M4 18 L100 90 L196 18 L196 18 A14 14 0 0 0 182 4 L18 4 A14 14 0 0 0 4 18 Z"
            fill="var(--color-accent-soft)"
            stroke="var(--color-outline)"
            strokeWidth="2"
          />
        </svg>
        <svg
          viewBox="0 0 24 24"
          fill="var(--color-accent)"
          className="heart-pop absolute left-1/2 top-1/2 h-14 w-14"
          aria-hidden="true"
        >
          <path d="M12 21s-7.5-4.6-10.2-9.1C.2 9.2 1.4 5.6 4.6 4.6c2-.6 4 .2 5.4 2 .3.4.9.4 1.2 0 1.4-1.8 3.4-2.6 5.4-2 3.2 1 4.4 4.6 2.8 7.3C19.5 16.4 12 21 12 21z" />
        </svg>
      </div>
    </div>
  );
}
