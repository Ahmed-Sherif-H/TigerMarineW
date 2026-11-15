import * as THREE from 'three';

const STORAGE_KEY = 'tm-infinity-280-studio-look-v3';

export const DEFAULT_STUDIO_LOOK = {
  exposure: 0.98,
  sunIntensity: 1.2,
  lampIntensity: 0.4,
  hemiIntensity: 0.74,
  hdri: 0.82,
  warmth: 0.14,
  sunAzimuth: 42,
  sunHeight: 22,
  sunDistance: 10,
  shadowRadius: 10,
  floorShadow: 0.3,
  bandOpacity: 0.12,
  bandWidth: 0.024,
  bandSpread: 0.067,
  bandAngle: -74,
  bandFollowSun: true,
  bandRadius: 0.28,
  bandFeather: 4,
  fillIntensity: 0.7,
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
  const { renderer, scene, sun, lamp, fill, hemi, floor, bands } = studio;
  const pos = sunPositionFromLook(look);
  const cool = new THREE.Color('#f4f5f6');
  const warm = new THREE.Color('#f0e4d2');
  const color = cool.clone().lerp(warm, look.warmth);

  renderer.toneMappingExposure = look.exposure;
  renderer.setClearColor('#f5f3ef', 1);
  if (scene.background) scene.background.copy(new THREE.Color('#f5f3ef'));
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

  if (fill) {
    fill.intensity = look.fillIntensity;
    fill.color.copy(color);
    fill.position.set(-pos.x * 0.85, pos.y * 0.72, -pos.z * 0.85);
  }

  hemi.intensity = look.hemiIntensity;
  hemi.color.copy(color);
  hemi.groundColor.set('#c9c8c4');

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
