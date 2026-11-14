"use client";

import { useEffect, useRef } from "react";
import { imageAlt, type GalleryImage } from "@/content/gallery";
import { ImageBadge } from "@/components/ui/Badge";

type HeroVideoProps = {
  /** Gambar poster: tampil sebelum video main dan saat video tidak diputar. */
  poster: GalleryImage;
  videoSrc: string;
  className?: string;
};

/**
 * Video hero tanpa suara yang berulang, dengan badge jenis gambar.
 * Tidak diputar kalau pengguna memilih "kurangi gerakan" atau JavaScript mati:
 * dalam keadaan itu poster yang tampil.
 */
export function HeroVideo({ poster, videoSrc, className = "" }: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    video.play().catch(() => {
      // Autoplay ditolak browser (misalnya mode hemat data): poster tetap tampil.
    });
  }, []);

  return (
    <figure className={`relative overflow-hidden rounded-media border border-border bg-surface ${className}`}>
      <video
        ref={ref}
        poster={poster.src}
        width={poster.width}
        height={poster.height}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={imageAlt(poster)}
        className="h-full w-full object-cover object-top"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      <ImageBadge kind={poster.kind} className="absolute left-3 top-3" />
    </figure>
  );
}
