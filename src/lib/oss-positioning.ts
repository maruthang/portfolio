export interface Point2 {
  x: number;
  y: number;
}

export function ringPositions(n: number, radius: number): Point2[] {
  const points: Point2[] = [];
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2;
    points.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
  }
  return points;
}

export interface Orbit {
  cx: number;
  cy: number;
  a: number; // semi-major axis
  b: number; // semi-minor axis
  phase: number; // starting angle offset
  speed: number; // radians per unit time
}

export function ellipseOrbit(orbit: Orbit, t: number): Point2 {
  const angle = orbit.phase + orbit.speed * t;
  return {
    x: orbit.cx + orbit.a * Math.cos(angle),
    y: orbit.cy + orbit.b * Math.sin(angle),
  };
}
