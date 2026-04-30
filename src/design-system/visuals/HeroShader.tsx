'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function StaticFallback() {
  return (
    <div data-testid="hero-shader-fallback" className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--color-brand-500) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />
      <div
        className="absolute -top-32 -left-32 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--color-brand-500), transparent 70%)' }}
      />
      <div
        className="absolute -right-32 -bottom-32 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--color-brand-300), transparent 70%)' }}
      />
    </div>
  );
}

const FRAGMENT_SHADER = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec3 uColor;
  varying vec2 vUv;

  // Cheap pseudo-noise.
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  void main() {
    vec2 uv = vUv - 0.5;
    uv += uMouse * 0.05;
    float n = noise(uv * 3.0 + uTime * 0.05);
    n += 0.5 * noise(uv * 6.0 - uTime * 0.03);
    float r = length(uv);
    float vignette = smoothstep(0.95, 0.2, r);
    float intensity = n * vignette * 0.18;
    gl_FragColor = vec4(uColor * intensity, intensity);
  }
`;

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function ShaderPlane({ paused }: { paused: boolean }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.set(x, y);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame((_state, delta) => {
    if (paused || !matRef.current) return;
    const u = matRef.current.uniforms;
    if (u['uTime']) u['uTime'].value += delta;
    if (u['uMouse']) (u['uMouse'].value as THREE.Vector2).lerp(mouseRef.current, 0.05);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={{
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uColor: { value: new THREE.Color('#58a6ff') },
        }}
      />
    </mesh>
  );
}

export function HeroShader() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    setMounted(true);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!wrapRef.current) return;
    const obs = new IntersectionObserver(([entry]) => setInView(!!entry?.isIntersecting), {
      threshold: 0,
    });
    obs.observe(wrapRef.current);
    return () => obs.disconnect();
  }, []);

  const animate = mounted && !reduced;

  return (
    <div ref={wrapRef} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <StaticFallback />
      {animate && (
        <Canvas
          camera={{ position: [0, 0, 1], near: 0.1, far: 10 }}
          gl={{ antialias: false, alpha: true }}
          dpr={[1, 1.5]}
          className="absolute inset-0"
        >
          <Suspense fallback={null}>
            <ShaderPlane paused={!inView} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
