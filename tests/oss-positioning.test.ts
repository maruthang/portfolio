import { describe, it, expect } from 'vitest';
import { ringPositions, ellipseOrbit } from '@/lib/oss-positioning';

describe('ringPositions', () => {
  it('places n nodes evenly on a circle of given radius', () => {
    const pts = ringPositions(4, 10);
    expect(pts).toHaveLength(4);
    expect(pts[0]!.x).toBeCloseTo(10);
    expect(pts[0]!.y).toBeCloseTo(0);
    expect(pts[2]!.x).toBeCloseTo(-10);
    expect(pts[2]!.y).toBeCloseTo(0);
  });

  it('returns deterministic results for same inputs', () => {
    expect(ringPositions(9, 5)).toEqual(ringPositions(9, 5));
  });
});

describe('ellipseOrbit', () => {
  it('returns a point on an ellipse around a center for time t', () => {
    const p = ellipseOrbit({ cx: 0, cy: 0, a: 2, b: 1, phase: 0, speed: 0 }, 0);
    expect(p.x).toBeCloseTo(2);
    expect(p.y).toBeCloseTo(0);
  });

  it('moves around the ellipse over time', () => {
    const at0 = ellipseOrbit({ cx: 0, cy: 0, a: 2, b: 1, phase: 0, speed: 1 }, 0);
    const atQuarter = ellipseOrbit({ cx: 0, cy: 0, a: 2, b: 1, phase: 0, speed: 1 }, Math.PI / 2);
    expect(at0.x).toBeCloseTo(2);
    expect(atQuarter.x).toBeCloseTo(0);
    expect(atQuarter.y).toBeCloseTo(1);
  });
});
