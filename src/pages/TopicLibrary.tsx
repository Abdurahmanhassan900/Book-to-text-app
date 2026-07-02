import { Link } from 'react-router-dom';
import { TopicBadge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { topics } from '../data/topics';
import { TOPIC_LABELS, type TopicId } from '../types';

const placeholderTopics: TopicId[] = [
  'sql-injection',
  'jwt-authentication',
  'sast-dast',
  'api-rate-limiting',
  'defensive-security',
  'mobile-pinning',
  'cia-triad',
];

export function TopicLibrary() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold">Topic Library</h2>
        <p className="mt-1 text-sm text-muted">
          Full D-M-B-R-E-C content per topic. TLS is available now; others arrive in Phase 3.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {topics.map((topic) => (
          <Card key={topic.id}>
            <TopicBadge topicId={topic.id} />
            <h3 className="mt-2 text-lg font-semibold">{topic.title}</h3>
            <p className="mt-1 text-sm text-muted line-clamp-2">{topic.plainDefinition}</p>
            <Link
              to={`/topics/${topic.id}`}
              className="mt-3 inline-block text-sm text-accent hover:underline"
            >
              Study topic →
            </Link>
          </Card>
        ))}

        {placeholderTopics.map((id) => (
          <Card key={id} className="opacity-60">
            <TopicBadge topicId={id} />
            <h3 className="mt-2 text-lg font-semibold">{TOPIC_LABELS[id]}</h3>
            <p className="mt-1 text-sm text-muted">Content coming in Phase 3</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
