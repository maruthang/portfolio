import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
} from '@/design-system/components';

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="font-mono text-4xl font-bold sm:text-6xl">
          Hi, I&apos;m <span className="text-[var(--color-brand-500)]">Maruthan</span>
        </h1>
        <p className="text-lg text-[var(--muted)]">
          Full-stack developer and OSS contributor. Foundation in place; content arrives in Plan 2.
        </p>
        <div className="flex gap-3">
          <Button>View work</Button>
          <Button variant="outline">Resume</Button>
        </div>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Design system smoke test</CardTitle>
            <CardDescription>
              If this card is styled and the badges below render, tokens are wired correctly.
            </CardDescription>
          </CardHeader>
          <div className="flex flex-wrap gap-2">
            <Badge>default</Badge>
            <Badge variant="success">success</Badge>
            <Badge variant="warning">warning</Badge>
            <Badge variant="error">error</Badge>
          </div>
        </Card>
      </section>
    </div>
  );
}
