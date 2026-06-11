interface ProgressBarProps {
  label?: string;
  percentage: number;
  showLabel?: boolean;
  size?: 'compact' | 'prominent';
}

function getProgressColor(percentage: number): { bg: string; text: string } {
  if (percentage <= 30) return { bg: 'bg-status-error', text: 'text-status-error' };
  if (percentage <= 60) return { bg: 'bg-status-warning', text: 'text-status-warning' };
  if (percentage <= 85) return { bg: 'bg-status-info', text: 'text-status-info' };
  return { bg: 'bg-status-success', text: 'text-status-success' };
}

export function ProgressBar({
  label,
  percentage,
  showLabel = true,
  size = 'compact'
}: ProgressBarProps) {
  const heightClass = size === 'compact' ? 'h-2' : 'h-3';
  const { bg, text } = getProgressColor(percentage);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">{label}</span>
          <span className={`text-sm font-semibold ${text}`}>
            {percentage}%
          </span>
        </div>
      )}
      <div className={`${heightClass} bg-muted rounded-full overflow-hidden`}>
        <div
          className={`h-full ${bg} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
