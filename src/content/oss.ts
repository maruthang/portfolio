export interface OssProject {
  name: string;
  href: string;
  stars: string;
  merged: number;
  open: number;
  focus: string;
}

export interface OssHighlight {
  project: string;
  pr: string;
  title: string;
  href: string;
  mergedOn?: string;
}

export const ossStats = {
  totalMerged: 57,
  totalOpen: 103,
  projectCount: 9,
} as const;

export const ossProjects: OssProject[] = [
  {
    name: 'nestjs/nest-cli',
    href: 'https://github.com/nestjs/nest-cli',
    stars: '2.1k+',
    merged: 15,
    open: 2,
    focus: 'SWC compiler, watch mode, build system, async shutdown hooks, signal forwarding',
  },
  {
    name: 'nestjs/swagger',
    href: 'https://github.com/nestjs/swagger',
    stars: '1.4k+',
    merged: 14,
    open: 0,
    focus: 'Schema handling, plugin fixes, enum mutation, TS project references, SWC metadata',
  },
  {
    name: 'microsoft/vscode',
    href: 'https://github.com/microsoft/vscode',
    stars: '183k+',
    merged: 12,
    open: 46,
    focus: 'ANSI escape handling, chat/terminal tooling, editor UI, context key services',
  },
  {
    name: 'nestjs/graphql',
    href: 'https://github.com/nestjs/graphql',
    stars: '1.5k+',
    merged: 6,
    open: 0,
    focus: 'Apollo subscriptions, abstract directive inheritance, global prefix handling',
  },
  {
    name: 'nodejs/undici',
    href: 'https://github.com/nodejs/undici',
    stars: '7k+',
    merged: 4,
    open: 2,
    focus: 'HTTP interceptors, redirect options, type definitions',
  },
  {
    name: 'taskforcesh/bullmq',
    href: 'https://github.com/taskforcesh/bullmq',
    stars: '7k+',
    merged: 3,
    open: 13,
    focus: 'Worker scheduler registry, repeatable jobs, queue internals',
  },
  {
    name: 'angular/angular-cli',
    href: 'https://github.com/angular/angular-cli',
    stars: '27k+',
    merged: 2,
    open: 3,
    focus: 'Build system, error stack traces, styleUrl validation',
  },
];

export const ossHighlights: OssHighlight[] = [
  {
    project: 'nodejs/undici',
    pr: '#5066',
    title: 'fix(interceptor): add throwOnMaxRedirect to types and interceptor opts',
    href: 'https://github.com/nodejs/undici/pull/5066',
  },
  {
    project: 'microsoft/vscode',
    pr: '#307960',
    title: 'fix: handle heredoc/multiline commands in terminal tool execution',
    href: 'https://github.com/microsoft/vscode/pull/307960',
  },
  {
    project: 'nestjs/graphql',
    pr: '#3937',
    title: 'fix(apollo): respect useGlobalPrefix on custom subscription path',
    href: 'https://github.com/nestjs/graphql/pull/3937',
  },
];
