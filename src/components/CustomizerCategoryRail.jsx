const GOLD = '#C4A36A';

const CATEGORIES = [
  { id: 'exterior', label: 'Exterior' },
];

function BoatIcon() {
  return (
    <svg viewBox="0 0 64 40" className="w-[72%] h-auto" fill="none" aria-hidden="true">
      <path d="M8 24c8-8 20-12 36-10 4 4 6 8 8 12-14 2-30 2-44 0z" fill="#9AA0A8" />
      <path d="M14 22c6-3 16-5 28-4" stroke="#6B7178" strokeWidth="1.2" />
      <path d="M18 18l4-8h8l3 8" stroke="#6B7178" strokeWidth="1.2" fill="#C5C9CE" />
    </svg>
  );
}

const ICONS = {
  exterior: BoatIcon,
};

export default function CustomizerCategoryRail({
  active,
  onChange,
}) {
  const idx = CATEGORIES.findIndex((c) => c.id === active);
  const cycle = (dir) => {
    const next = (idx + dir + CATEGORIES.length) % CATEGORIES.length;
    onChange(CATEGORIES[next].id);
  };

  return (
    <div
      className="absolute z-30 pointer-events-auto flex flex-col"
      style={{ left: '1.15rem', top: '50%', width: '8.9rem', gap: '0.62rem', transform: 'translateY(-44%)' }}
    >
      {CATEGORIES.map((cat) => {
        const selected = cat.id === active;
        const Icon = ICONS[cat.id];
        return (
          <div
            key={cat.id}
            className={`relative w-full overflow-hidden transition-all ${
              selected
                ? 'bg-white/70 shadow-[0_8px_24px_rgba(40,48,58,0.1)]'
                : 'bg-white/45 hover:bg-white/65'
            }`}
            style={{
              height: selected ? '8.35rem' : '5.15rem',
              borderRadius: '1rem',
              border: selected ? `1px solid ${GOLD}` : '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <button
              type="button"
              onClick={() => onChange(cat.id)}
              className="absolute inset-0"
              aria-label={cat.label}
              aria-pressed={selected}
            />
            {selected && CATEGORIES.length > 1 && (
              <>
                <button
                  type="button"
                  className="absolute left-0.5 top-1/2 -translate-y-1/2 z-10 w-6 h-8 flex items-center justify-center text-[#C4A36A] text-lg"
                  onClick={() => cycle(-1)}
                  aria-label="Previous category"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="absolute right-0.5 top-1/2 -translate-y-1/2 z-10 w-6 h-8 flex items-center justify-center text-[#C4A36A] text-lg"
                  onClick={() => cycle(1)}
                  aria-label="Next category"
                >
                  ›
                </button>
              </>
            )}
            <span className="absolute inset-0 flex items-center justify-center pt-1 pointer-events-none">
              <Icon />
            </span>
            <span
              className={`absolute left-0 right-0 text-center uppercase pointer-events-none ${
                selected ? 'text-[#071333]/55' : 'text-[#071333]/40'
              }`}
              style={{ bottom: '0.45rem', fontSize: '0.58rem', letterSpacing: '0.16em', fontWeight: 500 }}
            >
              {cat.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
