import { Card } from '../components/ui/Card';

export function SpeakingPractice() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold">Timed Speaking Practice</h2>
        <p className="mt-1 text-sm text-muted">
          15s prep · 60s or 90s answer · D-M-B-R-E-C checklist · Coming in Phase 4
        </p>
      </header>
      <Card>
        <p className="text-sm text-slate-300">
          Practice delivering complete technical answers aloud under time pressure.
        </p>
      </Card>
    </div>
  );
}
