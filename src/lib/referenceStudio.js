import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { createLuxuryStudioShadows } from './luxuryStudioShadows';
import { DEFAULT_STUDIO_LOOK, sunPositionFromLook } from './studioLook';

export const STUDIO_HDRI_URL = '/hdri/white_studio_03_2k.hdr';
export const STUDIO_BACKGROUND = '#f5f3ef';

function createFloor(floorY) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(48, 48),
    new THREE.ShadowMaterial({
      color: '#3a3d45',
      opacity: DEFAULT_STUDIO_LOOK.floorShadow,
    }),
  );
  mesh.receiveShadow = true;
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(0, floorY, 0);
  mesh.name = 'studio-floor';
  return mesh;
}

export function applyReferenceRenderer(renderer) {
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = DEFAULT_STUDIO_LOOK.exposure;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(STUDIO_BACKGROUND, 1);
}

export function addReferenceLights(scene) {
  const look = DEFAULT_STUDIO_LOOK;
  const sunPos = sunPositionFromLook(look);

  const hemi = new THREE.HemisphereLight(0xfff6ee, 0xd0cdc8, look.hemiIntensity);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xfff0dc, look.sunIntensity);
  sun.position.copy(sunPos);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -10;
  sun.shadow.camera.right = 10;
  sun.shadow.camera.top = 10;
  sun.shadow.camera.bottom = -10;
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 45;
  sun.shadow.bias = -0.00015;
  sun.shadow.normalBias = 0.04;
  sun.shadow.radius = look.shadowRadius;
  sun.target.position.set(0, 0.7, 0);
  scene.add(sun);
  scene.add(sun.target);

  const lamp = new THREE.PointLight(0xfff0dc, look.lampIntensity, 36, 2);
  lamp.position.copy(sunPos);
  scene.add(lamp);

  return { hemi, sun, lamp, sunPos };
}

export function addReferenceGround(scene, floorY) {
  const look = DEFAULT_STUDIO_LOOK;
  const floor = createFloor(floorY);
  const sunPos = sunPositionFromLook(look);
  const bandAngle = THREE.MathUtils.radToDeg(Math.atan2(sunPos.z, -sunPos.x));
  const studioShadows = createLuxuryStudioShadows({
    floorY,
    size: 80,
    angle: bandAngle,
    opacity: look.bandOpacity,
    offsetX: 0,
    offsetZ: 0,
    color: '#8a8680',
  });
  scene.add(floor, studioShadows);
  return { floor, studioShadows };
}

export function markShadowReady(root) {
  root.traverse((obj) => {
    if (!obj.isMesh) return;
    obj.castShadow = true;
    obj.receiveShadow = true;
  });
}

export function loadStudioHdri(renderer, scene, { onLoad, onError } = {}) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const loader = new RGBELoader();
  loader.load(
    STUDIO_HDRI_URL,
    (texture) => {
      const env = pmrem.fromEquirectangular(texture).texture;
      scene.environment = env;
      scene.environmentIntensity = DEFAULT_STUDIO_LOOK.hdri;
      if ('environmentRotation' in scene) {
        scene.environmentRotation.set(0, -Math.PI / 3, 0);
      }
      texture.dispose();
      pmrem.dispose();
      onLoad?.(env);
    },
    undefined,
    (err) => {
      pmrem.dispose();
      onError?.(err);
    },
  );
  return pmrem;
}
