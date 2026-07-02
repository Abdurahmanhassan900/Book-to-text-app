import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useProgress } from '../hooks/useProgress';
import type { MistakeStatus } from '../types';
import { TOPIC_LABELS } from '../types';
import { getMistakeStats, updateMistakeStatus } from '../utils/mistakes';

const STATUSES: MistakeStatus[] = [
  'not-reviewed',
  'reviewing',
  'fixed',
  'retest-needed',
];

export function MistakeLog() {
  const { progress, persist } = useProgress();
  const stats = getMistakeStats(progress);

  const sorted = [...progress.mistakes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const setStatus = (id: string, status: MistakeStatus) => {
    persist((prev) => updateMistakeStatus(prev, id, status));
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold">Mistake Log</h2>
        <p className="mt-1 text-sm text-muted">
          Auto-captured from practice · {stats.total} entries
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-4">
        {STATUSES.map((status) => (
          <Card key={status}>
            <p className="text-xs uppercase text-muted">{status}</p>
            <p className="text-2xl font-bold font-mono">{stats.byStatus[status] ?? 0}</p>
          </Card>
        ))}
      </div>

      <Card title="Common patterns">
        <div className="flex flex-wrap gap-2">
          {Object.entries(stats.byType).map(([type, count]) => (
            <Badge key={type} variant="outline">
              {type}: {count}
            </Badge>
          ))}
        </div>
        {stats.total === 0 && (
          <p className="mt-2 text-sm text-muted">
            Complete Answer Builder or Speaking Practice to populate mistakes.
          </p>
        )}
      </Card>

      <ul className="space-y-3">
        {sorted.map((m) => (
          <li key={m.id}>
            <Card>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="topic">{TOPIC_LABELS[m.topicId]}</Badge>
                    <Badge
                      variant={
                        m.type === 'incorrect-claim'
                          ? 'danger'
                          : m.type === 'low-score'
                            ? 'warning'
                            : 'outline'
                      }
                    >
                      {m.type}
                    </Badge>
                  </div>
                  <p className="mt-2 font-medium">{m.description}</p>
                  <p className="mt-1 text-sm text-muted">{m.detail}</p>
                  <p className="mt-1 text-xs text-muted">
                    {new Date(m.createdAt).toLocaleString()}
                  </p>
                </div>
                <select
                  value={m.status}
                  onChange={(e) => setStatus(m.id, e.target.value as MistakeStatus)}
                  className="rounded border border-border bg-surface px-2 py-1 text-xs"
                  aria-label="Mistake review status"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              {m.questionId && (
                <Link
                  to={`/practice/builder?q=${m.questionId}`}
                  className="mt-2 inline-block text-xs text-accent hover:underline"
                >
                  Retest in Answer Builder →
                </Link>
              )}
            </Card>
          </li>
        ))}
      </ul>

      {stats.byStatus['retest-needed'] > 0 && (
        <Card>
          <p className="text-sm text-amber-200">
            {stats.byStatus['retest-needed']} items need retest — prioritize these before mock exams.
          </p>
          <ProgressBar
            value={
              stats.total > 0
                ? ((stats.byStatus['fixed'] ?? 0) / stats.total) * 100
                : 0
            }
            label="Fixed ratio"
            size="sm"
          />
        </Card>
      )}
    </div>
  );
}
