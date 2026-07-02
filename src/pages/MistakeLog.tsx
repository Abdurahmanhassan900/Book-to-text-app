import { Card } from '../components/ui/Card';

export function MistakeLog() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold">Mistake Log</h2>
        <p className="mt-1 text-sm text-muted">
          Auto-captured errors, missing sections, and low scores — Phase 4
        </p>
      </header>
      <Card>
        <p className="text-sm text-muted">Track: not reviewed → reviewing → fixed → retest needed</p>
      </Card>
    </div>
  );
}
