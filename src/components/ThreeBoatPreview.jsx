import { useEffect, useRef } from 'react';

/**
 * ThreeBoatPreview
 * - Dynamically imports three.js from a CDN (no extra deps needed)
 * - Renders a simple stylized "boat" made of primitives
 * - Auto-resizes and animates subtle rotation
 * - Designed for draft preview only
 */
const ThreeBoatPreview = ({ className = '', style = {} }) => {
  const containerRef = useRef(null);
  const threeRef = useRef({ cleanup: null });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Dynamically import three from CDN to avoid adding dependencies
        const THREE = await import('https://unpkg.com/three@0.160.0/build/three.module.js');

        if (!mounted || !containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth || 800;
        const height = container.clientHeight || 480;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1.5, 2));
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0); // transparent
        container.appendChild(renderer.domElement);

        // Scene
        const scene = new THREE.Scene();

        // Camera
        const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
        camera.position.set(0.6, 0.35, 1.4);
        camera.lookAt(0, 0.05, 0);

        // Lights
        const hemi = new THREE.HemisphereLight(0xffffff, 0x222233, 0.9);
        scene.add(hemi);
        const dir1 = new THREE.DirectionalLight(0xffffff, 0.8);
        dir1.position.set(2, 3, 2);
        scene.add(dir1);
        const dir2 = new THREE.DirectionalLight(0xfff2cc, 0.4);
        dir2.position.set(-2, 1.5, -1.5);
        scene.add(dir2);

        // Group for the "boat"
        const boat = new THREE.Group();
        scene.add(boat);

        // Hull (rounded box approximation)
        const hullGeom = new THREE.CapsuleGeometry(0.42, 0.8, 6, 16);
        const hullMat = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          metalness: 0.15,
          roughness: 0.35,
        });
        const hull = new THREE.Mesh(hullGeom, hullMat);
        hull.rotation.z = Math.PI / 2;
        hull.scale.set(1, 0.75, 0.55);
        hull.position.y = 0.02;
        boat.add(hull);

        // Tube (outer torus-like rounded rectangle - approximate with torus segments)
        const tubeGeom = new THREE.TorusGeometry(0.6, 0.06, 12, 48);
        const tubeMat = new THREE.MeshStandardMaterial({
          color: 0xeaeaea,
          metalness: 0.1,
          roughness: 0.55,
        });
        const tube = new THREE.Mesh(tubeGeom, tubeMat);
        tube.rotation.x = Math.PI / 2;
        tube.scale.set(1.35, 1.0, 0.62);
        tube.position.y = 0.05;
        boat.add(tube);

        // Console (small box)
        const consoleGeom = new THREE.BoxGeometry(0.18, 0.14, 0.12);
        const consoleMat = new THREE.MeshStandardMaterial({
          color: 0xf0f0f0,
          metalness: 0.05,
          roughness: 0.4,
        });
        const consoleMesh = new THREE.Mesh(consoleGeom, consoleMat);
        consoleMesh.position.set(0.05, 0.12, 0);
        boat.add(consoleMesh);

        // Seats (cylinders)
        const seatGeom = new THREE.CylinderGeometry(0.07, 0.07, 0.12, 20);
        const seatMat = new THREE.MeshStandardMaterial({
          color: 0xcbb69d,
          metalness: 0.05,
          roughness: 0.6,
        });
        const seat1 = new THREE.Mesh(seatGeom, seatMat);
        seat1.rotation.z = Math.PI / 2;
        seat1.position.set(-0.1, 0.09, 0.0);
        boat.add(seat1);
        const seat2 = seat1.clone();
        seat2.position.set(-0.18, 0.09, 0.0);
        boat.add(seat2);

        // Floor (thin box with slight gloss)
        const floorGeom = new THREE.BoxGeometry(1.0, 0.01, 0.35);
        const floorMat = new THREE.MeshStandardMaterial({
          color: 0xe7dcc9,
          metalness: 0.05,
          roughness: 0.5,
        });
        const floor = new THREE.Mesh(floorGeom, floorMat);
        floor.position.y = -0.02;
        boat.add(floor);

        // Subtle hover
        let t = 0;
        // Resize handler
        const onResize = () => {
          if (!container) return;
          const w = container.clientWidth || width;
          const h = container.clientHeight || height;
          renderer.setSize(w, h);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', onResize);

        // Mouse tilt
        let targetRotX = -0.12;
        let targetRotY = -0.18;
        const onMouseMove = (e) => {
          const rect = container.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = (e.clientY - rect.top) / rect.height;
          targetRotY = (x - 0.5) * 0.5; // yaw
          targetRotX = -(y - 0.5) * 0.3; // pitch
        };
        container.addEventListener('mousemove', onMouseMove);

        // Initial orientation
        boat.rotation.set(-0.15, -0.25, 0);

        // Render loop
        const animate = () => {
          if (!mounted) return;
          t += 0.01;
          // Smoothly approach target tilt
          boat.rotation.x += (targetRotX - boat.rotation.x) * 0.08;
          boat.rotation.y += (targetRotY - boat.rotation.y) * 0.08;
          // Gentle bob
          boat.position.y = Math.sin(t) * 0.01;
          renderer.render(scene, camera);
          requestAnimationFrame(animate);
        };
        animate();

        threeRef.current.cleanup = () => {
          window.removeEventListener('resize', onResize);
          container.removeEventListener('mousemove', onMouseMove);
          renderer.dispose();
          while (container.firstChild) {
            container.removeChild(container.firstChild);
          }
        };
      } catch (err) {
        // Fail silently in draft if CDN blocked
        // eslint-disable-next-line no-console
        console.warn('[ThreeBoatPreview] three.js dynamic import failed', err);
      }
    })();
    return () => {
      mounted = false;
      if (threeRef.current.cleanup) {
        threeRef.current.cleanup();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: '100%', height: '480px', ...style }}
    />
  );
};

export default ThreeBoatPreview;

