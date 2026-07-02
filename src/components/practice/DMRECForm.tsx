import type { DMRECAnswer, DMRECSection } from '../../types';
import { DMREC_LABELS } from '../../types';

interface DMRECFormProps {
  value: DMRECAnswer;
  onChange: (value: DMRECAnswer) => void;
  disabled?: boolean;
  showFallbackHint?: boolean;
}

const SECTIONS: DMRECSection[] = [
  'definition',
  'mechanism',
  'benefit',
  'risk',
  'example',
  'conclusion',
];

const PLACEHOLDERS: Record<DMRECSection, string> = {
  definition: 'What is it? One clear sentence.',
  mechanism: 'How does it work? Step-by-step.',
  benefit: 'What security problem does it solve?',
  risk: 'What are limitations, tradeoffs, or dangers?',
  example: 'Where does this appear in a real system?',
  conclusion: 'Why does it matter? Brief closing sentence.',
};

export function DMRECForm({
  value,
  onChange,
  disabled = false,
  showFallbackHint = true,
}: DMRECFormProps) {
  const update = (section: DMRECSection, text: string) => {
    onChange({ ...value, [section]: text });
  };

  return (
    <div className="space-y-4">
      {showFallbackHint && (
        <p className="rounded border border-border bg-surface px-3 py-2 text-sm text-muted">
          Unsure? Start with:{' '}
          <em className="text-slate-300">
            &quot;I&apos;m not completely sure, but I believe…&quot;
          </em>{' '}
          then fill each field honestly.
        </p>
      )}
      {SECTIONS.map((section) => {
        const { letter, label } = DMREC_LABELS[section];
        return (
          <label key={section} className="block">
            <span className="mb-1 flex items-center gap-2 text-sm font-medium">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-accent/20 font-mono text-xs text-accent">
                {letter}
              </span>
              {label}
            </span>
            <textarea
              value={value[section]}
              onChange={(e) => update(section, e.target.value)}
              disabled={disabled}
              rows={section === 'mechanism' ? 4 : 2}
              placeholder={PLACEHOLDERS[section]}
              className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-slate-200 placeholder:text-muted focus:border-accent focus:outline-none disabled:opacity-60"
            />
          </label>
        );
      })}
    </div>
  );
}

export function emptyDMRECAnswer(): DMRECAnswer {
  return {
    definition: '',
    mechanism: '',
    benefit: '',
    risk: '',
    example: '',
    conclusion: '',
  };
}
