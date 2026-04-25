import type { Story } from '@ladle/react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/design-system/components/Card';
import '@/app/globals.css';

export const Basic: Story = () => (
  <Card>
    <CardHeader>
      <CardTitle>Card title</CardTitle>
      <CardDescription>Some description text.</CardDescription>
    </CardHeader>
    <p>Body content goes here.</p>
  </Card>
);
