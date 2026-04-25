import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { colors, spacing, radii, shadows, motion } from '../src/design-system/tokens';

function flatten(obj: Record<string, unknown>, prefix: string): string[] {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      lines.push(`  --${prefix}-${key}: ${value};`);
    } else if (typeof value === 'object' && value !== null) {
      for (const [subKey, subValue] of Object.entries(value as Record<string, string>)) {
        lines.push(`  --${prefix}-${key}-${subKey}: ${subValue};`);
      }
    }
  }
  return lines;
}

export function tokensToCss(): string {
  const lines: string[] = [':root {'];
  lines.push('  /* colors */');
  lines.push(...flatten(colors as unknown as Record<string, unknown>, 'color'));
  lines.push('  /* spacing */');
  lines.push(...flatten(spacing as unknown as Record<string, unknown>, 'spacing'));
  lines.push('  /* radius */');
  lines.push(...flatten(radii as unknown as Record<string, unknown>, 'radius'));
  lines.push('  /* shadow */');
  lines.push(...flatten(shadows as unknown as Record<string, unknown>, 'shadow'));
  lines.push('  /* motion */');
  for (const [k, v] of Object.entries(motion.duration)) {
    lines.push(`  --duration-${k}: ${v};`);
  }
  for (const [k, v] of Object.entries(motion.easing)) {
    lines.push(`  --easing-${k}: ${v};`);
  }
  lines.push('}');
  return lines.join('\n') + '\n';
}

function main() {
  const css = tokensToCss();
  const outPath = resolve(__dirname, '../src/design-system/tokens.css');
  writeFileSync(outPath, css, 'utf8');
  console.log(`wrote ${outPath} (${css.length} bytes)`);
}

if (require.main === module) {
  main();
}
