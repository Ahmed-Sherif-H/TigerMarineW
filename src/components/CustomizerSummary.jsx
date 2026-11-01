import { getColorHex } from '../data/customizerColorMap';
import { ORBIT_CATEGORY_OPTIONS } from './CustomizerCategoryPanel';

const GOLD = '#C4A36A';

const PART_ORDER = [
  { key: 'upholestry', label: 'Upholstery' },
  { key: 'fiberglass', label: 'Fiberglass' },
  { key: 'tubeDecoration', label: 'Tube decoration' },
  { key: 'sideFender', label: 'Side fender' },
  { key: 'tube', label: 'Tube' },
  { key: 'deckFloor', label: 'Deck floor' },
];

function extraLabel(id) {
  for (const list of Object.values(ORBIT_CATEGORY_OPTIONS)) {
    const found = list.find((item) => item.id === id);
    if (found) return found.label;
  }
  return id;
}

export default function CustomizerSummary({
  modelName,
  selectedColors,
  extras,
  saved,
  onClose,
  onJump,
  onSave,
  onQuote,
}) {
  return (
    <>
      <button
        type="button"
        aria-label="Close build summary"
        className="fixed inset-0 z-[60] bg-[#071333]/22 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <aside className="fixed top-0 right-0 z-[61] h-dvh w-[min(27rem,100vw)] bg-[#f9faf9] shadow-[-24px_0_64px_rgba(7,19,51,0.16)] p-6 flex flex-col">
        <div className="flex items-start justify-between pb-5 border-b border-black/10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] font-semibold mb-1" style={{ color: GOLD }}>
              Your configuration
            </p>
            <h2 className="text-xl font-medium tracking-[0.08em] uppercase text-[#071333]">{modelName}</h2>
          </div>
          <button
            type="button"
            aria-label="Close summary"
            onClick={onClose}
            className="w-10 h-10 border border-black/10 text-black/45 grid place-items-center"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto border-t border-black/10 flex-1">
          {PART_ORDER.map(({ key, label }) => {
            const color = selectedColors[key];
            if (!color) return null;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onJump(key)}
                className="w-full min-h-[3.6rem] grid grid-cols-[2rem_1fr_1.25rem] items-center gap-3 py-2 px-1 text-left border-b border-black/8 hover:bg-white"
              >
                <span
                  className="w-7 h-7 rounded-full border border-black/10"
                  style={{ backgroundColor: getColorHex(color) }}
                />
                <span>
                  <span className="block text-[10px] uppercase tracking-[0.1em] text-black/40">{label}</span>
                  <span className="block text-[13px] font-semibold text-[#071333]">{color}</span>
                </span>
                <span className="text-black/30">›</span>
              </button>
            );
          })}
          {extras.map((id) => (
            <button
              key={id}
              type="button"
              onClick={onClose}
              className="w-full min-h-[3.6rem] grid grid-cols-[2rem_1fr_1.25rem] items-center gap-3 py-2 px-1 text-left border-b border-black/8 hover:bg-white"
            >
              <span
                className="w-7 h-7 rounded-full grid place-items-center text-sm"
                style={{ color: GOLD, background: 'rgba(196,163,106,0.1)', border: '1px solid rgba(196,163,106,0.45)' }}
              >
                +
              </span>
              <span>
                <span className="block text-[10px] uppercase tracking-[0.1em] text-black/40">Equipment</span>
                <span className="block text-[13px] font-semibold text-[#071333]">{extraLabel(id)}</span>
              </span>
              <span className="text-black/30">›</span>
            </button>
          ))}
        </div>

        <div className="pt-5 mt-auto">
          <button
            type="button"
            onClick={onSave}
            className="w-full min-h-[3.1rem] mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#071333] border border-[#071333]"
          >
            {saved ? 'Draft saved' : 'Save draft'}
          </button>
          <button
            type="button"
            onClick={onQuote}
            className="w-full min-h-[3.1rem] text-[11px] font-semibold uppercase tracking-[0.08em] text-white bg-[#071333]"
          >
            Request a quote
          </button>
          <p className="max-w-[19rem] mx-auto mt-3 text-[10px] leading-relaxed text-black/40 text-center">
            No payment required. A Tiger Marine specialist will contact you.
          </p>
        </div>
      </aside>
    </>
  );
}
