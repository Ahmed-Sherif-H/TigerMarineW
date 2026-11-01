export default function CustomizerStudioBackground() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0, isolation: 'isolate' }}
    >
      {/* Bright cyclorama — sun-lit floor stays light at the bottom */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 64% at 54% 46%, #FFFFFF 0%, #F7F5F1 30%, #F1F1F3 52%, #EAEBEE 78%, #E4E6EA 100%)
          `,
        }}
      />

      {/* Lift the top of the studio */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 90% 42% at 50% -4%, rgba(255,255,255,0.88) 0%, rgba(255,252,247,0.4) 38%, transparent 68%)',
        }}
      />

      {/* Key on the vehicle */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 42% 36% at 54% 52%, rgba(255,255,255,0.95) 0%, rgba(255,249,241,0.45) 42%, transparent 74%)',
        }}
      />

      {/* Sun rakes from upper-right down the floor */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 72% 88% at 74% 8%, rgba(255,252,246,0.9) 0%, rgba(255,249,241,0.32) 42%, rgba(255,252,247,0.1) 68%, transparent 84%)',
        }}
      />

      {/* Floor catch — leftover sun, very diffused */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 38% at 48% 96%, rgba(255,252,247,0.5) 0%, rgba(255,249,241,0.16) 46%, transparent 76%)',
        }}
      />

      {/* Weak fill — shadow side stays a little cooler for contrast */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 34% 52% at 8% 36%, rgba(255,255,255,0.2) 0%, transparent 60%)',
        }}
      />

      {/* Hint of cove on the mid sides only, not the floor */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 28% 58% at 0% 42%, rgba(150,156,168,0.12) 0%, transparent 55%),
            radial-gradient(ellipse 24% 54% at 100% 36%, rgba(150,156,168,0.08) 0%, transparent 52%)
          `,
        }}
      />

      {/* Directional key shaft + its cast shadow (shadow stays mid, light continues down) */}
      <div
        className="absolute -inset-[28%]"
        style={{
          background: 'linear-gradient(38deg, transparent 14%, rgba(255,252,247,0.88) 26%, rgba(255,252,247,0.28) 48%, rgba(255,252,247,0.12) 62%, transparent 76%)',
          filter: 'blur(42px)',
        }}
      />
      <div
        className="absolute -inset-[28%]"
        style={{
          background: 'linear-gradient(38deg, transparent 32%, rgba(58,66,80,0.34) 42%, transparent 52%)',
          filter: 'blur(36px)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Second shaft, slightly offset */}
      <div
        className="absolute -inset-[22%]"
        style={{
          background: 'linear-gradient(34deg, transparent 36%, rgba(255,252,247,0.55) 48%, rgba(255,252,247,0.16) 64%, transparent 80%)',
          filter: 'blur(48px)',
        }}
      />
      <div
        className="absolute -inset-[22%]"
        style={{
          background: 'linear-gradient(34deg, transparent 48%, rgba(58,66,80,0.24) 56%, transparent 66%)',
          filter: 'blur(40px)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Tight cinematic edge on the key */}
      <div
        className="absolute -inset-[18%]"
        style={{
          background: 'linear-gradient(40deg, transparent 22%, rgba(255,255,255,0.42) 30%, transparent 38%)',
          filter: 'blur(28px)',
        }}
      />
    </div>
  );
}

function BoatSilhouette({ images, style }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={style}
    >
      {images.map((src) => (
        <img
          key={src}
          src={src}
          alt=""
          draggable={false}
          className="absolute inset-0 w-full h-full object-contain"
        />
      ))}
    </div>
  );
}

export function CustomizerStudioGroundShadow({ images = [] }) {
  const layers = images.filter(Boolean);
  if (!layers.length) return null;

  return (
    <>
      <BoatSilhouette
        images={layers}
        style={{
          zIndex: 0,
          transformOrigin: '50% 100%',
          transform: 'translate(-2%, 16%) scale(1.04, 0.92)',
          filter: 'brightness(0) blur(36px)',
          opacity: 0.2,
          mixBlendMode: 'multiply',
        }}
      />
      <BoatSilhouette
        images={layers}
        style={{
          zIndex: 0,
          transformOrigin: '50% 100%',
          transform: 'translate(-1.1%, 12.5%) scale(1.02, 0.9)',
          filter: 'brightness(0) blur(22px)',
          opacity: 0.3,
          mixBlendMode: 'multiply',
        }}
      />
      <BoatSilhouette
        images={layers}
        style={{
          zIndex: 0,
          transformOrigin: '50% 100%',
          transform: 'translate(-0.5%, 10%) scale(1.0, 0.88)',
          filter: 'brightness(0) blur(14px)',
          opacity: 0.36,
          mixBlendMode: 'multiply',
        }}
      />
    </>
  );
}
