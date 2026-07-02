import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { dailyPlans } from '../data/dailyPlans';
import { useProgress } from '../hooks/useProgress';
import { TOPIC_LABELS } from '../types';
import { getDayCompletionPercent, isTaskCompleted } from '../utils/storage';

export function SevenDayPlan() {
  const { progress, toggleTask, changeDay } = useProgress();

  const getDayQuizScore = (day: number): number | null => {
    const attempts = progress.quizAttempts.filter((q) => q.day === day);
    if (attempts.length === 0) return null;
    const latest = attempts[attempts.length - 1];
    return Math.round((latest.score / latest.maxScore) * 100);
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold">Seven-Day Plan</h2>
        <p className="mt-1 text-sm text-muted">
          ~3 hours per day · 8 structured blocks · All days unlocked
        </p>
      </header>

      <div className="space-y-4">
        {dailyPlans.map((plan) => {
          const completion = getDayCompletionPercent(progress, plan);
          const quizScore = getDayQuizScore(plan.day);
          const isCurrent = progress.currentDay === plan.day;

          return (
            <Card
              key={plan.day}
              className={isCurrent ? 'ring-1 ring-accent/50' : ''}
              title={`Day ${plan.day}`}
              action={
                <div className="flex items-center gap-2">
                  {isCurrent && <Badge variant="success">Current</Badge>}
                  <button
                    type="button"
                    onClick={() => changeDay(plan.day)}
                    className="text-xs text-accent hover:underline"
                  >
                    Set as today
                  </button>
                </div>
              }
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{plan.title}</h3>
                  <p className="text-sm text-muted">
                    {plan.estimatedMinutes} minutes · {plan.topics.map((t) => TOPIC_LABELS[t]).join(', ')}
                  </p>
                  <div className="mt-2">
                    <ProgressBar value={completion} label="Task completion" />
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                    Learning objectives
                  </h4>
                  <ul className="list-inside list-disc space-y-1 text-sm text-slate-300">
                    {plan.objectives.map((obj) => (
                      <li key={obj}>{obj}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                    Required tasks
                  </h4>
                  <ul className="space-y-2">
                    {plan.tasks.map((task) => {
                      const done = isTaskCompleted(progress, plan.day, task.id);
                      return (
                        <li
                          key={task.id}
                          className="flex items-start gap-3 rounded border border-border bg-surface px-3 py-2"
                        >
                          <input
                            type="checkbox"
                            id={task.id}
                            checked={done}
                            onChange={() => toggleTask(plan.day, task.id)}
                            className="mt-1 h-4 w-4 rounded border-border bg-surface-overlay accent-accent"
                          />
                          <label htmlFor={task.id} className="flex-1 cursor-pointer">
                            <span className={`text-sm font-medium ${done ? 'text-muted line-through' : ''}`}>
                              {task.title}
                            </span>
                            <span className="mt-0.5 block text-xs text-muted">
                              {task.durationMinutes} min — {task.description}
                            </span>
                          </label>
                          {task.route && (
                            <Link
                              to={task.route}
                              className="shrink-0 text-xs text-accent hover:underline"
                            >
                              Go
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="flex flex-wrap items-center gap-4 border-t border-border pt-3">
                  <div className="text-sm">
                    <span className="text-muted">Daily quiz: </span>
                    <span className="font-mono">
                      {quizScore !== null ? `${quizScore}%` : 'Not taken'}
                    </span>
                  </div>
                  <Link
                    to={`/plan/quiz/${plan.day}`}
                    className="rounded border border-border px-3 py-1.5 text-xs hover:bg-surface-overlay"
                  >
                    Take daily quiz
                  </Link>
                  <Link
                    to={`/topics/${plan.topics[0]}`}
                    className="rounded border border-border px-3 py-1.5 text-xs hover:bg-surface-overlay"
                  >
                    Review topics
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
