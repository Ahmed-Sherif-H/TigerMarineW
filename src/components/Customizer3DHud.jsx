import { useEffect, useRef, useState } from 'react';
import { getStudioColorHex } from '../data/customizerColorMap';

const GOLD = '#C4A36A';
const CIRCLE_MIN = 56;
const CIRCLE_MAX = 70;

const HUD_LABELS = {
  deckFloor: 'Floor',
  fiberglass: 'Fiberglass',
  upholestry: 'Upholstery',
};

const CALL_OUTS = [
  { key: 'upholestry', side: 'left', left: 0.055, top: 0.38 },
  { key: 'fiberglass', side: 'right', left: 0.88, top: 0.26 },
  { key: 'deckFloor', side: 'right', left: 0.89, top: 0.62 },
];

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

function PartOption({
  partKey,
  color,
  colors,
  label,
  active,
  circle,
  align = 'left',
  onSelect,
  onPick,
}) {
  const hex = getStudioColorHex(color);
  const isRight = align === 'right';

  return (
    <div
      className={`pointer-events-auto flex items-start gap-2.5 ${isRight ? 'flex-row-reverse text-right' : ''}`}
    >
      <button
        type="button"
        onClick={() => onSelect(partKey)}
        className="relative shrink-0 rounded-full"
        style={{
          width: circle,
          height: circle,
          backgroundColor: hex,
          backgroundImage: textureFor(partKey),
          border: `1.5px solid ${GOLD}`,
          boxShadow: active
            ? '0 0 0 3px rgba(196,163,106,0.28), 0 5px 12px rgba(40,48,58,0.14)'
            : '0 4px 10px rgba(40,48,58,0.1)',
        }}
        aria-label={label}
      />
      <div className="relative z-10 min-w-0" style={{ paddingTop: circle * 0.28 }}>
        <p
          className="text-[10px] uppercase tracking-[0.16em] font-semibold leading-none whitespace-nowrap"
          style={{ color: GOLD }}
        >
          {label}
        </p>
        <p className="mt-1 text-[11px] text-[#6b7178] leading-none">
          {color === 'Baige' ? 'Beige' : color}
        </p>
        <div className={`flex flex-wrap gap-1.5 mt-1.5 ${isRight ? 'justify-end' : ''}`}>
          {colors.map((c) => {
            const selected = c === color || (c === 'Beige' && color === 'Baige');
            return (
              <button
                key={c}
                type="button"
                title={c}
                onClick={() => onPick(c)}
                className="rounded-full transition-transform hover:scale-110"
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: getStudioColorHex(c),
                  border: selected
                    ? `1.5px solid ${GOLD}`
                    : '1px solid rgba(7,19,51,0.14)',
                  boxShadow: selected ? '0 0 0 2px rgba(196,163,106,0.28)' : '0 1px 3px rgba(7,19,51,0.12)',
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Customizer3DHud({
  partKey,
  selectedColors,
  availableColors,
  onColorChange,
  onGoTo,
  hint,
  stacked = false,
}) {
  const rootRef = useRef(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (stacked) return undefined;
    const el = rootRef.current;
    if (!el) return undefined;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setBox({ w: r.width, h: r.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [stacked]);

  const selectPart = (key) => {
    if (key) onGoTo(key);
  };

  if (stacked) {
    return (
      <div className="relative z-20 px-4 pb-8 pt-2">
        {hint && (
          <p className="mb-3 text-center text-[10px] uppercase tracking-[0.2em] text-[#071333]/45">
            Drag to rotate in 3D
          </p>
        )}
        <div className="grid grid-cols-1 gap-2.5">
          {CALL_OUTS.map((slot) => {
            const color = selectedColors[slot.key];
            const hex = getStudioColorHex(color);
            const colors = visibleColors(availableColors[slot.key] || []);
            const label = HUD_LABELS[slot.key];
            const isActive = partKey === slot.key;
            return (
              <div
                key={slot.key}
                className="flex items-start gap-3 rounded-2xl px-3 py-3"
                style={{
                  background: isActive ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.55)',
                  border: isActive ? `1px solid ${GOLD}` : '1px solid rgba(0,0,0,0.06)',
                }}
              >
                <button
                  type="button"
                  onClick={() => selectPart(slot.key)}
                  className="relative shrink-0 rounded-full"
                  style={{
                    width: 52,
                    height: 52,
                    backgroundColor: hex,
                    backgroundImage: textureFor(slot.key),
                    border: `1.5px solid ${GOLD}`,
                    boxShadow: isActive
                      ? '0 0 0 3px rgba(196,163,106,0.28), 0 5px 12px rgba(40,48,58,0.14)'
                      : '0 4px 10px rgba(40,48,58,0.1)',
                  }}
                  aria-label={label}
                />
                <div className="min-w-0 flex-1 pt-0.5">
                  <p
                    className="text-[10px] uppercase tracking-[0.16em] font-semibold leading-none"
                    style={{ color: GOLD }}
                  >
                    {label}
                  </p>
                  <p className="mt-1.5 text-[13px] text-[#6b7178] leading-none">
                    {color === 'Baige' ? 'Beige' : color}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {colors.map((c) => {
                      const selected = c === color || (c === 'Beige' && color === 'Baige');
                      return (
                        <button
                          key={c}
                          type="button"
                          title={c}
                          onClick={() => onColorChange(slot.key, c)}
                          className="rounded-full transition-transform hover:scale-110"
                          style={{
                            width: 14,
                            height: 14,
                            backgroundColor: getStudioColorHex(c),
                            border: selected
                              ? `1.5px solid ${GOLD}`
                              : '1px solid rgba(7,19,51,0.14)',
                            boxShadow: selected
                              ? '0 0 0 2px rgba(196,163,106,0.28)'
                              : '0 1px 3px rgba(7,19,51,0.12)',
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const { w, h } = box;
  const circle = Math.round(Math.min(CIRCLE_MAX, Math.max(CIRCLE_MIN, w * 0.036)));

  return (
    <div ref={rootRef} className="absolute inset-0 z-20 pointer-events-none">
      {hint && (
        <p className="absolute bottom-4 left-0 right-0 text-center text-[10px] uppercase tracking-[0.2em] text-[#071333]/45">
          Drag to rotate in 3D
        </p>
      )}
      {w > 0 &&
        CALL_OUTS.map((slot) => {
          const circleX = slot.left * w;
          const circleY = slot.top * h;
          const isRight = slot.side === 'right';
          return (
            <div
              key={slot.key}
              className="absolute"
              style={{
                left: isRight ? undefined : circleX - circle / 2,
                right: isRight ? w - circleX - circle / 2 : undefined,
                top: circleY - circle / 2,
              }}
            >
              <PartOption
                partKey={slot.key}
                color={selectedColors[slot.key]}
                colors={visibleColors(availableColors[slot.key] || [])}
                label={HUD_LABELS[slot.key]}
                active={partKey === slot.key}
                circle={circle}
                align={slot.side}
                onSelect={selectPart}
                onPick={(c) => onColorChange(slot.key, c)}
              />
            </div>
          );
        })}
    </div>
  );
}
