import type { DMRECSection, EvaluationResult } from '../../types';
import { DMREC_LABELS } from '../../types';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

interface RubricFeedbackProps {
  result: EvaluationResult;
  showEstimateLabel?: boolean;
}

export function RubricFeedback({ result, showEstimateLabel = true }: RubricFeedbackProps) {
  const sectionOrder: (DMRECSection | 'terminology')[] = [
    'definition',
    'mechanism',
    'benefit',
    'risk',
    'example',
    'conclusion',
    'terminology',
  ];

  const variant =
    result.percentage >= 85
      ? 'success'
      : result.percentage >= 70
        ? 'warning'
        : 'danger';

  return (
    <Card title="Scoring feedback">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="text-3xl font-bold font-mono">{result.percentage}%</div>
        <Badge variant={variant === 'success' ? 'success' : variant === 'warning' ? 'warning' : 'danger'}>
          {result.percentage >= 80 ? 'On target' : 'Below 80% — review'}
        </Badge>
        {showEstimateLabel && (
          <span className="text-xs text-muted">Automated score (estimate)</span>
        )}
      </div>

      <ProgressBar value={result.percentage} label="Total score" variant={variant} />

      <div className="mt-4 space-y-2">
        {sectionOrder.map((key) => {
          const score = result.sectionScores.find((s) => s.section === key);
          if (!score) return null;
          const label =
            key === 'terminology' ? 'Terminology' : DMREC_LABELS[key as DMRECSection].label;
          return (
            <div key={key}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-muted">{label}</span>
                <span className="font-mono">
                  {score.score}/{score.maxScore}
                </span>
              </div>
              <ProgressBar
                value={score.maxScore > 0 ? (score.score / score.maxScore) * 100 : 0}
                size="sm"
                showValue={false}
              />
              {score.feedback.length > 0 && (
                <ul className="mt-1 list-inside list-disc text-xs text-amber-200/90">
                  {score.feedback.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {result.missingSections.length > 0 && (
        <div className="mt-4 rounded border border-danger/30 bg-danger/10 p-3">
          <p className="text-xs font-medium text-red-200">Missing sections</p>
          <p className="text-sm">{result.missingSections.join(', ')}</p>
        </div>
      )}

      {result.flags.length > 0 && (
        <div className="mt-3 rounded border border-warning/30 bg-warning/10 p-3">
          <p className="text-xs font-medium text-amber-200">Flags</p>
          <ul className="mt-1 list-inside list-disc text-sm text-amber-100/90">
            {result.flags.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      )}

      {result.suggestions.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-medium text-muted">Suggestions</p>
          <ul className="mt-1 list-inside list-disc text-sm text-slate-300">
            {result.suggestions.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
