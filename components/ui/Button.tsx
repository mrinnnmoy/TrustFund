import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "rounded-[var(--radius-pill)] bg-[var(--color-accent)] text-[var(--color-ink)] hover:bg-[var(--color-accent-soft)]",
  secondary:
    "rounded-[var(--radius-pill)] border border-[var(--color-ink)] bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]",
  ghost:
    "rounded-[var(--radius-pill)] bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-ink-05)]",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center px-5 py-2.5 font-[family-name:var(--font-body)] text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
