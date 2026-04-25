const STAR_POSITIONS = [
  { top: '15%', left: '20%', delay: '0s', size: '2px' },
  { top: '30%', left: '70%', delay: '0.6s', size: '1px' },
  { top: '50%', left: '10%', delay: '1.2s', size: '2px' },
  { top: '65%', left: '85%', delay: '0.3s', size: '1px' },
  { top: '20%', left: '90%', delay: '1.5s', size: '2px' },
  { top: '80%', left: '30%', delay: '0.9s', size: '1px' },
  { top: '40%', left: '50%', delay: '0.4s', size: '1px' },
  { top: '70%', left: '60%', delay: '1.8s', size: '2px' },
];

export function HeroBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Dotted grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--color-brand-500) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />
      {/* Top-left brand glow */}
      <div
        className="absolute -top-32 -left-32 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--color-brand-500), transparent 70%)' }}
      />
      {/* Bottom-right warm glow */}
      <div
        className="absolute -right-32 -bottom-32 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--color-brand-300), transparent 70%)' }}
      />
      {/* Twinkling stars */}
      {STAR_POSITIONS.map((s, i) => (
        <span
          key={i}
          className="hero-star absolute rounded-full bg-white/70"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animation: `twinkle 3s ease-in-out ${s.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}
