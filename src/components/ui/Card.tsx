import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  action?: ReactNode;
}

export function Card({ children, className = '', title, action }: CardProps) {
  return (
    <section
      className={`rounded-lg border border-border bg-surface-raised p-4 ${className}`}
    >
      {(title || action) && (
        <header className="mb-3 flex items-start justify-between gap-3">
          {title && <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{title}</h2>}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
