import { Card } from '../components/ui/Card';

export function Flashcards() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold">Flashcards</h2>
        <p className="mt-1 text-sm text-muted">
          80+ cards across the curriculum — Phase 3
        </p>
      </header>
      <Card>
        <p className="text-sm text-muted">Active recall drills with mechanism, risk, and follow-ups.</p>
      </Card>
    </div>
  );
}
