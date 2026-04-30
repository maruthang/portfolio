'use client';

import { useState } from 'react';
import { OssConstellation } from '@/design-system/visuals/OssConstellation';
import { OssPrTable } from '@/design-system/components/OssPrTable';
import type { OssPr, OssProject } from '@/content/oss';

interface OssExplorerProps {
  prs: OssPr[];
  projects: OssProject[];
}

export function OssExplorer({ prs, projects }: OssExplorerProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const constellationProjects = projects.map((p) => ({ name: p.name, merged: p.merged }));

  return (
    <div className="space-y-10">
      <OssConstellation
        projects={constellationProjects}
        selectedProject={selected}
        onSelectProject={setSelected}
      />
      <OssPrTable prs={prs} projectFilter={selected} />
    </div>
  );
}
