import { Link } from 'react-router-dom';
import { Badge, TopicBadge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { getQuestionById } from '../data/questions';
import { useProgress } from '../hooks/useProgress';
import { TOPIC_LABELS } from '../types';
import {
  calculateReadiness,
  getRetestQuestions,
  getReviewRecommendations,
  getWeakComponents,
  getWeakestTopics,
} from '../utils/scoring';
import { DMREC_LABELS } from '../types';

export function ReviewMode() {
  const { progress } = useProgress();
  const metrics = calculateReadiness(progress);
  const recommendations = getReviewRecommendations(progress, metrics);
  const weakTopics = getWeakestTopics(metrics, 5);
  const weakComponents = getWeakComponents(progress);
  const retestIds = getRetestQuestions(progress, 5);

  const openMistakes = progress.mistakes.filter((m) => m.status !== 'fixed');

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold">Review Mode</h2>
        <p className="mt-1 text-sm text-muted">
          Focused retest for weak topics, components, and open mistakes
        </p>
      </header>

      {metrics.isReady ? (
        <Card>
          <p className="text-success font-medium">
            Readiness thresholds met — use review mode to stay sharp before the exam.
          </p>
        </Card>
      ) : (
        <Card title="Priority focus">
          <p className="text-sm text-amber-200">
            Not exam-ready yet. Work through high-priority items below before Day 7 mocks.
          </p>
        </Card>
      )}

      {weakComponents.length > 0 && (
        <Card title="Weakest answer components (latest mock)">
          <div className="flex flex-wrap gap-2">
            {weakComponents.map((s) => (
              <Badge key={s} variant="warning">
                {DMREC_LABELS[s].letter}: {DMREC_LABELS[s].label}
              </Badge>
            ))}
          </div>
          <p className="mt-2 text-sm text-muted">
            Drill these in Answer Builder — mechanism and risk are highest-weight sections.
          </p>
        </Card>
      )}

      <Card title="Weakest topics">
        <ul className="space-y-3">
          {weakTopics.map((topicId) => (
            <li key={topicId} className="flex items-center gap-3">
              <TopicBadge topicId={topicId} />
              <div className="flex-1">
                <ProgressBar
                  value={metrics.topicMastery[topicId] ?? 0}
                  label={TOPIC_LABELS[topicId]}
                  size="sm"
                />
              </div>
              <Link
                to={`/topics/${topicId}`}
                className="text-xs text-accent hover:underline"
              >
                Study
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Recommended actions">
        <ul className="space-y-3">
          {recommendations.map((rec) => (
            <li key={`${rec.topicId}-${rec.reason}`} className="rounded border border-border p-3">
              <div className="flex items-center gap-2">
                <TopicBadge topicId={rec.topicId} />
                <Badge variant={rec.priority === 'high' ? 'danger' : 'outline'}>
                  {rec.priority}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted">{rec.reason}</p>
              <div className="mt-2 flex flex-wrap gap-3">
                {rec.actions.map((a) => (
                  <Link key={a.label} to={a.route} className="text-sm text-accent hover:underline">
                    {a.label} →
                  </Link>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {retestIds.length > 0 && (
        <Card title="Retest these questions">
          <ul className="space-y-2">
            {retestIds.map((id) => {
              const q = getQuestionById(id);
              return (
                <li key={id}>
                  <Link
                    to={`/practice/builder?q=${id}`}
                    className="text-sm text-accent hover:underline"
                  >
                    {q?.prompt ?? id}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      {openMistakes.length > 0 && (
        <Card title={`Open mistakes (${openMistakes.length})`}>
          <ul className="space-y-2">
            {openMistakes.slice(0, 8).map((m) => (
              <li key={m.id} className="text-sm">
                <Badge variant="outline">{m.type}</Badge>
                <span className="ml-2">{m.description}</span>
              </li>
            ))}
          </ul>
          <Link to="/mistakes" className="mt-3 inline-block text-sm text-accent hover:underline">
            Full mistake log →
          </Link>
        </Card>
      )}

      <div className="flex flex-wrap gap-3">
        <Link to="/mock" className="rounded bg-accent px-4 py-2 text-sm font-medium text-white">
          Take mock assessment
        </Link>
        <Link to="/practice/speaking" className="rounded border border-border px-4 py-2 text-sm">
          Timed speaking
        </Link>
        <Link to="/readiness" className="rounded border border-border px-4 py-2 text-sm">
          Readiness report
        </Link>
      </div>
    </div>
  );
}
