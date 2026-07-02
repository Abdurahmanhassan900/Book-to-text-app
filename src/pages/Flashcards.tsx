import { useMemo, useState } from 'react';
import { Badge, TopicBadge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { flashcards, getFlashcardsByTopic } from '../data/flashcards';
import { topics } from '../data/topics';
import type { TopicId } from '../types';

export function Flashcards() {
  const [topicFilter, setTopicFilter] = useState<TopicId | 'all'>('all');
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const deck = useMemo(() => {
    return topicFilter === 'all' ? flashcards : getFlashcardsByTopic(topicFilter);
  }, [topicFilter]);

  const card = deck[index];

  const next = () => {
    setFlipped(false);
    setIndex((i) => (i + 1) % deck.length);
  };

  const prev = () => {
    setFlipped(false);
    setIndex((i) => (i - 1 + deck.length) % deck.length);
  };

  const shuffle = () => {
    setFlipped(false);
    setIndex(Math.floor(Math.random() * deck.length));
  };

  if (!card) {
    return <p className="text-muted">No flashcards available.</p>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold">Flashcards</h2>
        <p className="mt-1 text-sm text-muted">
          {flashcards.length} cards · active recall · mechanism + risk + example on each back
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="topic-filter" className="text-sm text-muted">
          Topic:
        </label>
        <select
          id="topic-filter"
          value={topicFilter}
          onChange={(e) => {
            setTopicFilter(e.target.value as TopicId | 'all');
            setIndex(0);
            setFlipped(false);
          }}
          className="rounded border border-border bg-surface-raised px-2 py-1 text-sm"
        >
          <option value="all">All topics ({flashcards.length})</option>
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title} ({getFlashcardsByTopic(t.id).length})
            </option>
          ))}
        </select>
        <Badge variant="outline">
          {index + 1} / {deck.length}
        </Badge>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="w-full text-left focus:outline-none"
        aria-pressed={flipped}
      >
        <Card className="min-h-[280px] cursor-pointer transition hover:border-accent/40">
          <div className="mb-2 flex items-center justify-between">
            <TopicBadge topicId={card.topicId} />
            <span className="text-xs text-muted">{flipped ? 'Back' : 'Front'} · click to flip</span>
          </div>
          {!flipped ? (
            <p className="text-lg font-medium leading-relaxed">{card.front}</p>
          ) : (
            <div className="space-y-3 text-sm">
              <p className="text-base font-medium text-slate-100">{card.back}</p>
              <div>
                <p className="text-xs font-semibold uppercase text-accent">Mechanism</p>
                <p className="text-muted">{card.mechanism}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-warning">Risk</p>
                <p className="text-muted">{card.risk}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-success">Example</p>
                <p className="text-muted">{card.example}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-muted">Follow-up</p>
                <p className="text-muted">{card.followUp}</p>
              </div>
            </div>
          )}
        </Card>
      </button>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={prev}
          className="rounded border border-border px-4 py-2 text-sm hover:bg-surface-raised"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={next}
          className="rounded bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-muted"
        >
          Next
        </button>
        <button
          type="button"
          onClick={shuffle}
          className="rounded border border-border px-4 py-2 text-sm hover:bg-surface-raised"
        >
          Random
        </button>
        <button
          type="button"
          onClick={() => setFlipped(false)}
          className="rounded border border-border px-4 py-2 text-sm hover:bg-surface-raised"
        >
          Show front
        </button>
      </div>
    </div>
  );
}
