import type { TopicId } from '../../types';
import { TOPIC_LABELS } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'topic' | 'success' | 'warning' | 'danger' | 'outline';
}

const variants = {
  default: 'bg-surface-overlay text-slate-200',
  topic: 'bg-accent-dim/40 text-blue-200',
  success: 'bg-success/20 text-green-300',
  warning: 'bg-warning/20 text-amber-300',
  danger: 'bg-danger/20 text-red-300',
  outline: 'border border-border text-muted',
};

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
}

export function TopicBadge({ topicId }: { topicId: TopicId }) {
  return <Badge variant="topic">{TOPIC_LABELS[topicId]}</Badge>;
}
