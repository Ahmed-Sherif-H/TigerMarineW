import { useEffect, useRef } from 'react';
import { getColorHex } from '../data/customizerColorMap';

const GOLD = '#C4A36A';

const HUD_LABELS = {
  deckFloor: 'Deck Floor',
  fiberglass: 'Fiberglass',
  sideFender: 'Side Fender',
  tube: 'Tube',
  tubeDecoration: 'Tube Decoration',
  upholestry: 'Upholstery',
};

function textureFor(key) {
  if (key === 'upholestry') {
    return 'repeating-linear-gradient(90deg, rgba(255,255,255,0.07) 0 1px, transparent 1px 3px), repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0 1px, transparent 1px 4px)';
  }
  if (key === 'fiberglass') {
    return 'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.55) 0 18%, transparent 42%), radial-gradient(circle at 70% 68%, rgba(0,0,0,0.06) 0 12%, transparent 40%)';
  }
  if (key === 'deckFloor') {
    return 'repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 2px, rgba(0,0,0,0.16) 2px 3px, transparent 3px 9px)';
  }
  return 'radial-gradient(circle at 38% 32%, rgba(255,255,255,0.18), transparent 58%)';
}

function visibleColors(colors) {
  const hasBeige = colors.includes('Beige');
  return colors.filter((c) => !(c === 'Baige' && hasBeige));
}

function PartDisc({ partKey, color, size, active }) {
  return (
    <span
      className="relative shrink-0 rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: getColorHex(color),
        backgroundImage: textureFor(partKey),
        border: active ? `1.5px solid ${GOLD}` : '1px solid rgba(7,19,51,0.14)',
        boxShadow: active
          ? '0 0 0 3px rgba(196,163,106,0.22), 0 8px 18px rgba(40,48,58,0.12)'
          : '0 1px 3px rgba(7,19,51,0.1)',
      }}
    />
  );
}

export default function Customizer3DHud({
  partKey,
  stationKeys,
  selectedColors,
  availableColors,
  onColorChange,
  onGoTo,
  hint,
  stacked = false,
  onBind,
}) {
  const pinRef = useRef(null);
  const rowRef = useRef(null);

  useEffect(() => {
    if (!onBind) return undefined;
    const update = ({ pinX, pinY, opacity }) => {
      const pin = pinRef.current;
      if (!pin) return;
      pin.style.opacity = String(opacity);
      pin.style.transform = `translate(${pinX - 5}px, ${pinY - 5}px)`;
    };
    onBind(update);
    return () => onBind(null);
  }, [onBind, partKey]);

  useEffect(() => {
    const active = rowRef.current?.querySelector('[data-active="true"]');
    active?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [partKey]);

  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-visible">
      <span
        ref={pinRef}
        className="absolute top-0 left-0 w-2.5 h-2.5 rounded-full"
        style={{
          background: GOLD,
          boxShadow: '0 0 0 4px rgba(196,163,106,0.28)',
          opacity: 0,
          willChange: 'transform, opacity',
        }}
      />

      <div
        className={
          stacked
            ? 'absolute left-0 right-0 top-full px-4 pt-2 pb-4 flex flex-col items-center gap-2'
            : 'absolute bottom-0 left-0 right-0 px-4 pb-2.5 pt-1 flex flex-col items-center gap-2'
        }
      >
        {hint && (
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#071333]/45">
            Drag to rotate in 3D
          </p>
        )}

        <div
          ref={rowRef}
          className="pointer-events-auto flex items-end justify-start sm:justify-center gap-2 max-w-full overflow-x-auto pb-1 scroll-px-4"
        >
          {stationKeys.map((key) => {
            const active = key === partKey;
            const color = selectedColors[key];
            const label = HUD_LABELS[key] || key;
            const colors = visibleColors(availableColors[key] || []);
            return (
              <div
                key={key}
                data-active={active ? 'true' : 'false'}
                className="shrink-0 rounded-2xl border bg-white/90 shadow-[0_8px_24px_rgba(40,48,58,0.1)] backdrop-blur-md transition-all duration-500 ease-out"
                style={{
                  borderColor: active ? 'rgba(196,163,106,0.45)' : 'rgba(7,19,51,0.08)',
                  padding: active ? '10px 14px' : '8px 8px 7px',
                }}
              >
                {active ? (
                  <div className="flex items-center gap-3 min-w-[10.5rem]">
                    <PartDisc partKey={key} color={color} size={48} active />
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.16em] font-semibold leading-none" style={{ color: GOLD }}>
                        {label}
                      </p>
                      <p className="mt-1.5 text-[13px] text-[#6b7178] leading-none">
                        {color === 'Baige' ? 'Beige' : color}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {colors.map((c) => {
                          const picked = c === color || (c === 'Beige' && color === 'Baige');
                          return (
                            <button
                              key={c}
                              type="button"
                              title={c}
                              onClick={() => onColorChange(key, c)}
                              className="rounded-full transition-transform hover:scale-110"
                              style={{
                                width: 14,
                                height: 14,
                                backgroundColor: getColorHex(c),
                                border: picked ? `1.5px solid ${GOLD}` : '1px solid rgba(7,19,51,0.14)',
                                boxShadow: picked ? '0 0 0 2px rgba(196,163,106,0.28)' : '0 1px 3px rgba(7,19,51,0.12)',
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onGoTo(key)}
                    className="flex flex-col items-center gap-1.5 min-w-[3.1rem]"
                    aria-label={label}
                  >
                    <PartDisc partKey={key} color={color} size={32} active={false} />
                    <span className="text-[8px] uppercase tracking-[0.12em] text-[#071333]/40 leading-none whitespace-nowrap">
                      {label}
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
