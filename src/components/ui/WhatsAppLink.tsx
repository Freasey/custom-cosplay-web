"use client";

import type { ReactNode } from "react";
import { trackWhatsappClick } from "@/lib/analytics";
import { whatsappUrl, type WhatsAppLocation } from "@/lib/whatsapp";
import { buttonBase, buttonVariants, type ButtonVariant } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";

type WhatsAppLinkProps = {
  location: WhatsAppLocation;
  /** Konteks tambahan di pesan awal, misalnya nama layanan. */
  context?: string;
  children?: ReactNode;
  className?: string;
  ariaLabel?: string;
  tabIndex?: number;
};

/** Tautan WhatsApp polos. Semua tombol WhatsApp memakai komponen ini supaya event tercatat. */
export function WhatsAppLink({
  location,
  context,
  children,
  className = "",
  ariaLabel,
  tabIndex,
}: WhatsAppLinkProps) {
  return (
    <a
      href={whatsappUrl(context)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      tabIndex={tabIndex}
      className={className}
      onClick={() => trackWhatsappClick(location)}
    >
      {children}
    </a>
  );
}

type WhatsAppButtonProps = Omit<WhatsAppLinkProps, "className"> & {
  variant?: ButtonVariant;
  className?: string;
};

/** Tombol WhatsApp bergaya primary dengan ikon di kiri teks. */
export function WhatsAppButton({ variant = "primary", className = "", children, ...rest }: WhatsAppButtonProps) {
  return (
    <WhatsAppLink {...rest} className={`${buttonBase} ${buttonVariants[variant]} ${className}`}>
      <WhatsAppIcon size={20} />
      <span>{children}</span>
    </WhatsAppLink>
  );
}
