import type { Story } from '@ladle/react';
import { Badge, type BadgeProps } from '@/design-system/components/Badge';
import '@/app/globals.css';

export const All: Story<BadgeProps> = () => (
  <div style={{ display: 'flex', gap: '0.5rem' }}>
    <Badge>default</Badge>
    <Badge variant="success">success</Badge>
    <Badge variant="warning">warning</Badge>
    <Badge variant="error">error</Badge>
  </div>
);
