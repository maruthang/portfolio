import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/design-system/utils/cn';

export type ButtonVariant = 'primary' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const base =
  'inline-flex items-center justify-center font-medium rounded-md transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--color-brand-500)] text-white hover:bg-[var(--color-brand-600)]',
  ghost: 'bg-transparent text-[var(--fg)] hover:bg-[var(--surface)]',
  outline:
    'bg-transparent border border-[var(--border)] text-[var(--fg)] hover:bg-[var(--surface)]',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-base',
  lg: 'h-12 px-6 text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';
