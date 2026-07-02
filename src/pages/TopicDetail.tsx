import { Link, useParams } from 'react-router-dom';
import { DMRECChecklist } from '../components/shared/DMRECChecklist';
import { TopicBadge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { getTopic } from '../data/topics';
import { TOPIC_LABELS, type TopicId } from '../types';

export function TopicDetail() {
  const { id } = useParams<{ id: string }>();
  const topicId = id as TopicId;
  const topic = getTopic(topicId);

  if (!topic) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Topic not found</h2>
        <p className="text-muted">
          {TOPIC_LABELS[topicId] ?? id} content is not available yet.
        </p>
        <Link to="/topics" className="text-accent hover:underline">
          ← Back to library
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <Link to="/topics" className="text-sm text-accent hover:underline">
          ← Topic library
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <h2 className="text-2xl font-bold">{topic.title}</h2>
          <TopicBadge topicId={topic.id} />
        </div>
      </header>

      <Card title="D-M-B-R-E-C framework">
        <DMRECChecklist />
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Definition">
          <p className="text-sm text-slate-300">{topic.plainDefinition}</p>
          <p className="mt-2 text-sm text-muted">{topic.technicalDefinition}</p>
        </Card>
        <Card title="Mechanism">
          <ol className="list-inside list-decimal space-y-1 text-sm text-slate-300">
            {topic.mechanism.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </Card>
        <Card title="Security benefit">
          <p className="text-sm text-slate-300">{topic.securityBenefit}</p>
        </Card>
        <Card title="Risks and tradeoffs">
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-300">
            {topic.risksAndTradeoffs.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="Real-world example">
        <p className="text-sm text-slate-300">{topic.realWorldExample}</p>
      </Card>

      <Card title="Common misconception">
        <p className="text-sm text-amber-200">{topic.commonMisconception}</p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Strong model answer (60–90s)">
          <dl className="space-y-2 text-sm">
            <div><dt className="font-mono text-accent">D</dt><dd>{topic.modelAnswer.definition}</dd></div>
            <div><dt className="font-mono text-accent">M</dt><dd>{topic.modelAnswer.mechanism}</dd></div>
            <div><dt className="font-mono text-accent">B</dt><dd>{topic.modelAnswer.benefit}</dd></div>
            <div><dt className="font-mono text-accent">R</dt><dd>{topic.modelAnswer.risk}</dd></div>
            <div><dt className="font-mono text-accent">E</dt><dd>{topic.modelAnswer.example}</dd></div>
            <div><dt className="font-mono text-accent">C</dt><dd>{topic.modelAnswer.conclusion}</dd></div>
          </dl>
        </Card>
        <Card title="Weak answer example">
          <p className="text-sm text-slate-400 italic">&quot;{topic.weakAnswer}&quot;</p>
          <p className="mt-3 text-sm text-danger">{topic.weakAnswerExplanation}</p>
        </Card>
      </div>

      <Card title="Follow-up questions">
        <ul className="list-inside list-disc space-y-1 text-sm">
          {topic.followUpQuestions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </Card>

      <div className="flex gap-3">
        <Link
          to="/practice/builder"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-muted"
        >
          Practice structured answer
        </Link>
        <Link
          to="/practice/speaking"
          className="rounded-md border border-border px-4 py-2 text-sm hover:bg-surface-raised"
        >
          Timed speaking
        </Link>
      </div>
    </div>
  );
}
