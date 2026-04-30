'use client';

export function HeroShader() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div data-testid="hero-shader-fallback" className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'radial-gradient(circle, var(--color-brand-500) 1px, transparent 1px)',
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
    </div>
  );
}
