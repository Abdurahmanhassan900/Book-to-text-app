import { Card } from '../components/ui/Card';

export function QuestionBank() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold">Question Bank</h2>
        <p className="mt-1 text-sm text-muted">
          100+ questions · definition, mechanism, scenario, comparison — Phase 3
        </p>
      </header>
      <Card>
        <p className="text-sm text-muted">Browse and practice by category and difficulty.</p>
      </Card>
    </div>
  );
}
