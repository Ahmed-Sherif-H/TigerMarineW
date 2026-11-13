import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import CustomizerStudioBackground from '../components/CustomizerStudioBackground';
import Customizer3DHud from '../components/Customizer3DHud';
import { customizerParts } from '../data/customizerConfig';
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

function makeContactShadow() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(size / 2, size / 2, size * 0.06, size / 2, size / 2, size * 0.48);
  gradient.addColorStop(0, 'rgba(40,48,58,0.34)');
  gradient.addColorStop(0.42, 'rgba(40,48,58,0.12)');
  gradient.addColorStop(1, 'rgba(40,48,58,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, opacity: 0.9 })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.renderOrder = -1;
  mesh.name = 'ground';
  return mesh;
}

function frameCamera(camera, controls, object) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const radius = Math.max(size.length() * 0.5, 0.2);
  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const hFov = 2 * Math.atan(Math.tan(vFov * 0.5) * Math.max(camera.aspect, 0.35));
  const dist = Math.max(
    (size.y * 0.52) / Math.tan(vFov * 0.5),
    (Math.max(size.x, size.z) * 0.38) / Math.tan(hFov * 0.5),
    0.8
  );
  const dir = new THREE.Vector3(0.72, 0.38, 1).normalize();
  camera.position.copy(center).addScaledVector(dir, dist);
  camera.near = Math.max(dist / 180, 0.02);
  camera.far = dist * 22;
  camera.updateProjectionMatrix();
  controls.target.copy(center);
  controls.target.y -= size.y * 0.12;
  controls.minDistance = dist * 0.68;
  controls.maxDistance = dist * 2.4;
  controls.update();
}

export default function Customizer3DTest() {
  const hostRef = useRef(null);
  const partsRef = useRef({});
  const hudUpdateRef = useRef(null);
  const tourRef = useRef({ goTo: () => {} });
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Waiting for optimized model…');
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const [compact, setCompact] = useState(false);
  const [selected, setSelected] = useState('fiberglass');
  const [selectedColors, setSelectedColors] = useState(DEFAULT_COLORS);
  const [station, setStation] = useState(0);
  const [stationKeys, setStationKeys] = useState(() => TOUR.map((step) => step.key));
  const [hint, setHint] = useState(true);
  const [grabbing, setGrabbing] = useState(false);

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

  const bindHud = useCallback((fn) => {
    hudUpdateRef.current = fn;
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
      alpha: true,
      powerPreference: 'high-performance',
      logarithmicDepthBuffer: true,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
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
    controls.minPolarAngle = 0.12;
    controls.maxPolarAngle = Math.PI * 0.58;
    controls.autoRotate = false;

    RectAreaLightUniformsLib.init();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.02).texture;
    scene.environmentIntensity = 0.28;
    scene.add(new THREE.HemisphereLight(0xfffdf8, 0xc5c9d0, 0.32));
    const sun = new THREE.DirectionalLight(0xfff6ea, 2.15);
    sun.position.set(7.2, 9.4, 4.2);
    scene.add(sun);
    scene.add(sun.target);
    sun.target.position.set(-0.4, 0, -0.6);
    const keySoft = new THREE.RectAreaLight(0xfffaf4, 14, 11, 6);
    keySoft.position.set(5.8, 7.6, 3.4);
    keySoft.lookAt(0, 0.15, 0);
    scene.add(keySoft);
    const fill = new THREE.RectAreaLight(0xe7eef6, 5.5, 8, 9);
    fill.position.set(-6.2, 3.2, 1.2);
    fill.lookAt(0, 0.1, 0);
    scene.add(fill);
    const rim = new THREE.RectAreaLight(0xffffff, 6.5, 7, 3.2);
    rim.position.set(-1.4, 4.8, -6.4);
    rim.lookAt(0, 0.2, 0);
    scene.add(rim);
    const floorLift = new THREE.RectAreaLight(0xfff8f1, 2.4, 10, 4);
    floorLift.position.set(0.4, -2.6, 2.2);
    floorLift.lookAt(0, 0, 0);
    scene.add(floorLift);

    const rig = new THREE.Group();
    scene.add(rig);

    const fit = () => {
      const w = Math.max(1, host.clientWidth);
      const h = Math.max(1, host.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const hud = Math.min(168, Math.round(h * 0.2));
      camera.setViewOffset(w, h + hud, 0, hud, w, h);
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
    const worldPin = new THREE.Vector3();
    const project = new THREE.Vector3();
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
      setStation(index);
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

      const updater = hudUpdateRef.current;
      const step = stations[stationIndex];
      if (updater && step?.object) {
        step.object.getWorldPosition(worldPin);
        project.copy(worldPin).project(camera);
        const w = host.clientWidth;
        const h = host.clientHeight;
        const pinX = (project.x * 0.5 + 0.5) * w;
        const pinY = (-project.y * 0.5 + 0.5) * h;
        const onScreen =
          project.z > -1 &&
          project.z < 1 &&
          pinX > 8 &&
          pinX < w - 8 &&
          pinY > 8 &&
          pinY < h - 96;
        updater({
          pinX,
          pinY,
          opacity: onScreen ? 1 : 0,
        });
      }
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
          const list = Array.isArray(obj.material) ? obj.material : [obj.material];
          const partsOnMesh = new Set();
          list.forEach((mat) => {
            if (!mat) return;
            mat.side = THREE.DoubleSide;
            mat.envMapIntensity = 0.42;
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
        const fitted = hullBox.clone();
        const fitSize = fitted.getSize(new THREE.Vector3());
        const fitCenter = fitted.getCenter(new THREE.Vector3());
        const shadow = makeContactShadow();
        shadow.position.set(fitCenter.x - fitSize.x * 0.04, fitted.min.y - 0.02, fitCenter.z + fitSize.z * 0.04);
        shadow.scale.set(fitSize.x * 1.55, fitSize.z * 1.7, 1);

        rig.add(shadow);
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
        setStationKeys(stations.map((step) => step.key));
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
            ? 'The optimized model is not ready yet. Refresh after test-web.glb is available.'
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
      controls.dispose();
      draco.dispose();
      pmrem.dispose();
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
          <p className="text-[10px] uppercase tracking-[0.22em] font-semibold" style={{ color: GOLD }}>
            3D customizer draft · live site unchanged
          </p>
          <h1 className={`${compact ? 'text-base tracking-[0.14em]' : 'text-[1.2rem] tracking-[0.22em]'} font-medium uppercase truncate`} style={{ color: GOLD }}>
            TM28 GLB
          </h1>
        </div>
        <Link to="/" className="pointer-events-auto text-xs text-[#85898f] hover:text-smoked-saffron">
          Back
        </Link>
      </header>

      <div className={compact ? 'w-full' : 'h-[calc(100dvh-5rem)]'}>
        <div className={`relative ${compact ? 'h-[52dvh] min-h-[280px]' : 'h-full'}`}>
          <CustomizerStudioBackground />
          <div
            ref={hostRef}
            className="absolute inset-0 z-10"
            style={{ cursor: grabbing ? 'grabbing' : 'grab' }}
          />
          {ready && (
            <Customizer3DHud
              partKey={selected}
              stationKeys={stationKeys}
              selectedColors={selectedColors}
              availableColors={availableColors}
              onColorChange={handleColorChange}
              onGoTo={(key) => tourRef.current.goTo(key)}
              hint={hint}
              stacked={compact}
              onBind={bindHud}
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
      </div>
    </div>
  );
}
