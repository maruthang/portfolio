export interface Stat {
  label: string;
  value: number;
  suffix?: string;
}

export const stats: Stat[] = [
  { label: 'Merged PRs', value: 57, suffix: '+' },
  { label: 'OSS projects', value: 9, suffix: '+' },
  { label: 'Projects shipped', value: 6 },
];
