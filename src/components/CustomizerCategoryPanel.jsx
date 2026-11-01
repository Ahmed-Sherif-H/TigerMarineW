const GOLD = '#C4A36A';

export const ORBIT_CATEGORY_OPTIONS = {
  interior: [
    { id: 'rear-sofa', label: 'Premium rear sofa', hint: 'Optional equipment' },
    { id: 'helm-seats', label: 'Bolster helm seats', hint: 'Optional equipment' },
    { id: 'audio', label: 'Marine audio system', hint: 'Optional equipment' },
    { id: 'cabin-pack', label: 'Cabin comfort pack', hint: 'Optional equipment' },
  ],
  engine: [
    { id: 'suzuki-single', label: 'Suzuki DF300AP · Single', hint: 'Power package' },
    { id: 'suzuki-twin', label: 'Suzuki DF300AP · Twin', hint: 'Power package' },
    { id: 'mercury-twin', label: 'Mercury Verado 300 · Twin', hint: 'Power package' },
  ],
  accessories: [
    { id: 't-top', label: 'Carbon T-top', hint: 'Optional equipment' },
    { id: 'windlass', label: 'Electric anchor windlass', hint: 'Optional equipment' },
    { id: 'shower', label: 'Deck shower', hint: 'Optional equipment' },
    { id: 'fridge', label: 'Drawer refrigerator', hint: 'Optional equipment' },
  ],
};

const TITLES = {
  interior: 'Interior',
  engine: 'Engine',
  accessories: 'Accessories',
};

export default function CustomizerCategoryPanel({
  category,
  extras,
  onToggle,
  onBack,
}) {
  const options = ORBIT_CATEGORY_OPTIONS[category] || [];
  const single = category === 'engine';

  return (
    <>
      <button
        type="button"
        aria-label="Return to exterior"
        className="absolute inset-0 z-20 bg-[#E8EAED]/80 pointer-events-auto"
        onClick={onBack}
      />
      <section className="absolute z-30 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(28rem,calc(100vw-2rem))] pointer-events-auto bg-white border border-[#C4A36A]/40 shadow-[0_24px_64px_rgba(7,19,51,0.16)] p-6">
        <div className="flex items-end justify-between pb-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] font-semibold mb-1" style={{ color: GOLD }}>
              Configure your boat
            </p>
            <h2 className="text-base font-medium tracking-[0.12em] uppercase text-[#071333]">
              {TITLES[category]}
            </h2>
          </div>
          <p className="text-[10px] text-[#6b7178]">
            {single ? 'Choose one power package' : 'Select all that apply'}
          </p>
        </div>
        <div className="py-1">
          {options.map((option, index) => {
            const selected = extras.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={selected}
                onClick={() => onToggle(option.id, single)}
                className={`w-full min-h-[3.4rem] grid grid-cols-[2rem_1fr_auto] items-center gap-3 py-2 px-1.5 text-left ${
                  selected ? 'bg-[#C4A36A]/12' : 'bg-white'
                }`}
              >
                <span
                  className="w-7 h-7 rounded-full border flex items-center justify-center text-[11px]"
                  style={{ borderColor: GOLD, color: GOLD }}
                >
                  {single ? `0${index + 1}` : '+'}
                </span>
                <span>
                  <span className="block text-[13px] font-semibold text-[#071333]">{option.label}</span>
                  <span className="block text-[10px] text-[#6b7178] mt-0.5">{option.hint}</span>
                </span>
                <span
                  className="text-[10px] uppercase tracking-[0.1em] font-medium"
                  style={{ color: selected ? GOLD : '#6b7178' }}
                >
                  {selected ? 'Added' : 'Select'}
                </span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={onBack}
          className="mt-3 w-full min-h-[2.6rem] bg-[#071333] text-white text-[11px] font-semibold uppercase tracking-[0.1em]"
        >
          Back to exterior view
        </button>
      </section>
    </>
  );
}
