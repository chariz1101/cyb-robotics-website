/**
 * Client-side image downscaling, run before upload.
 *
 * Deliberately free of any Supabase import so it can be bundled on its own
 * and exercised in a real browser — see scripts/check-image-resize.mjs.
 */

/** Longest edge an uploaded image is allowed to keep. */
export const MAX_IMAGE_EDGE = 1400;

const IMAGE_QUALITY = 0.85;

/**
 * Shrinks an image to fit within MAX_IMAGE_EDGE, preserving aspect ratio.
 *
 * Phone photos are routinely 4000px and several megabytes. Uploading them
 * raw wastes storage and makes every page that shows them slow, so this
 * runs in the browser before the file leaves the device.
 *
 * Returns the original file when it is already small enough, when it is
 * not a raster image, or when anything about the resize fails — a failed
 * optimization must never block an upload.
 */
export async function resizeImage(file: File): Promise<Blob> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(
      1,
      MAX_IMAGE_EDGE / Math.max(bitmap.width, bitmap.height),
    );

    if (scale === 1) {
      bitmap.close();
      return file;
    }

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }

    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", IMAGE_QUALITY),
    );

    // Keep whichever is smaller: re-encoding an already-small PNG can grow it.
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}
