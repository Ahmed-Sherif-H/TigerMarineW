import { useEffect, useRef, useState } from 'react';
import { getColorHex } from '../data/customizerColorMap';

const GOLD = '#C4A36A';
const BOAT_ASPECT = 5184 / 3456;
const CIRCLE_MIN = 56;
const CIRCLE_MAX = 70;

const WRAP = { left: 0.18, right: 0.12, top: 0.08, bottom: 0.08 };

const HUD_LABELS = {
  deckFloor: 'Deck Floor',
  fiberglass: 'Fiberglass',
  sideFender: 'Side Fender',
  tube: 'Tube',
  tubeDecoration: 'Tube Decoration',
  upholestry: 'Upholstery',
};

const CALL_OUTS = [
  { key: 'upholestry', side: 'left', ax: 0.18, ay: 0.22, hx: 0.12, hy: 0.08, left: 0.168, top: 0.215 },
  { key: 'tubeDecoration', side: 'left', ax: 0.22, ay: 0.38, hx: 0.16, hy: 0.32, left: 0.158, top: 0.455 },
  { key: 'tube', side: 'left', ax: 0.38, ay: 0.62, hx: 0.38, hy: 0.72, left: 0.198, top: 0.76 },
  { key: 'fiberglass', side: 'right', ax: 0.58, ay: 0.28, hx: 0.62, hy: 0.16, left: 0.735, top: 0.168 },
  { key: 'sideFender', side: 'right', ax: 0.72, ay: 0.48, hx: 0.84, hy: 0.48, left: 0.778, top: 0.47 },
  { key: 'deckFloor', side: 'right', ax: 0.70, ay: 0.68, hx: 0.80, hy: 0.78, left: 0.795, top: 0.76 },
];

function measureOpaqueBounds(src) {
  return new Promise((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }
    const img = new Image();
    img.onload = () => {
      const step = 8;
      const w = Math.max(1, Math.floor(img.naturalWidth / step));
      const h = Math.max(1, Math.floor(img.naturalHeight / step));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        resolve(null);
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;
      let minX = w;
      let minY = h;
      let maxX = 0;
      let maxY = 0;
      for (let y = 0; y < h; y += 1) {
        for (let x = 0; x < w; x += 1) {
          if (data[(y * w + x) * 4 + 3] > 16) {
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
          }
        }
      }
      if (maxX <= minX || maxY <= minY) {
        resolve(null);
        return;
      }
      resolve({
        x: minX / w,
        y: minY / h,
        w: (maxX - minX) / w,
        h: (maxY - minY) / h,
      });
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

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

function containedBoatRect(stageW, stageH) {
  const wrapX = stageW * WRAP.left;
  const wrapY = stageH * WRAP.top;
  const wrapW = stageW * (1 - WRAP.left - WRAP.right);
  const wrapH = stageH * (1 - WRAP.top - WRAP.bottom);
  let imgW = Math.min(wrapW, stageW * 0.56);
  let imgH = imgW / BOAT_ASPECT;
  if (imgH > wrapH) {
    imgH = wrapH;
    imgW = imgH * BOAT_ASPECT;
  }
  return {
    x: wrapX + (wrapW - imgW) / 2,
    y: wrapY + (wrapH - imgH) / 2,
    w: imgW,
    h: imgH,
  };
}

function PartSwatches({ colors, color, onPick }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-1.5">
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
              width: 14,
              height: 14,
              backgroundColor: getColorHex(c),
              border: selected
                ? `1.5px solid ${GOLD}`
                : '1px solid rgba(7,19,51,0.14)',
              boxShadow: selected ? '0 0 0 2px rgba(196,163,106,0.28)' : '0 1px 3px rgba(7,19,51,0.12)',
            }}
          />
        );
      })}
    </div>
  );
}

export default function CustomizerOrbitHud({
  parts,
  selectedColors,
  availableColors,
  selectedPart,
  onSelectPart,
  onColorChange,
  partLabels = {},
  compact = false,
  hullSrc = null,
}) {
  const rootRef = useRef(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [hovered, setHovered] = useState(null);
  const [hull, setHull] = useState(null);

  useEffect(() => {
    if (compact) return undefined;
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
  }, [compact]);

  useEffect(() => {
    if (compact || !hullSrc) {
      setHull(null);
      return undefined;
    }
    let alive = true;
    measureOpaqueBounds(hullSrc).then((bounds) => {
      if (alive) setHull(bounds);
    });
    return () => {
      alive = false;
    };
  }, [compact, hullSrc]);

  if (compact) {
    return (
      <div className="relative z-20 px-4 pb-8 pt-2">
        <div className="grid grid-cols-1 gap-2.5">
          {CALL_OUTS.map((slot) => {
            const part = parts.find((p) => p.key === slot.key);
            if (!part) return null;
            const key = slot.key;
            const color = selectedColors[key];
            const hex = getColorHex(color);
            const colors = visibleColors(availableColors[key] || []);
            const label = HUD_LABELS[key] || partLabels[key] || part.label;
            const isActive = selectedPart === key;
            return (
              <div
                key={key}
                className="flex items-start gap-3 rounded-2xl px-3 py-3"
                style={{
                  background: isActive ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.55)',
                  border: isActive ? `1px solid ${GOLD}` : '1px solid rgba(0,0,0,0.06)',
                }}
              >
                <button
                  type="button"
                  onClick={() => onSelectPart(isActive ? null : key)}
                  className="relative shrink-0 rounded-full"
                  style={{
                    width: 52,
                    height: 52,
                    backgroundColor: hex,
                    backgroundImage: textureFor(key),
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
                  <PartSwatches
                    colors={colors}
                    color={color}
                    onPick={(c) => onColorChange(key, c)}
                  />
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
  const boat = w > 0 ? containedBoatRect(w, h) : null;

  const slots = boat
    ? CALL_OUTS.map((slot) => {
        const part = parts.find((p) => p.key === slot.key);
        if (!part) return null;
        const attach = hull
          ? {
              x: boat.x + (hull.x + slot.hx * hull.w) * boat.w,
              y: boat.y + (hull.y + slot.hy * hull.h) * boat.h,
            }
          : {
              x: boat.x + slot.ax * boat.w,
              y: boat.y + slot.ay * boat.h,
            };
        const isRight = slot.side === 'right';
        const circleX = slot.left * w;
        const circleY = slot.top * h;
        const lineX = isRight ? circleX - circle / 2 : circleX + circle / 2;
        const lineY = isRight ? circleY : circleY - circle / 2;
        const elbowX = isRight
          ? Math.min(attach.x + 48, lineX - 12)
          : Math.max(attach.x - 48, lineX + 12);
        return { ...slot, part, attach, isRight, circleX, circleY, lineX, lineY, elbowX };
      }).filter(Boolean)
    : [];

  const activeKey = hovered || selectedPart;

  return (
    <div ref={rootRef} className="absolute inset-0 z-20 pointer-events-none">
      {w > 0 && (
        <svg
          className="absolute inset-0 w-full h-full overflow-visible"
          viewBox={`0 0 ${w} ${h}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {slots.map(({ key, attach, lineX, lineY, elbowX }) => {
            const lit = activeKey === key;
            const d = `M ${attach.x} ${attach.y} L ${elbowX} ${lineY} L ${lineX} ${lineY}`;
            return (
              <path
                key={`line-${key}`}
                d={d}
                fill="none"
                stroke={GOLD}
                strokeWidth={lit ? 1.6 : 1.15}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={lit ? 1 : 0.88}
              />
            );
          })}
        </svg>
      )}

      {w > 0 && slots.map(({ key, circleX, circleY, part }) => {
        const color = selectedColors[key];
        const hex = getColorHex(color);
        const colors = visibleColors(availableColors[key] || []);
        const label = HUD_LABELS[key] || partLabels[key] || part.label;
        const isActive = selectedPart === key;

        return (
          <div
            key={key}
            className="absolute pointer-events-auto flex items-start gap-2.5"
            style={{
              left: circleX - circle / 2,
              top: circleY - circle / 2,
            }}
            onMouseEnter={() => setHovered(key)}
            onMouseLeave={() => setHovered(null)}
          >
            <button
              type="button"
              onClick={() => onSelectPart(isActive ? null : key)}
              className="relative shrink-0 rounded-full"
              style={{
                width: circle,
                height: circle,
                backgroundColor: hex,
                backgroundImage: textureFor(key),
                border: `1.5px solid ${GOLD}`,
                boxShadow: isActive
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
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {colors.map((c) => {
                  const selected = c === color || (c === 'Beige' && color === 'Baige');
                  return (
                    <button
                      key={c}
                      type="button"
                      title={c}
                      onClick={() => onColorChange(key, c)}
                      className="rounded-full transition-transform hover:scale-110"
                      style={{
                        width: 12,
                        height: 12,
                        backgroundColor: getColorHex(c),
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
      })}
    </div>
  );
}
