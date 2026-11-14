"use client";

import { useEffect, useState } from "react";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { WhatsAppIcon } from "@/components/ui/icons";

/**
 * Tombol WhatsApp melayang, hanya di HP (di bawah 768px).
 * Muncul setelah pengguna scroll melewati hero. Di halaman tanpa hero
 * (misalnya /syarat) langsung tampil.
 */
export function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-opacity duration-150 md:hidden ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!visible}
    >
      <WhatsAppLink
        location="melayang"
        ariaLabel="Chat WhatsApp"
        className="flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-[0_6px_20px_rgb(16_24_43_/_0.25)] transition-colors duration-150 hover:bg-primary-hover"
        tabIndex={visible ? 0 : -1}
      >
        <WhatsAppIcon size={26} />
      </WhatsAppLink>
    </div>
  );
}
