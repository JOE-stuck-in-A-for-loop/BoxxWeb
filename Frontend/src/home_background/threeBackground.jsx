import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;

  // Simple pseudo-random noise to break up banding
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  void main() {
    // Bottom-left (#D8ECFF) to top-right (#FFFFFF)
    vec3 colorA = vec3(0.847, 0.925, 1.0); // #D8ECFF
    vec3 colorB = vec3(1.0, 1.0, 1.0);      // #FFFFFF

    // Diagonal gradient: bottom-left (0,0) → top-right (1,1)
    float t = (vUv.x + vUv.y) * 0.5;

    // Slow breathing cycle
    float breathe = sin(uTime * 0.3) * 0.03;
    t = clamp(t + breathe, 0.0, 1.0);

    vec3 color = mix(colorA, colorB, t);

    // Subtle film grain to prevent banding
    vec2 grainUV = vUv * 1.5;
    float grain = hash(grainUV + floor(uTime * 30.0)) * 0.008;
    color += grain;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function ThreeBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: false,
      antialias: true,
    });
    renderer.setClearColor(0xffffff, 1);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
      },
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    function resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
    }
    resize();
    window.addEventListener('resize', resize);

    const clock = new THREE.Clock();
    let animId;

    function animate() {
      material.uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="three-canvas" />;
}

export { ThreeBackground };