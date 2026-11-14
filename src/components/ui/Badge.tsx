import type { ImageKind } from "@/content/gallery";

const labels: Record<ImageKind, string> = {
  concept: "Ilustrasi konsep",
  real: "Foto hasil asli",
};

const styles: Record<ImageKind, string> = {
  concept: "bg-accent text-ink",
  real: "bg-ink text-white",
};

/** Badge jenis gambar. Selalu terlihat, posisinya diatur oleh pembungkus. */
export function ImageBadge({ kind, className = "" }: { kind: ImageKind; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-chip px-2.5 py-1 text-caption font-semibold ${styles[kind]} ${className}`}
    >
      {labels[kind]}
    </span>
  );
}
