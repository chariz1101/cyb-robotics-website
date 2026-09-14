import { createClient } from "@/lib/supabase/client";
import { resizeImage } from "@/lib/image";

export type Bucket =
  | "avatars"
  | "event-media"
  | "project-media"
  | "project-code"
  | "directory-files";

export type UploadResult = {
  url: string;
  /** Extension without the dot, e.g. "pdf". Empty when the name had none. */
  fileType: string;
  /** Rounded up, so a sub-1KB file reads as 1 rather than 0. */
  sizeKb: number;
};

/** Largest file that may be stored, measured after any resizing. */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/**
 * Hard ceiling on what is even read into memory.
 *
 * The stored-size limit above cannot be applied to the original file: a
 * 12 MB phone photo resizes to well under 1 MB, and rejecting it up front
 * would refuse exactly the files officers are most likely to submit. So
 * the original is only checked against this much larger bound, which
 * exists to stop a huge file from being decoded into a canvas at all.
 */
const MAX_SOURCE_BYTES = 60 * 1024 * 1024;

function mb(bytes: number) {
  return (bytes / 1024 / 1024).toFixed(1);
}

function extensionOf(name: string) {
  const i = name.lastIndexOf(".");
  return i === -1 ? "" : name.slice(i + 1).toLowerCase();
}

/**
 * Uploads a file to a public bucket and returns its public URL.
 *
 * Runs through the browser client so the request carries the admin's
 * session — the storage policies in migration 0002 require is_admin().
 * The service role key is never involved.
 */
export async function uploadFile(
  bucket: Bucket,
  file: File,
): Promise<UploadResult> {
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error(
      `That file is ${mb(file.size)} MB, which is too large to process.`,
    );
  }

  // Resize first, then check: an oversized photo becomes an acceptable
  // one, while an oversized PDF is still refused below.
  const body = await resizeImage(file);

  if (body.size > MAX_UPLOAD_BYTES) {
    throw new Error(
      `That file is ${mb(body.size)} MB. The limit is ${MAX_UPLOAD_BYTES / 1024 / 1024} MB.`,
    );
  }
  // A resized image is always re-encoded as JPEG, so keeping the original
  // extension would be a lie.
  const ext = body === file ? extensionOf(file.name) : "jpg";

  // A random name, never the user's: filenames arrive with spaces,
  // non-ASCII characters and path separators, and two people uploading
  // "photo.jpg" must not collide.
  const path = `${crypto.randomUUID()}${ext ? `.${ext}` : ""}`;

  const supabase = createClient();
  const { error } = await supabase.storage.from(bucket).upload(path, body, {
    contentType: body.type || file.type || "application/octet-stream",
    upsert: false,
  });

  if (error) throw new Error(error.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);

  return {
    url: publicUrl,
    fileType: ext,
    sizeKb: Math.max(1, Math.ceil(body.size / 1024)),
  };
}
