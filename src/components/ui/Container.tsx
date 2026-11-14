import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  /** "content" 1120px untuk bagian halaman, "reading" 720px untuk teks panjang. */
  width?: "content" | "reading";
};

export function Container({ children, className = "", width = "content" }: ContainerProps) {
  const max = width === "reading" ? "max-w-reading" : "max-w-content";
  return <div className={`mx-auto w-full ${max} px-5 md:px-7 ${className}`}>{children}</div>;
}
