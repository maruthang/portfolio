import { ImageResponse } from 'next/og';
import { posts } from '@/content/writing';

export const runtime = 'edge';
export const alt = 'Writing — Maruthan G';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  const title = post?.title ?? 'Writing';
  const date = post ? formatDate(post.date) : '';

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
        maruthan.dev / writing
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.15 }}>{title}</div>
        {date && (
          <div style={{ fontSize: 28, color: '#7d8590', fontFamily: 'monospace' }}>{date}</div>
        )}
      </div>
      <div style={{ fontSize: 22, color: '#7d8590' }}>Maruthan G — Full-stack developer</div>
    </div>,
    size,
  );
}
