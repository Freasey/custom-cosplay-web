type ImagePlaceholderProps = {
  label: string;
  className?: string;
};

/** Kotak gambar kosong selama foto belum ada. Tidak memakai gambar stok. */
export function ImagePlaceholder({ label, className = "" }: ImagePlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`flex items-center justify-center rounded-media border-[1.5px] border-dashed border-placeholder bg-bg p-6 text-center ${className}`}
    >
      <span className="max-w-[220px] text-caption-lg text-muted">{label}</span>
    </div>
  );
}
