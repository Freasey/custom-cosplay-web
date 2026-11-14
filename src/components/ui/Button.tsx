import Link from "next/link";
import type { ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary";

export const buttonBase =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-button px-6 text-center text-body font-semibold transition-colors duration-150 md:px-7";

export const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  secondary: "border-[1.5px] border-ink text-ink hover:border-primary-hover hover:text-primary-hover",
};

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

/** Tombol berupa tautan internal (anchor atau halaman lain di situs ini). */
export function ButtonLink({ href, children, variant = "primary", className = "" }: ButtonLinkProps) {
  return (
    <Link href={href} className={`${buttonBase} ${buttonVariants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
