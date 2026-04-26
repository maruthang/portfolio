import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import type { ComponentProps } from 'react';

const mdxComponents = {
  h1: (props: ComponentProps<'h1'>) => (
    <h1 className="mt-12 font-mono text-3xl font-bold sm:text-4xl" {...props} />
  ),
  h2: (props: ComponentProps<'h2'>) => (
    <h2 className="mt-10 font-mono text-2xl font-bold sm:text-3xl" {...props} />
  ),
  h3: (props: ComponentProps<'h3'>) => (
    <h3 className="mt-8 font-mono text-xl font-semibold" {...props} />
  ),
  p: (props: ComponentProps<'p'>) => (
    <p className="mt-4 leading-relaxed text-[var(--fg)]/90" {...props} />
  ),
  ul: (props: ComponentProps<'ul'>) => (
    <ul className="mt-4 list-disc space-y-1 pl-6 text-[var(--fg)]/90" {...props} />
  ),
  ol: (props: ComponentProps<'ol'>) => (
    <ol className="mt-4 list-decimal space-y-1 pl-6 text-[var(--fg)]/90" {...props} />
  ),
  li: (props: ComponentProps<'li'>) => <li {...props} />,
  a: (props: ComponentProps<'a'>) => (
    <a
      className="text-[var(--color-brand-500)] underline-offset-2 hover:underline"
      target={props.href?.startsWith('http') ? '_blank' : undefined}
      rel={props.href?.startsWith('http') ? 'noreferrer' : undefined}
      {...props}
    />
  ),
  blockquote: (props: ComponentProps<'blockquote'>) => (
    <blockquote
      className="mt-4 border-l-4 border-[var(--color-brand-500)] bg-[var(--surface)] px-4 py-2 text-[var(--muted)] italic"
      {...props}
    />
  ),
  code: (props: ComponentProps<'code'>) => (
    <code
      className="rounded-md bg-[var(--surface)] px-1.5 py-0.5 font-mono text-sm text-[var(--fg)]"
      {...props}
    />
  ),
  pre: (props: ComponentProps<'pre'>) => (
    <pre
      className="mt-4 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-relaxed"
      {...props}
    />
  ),
  hr: () => <hr className="my-12 border-[var(--border)]" />,
};

export function MDXContent({ source }: { source: string }) {
  return (
    <div className="max-w-3xl">
      <MDXRemote
        source={source}
        components={mdxComponents}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              [
                rehypePrettyCode,
                {
                  theme: { dark: 'github-dark', light: 'github-light' },
                  keepBackground: false,
                },
              ],
            ],
          },
        }}
      />
    </div>
  );
}
