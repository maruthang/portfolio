import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OssConstellation } from '@/design-system/visuals/OssConstellation';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="constellation-canvas">{children}</div>
  ),
  useFrame: () => {},
}));

const projects = [
  { name: 'nestjs/nest-cli', merged: 15 },
  { name: 'microsoft/vscode', merged: 12 },
];

describe('OssConstellation', () => {
  it('renders an accessible repo-selection list as a fallback for screen readers + no-JS', () => {
    render(
      <OssConstellation projects={projects} selectedProject={null} onSelectProject={() => {}} />,
    );
    expect(screen.getByRole('button', { name: /nestjs\/nest-cli/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /microsoft\/vscode/i })).toBeInTheDocument();
  });

  it('calls onSelectProject(name) when a fallback button is clicked', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <OssConstellation projects={projects} selectedProject={null} onSelectProject={onSelect} />,
    );
    await user.click(screen.getByRole('button', { name: /microsoft\/vscode/i }));
    expect(onSelect).toHaveBeenCalledWith('microsoft/vscode');
  });

  it('marks the selected button with aria-pressed=true', () => {
    render(
      <OssConstellation
        projects={projects}
        selectedProject="microsoft/vscode"
        onSelectProject={() => {}}
      />,
    );
    expect(screen.getByRole('button', { name: /microsoft\/vscode/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});
