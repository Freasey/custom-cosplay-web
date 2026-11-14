import type { ReactNode } from "react";

type SectionHeadingProps = {
  id?: string;
  label?: string;
  title: string;
  children?: ReactNode;
};

/** Label kecil huruf besar (opsional), H2, lalu paragraf pembuka (opsional). */
export function SectionHeading({ id, label, title, children }: SectionHeadingProps) {
  return (
    <div className="max-w-[640px]">
      {label ? (
        <p className="mb-3 text-label font-semibold uppercase tracking-[2px] text-primary">{label}</p>
      ) : null}
      <h2 id={id} className="text-section md:text-section-lg">
        {title}
      </h2>
      {children ? <div className="mt-3 text-ink-soft">{children}</div> : null}
    </div>
  );
}
