import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Maruthan G — Portfolio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
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
      <div style={{ fontSize: 36, fontFamily: 'monospace', color: '#58a6ff' }}>maruthan.dev</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>Maruthan G</div>
        <div style={{ fontSize: 32, color: '#7d8590', maxWidth: 900 }}>
          Full-stack developer building production B2B systems and contributing to the dev tools I
          use every day.
        </div>
      </div>
      <div style={{ fontSize: 24, color: '#7d8590' }}>
        57 merged PRs · NestJS · VS Code · undici · BullMQ
      </div>
    </div>,
    size,
  );
}
