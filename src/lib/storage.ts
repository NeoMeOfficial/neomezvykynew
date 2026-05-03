/**
 * Supabase Storage helpers — admin content uploads.
 *
 * Single bucket (`content-images`) with path prefixes per content type:
 *   blog/{uuid}.webp
 *   exercises/{uuid}.webp
 *   meditations/{uuid}.webp
 *   programs/{uuid}.webp
 *   recipes/{uuid}.webp
 *
 * Uploads accept JPEG, PNG, or WebP. Non-WebP source files are converted to
 * WebP client-side before upload via a canvas. Storage is uniformly WebP.
 *
 * Bucket setup (one-time, via Supabase Studio):
 *   - Create `content-images` bucket, public: yes
 *   - Storage policy: read for anyone, write for `app_metadata.role='admin'`
 * See docs/operations/storage-setup.md for the runbook.
 */

import { supabase } from './supabase';

const BUCKET = 'content-images';
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const WEBP_QUALITY = 0.85;
const ALLOWED_INPUT_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export type ContentImagePrefix =
  | 'blog'
  | 'exercises'
  | 'meditations'
  | 'programs'
  | 'recipes';

export interface UploadResult {
  /** Public URL (use for hero/full-resolution display). */
  url: string;
  /** Storage path (e.g. `blog/abc-123-def.webp`). Persist this in the row. */
  path: string;
}

export class ImageUploadError extends Error {
  constructor(message: string, readonly code: 'invalid_type' | 'too_large' | 'conversion_failed' | 'upload_failed') {
    super(message);
    this.name = 'ImageUploadError';
  }
}

/**
 * Upload a content image. Validates type and size, converts to WebP if needed,
 * generates a UUID filename, uploads to the appropriate path prefix, and
 * returns the public URL + storage path.
 */
export async function uploadContentImage(
  file: File,
  prefix: ContentImagePrefix,
): Promise<UploadResult> {
  if (!ALLOWED_INPUT_TYPES.includes(file.type as typeof ALLOWED_INPUT_TYPES[number])) {
    throw new ImageUploadError(
      'Use JPEG, PNG, or WebP. (HEIC, SVG, GIF, BMP are not supported.)',
      'invalid_type',
    );
  }
  if (file.size > MAX_BYTES) {
    throw new ImageUploadError(
      `File is ${(file.size / 1024 / 1024).toFixed(1)} MB; max ${(MAX_BYTES / 1024 / 1024).toFixed(0)} MB.`,
      'too_large',
    );
  }

  const blob: Blob = file.type === 'image/webp' ? file : await convertToWebP(file);
  const path = `${prefix}/${crypto.randomUUID()}.webp`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    contentType: 'image/webp',
    cacheControl: '31536000', // 1 year — paths are immutable (UUID-named)
    upsert: false,
  });
  if (error) {
    throw new ImageUploadError(error.message, 'upload_failed');
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

/**
 * Build a transform-on-display URL from a stored path.
 *
 * @param path  Storage path like `blog/abc.webp` (what `uploadContentImage` returned)
 * @param opts  Optional resize/quality params. Supabase generates the variant on first request.
 */
export function imageDisplayUrl(
  path: string,
  opts?: { width?: number; height?: number; quality?: number },
): string {
  if (!path) return '';
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  if (!supabaseUrl) return '';

  const base = `${supabaseUrl}/storage/v1/render/image/public/${BUCKET}/${path}`;
  const params = new URLSearchParams();
  if (opts?.width) params.set('width', String(opts.width));
  if (opts?.height) params.set('height', String(opts.height));
  if (opts?.quality) params.set('quality', String(opts.quality));
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

/**
 * Delete a stored image. Use when admin removes a row that owned the image,
 * or when replacing an existing image (delete old after successful new upload).
 */
export async function deleteContentImage(path: string): Promise<void> {
  if (!path) return;
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) {
    throw new ImageUploadError(error.message, 'upload_failed');
  }
}

// ── internal: WebP conversion via canvas ────────────────────────────────────

async function convertToWebP(file: File): Promise<Blob> {
  const img = await loadImageElement(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new ImageUploadError('Browser cannot create a canvas context.', 'conversion_failed');
  }
  ctx.drawImage(img, 0, 0);

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new ImageUploadError('WebP conversion failed.', 'conversion_failed'));
      },
      'image/webp',
      WEBP_QUALITY,
    );
  });
}

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new ImageUploadError('Could not load image.', 'conversion_failed'));
    };
    img.src = objectUrl;
  });
}
