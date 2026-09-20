interface ProgressBarProps {
  /** 0-100 */
  percent: number;
  /** e.g. "4.2 / 10 SOL" — pass pre-formatted; this component does not do lamport math. */
  label: string;
}

export function ProgressBar({ percent, label }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div className="flex flex-col gap-2">
      <div className="h-2 w-full overflow-hidden rounded-[var(--radius-pill)] bg-[var(--color-ink-10)]">
        <div
          className="h-full rounded-[var(--radius-pill)] bg-[var(--color-accent)] transition-[width]"
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-ink)]">
        {label}
      </span>
    </div>
  );
}
