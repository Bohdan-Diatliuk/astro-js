interface Props {
  open: boolean;
}

export default function EnvelopeArt({ open }: Props) {
  return (
    <div className="relative hidden overflow-hidden rounded-[28px] bg-gradient-to-br from-accent-soft via-card to-canvas-end p-10 shadow-[0_30px_60px_-15px_rgba(61,44,46,0.22)] lg:flex lg:flex-col lg:items-center lg:justify-center">
      <div className="relative" style={{ perspective: '400px' }}>
        <svg viewBox="0 0 200 140" className="h-40 w-56" aria-hidden="true">
          <rect x="4" y="4" width="192" height="132" rx="14" fill="#ffffff" stroke="var(--color-outline)" strokeWidth="2" />
          <path d="M4 18 L100 90 L196 18" fill="none" stroke="var(--color-outline)" strokeWidth="2" />
          <path
            className={open ? 'envelope-flap' : ''}
            d="M4 18 L100 90 L196 18 L196 18 A14 14 0 0 0 182 4 L18 4 A14 14 0 0 0 4 18 Z"
            fill="var(--color-accent-soft)"
            stroke="var(--color-outline)"
            strokeWidth="2"
          />
          {!open && (
            <>
              <circle cx="100" cy="70" r="22" fill="var(--color-accent)" />
              <path
                d="M100 78s-9-5.4-12-10.7C86.7 63.8 88 60 91.5 59c2.3-.6 4.6.2 6.2 2.2.3.4 1 .4 1.3 0 1.6-2 3.9-2.8 6.2-2.2 3.5 1 4.8 4.8 3.5 8.3C105.5 71.6 100 78 100 78z"
                fill="#fff"
              />
            </>
          )}
        </svg>
        {open && (
          <svg
            viewBox="0 0 24 24"
            fill="var(--color-accent)"
            className="heart-pop absolute left-1/2 top-1/2 h-14 w-14"
            aria-hidden="true"
          >
            <path d="M12 21s-7.5-4.6-10.2-9.1C.2 9.2 1.4 5.6 4.6 4.6c2-.6 4 .2 5.4 2 .3.4.9.4 1.2 0 1.4-1.8 3.4-2.6 5.4-2 3.2 1 4.4 4.6 2.8 7.3C19.5 16.4 12 21 12 21z" />
          </svg>
        )}
      </div>
      <p className="mt-6 font-display text-xl italic text-ink">{open ? 'Ура!' : 'Твоє запрошення'}</p>
    </div>
  );
}
