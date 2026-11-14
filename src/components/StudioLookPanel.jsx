const GOLD = '#C4A36A';

function Slider({ label, min, max, step, value, onChange }) {
  return (
    <label className="block">
      <span className="flex justify-between gap-2 text-[10px] uppercase tracking-[0.12em] text-[#071333]/55">
        {label}
        <span className="text-[#071333]">{Number(value).toFixed(step < 0.01 ? 3 : step < 0.1 ? 2 : 1)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-1 w-full accent-[#C4A36A]"
      />
    </label>
  );
}

export default function StudioLookPanel({ look, onChange, onReset, onClose, compact }) {
  const set = (key) => (value) => onChange({ [key]: value });

  async function copySettings() {
    const text = JSON.stringify(look, null, 2);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      window.prompt('Copy these lighting values:', text);
    }
  }

  return (
    <aside
      className={`pointer-events-auto z-40 w-[17.5rem] max-h-[min(72dvh,34rem)] overflow-y-auto rounded-2xl border border-black/10 bg-white/92 p-3 shadow-[0_12px_40px_rgba(40,48,58,0.16)] backdrop-blur-md ${
        compact ? 'relative mx-4 mb-4' : 'absolute right-4 top-16'
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: GOLD }}>
          Tune look
        </p>
        <div className="flex items-center gap-2">
          <button type="button" className="text-[10px] uppercase tracking-[0.12em] text-[#85898f] hover:text-[#071333]" onClick={() => void copySettings()}>
            Copy
          </button>
          <button type="button" className="text-[10px] uppercase tracking-[0.12em] text-[#85898f] hover:text-[#071333]" onClick={onReset}>
            Reset
          </button>
          <button
            type="button"
            className="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-[#071333] hover:bg-black/5"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-[9px] uppercase tracking-[0.16em] text-[#071333]/35">Light</p>
        <Slider label="Exposure" min={0.7} max={1.6} step={0.01} value={look.exposure} onChange={set('exposure')} />
        <Slider label="Sun intensity" min={0.4} max={6} step={0.05} value={look.sunIntensity} onChange={set('sunIntensity')} />
        <Slider label="Lamp intensity" min={0} max={4} step={0.05} value={look.lampIntensity} onChange={set('lampIntensity')} />
        <Slider label="Ambient" min={0} max={0.5} step={0.01} value={look.hemiIntensity} onChange={set('hemiIntensity')} />
        <Slider label="HDRI" min={0} max={1.6} step={0.01} value={look.hdri} onChange={set('hdri')} />
        <Slider label="Warmth" min={0} max={1} step={0.01} value={look.warmth} onChange={set('warmth')} />
        <Slider label="Sun around" min={-180} max={180} step={1} value={look.sunAzimuth} onChange={set('sunAzimuth')} />
        <Slider label="Sun height" min={4} max={28} step={0.1} value={look.sunHeight} onChange={set('sunHeight')} />
        <Slider label="Sun distance" min={6} max={22} step={0.1} value={look.sunDistance} onChange={set('sunDistance')} />

        <p className="pt-1 text-[9px] uppercase tracking-[0.16em] text-[#071333]/35">Boat shadow</p>
        <Slider label="Shadow softness" min={0} max={12} step={0.1} value={look.shadowRadius} onChange={set('shadowRadius')} />
        <Slider label="Ground shadow" min={0} max={0.5} step={0.01} value={look.floorShadow} onChange={set('floorShadow')} />

        <p className="pt-1 text-[9px] uppercase tracking-[0.16em] text-[#071333]/35">Three architectural bands</p>
        <Slider label="Band strength" min={0} max={0.6} step={0.01} value={look.bandOpacity} onChange={set('bandOpacity')} />
        <Slider label="Band width" min={0.004} max={0.04} step={0.001} value={look.bandWidth} onChange={set('bandWidth')} />
        <Slider label="Band spacing" min={0.02} max={0.12} step={0.001} value={look.bandSpread} onChange={set('bandSpread')} />
        <Slider label="Around boat" min={0.06} max={0.28} step={0.005} value={look.bandRadius} onChange={set('bandRadius')} />
        <Slider label="Band softness" min={1.4} max={4} step={0.05} value={look.bandFeather} onChange={set('bandFeather')} />
        <label className="flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-[#071333]/55">
          Follow sun
          <input type="checkbox" checked={look.bandFollowSun} onChange={(event) => onChange({ bandFollowSun: event.target.checked })} />
        </label>
        {!look.bandFollowSun && (
          <Slider label="Band angle" min={-180} max={180} step={1} value={look.bandAngle} onChange={set('bandAngle')} />
        )}
        <p className="text-[9px] leading-relaxed text-[#071333]/40">
          Drag sliders live. Copy when it looks right and send those values so they can be locked in.
        </p>
      </div>
    </aside>
  );
}
