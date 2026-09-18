import Image from "next/image";

/**
 * A photo served from Supabase Storage.
 *
 * Uploads are capped at 1400px on the long edge, which is right for a
 * hero and far too much for a card. next/image resizes and re-encodes per
 * request, so `sizes` is what actually decides the bytes a phone
 * downloads — it must describe the rendered width at each breakpoint, not
 * the source image.
 */
export function StorageImage({
  src,
  alt = "",
  sizes,
  className = "",
  priority = false,
}: {
  src: string;
  alt?: string;
  /** Rendered width per breakpoint, e.g. "(min-width: 640px) 220px, 100vw". */
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
    />
  );
}
