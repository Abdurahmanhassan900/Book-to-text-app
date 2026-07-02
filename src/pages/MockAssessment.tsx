import { Card } from '../components/ui/Card';

export function MockAssessment() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold">Mock Assessment</h2>
        <p className="mt-1 text-sm text-muted">
          12–15 questions · timed · topic breakdown — Phase 5
        </p>
      </header>
      <Card>
        <p className="text-sm text-muted">Three fixed mocks plus randomized mode.</p>
      </Card>
    </div>
  );
}
