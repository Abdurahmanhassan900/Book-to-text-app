interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md';
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const variantClasses = {
  default: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  size = 'md',
  variant = 'default',
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="mb-1 flex items-center justify-between text-xs text-muted">
          {label && <span>{label}</span>}
          {showValue && <span className="font-mono">{percent}%</span>}
        </div>
      )}
      <div
        className={`w-full overflow-hidden rounded-full bg-surface-overlay ${size === 'sm' ? 'h-1.5' : 'h-2.5'}`}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${variantClasses[variant]}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
