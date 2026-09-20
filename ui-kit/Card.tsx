import type { HTMLAttributes } from "react";

export function Card({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-paper)] p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
