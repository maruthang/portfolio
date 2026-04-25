import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AvailabilityPing } from '@/design-system/components/AvailabilityPing';

describe('AvailabilityPing', () => {
  it('renders the status text', () => {
    render(<AvailabilityPing>Open to opportunities</AvailabilityPing>);
    expect(screen.getByText('Open to opportunities')).toBeInTheDocument();
  });

  it('renders both ping halo and solid dot for live status', () => {
    const { container } = render(<AvailabilityPing>Live</AvailabilityPing>);
    const ping = container.querySelector('[data-testid="ping-halo"]');
    const dot = container.querySelector('[data-testid="ping-dot"]');
    expect(ping).toBeInTheDocument();
    expect(dot).toBeInTheDocument();
  });
});
