interface GaugeProps {
  value: number;
  label: string;
  sublabel?: string;
  size?: number;
}

export function Gauge({ value, label, sublabel, size = 120 }: GaugeProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  const color =
    clamped >= 85 ? '#22c55e' : clamped >= 70 ? '#f59e0b' : clamped >= 50 ? '#3b82f6' : '#ef4444';

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#243044"
          strokeWidth="8"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>
      <div className="-mt-16 text-center">
        <div className="text-2xl font-bold text-slate-100">{clamped}%</div>
        <div className="text-xs text-muted">{label}</div>
        {sublabel && <div className="text-[10px] text-muted">{sublabel}</div>}
      </div>
    </div>
  );
}
