import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { useModels } from '../context/ModelsContext';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Customizer3DHud from '../components/Customizer3DHud';
import StudioLookPanel from '../components/StudioLookPanel';
import {
  STUDIO_BACKGROUND,
  addReferenceGround,
  addReferenceLights,
  applyReferenceRenderer,
  loadStudioHdri,
  markShadowReady,
} from '../lib/referenceStudio';
import { DEFAULT_STUDIO_LOOK, applyStudioLook, loadStudioLook, saveStudioLook } from '../lib/studioLook';
import { customizerParts, is3DCustomizerModel } from '../data/customizerConfig';
import { getColorHex } from '../data/customizerColorMap';
import { getAvailableColors } from '../data/customizerColors';

const GOLD = '#C4A36A';
const MODEL_URL = '/glb-test/test-web.glb';

const PART_MATCH = {
  upholestry: /cushion|upholst|havan/i,
  tubeDecoration: /tube decoration|decoration|accent/i,
  tube: /^(black)$/i,
  fiberglass: /^(white)$/i,
  sideFender: /fender|black - matt|black \[imported\]/i,
  deckFloor: /teak|deck|foat/i,
};

const DEFAULT_COLORS = {
  upholestry: 'Beige',
  tubeDecoration: 'White',
  tube: 'Black',
  fiberglass: 'White',
  sideFender: 'Black',
  deckFloor: 'Beige',
};

const TOUR = [
  { key: 'fiberglass', label: 'Fiberglass' },
  { key: 'sideFender', label: 'Side Fender' },
  { key: 'deckFloor', label: 'Deck Floor' },
  { key: 'tube', label: 'Tube' },
  { key: 'tubeDecoration', label: 'Tube Decoration' },
  { key: 'upholestry', label: 'Upholstery' },
];

const SLOT_ON_HULL = {
  fiberglass: { u: 0.62, v: 0.78, w: 0.72 },
  sideFender: { u: 0.92, v: 0.48, w: 0.42 },
  deckFloor: { u: 0.70, v: 0.16, w: 0.78 },
  tube: { u: 0.22, v: 0.28, w: 0.82 },
  tubeDecoration: { u: 0.18, v: 0.58, w: 0.60 },
  upholestry: { u: 0.38, v: 0.82, w: 0.55 },
};

function partForMaterialName(name) {
  const n = String(name || '').trim();
  return Object.keys(PART_MATCH).find((key) => PART_MATCH[key].test(n)) || null;
}

function wrapAngle(rad) {
  const tau = Math.PI * 2;
  return ((rad % tau) + tau) % tau;
}

function shortestDelta(from, to) {
  let d = wrapAngle(to) - wrapAngle(from);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
}

function forwardDelta(from, to) {
  const delta = wrapAngle(to - from);
  return delta < 0.03 ? 0 : delta;
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2;
}

function attachOnHull(key, box) {
  const slot = SLOT_ON_HULL[key] || { u: 0.5, v: 0.5, w: 0.5 };
  const size = box.getSize(new THREE.Vector3());
  return new THREE.Vector3(
    box.min.x + size.x * slot.u,
    box.min.y + size.y * slot.v,
    box.min.z + size.z * slot.w
  );
}

function frameCamera(camera, controls, object) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const hFov = 2 * Math.atan(Math.tan(vFov * 0.5) * Math.max(camera.aspect, 0.35));
  const dist = Math.max(
    (size.y * 1.08) / Math.tan(vFov * 0.5),
    (Math.max(size.x, size.z) * 0.88) / Math.tan(hFov * 0.5),
    0.8
  );
  const dir = new THREE.Vector3(0.78, 0.16, 1).normalize();
  camera.position.copy(center).addScaledVector(dir, dist);
  camera.near = Math.max(dist / 180, 0.02);
  camera.far = dist * 22;
  camera.updateProjectionMatrix();
  controls.target.copy(center);
  controls.target.y -= size.y * 0.14;
  controls.minDistance = dist * 0.82;
  controls.maxDistance = dist * 2.2;
  controls.update();
}

export default function Customizer3DTest() {
  const { models } = useModels();
  const infinityModel = (models || []).find((model) => is3DCustomizerModel(model.name));
  const backTo = infinityModel ? `/models/${infinityModel.id}` : '/';
  const hostRef = useRef(null);
  const partsRef = useRef({});
  const tourRef = useRef({ goTo: () => {} });
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Loading 3D boat…');
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const [compact, setCompact] = useState(false);
  const [selected, setSelected] = useState('fiberglass');
  const [selectedColors, setSelectedColors] = useState(DEFAULT_COLORS);
  const [hint, setHint] = useState(true);
  const [grabbing, setGrabbing] = useState(false);
  const [tuneOpen, setTuneOpen] = useState(false);
  const [look, setLook] = useState(() => (typeof window === 'undefined' ? DEFAULT_STUDIO_LOOK : loadStudioLook()));
  const lookRef = useRef(look);
  const studioRef = useRef(null);

  lookRef.current = look;

  function updateLook(patch) {
    const next = { ...lookRef.current, ...patch };
    lookRef.current = next;
    setLook(next);
    saveStudioLook(next);
    applyStudioLook(studioRef.current, next);
  }

  const hudParts = useMemo(
    () => customizerParts.filter((part) => part.key !== 'base'),
    []
  );
  const availableColors = useMemo(() => {
    const next = {};
    hudParts.forEach((part) => {
      next[part.key] = getAvailableColors(part.key);
    });
    return next;
  }, [hudParts]);

  useEffect(() => {
    const previous = document.title;
    document.title = 'Infinity 280 | Tiger Marine';
    return () => {
      document.title = previous;
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1099px)');
    const apply = () => setCompact(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    return () => robots.remove();
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    let disposed = false;
    let frame;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 200);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      logarithmicDepthBuffer: true,
    });
    applyReferenceRenderer(renderer);
    scene.background = new THREE.Color(STUDIO_BACKGROUND);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.outline = 'none';
    renderer.domElement.style.cursor = 'grab';
    renderer.domElement.style.touchAction = 'none';
    host.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableRotate = true;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.rotateSpeed = 0.68;
    controls.zoomSpeed = 0.85;
    controls.minPolarAngle = 0.32;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.autoRotate = false;

    const lights = addReferenceLights(scene);
    const studio = { renderer, scene, ...lights, floor: null, bands: null };
    studioRef.current = studio;
    applyStudioLook(studio, lookRef.current);
    loadStudioHdri(renderer, scene, {
      onLoad: (env) => {
        if (disposed) {
          env.dispose();
          scene.environment = null;
          return;
        }
        applyStudioLook(studioRef.current, lookRef.current);
      },
    });

    const rig = new THREE.Group();
    scene.add(rig);

    const fit = () => {
      const w = Math.max(1, host.clientWidth);
      const h = Math.max(1, host.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const side = w >= 1100 ? Math.round(w * 0.24) : 0;
      if (side) camera.setViewOffset(w + side * 2, h, side, 0, w, h);
      else camera.clearViewOffset();
      camera.updateProjectionMatrix();
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(host);

    const stations = TOUR.map((step, index) => ({
      ...step,
      yaw: (index / TOUR.length) * Math.PI * 2,
      object: null,
    }));
    let stationIndex = 0;
    let anim = null;
    const camOffset = new THREE.Vector3();
    const camSpherical = new THREE.Spherical();

    const cameraTheta = () => {
      camOffset.copy(camera.position).sub(controls.target);
      camSpherical.setFromVector3(camOffset);
      return wrapAngle(camSpherical.theta);
    };

    const applyCameraTheta = (theta) => {
      camOffset.copy(camera.position).sub(controls.target);
      camSpherical.setFromVector3(camOffset);
      camSpherical.theta = theta;
      camSpherical.makeSafe();
      camOffset.setFromSpherical(camSpherical);
      camera.position.copy(controls.target).add(camOffset);
      camera.lookAt(controls.target);
    };

    const highlightPart = (key) => {
      Object.entries(partsRef.current).forEach(([partKey, mats]) => {
        mats.forEach((mat) => {
          if (!mat?.emissive) return;
          if (partKey === key) {
            mat.emissive.setHex(0x2a2314);
            mat.emissiveIntensity = 0.2;
          } else {
            mat.emissive.setHex(0x000000);
            mat.emissiveIntensity = 0;
          }
        });
      });
    };

    const applyStationState = (index) => {
      if (index === stationIndex) return;
      stationIndex = index;
      const key = stations[index].key;
      highlightPart(key);
      setSelected(key);
    };

    const nearestIndex = (yaw) => {
      let best = 0;
      let bestAbs = Infinity;
      stations.forEach((step, index) => {
        const d = Math.abs(shortestDelta(yaw, step.yaw));
        if (d < bestAbs) {
          bestAbs = d;
          best = index;
        }
      });
      return best;
    };

    const animateTo = (index, direction = 'forward') => {
      const to = stations[index].yaw;
      const from = cameraTheta();
      const delta = direction === 'forward' ? forwardDelta(from, to) : shortestDelta(from, to);
      camOffset.copy(camera.position).sub(controls.target);
      camSpherical.setFromVector3(camOffset);
      anim = {
        fromTheta: from,
        delta,
        phi: camSpherical.phi,
        radius: camSpherical.radius,
        toIndex: index,
        start: performance.now(),
        duration: 920,
      };
      controls.enabled = false;
    };

    tourRef.current = {
      goTo: (key) => {
        if (!stations.length) return;
        const index = stations.findIndex((step) => step.key === key);
        if (index < 0) return;
        setHint(false);
        animateTo(index, 'shortest');
      },
    };

    const onControlStart = () => {
      anim = null;
      controls.enabled = true;
      setHint(false);
      setGrabbing(true);
      renderer.domElement.style.cursor = 'grabbing';
    };
    const onControlEnd = () => {
      setGrabbing(false);
      renderer.domElement.style.cursor = 'grab';
    };
    controls.addEventListener('start', onControlStart);
    controls.addEventListener('end', onControlEnd);

    const tick = () => {
      if (disposed) return;
      if (anim) {
        const t = Math.min(1, (performance.now() - anim.start) / anim.duration);
        const eased = easeInOut(t);
        camSpherical.theta = anim.fromTheta + anim.delta * eased;
        camSpherical.phi = anim.phi;
        camSpherical.radius = anim.radius;
        camSpherical.makeSafe();
        camOffset.setFromSpherical(camSpherical);
        camera.position.copy(controls.target).add(camOffset);
        camera.lookAt(controls.target);
        if (t >= 1) {
          applyStationState(anim.toIndex);
          anim = null;
          controls.enabled = true;
          controls.update();
        } else {
          applyStationState(nearestIndex(wrapAngle(camSpherical.theta)));
        }
      } else {
        controls.update();
        applyStationState(nearestIndex(cameraTheta()));
      }
      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };
    tick();

    const draco = new DRACOLoader();
    draco.setDecoderPath('/draco/');
    draco.preload();
    const loader = new GLTFLoader();
    loader.setDRACOLoader(draco);

    setStatus('Loading 3D boat…');
    loader.load(
      MODEL_URL,
      (gltf) => {
        if (disposed) return;
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        model.scale.setScalar(6 / Math.max(size.x, size.y, size.z, 0.001));

        const mapped = {};
        model.traverse((obj) => {
          if (!obj.isMesh) return;
          obj.frustumCulled = false;
          obj.castShadow = true;
          obj.receiveShadow = true;
          const list = Array.isArray(obj.material) ? obj.material : [obj.material];
          const partsOnMesh = new Set();
          list.forEach((mat) => {
            if (!mat) return;
            mat.side = THREE.DoubleSide;
            mat.envMapIntensity = 0.9;
            if ('roughness' in mat) mat.roughness = Math.max(Number(mat.roughness) || 0, 0.32);
            if ('metalness' in mat && Number(mat.metalness) > 0.85) mat.metalness = 0.58;
            if ('transmission' in mat && Number(mat.transmission) > 0 && !/glass|wind|plexy/i.test(mat.name || '')) {
              mat.transmission = 0;
            }
            mat.needsUpdate = true;
            const part = partForMaterialName(mat.name);
            if (!part) return;
            if (!mapped[part]) mapped[part] = { mats: [], meshes: [] };
            if (!mapped[part].mats.includes(mat)) mapped[part].mats.push(mat);
            partsOnMesh.add(part);
          });
          partsOnMesh.forEach((part) => mapped[part].meshes.push(obj));
        });

        Object.entries(DEFAULT_COLORS).forEach(([key, name]) => {
          const hex = getColorHex(name);
          (mapped[key]?.mats || []).forEach((mat) => {
            if (!mat?.color) return;
            mat.color.set(hex);
            mat.needsUpdate = true;
          });
        });
        partsRef.current = Object.fromEntries(
          Object.entries(mapped).map(([key, value]) => [key, value.mats])
        );

        model.updateMatrixWorld(true);
        const hullBox = new THREE.Box3().setFromObject(model);
        model.position.y -= hullBox.min.y;
        model.position.y += 0.48;
        model.updateMatrixWorld(true);
        const ground = addReferenceGround(scene, 0);
        if (studioRef.current) {
          studioRef.current.floor = ground.floor;
          studioRef.current.bands = ground.studioShadows;
          applyStudioLook(studioRef.current, lookRef.current);
        }
        markShadowReady(model);
        rig.add(model);

        stations.forEach((step) => {
          let local = attachOnHull(step.key, hullBox);
          if (mapped[step.key]?.meshes?.length) {
            const partBox = new THREE.Box3();
            mapped[step.key].meshes.forEach((mesh) => partBox.expandByObject(mesh));
            if (!partBox.isEmpty()) local.lerp(partBox.getCenter(new THREE.Vector3()), 0.35);
          }
          const marker = new THREE.Object3D();
          marker.position.copy(local);
          model.add(marker);
          step.object = marker;
          step.yaw = wrapAngle(Math.atan2(local.x, local.z));
        });

        stations.sort((a, b) => a.yaw - b.yaw);
        fit();
        frameCamera(camera, controls, rig);
        stationIndex = -1;
        applyCameraTheta(stations[0].yaw);
        applyStationState(0);
        setReady(true);
        setStatus('');
      },
      (event) => {
        if (!event.total) return;
        setProgress(Math.round((event.loaded / event.total) * 100));
      },
      (err) => {
        if (disposed) return;
        const missing = String(err?.message || err).includes('404') || err?.status === 404;
        setError(
          missing
            ? 'The Infinity 280 3D model could not be found. Please refresh and try again.'
            : `Could not load the 3D model. ${err?.message || err}`
        );
        setStatus('');
      }
    );

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      ro.disconnect();
      controls.removeEventListener('start', onControlStart);
      controls.removeEventListener('end', onControlEnd);
      tourRef.current = { goTo: () => {} };
      studioRef.current = null;
      controls.dispose();
      draco.dispose();
      scene.environment?.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  const handleColorChange = (partKey, name) => {
    const hex = getColorHex(name);
    (partsRef.current[partKey] || []).forEach((mat) => {
      if (!mat?.color) return;
      mat.color.set(hex);
      mat.needsUpdate = true;
    });
    setSelectedColors((prev) => ({ ...prev, [partKey]: name }));
    setSelected(partKey);
  };

  return (
    <div className={`${compact ? 'min-h-[100dvh] overflow-x-hidden overflow-y-auto' : 'h-[100dvh] overflow-hidden'} pt-20 bg-[#ECEDEF] text-midnight-slate`}>
      <header className={`${compact ? 'relative z-30' : 'absolute top-20 left-0 right-0 z-30 pointer-events-none'} px-5 h-[3.4rem] flex items-center justify-between`}>
        <div className="min-w-0 pointer-events-auto">
          <h1 className={`${compact ? 'text-base tracking-[0.14em]' : 'text-[1.2rem] tracking-[0.22em]'} font-medium uppercase truncate`} style={{ color: GOLD }}>
            Infinity 280
          </h1>
          <p className={`mt-0.5 uppercase text-[#071333]/38 ${compact ? 'text-[9px] tracking-[0.16em]' : 'text-[10px] tracking-[0.28em]'}`}>
            Customize your boat
          </p>
        </div>
        <div className="pointer-events-auto flex items-center gap-3">
          <button
            type="button"
            className="text-xs text-[#85898f] hover:text-smoked-saffron"
            onClick={() => setTuneOpen((open) => !open)}
          >
            {tuneOpen ? 'Hide tuner' : 'Tune look'}
          </button>
          <Link to={backTo} className="text-xs text-[#85898f] hover:text-smoked-saffron">
            Back
          </Link>
        </div>
      </header>

      <div className={compact ? 'w-full' : 'h-[calc(100dvh-5rem)]'}>
        <div className={`relative ${compact ? 'h-[52dvh] min-h-[280px]' : 'h-full'}`} style={{ background: STUDIO_BACKGROUND }}>
          <div
            ref={hostRef}
            className="absolute inset-0 z-10"
            style={{ cursor: grabbing ? 'grabbing' : 'grab' }}
          />
          {ready && tuneOpen && !compact && (
            <StudioLookPanel
              look={look}
              onChange={updateLook}
              onReset={() => updateLook({ ...DEFAULT_STUDIO_LOOK })}
            />
          )}
          {ready && !compact && (
            <Customizer3DHud
              partKey={selected}
              selectedColors={selectedColors}
              availableColors={availableColors}
              onColorChange={handleColorChange}
              onGoTo={(key) => tourRef.current.goTo(key)}
              hint={hint}
            />
          )}
          {!ready && (
            <div className="absolute inset-0 z-30 grid place-items-center pointer-events-none">
              <div className="rounded-2xl bg-white/80 px-6 py-5 text-center shadow-sm max-w-md">
                <p className="text-sm text-[#071333]">{status || 'Preparing…'}</p>
                {progress > 0 && (
                  <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-black/40">{progress}%</p>
                )}
                {error && <p className="mt-3 text-sm text-[#8B0000]">{error}</p>}
              </div>
            </div>
          )}
        </div>
        {ready && tuneOpen && compact && (
          <StudioLookPanel
            look={look}
            compact
            onChange={updateLook}
            onReset={() => updateLook({ ...DEFAULT_STUDIO_LOOK })}
          />
        )}
        {ready && compact && (
          <Customizer3DHud
            partKey={selected}
            selectedColors={selectedColors}
            availableColors={availableColors}
            onColorChange={handleColorChange}
            onGoTo={(key) => tourRef.current.goTo(key)}
            hint={hint}
            stacked
          />
        )}
      </div>
    </div>
  );
}
