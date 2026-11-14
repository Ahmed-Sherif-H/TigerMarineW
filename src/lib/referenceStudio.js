import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

export const STUDIO_HDRI_URL = '/hdri/white_studio_03_2k.hdr';
export const STUDIO_BACKGROUND = '#f5f3f0';

const BAND_VERTEX = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const BAND_FRAGMENT = `
  varying vec2 vUv;
  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float d = p.x * 0.52 + p.y * 0.86;
    float light1 = exp(-pow((d - 0.18) / 0.30, 2.0));
    float light2 = exp(-pow((d - 0.78) / 0.22, 2.0));
    float shade1 = exp(-pow((d + 0.28) / 0.24, 2.0));
    float shade2 = exp(-pow((d + 0.72) / 0.34, 2.0));
    float falloff = 1.0 - smoothstep(0.42, 1.08, length(p * vec2(0.85, 1.0)));
    float lightA = (light1 * 0.10 + light2 * 0.06) * falloff;
    float shadeA = (shade1 * 0.11 + shade2 * 0.07) * falloff;
    float alpha = lightA + shadeA;
    vec3 lightColor = vec3(1.0, 0.96, 0.88);
    vec3 shadeColor = vec3(0.42, 0.45, 0.52);
    vec3 color = (lightColor * lightA + shadeColor * shadeA) / max(alpha, 0.0001);
    gl_FragColor = vec4(color, alpha);
  }
`;

function createSunlightBands(floorY) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(36, 36),
    new THREE.ShaderMaterial({
      vertexShader: BAND_VERTEX,
      fragmentShader: BAND_FRAGMENT,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      toneMapped: false,
    }),
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(0, floorY + 0.01, 0);
  mesh.renderOrder = 2;
  mesh.name = 'studio-sunlight-bands';
  return mesh;
}

function createFloor(floorY) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(36, 36),
    new THREE.ShadowMaterial({
      color: '#3a3d45',
      opacity: 0.32,
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
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(STUDIO_BACKGROUND, 1);
}

export function addReferenceLights(scene) {
  const hemi = new THREE.HemisphereLight(0xffffff, 0xd9d5d0, 0.16);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xfff1d0, 3.15);
  sun.position.set(12, 16, 4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -10;
  sun.shadow.camera.right = 10;
  sun.shadow.camera.top = 10;
  sun.shadow.camera.bottom = -10;
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 45;
  sun.shadow.bias = -0.00015;
  sun.shadow.normalBias = 0.03;
  sun.shadow.radius = 3.5;
  sun.target.position.set(0, 0.7, 0);
  scene.add(sun);
  scene.add(sun.target);

  const fill = new THREE.DirectionalLight(0xe8ebf3, 0.18);
  fill.position.set(-8, 5, -2);
  scene.add(fill);

  return { hemi, sun, fill };
}

export function addReferenceGround(scene, floorY) {
  const floor = createFloor(floorY);
  const bands = createSunlightBands(floorY);
  scene.add(floor, bands);
  return { floor, bands };
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
      scene.environmentIntensity = 0.85;
      if ('environmentRotation' in scene) {
        scene.environmentRotation.set(0, Math.PI / 5, 0);
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
