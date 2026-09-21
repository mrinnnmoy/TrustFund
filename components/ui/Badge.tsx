import type { HTMLAttributes } from "react";

type BadgeTone = "neutral" | "success" | "warning";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-[var(--color-ink-05)] text-[var(--color-ink)]",
  success: "bg-[var(--color-accent)] text-[var(--color-ink)]",
  warning: "bg-[var(--color-accent-soft)] text-[var(--color-ink)]",
};

export function Badge({ tone = "neutral", className = "", children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-[var(--radius-pill)] px-3 py-1 font-[family-name:var(--font-body)] text-xs font-semibold ${toneClasses[tone]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
