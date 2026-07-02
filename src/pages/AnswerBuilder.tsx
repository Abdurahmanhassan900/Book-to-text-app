import { Card } from '../components/ui/Card';
import { DMRECChecklist } from '../components/shared/DMRECChecklist';

export function AnswerBuilder() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold">Structured Answer Builder</h2>
        <p className="mt-1 text-sm text-muted">
          Phase 4 will add interactive scoring. Use this page from your daily plan.
        </p>
      </header>
      <Card title="D-M-B-R-E-C fields">
        <DMRECChecklist />
        <p className="mt-4 text-sm text-muted">
          Six fields: Definition, Mechanism, Benefit, Risk, Example, Conclusion — each scored separately.
        </p>
      </Card>
    </div>
  );
}
