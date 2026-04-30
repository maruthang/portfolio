'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ringPositions, ellipseOrbit, type Point2 } from '@/lib/oss-positioning';
import { cn } from '@/design-system/utils/cn';

export interface ConstellationProject {
  name: string;
  merged: number;
}

interface OssConstellationProps {
  projects: ConstellationProject[];
  selectedProject: string | null;
  onSelectProject: (name: string | null) => void;
  className?: string;
}

function RepoNode({
  position,
  selected,
  dimmed,
  onSelect,
}: {
  position: Point2;
  selected: boolean;
  dimmed: boolean;
  onSelect: () => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  return (
    <mesh
      ref={ref}
      position={[position.x, position.y, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <circleGeometry args={[selected ? 0.28 : 0.22, 32]} />
      <meshBasicMaterial
        color={selected ? '#58a6ff' : '#ffffff'}
        opacity={dimmed ? 0.3 : 1}
        transparent
      />
    </mesh>
  );
}

interface OrbitConfig {
  cx: number;
  cy: number;
  a: number;
  b: number;
  phase: number;
  speed: number;
}

function PrSatellite({
  orbit,
  paused,
  dimmed,
}: {
  orbit: OrbitConfig;
  paused: boolean;
  dimmed: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const tRef = useRef(orbit.phase);
  useFrame((_, delta) => {
    if (paused || !ref.current) return;
    tRef.current += delta;
    const p = ellipseOrbit(orbit, tRef.current);
    ref.current.position.set(p.x, p.y, 0);
  });
  return (
    <mesh ref={ref} position={[orbit.cx + orbit.a, orbit.cy, 0]}>
      <circleGeometry args={[0.04, 12]} />
      <meshBasicMaterial color="#58a6ff" opacity={dimmed ? 0.15 : 0.6} transparent />
    </mesh>
  );
}

function orbitFor(repoPos: Point2, prIndex: number, totalForRepo: number): OrbitConfig {
  const a = 0.45 + (prIndex % 3) * 0.08;
  const b = a * (0.6 + ((prIndex * 31) % 30) / 100);
  const phase = (prIndex / Math.max(1, totalForRepo)) * Math.PI * 2;
  const speed = 0.3 + ((prIndex * 17) % 10) / 80;
  return { cx: repoPos.x, cy: repoPos.y, a, b, phase, speed };
}

export function OssConstellation({
  projects,
  selectedProject,
  onSelectProject,
  className,
}: OssConstellationProps) {
  const [reduced, setReduced] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    setMounted(true);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const positions = useMemo(() => ringPositions(projects.length, 1.6), [projects.length]);

  return (
    <div className={cn('relative w-full', className)}>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md border border-[var(--border)] bg-[var(--surface)]">
        {mounted && (
          <Canvas
            orthographic
            camera={{ position: [0, 0, 5], zoom: 130, near: 0.1, far: 100 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 1.5]}
          >
            <Suspense fallback={null}>
              {projects.map((p, i) => {
                const pos = positions[i]!;
                const isSelected = selectedProject === p.name;
                const dimmed = !!selectedProject && !isSelected;
                return (
                  <group key={p.name}>
                    <RepoNode
                      position={pos}
                      selected={isSelected}
                      dimmed={dimmed}
                      onSelect={() => onSelectProject(isSelected ? null : p.name)}
                    />
                    {Array.from({ length: Math.min(p.merged, 8) }).map((_, j) => (
                      <PrSatellite
                        key={j}
                        orbit={orbitFor(pos, j, Math.min(p.merged, 8))}
                        paused={reduced}
                        dimmed={dimmed}
                      />
                    ))}
                  </group>
                );
              })}
            </Suspense>
          </Canvas>
        )}
      </div>

      {/* Accessible / no-JS fallback list. Always rendered so screen readers have the same control. */}
      <ul className="mt-4 flex flex-wrap gap-2">
        {projects.map((p) => {
          const active = selectedProject === p.name;
          return (
            <li key={p.name}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => onSelectProject(active ? null : p.name)}
                className={cn(
                  'rounded-md border px-3 py-1.5 font-mono text-xs transition-colors',
                  active
                    ? 'border-[var(--color-brand-500)] bg-[var(--color-brand-500)]/10 text-[var(--color-brand-500)]'
                    : 'border-[var(--border)] text-[var(--fg)] hover:border-[var(--color-brand-500)]/60',
                )}
              >
                {p.name} <span className="text-[var(--muted)]">({p.merged})</span>
              </button>
            </li>
          );
        })}
        {selectedProject && (
          <li>
            <button
              type="button"
              onClick={() => onSelectProject(null)}
              className="rounded-md border border-[var(--border)] px-3 py-1.5 font-mono text-xs text-[var(--muted)] hover:text-[var(--fg)]"
            >
              Clear filter
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}
