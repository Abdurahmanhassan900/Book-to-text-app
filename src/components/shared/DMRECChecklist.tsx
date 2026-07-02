import { DMREC_LABELS, type DMRECSection } from '../../types';

interface DMRECChecklistProps {
  completed?: Partial<Record<DMRECSection, boolean>>;
  compact?: boolean;
}

const sections: DMRECSection[] = [
  'definition',
  'mechanism',
  'benefit',
  'risk',
  'example',
  'conclusion',
];

export function DMRECChecklist({ completed = {}, compact = false }: DMRECChecklistProps) {
  return (
    <ul
      className={`grid gap-2 ${compact ? 'grid-cols-3 sm:grid-cols-6' : 'grid-cols-1 sm:grid-cols-2'}`}
      aria-label="D-M-B-R-E-C answer framework checklist"
    >
      {sections.map((section) => {
        const { letter, label } = DMREC_LABELS[section];
        const done = completed[section];
        return (
          <li
            key={section}
            className={`flex items-center gap-2 rounded border px-2 py-1.5 text-xs ${
              done
                ? 'border-success/40 bg-success/10 text-green-200'
                : 'border-border bg-surface-overlay text-muted'
            }`}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded font-mono font-bold ${
                done ? 'bg-success/30 text-green-100' : 'bg-surface text-slate-300'
              }`}
            >
              {letter}
            </span>
            {!compact && <span>{label}</span>}
          </li>
        );
      })}
    </ul>
  );
}
