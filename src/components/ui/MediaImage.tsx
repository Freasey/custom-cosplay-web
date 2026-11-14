import Image from "next/image";
import { imageAlt, type GalleryImage } from "@/content/gallery";
import { ImageBadge } from "@/components/ui/Badge";

type MediaImageProps = {
  image: GalleryImage;
  /** Gambar hero dimuat prioritas, sisanya lazy load. */
  priority?: boolean;
  sizes: string;
  className?: string;
};

/** Gambar dengan badge jenis gambar di pojok kiri atas. */
export function MediaImage({ image, priority = false, sizes, className = "" }: MediaImageProps) {
  return (
    <figure className={`relative overflow-hidden rounded-media border border-border bg-surface ${className}`}>
      <Image
        src={image.src}
        alt={imageAlt(image)}
        width={image.width}
        height={image.height}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className="h-full w-full object-cover"
      />
      <ImageBadge kind={image.kind} className="absolute left-3 top-3" />
    </figure>
  );
}
