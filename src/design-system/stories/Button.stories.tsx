import type { Story } from '@ladle/react';
import { Button, type ButtonProps } from '@/design-system/components/Button';
import '@/app/globals.css';

export const Primary: Story<ButtonProps> = (args) => <Button {...args}>Primary</Button>;
Primary.args = { variant: 'primary', size: 'md' };

export const Ghost: Story<ButtonProps> = (args) => <Button {...args}>Ghost</Button>;
Ghost.args = { variant: 'ghost' };

export const Outline: Story<ButtonProps> = (args) => <Button {...args}>Outline</Button>;
Outline.args = { variant: 'outline' };

export const Disabled: Story<ButtonProps> = (args) => <Button {...args}>Disabled</Button>;
Disabled.args = { disabled: true };
