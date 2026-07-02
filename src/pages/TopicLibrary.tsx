import { Link } from 'react-router-dom';
import { TopicBadge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { topics } from '../data/topics';
import { getQuestionsByTopic } from '../data/questions';
import { getFlashcardsByTopic } from '../data/flashcards';
import { getLessonsByTopic } from '../data/lessons';

export function TopicLibrary() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold">Topic Library</h2>
        <p className="mt-1 text-sm text-muted">
          {topics.length} core topics · D-M-B-R-E-C model answers · mechanism walkthroughs · follow-ups
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {topics.map((topic) => {
          const questionCount = getQuestionsByTopic(topic.id).length;
          const flashcardCount = getFlashcardsByTopic(topic.id).length;
          const lessonCount = getLessonsByTopic(topic.id).length;

          return (
            <Card key={topic.id}>
              <div className="flex flex-wrap items-center gap-2">
                <TopicBadge topicId={topic.id} />
                <span className="text-xs text-muted">Day {topic.day}</span>
              </div>
              <h3 className="mt-2 text-lg font-semibold">{topic.title}</h3>
              <p className="mt-1 text-sm text-muted line-clamp-2">{topic.plainDefinition}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {topic.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-surface px-1.5 py-0.5 font-mono text-[10px] text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted">
                {lessonCount} lessons · {flashcardCount} flashcards · {questionCount} questions
              </p>
              <Link
                to={`/topics/${topic.id}`}
                className="mt-3 inline-block text-sm text-accent hover:underline"
              >
                Study topic →
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
