'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/design-system/motion/reducedMotion';
import { ProjectCard } from '@/design-system/components/ProjectCard';
import type { Project } from '@/content/projects';

export function HorizontalScrollProjects({ projects }: { projects: Project[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(max-width: 1023px)').matches) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      const gsapModule = await import('gsap');
      const scrollTriggerModule = await import('gsap/ScrollTrigger');
      const gsap = gsapModule.default ?? gsapModule.gsap;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger ?? scrollTriggerModule.default;
      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const distance = track.scrollWidth - section.clientWidth;

      const tween = gsap.to(track, {
        x: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      cleanup = () => {
        tween.kill();
        ScrollTrigger.getAll().forEach((t: { kill: () => void }) => t.kill());
      };
    })();

    return () => cleanup?.();
  }, [reduced]);

  return (
    <>
      <div ref={sectionRef} className="relative hidden lg:block">
        <div className="overflow-hidden">
          <div ref={trackRef} className="flex gap-6 py-8" style={{ width: 'max-content' }}>
            {projects.map((p) => (
              <div key={p.slug} className="w-[420px] shrink-0">
                <ProjectCard project={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:hidden">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </>
  );
}
