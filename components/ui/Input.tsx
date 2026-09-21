import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, id, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="font-[family-name:var(--font-body)] text-sm font-medium text-[var(--color-ink)]"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`rounded-[var(--radius-sm)] border bg-[var(--color-paper)] px-3.5 py-2.5 font-[family-name:var(--font-body)] text-sm text-[var(--color-ink)] outline-none transition-shadow placeholder:text-[var(--color-muted)] focus:border-[var(--color-ink)] focus:ring-2 focus:ring-[var(--color-accent)] ${
          error ? "border-[var(--color-error)]" : "border-[var(--color-border)]"
        } ${className}`}
        {...props}
      />
      {error && (
        <span className="font-[family-name:var(--font-body)] text-sm text-[var(--color-error)]">
          {error}
        </span>
      )}
    </div>
  );
}
