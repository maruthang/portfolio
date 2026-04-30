import { ImageResponse } from 'next/og';
import { projects } from '@/content/projects';

export const runtime = 'edge';
export const alt = 'Project case study — Maruthan G';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  const title = project?.title ?? 'Project';
  const tech = project?.tech.slice(0, 6).join(' · ') ?? '';

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 80,
        background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)',
        color: '#e6edf3',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ fontSize: 28, fontFamily: 'monospace', color: '#58a6ff' }}>
        maruthan.dev / case study
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.1 }}>{title}</div>
        <div style={{ fontSize: 28, color: '#7d8590', fontFamily: 'monospace' }}>{tech}</div>
      </div>
      <div style={{ fontSize: 22, color: '#7d8590' }}>Maruthan G — Full-stack developer</div>
    </div>,
    size,
  );
}
