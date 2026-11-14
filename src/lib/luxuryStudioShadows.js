import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  #include <common>
  #include <logdepthbuf_pars_vertex>
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    #include <logdepthbuf_vertex>
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform float uAngle;
  uniform float uOpacity;
  uniform float uWidth;
  uniform float uSpread;
  uniform float uRadius;
  uniform float uFeather;
  uniform vec3 uShadowColor;
  #include <common>
  #include <logdepthbuf_pars_fragment>
  float softBand(float x, float center, float width, float feather) {
    float d = abs((x - center) / max(width, 0.001));
    return exp(-pow(d, feather));
  }
  void main() {
    #include <logdepthbuf_fragment>
    vec2 p = vUv - 0.5;
    float c = cos(uAngle);
    float s = sin(uAngle);
    float axis = p.x * c + p.y * s;
    float w = uWidth;
    float shadow = 0.0;
    shadow += 0.82 * softBand(axis, -uSpread, w, uFeather);
    shadow += 0.58 * softBand(axis,  0.0, w * 1.12, uFeather);
    shadow += 0.74 * softBand(axis,  uSpread, w, uFeather);
    float r = length(p * vec2(0.9, 1.15));
    float aroundBoat = 1.0 - smoothstep(uRadius * 0.42, uRadius, r);
    float alpha = clamp(shadow, 0.0, 1.0) * aroundBoat * uOpacity;
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(uShadowColor, alpha);
  }
`;

export function createLuxuryStudioShadows({
  floorY = 0,
  size = 80,
  angle = -30,
  opacity = 0.24,
  offsetX = 0,
  offsetZ = 0,
  color = '#858992',
} = {}) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uAngle: { value: THREE.MathUtils.degToRad(angle) },
        uOpacity: { value: opacity },
        uWidth: { value: 0.024 },
        uSpread: { value: 0.067 },
        uRadius: { value: 0.28 },
        uFeather: { value: 4 },
        uShadowColor: { value: new THREE.Color(color) },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  mesh.position.set(offsetX, floorY + 0.012, offsetZ);
  mesh.rotation.x = -Math.PI / 2;
  mesh.renderOrder = 3;
  mesh.frustumCulled = false;
  mesh.name = 'luxury-studio-shadows';
  return mesh;
}
