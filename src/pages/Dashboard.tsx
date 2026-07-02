import { Link } from 'react-router-dom';
import { DMRECChecklist } from '../components/shared/DMRECChecklist';
import { Badge, TopicBadge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Gauge } from '../components/ui/Gauge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { dailyPlans, getDailyPlan } from '../data/dailyPlans';
import { useProgress } from '../hooks/useProgress';
import {
  calculateReadiness,
  getStrongestTopics,
  getWeakestTopics,
} from '../utils/scoring';
import { getDayCompletionPercent, getOverallCompletionPercent } from '../utils/storage';
export function Dashboard() {
  const { progress, changeDay } = useProgress();
  const todayPlan = getDailyPlan(progress.currentDay) ?? dailyPlans[0];
  const metrics = calculateReadiness(progress);
  const overallCompletion = getOverallCompletionPercent(progress, dailyPlans);
  const todayCompletion = getDayCompletionPercent(progress, todayPlan);
  const weakest = getWeakestTopics(metrics);
  const strongest = getStrongestTopics(metrics);

  const avgTimedScore =
    progress.speakingAttempts.length > 0
      ? Math.round(
          progress.speakingAttempts.reduce(
            (sum, a) => sum + (a.evaluation?.percentage ?? 0),
            0,
          ) / progress.speakingAttempts.length,
        )
      : 0;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted">Assessment prep · 7-day intensive</p>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="mt-1 text-sm text-muted">
            Train structured 60–90 second answers using D-M-B-R-E-C.
          </p>
        </div>
        <Link
          to="/plan"
          className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-muted focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface"
        >
          Start today&apos;s session
        </Link>
      </header>

      <Card title="Answer framework">
        <p className="mb-3 text-sm text-muted">
          Every answer: Definition → Mechanism → Benefit → Risk → Example → Conclusion
        </p>
        <DMRECChecklist />
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <Gauge
            value={metrics.overallReadiness}
            label="Readiness"
            sublabel={metrics.isReady ? 'On track' : 'Conservative estimate'}
          />
        </Card>
        <Card title="Current day">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">Day {progress.currentDay}</span>
              <Badge>{todayPlan.title}</Badge>
            </div>
            <ProgressBar value={todayCompletion} label="Today's tasks" />
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => changeDay(day)}
                  className={`h-8 w-8 rounded text-xs font-medium ${
                    progress.currentDay === day
                      ? 'bg-accent text-white'
                      : 'bg-surface-overlay text-muted hover:text-slate-200'
                  }`}
                  aria-label={`Switch to day ${day}`}
                  aria-pressed={progress.currentDay === day}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </Card>
        <Card title="Overall progress">
          <ProgressBar value={overallCompletion} label="7-day completion" variant="success" />
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-muted">Questions answered</dt>
              <dd className="font-mono text-lg">{progress.totalQuestionsAnswered}</dd>
            </div>
            <div>
              <dt className="text-muted">Completion rate</dt>
              <dd className="font-mono text-lg">{progress.answerCompletionRate}%</dd>
            </div>
            <div>
              <dt className="text-muted">Avg timed score</dt>
              <dd className="font-mono text-lg">{avgTimedScore || '—'}%</dd>
            </div>
            <div>
              <dt className="text-muted">Builder attempts</dt>
              <dd className="font-mono text-lg">{progress.builderAttempts}</dd>
            </div>
          </dl>
        </Card>
        <Card title="Topic signals">
          <div className="space-y-3">
            <div>
              <p className="mb-1 text-xs text-muted">Weakest</p>
              <div className="flex flex-wrap gap-1">
                {weakest.map((id) => (
                  <TopicBadge key={id} topicId={id} />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1 text-xs text-muted">Strongest</p>
              <div className="flex flex-wrap gap-1">
                {strongest.length > 0 ? (
                  strongest.map((id) => (
                    <TopicBadge key={id} topicId={id} />
                  ))
                ) : (
                  <span className="text-xs text-muted">Complete practice to see signals</span>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="7-day progress">
          <ul className="space-y-2">
            {dailyPlans.map((plan) => {
              const pct = getDayCompletionPercent(progress, plan);
              return (
                <li key={plan.day} className="flex items-center gap-3">
                  <span className="w-12 shrink-0 font-mono text-xs text-muted">Day {plan.day}</span>
                  <div className="flex-1">
                    <ProgressBar value={pct} label={plan.title} size="sm" />
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card title={`Today's tasks · ${todayPlan.estimatedMinutes} min`}>
          <ul className="space-y-2">
            {todayPlan.tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between gap-2 rounded border border-border bg-surface px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-xs text-muted">{task.durationMinutes} min</p>
                </div>
                {task.route && (
                  <Link
                    to={task.route}
                    className="text-xs text-accent hover:underline"
                  >
                    Open
                  </Link>
                )}
              </li>
            ))}
          </ul>
          {metrics.blockers.length > 0 && (
            <div className="mt-4 rounded border border-warning/30 bg-warning/10 p-3">
              <p className="text-xs font-medium text-amber-200">Readiness blockers</p>
              <ul className="mt-1 list-inside list-disc text-xs text-amber-100/80">
                {metrics.blockers.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </div>

      <Card title="Fallback rule">
        <p className="text-sm text-slate-300">
          When unsure, never leave an answer blank. Start with:{' '}
          <em className="text-accent">&quot;I&apos;m not completely sure, but I believe…&quot;</em>{' '}
          then deliver D-M-B-R-E-C and state your uncertainty honestly.
        </p>
      </Card>
    </div>
  );
}
