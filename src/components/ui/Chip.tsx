import type { ReactNode } from "react";

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-8 items-center rounded-chip border border-border bg-surface px-3 text-caption-lg text-ink-soft">
      {children}
    </span>
  );
}
