import { Card } from '../components/ui/Card';
import { Gauge } from '../components/ui/Gauge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { TopicBadge } from '../components/ui/Badge';
import { useProgress } from '../hooks/useProgress';
import { calculateReadiness } from '../utils/scoring';
import { ALL_TOPIC_IDS } from '../utils/storage';

export function ReadinessReport() {
  const { progress } = useProgress();
  const metrics = calculateReadiness(progress);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold">Readiness Report</h2>
        <p className="mt-1 text-sm text-muted">
          Conservative estimate — not ready until mocks, topics, and completion thresholds are met.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <Gauge value={metrics.overallReadiness} label="Overall readiness" />
        </Card>
        <Card title="Recent performance">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Avg quizzes</dt>
              <dd className="font-mono">{metrics.avgRecentQuizzes}%</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Avg mocks</dt>
              <dd className="font-mono">{metrics.avgRecentMocks}%</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Completion rate</dt>
              <dd className="font-mono">{metrics.completionRate}%</dd>
            </div>
          </dl>
        </Card>
        <Card title="Framework scores">
          <div className="space-y-2">
            <ProgressBar value={metrics.mechanismScore} label="Mechanism" size="sm" />
            <ProgressBar value={metrics.riskTradeoffScore} label="Risk & tradeoff" size="sm" />
            <ProgressBar value={metrics.realExampleScore} label="Real examples" size="sm" />
            <ProgressBar value={metrics.answerStructureConsistency} label="Structure" size="sm" />
            <ProgressBar value={metrics.timedPerformanceScore} label="Timed performance" size="sm" />
          </div>
        </Card>
      </div>

      <Card title="Topic mastery">
        <ul className="space-y-2">
          {ALL_TOPIC_IDS.map((id) => (
            <li key={id} className="flex items-center gap-3">
              <TopicBadge topicId={id} />
              <div className="flex-1">
                <ProgressBar
                  value={metrics.topicMastery[id] ?? 0}
                  size="sm"
                  variant={
                    (metrics.topicMastery[id] ?? 0) >= 80
                      ? 'success'
                      : (metrics.topicMastery[id] ?? 0) >= 60
                        ? 'warning'
                        : 'default'
                  }
                />
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {metrics.blockers.length > 0 && (
        <Card title="Blockers">
          <ul className="list-inside list-disc text-sm text-amber-200">
            {metrics.blockers.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </Card>
      )}

      {metrics.isReady && (
        <Card>
          <p className="text-success font-medium">Readiness thresholds met. Keep practicing under time pressure.</p>
        </Card>
      )}
    </div>
  );
}
