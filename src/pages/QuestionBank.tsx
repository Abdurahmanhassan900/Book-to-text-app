import { useMemo, useState } from 'react';
import { Badge, TopicBadge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { allQuestions } from '../data/questions';
import { topics } from '../data/topics';
import type { Difficulty, QuestionCategory, TopicId } from '../types';

const CATEGORIES: QuestionCategory[] = [
  'definition',
  'mechanism',
  'comparison',
  'scenario',
  'troubleshooting',
  'architecture',
  'risk-tradeoff',
  'follow-up',
];

const DIFFICULTIES: Difficulty[] = ['foundation', 'intermediate', 'assessment', 'pressure'];

export function QuestionBank() {
  const [topicFilter, setTopicFilter] = useState<TopicId | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<QuestionCategory | 'all'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return allQuestions.filter((q) => {
      if (topicFilter !== 'all' && q.topicId !== topicFilter) return false;
      if (categoryFilter !== 'all' && q.category !== categoryFilter) return false;
      if (difficultyFilter !== 'all' && q.difficulty !== difficultyFilter) return false;
      if (search && !q.prompt.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [topicFilter, categoryFilter, difficultyFilter, search]);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold">Question Bank</h2>
        <p className="mt-1 text-sm text-muted">
          {allQuestions.length} questions · filter by topic, category, difficulty · model answers in D-M-B-R-E-C
        </p>
      </header>

      <Card>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="q-search" className="mb-1 block text-xs text-muted">
              Search
            </label>
            <input
              id="q-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. TLS handshake"
              className="w-full rounded border border-border bg-surface px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label htmlFor="q-topic" className="mb-1 block text-xs text-muted">
              Topic
            </label>
            <select
              id="q-topic"
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value as TopicId | 'all')}
              className="w-full rounded border border-border bg-surface-raised px-2 py-1.5 text-sm"
            >
              <option value="all">All</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="q-cat" className="mb-1 block text-xs text-muted">
              Category
            </label>
            <select
              id="q-cat"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as QuestionCategory | 'all')}
              className="w-full rounded border border-border bg-surface-raised px-2 py-1.5 text-sm"
            >
              <option value="all">All</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="q-diff" className="mb-1 block text-xs text-muted">
              Difficulty
            </label>
            <select
              id="q-diff"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as Difficulty | 'all')}
              className="w-full rounded border border-border bg-surface-raised px-2 py-1.5 text-sm"
            >
              <option value="all">All</option>
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted">{filtered.length} matching questions</p>
      </Card>

      <ul className="space-y-3">
        {filtered.map((q) => {
          const open = expandedId === q.id;
          return (
            <li key={q.id}>
              <Card>
                <button
                  type="button"
                  onClick={() => setExpandedId(open ? null : q.id)}
                  className="w-full text-left"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <TopicBadge topicId={q.topicId} />
                    <Badge variant="outline">{q.category}</Badge>
                    <Badge
                      variant={
                        q.difficulty === 'pressure'
                          ? 'danger'
                          : q.difficulty === 'assessment'
                            ? 'warning'
                            : 'default'
                      }
                    >
                      {q.difficulty}
                    </Badge>
                  </div>
                  <p className="mt-2 font-medium">{q.prompt}</p>
                  <p className="mt-1 text-xs text-accent">
                    {open ? 'Hide model answer' : 'Show model answer & hints'}
                  </p>
                </button>

                {open && (
                  <div className="mt-4 space-y-4 border-t border-border pt-4">
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase text-muted">Model answer (D-M-B-R-E-C)</p>
                      <dl className="space-y-2 text-sm">
                        <div><dt className="font-mono text-accent">D</dt><dd>{q.modelAnswer.definition}</dd></div>
                        <div><dt className="font-mono text-accent">M</dt><dd>{q.modelAnswer.mechanism}</dd></div>
                        <div><dt className="font-mono text-accent">B</dt><dd>{q.modelAnswer.benefit}</dd></div>
                        <div><dt className="font-mono text-accent">R</dt><dd>{q.modelAnswer.risk}</dd></div>
                        <div><dt className="font-mono text-accent">E</dt><dd>{q.modelAnswer.example}</dd></div>
                        <div><dt className="font-mono text-accent">C</dt><dd>{q.modelAnswer.conclusion}</dd></div>
                      </dl>
                      <p className="mt-2 text-xs text-muted">
                        Target: ~{q.modelAnswer.estimatedSeconds}s spoken
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase text-muted">Hints</p>
                      <ul className="list-inside list-disc text-sm text-muted">
                        {q.hints.map((h) => (
                          <li key={h}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
