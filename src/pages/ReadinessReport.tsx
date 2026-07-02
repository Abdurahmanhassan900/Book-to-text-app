import { Link } from 'react-router-dom';
import { Badge, TopicBadge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Gauge } from '../components/ui/Gauge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useProgress } from '../hooks/useProgress';
import { DMREC_LABELS } from '../types';
import {
  calculateReadiness,
  getReviewRecommendations,
  getWeakComponents,
  getWeakestTopics,
} from '../utils/scoring';
import { ALL_TOPIC_IDS } from '../utils/storage';
import { getMockConfigTitle } from '../utils/mockAssessment';

export function ReadinessReport() {
  const { progress } = useProgress();
  const metrics = calculateReadiness(progress);
  const recommendations = getReviewRecommendations(progress, metrics);
  const weakComponents = getWeakComponents(progress);
  const weakest = getWeakestTopics(metrics, 3);

  const recentMocks = [...progress.mockAttempts].slice(-5).reverse();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Readiness Report</h2>
          <p className="mt-1 text-sm text-muted">
            Conservative estimate — requires 85%+ on two recent mocks, 80%+ per topic, 90% completion
          </p>
        </div>
        <Link
          to="/review"
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-muted"
        >
          Open review mode
        </Link>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <Gauge
            value={metrics.overallReadiness}
            label="Overall readiness"
            sublabel={metrics.isReady ? 'Thresholds met' : 'Keep practicing'}
          />
        </Card>
        <Card title="Recent performance">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Avg quizzes (last 3)</dt>
              <dd className="font-mono">{metrics.avgRecentQuizzes}%</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Avg mocks (last 2)</dt>
              <dd className="font-mono">{metrics.avgRecentMocks}%</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Task completion</dt>
              <dd className="font-mono">{metrics.completionRate}%</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Answer completion</dt>
              <dd className="font-mono">{progress.answerCompletionRate}%</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Questions answered</dt>
              <dd className="font-mono">{progress.totalQuestionsAnswered}</dd>
            </div>
          </dl>
        </Card>
        <Card title="Framework scores">
          <div className="space-y-2">
            <ProgressBar value={metrics.mechanismScore} label="Mechanism (25 pts)" size="sm" />
            <ProgressBar value={metrics.riskTradeoffScore} label="Risk & tradeoff (15 pts)" size="sm" />
            <ProgressBar value={metrics.realExampleScore} label="Real examples (10 pts)" size="sm" />
            <ProgressBar value={metrics.answerStructureConsistency} label="Structure consistency" size="sm" />
            <ProgressBar value={metrics.timedPerformanceScore} label="Timed performance" size="sm" />
          </div>
        </Card>
      </div>

      {weakComponents.length > 0 && (
        <Card title="Weak D-M-B-R-E-C components (latest mock)">
          <div className="flex flex-wrap gap-2">
            {weakComponents.map((c) => (
              <Badge key={c} variant="warning">
                {DMREC_LABELS[c].label}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      <Card title="Topic mastery">
        <ul className="space-y-2">
          {ALL_TOPIC_IDS.map((id) => {
            const score = metrics.topicMastery[id] ?? 0;
            const hasData = score > 0;
            return (
              <li key={id} className="flex items-center gap-3">
                <TopicBadge topicId={id} />
                <div className="flex-1">
                  <ProgressBar
                    value={hasData ? score : 0}
                    size="sm"
                    label={hasData ? undefined : 'No mock data'}
                    variant={
                      score >= 80 ? 'success' : score >= 60 ? 'warning' : 'default'
                    }
                  />
                </div>
                <span className="w-10 font-mono text-xs text-right">
                  {hasData ? `${score}%` : '—'}
                </span>
              </li>
            );
          })}
        </ul>
      </Card>

      {recommendations.length > 0 && (
        <Card title="What to review next">
          <ul className="space-y-3">
            {recommendations.map((rec) => (
              <li key={`${rec.topicId}-${rec.reason}`} className="rounded border border-border p-3 text-sm">
                <div className="flex items-center gap-2">
                  <TopicBadge topicId={rec.topicId} />
                  <Badge variant={rec.priority === 'high' ? 'danger' : 'outline'}>
                    {rec.priority}
                  </Badge>
                </div>
                <p className="mt-1 text-muted">{rec.reason}</p>
              </li>
            ))}
          </ul>
          <Link to="/review" className="mt-3 inline-block text-sm text-accent hover:underline">
            Full review mode →
          </Link>
        </Card>
      )}

      {metrics.blockers.length > 0 && (
        <Card title="Readiness blockers">
          <ul className="list-inside list-disc text-sm text-amber-200">
            {metrics.blockers.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </Card>
      )}

      {weakest.length > 0 && (
        <Card title="Weakest topics">
          <div className="flex flex-wrap gap-2">
            {weakest.map((id) => (
              <Link key={id} to={`/topics/${id}`}>
                <TopicBadge topicId={id} />
              </Link>
            ))}
          </div>
        </Card>
      )}

      {recentMocks.length > 0 && (
        <Card title="Mock attempt history">
          <ul className="space-y-2">
            {recentMocks.map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded border border-border px-3 py-2 text-sm"
              >
                <span>{getMockConfigTitle(a.configId)}</span>
                <span
                  className={`font-mono font-bold ${
                    a.percentage >= 85
                      ? 'text-success'
                      : a.percentage >= 70
                        ? 'text-warning'
                        : 'text-danger'
                  }`}
                >
                  {a.percentage}%
                </span>
                <span className="text-xs text-muted">
                  {new Date(a.completedAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {metrics.isReady && (
        <Card>
          <p className="font-medium text-success">
            Readiness thresholds met. Continue timed practice to stay sharp.
          </p>
        </Card>
      )}

      {!metrics.isReady && progress.mockAttempts.length < 2 && (
        <Card>
          <p className="text-sm text-muted">
            Take at least two mock assessments to unlock accurate readiness scoring.
          </p>
          <Link to="/mock" className="mt-2 inline-block text-accent hover:underline">
            Start mock exam →
          </Link>
        </Card>
      )}
    </div>
  );
}
