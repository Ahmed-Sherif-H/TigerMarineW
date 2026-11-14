import * as THREE from 'three';

const STORAGE_KEY = 'tm-infinity-280-studio-look-v2';

export const DEFAULT_STUDIO_LOOK = {
  exposure: 1.04,
  sunIntensity: 3.35,
  lampIntensity: 3.75,
  hemiIntensity: 0.27,
  hdri: 1.01,
  warmth: 0.59,
  sunAzimuth: 53,
  sunHeight: 25,
  sunDistance: 6,
  shadowRadius: 12,
  floorShadow: 0.41,
  bandOpacity: 0.17,
  bandWidth: 0.024,
  bandSpread: 0.067,
  bandAngle: -74,
  bandFollowSun: true,
  bandRadius: 0.28,
  bandFeather: 4,
};

export function loadStudioLook() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STUDIO_LOOK };
    return { ...DEFAULT_STUDIO_LOOK, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STUDIO_LOOK };
  }
}

export function saveStudioLook(look) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(look));
}

export function sunPositionFromLook(look) {
  const a = THREE.MathUtils.degToRad(look.sunAzimuth);
  const d = look.sunDistance;
  return new THREE.Vector3(Math.cos(a) * d, look.sunHeight, Math.sin(a) * d);
}

export function bandAngleFromSun(look) {
  const pos = sunPositionFromLook(look);
  return THREE.MathUtils.radToDeg(Math.atan2(pos.z, -pos.x));
}

export function applyStudioLook(studio, look) {
  if (!studio) return;
  const { renderer, scene, sun, lamp, hemi, floor, bands } = studio;
  const pos = sunPositionFromLook(look);
  const cool = new THREE.Color('#f6f4f1');
  const warm = new THREE.Color('#ffd89a');
  const color = cool.clone().lerp(warm, look.warmth);

  renderer.toneMappingExposure = look.exposure;
  renderer.setClearColor(look.warmth > 0.55 ? '#f7f3ec' : '#f5f3ef', 1);
  if (scene.background) scene.background.copy(new THREE.Color(look.warmth > 0.55 ? '#f7f3ec' : '#f5f3ef'));
  if (typeof scene.environmentIntensity === 'number') scene.environmentIntensity = look.hdri;

  sun.intensity = look.sunIntensity;
  sun.color.copy(color);
  sun.position.copy(pos);
  sun.target.position.set(0, 0.7, 0);
  sun.target.updateMatrixWorld();
  sun.shadow.radius = look.shadowRadius;

  lamp.intensity = look.lampIntensity;
  lamp.color.copy(color);
  lamp.position.copy(pos);

  hemi.intensity = look.hemiIntensity;

  if (floor?.material) floor.material.opacity = look.floorShadow;

  const mat = bands?.material;
  if (mat?.uniforms) {
    const angle = look.bandFollowSun ? bandAngleFromSun(look) : look.bandAngle;
    mat.uniforms.uAngle.value = THREE.MathUtils.degToRad(angle);
    mat.uniforms.uOpacity.value = look.bandOpacity;
    mat.uniforms.uWidth.value = look.bandWidth;
    mat.uniforms.uSpread.value = look.bandSpread;
    mat.uniforms.uRadius.value = look.bandRadius;
    mat.uniforms.uFeather.value = look.bandFeather;
    mat.uniforms.uShadowColor.value.set(look.warmth > 0.6 ? '#8a8680' : '#858992');
  }
}
