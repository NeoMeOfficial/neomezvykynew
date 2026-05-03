# Supabase Storage setup

One-time runbook for setting up the `content-images` bucket that admin-uploaded images go into. Run this once per Supabase project (production, staging if separate).

## What you're creating

A single public bucket `content-images` with admin-only writes. Path prefixes per content type:

```
content-images/
├── blog/{uuid}.webp
├── exercises/{uuid}.webp
├── meditations/{uuid}.webp
├── programs/{uuid}.webp
└── recipes/{uuid}.webp
```

Storage holds WebP files only (client-side conversion via `src/lib/storage.ts`). Public-readable, admin-writable.

## Steps

### 1. Create the bucket

Supabase Studio → **Storage** → **New bucket**

- **Name:** `content-images`
- **Public bucket:** ✅ checked
- **File size limit:** 5 MB (5242880 bytes)
- **Allowed MIME types:** `image/webp`

Create.

### 2. Storage policies

Storage → `content-images` bucket → **Policies** tab.

**Policy 1 — Public read.**

- Name: `Anyone can read content-images`
- Allowed operation: `SELECT`
- Target roles: leave empty (public)
- USING expression:
  ```sql
  bucket_id = 'content-images'
  ```

**Policy 2 — Admin can write.**

- Name: `Admin can upload content-images`
- Allowed operations: `INSERT`, `UPDATE`, `DELETE`
- Target roles: `authenticated`
- USING + WITH CHECK expression:
  ```sql
  bucket_id = 'content-images'
  AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  ```

Save.

### 3. CORS

Storage → **CORS configuration** (project-wide setting). Allow your app origins:

```
http://localhost:8080
https://neome-wellness-app.netlify.app
https://neome.com.au   (or your production domain)
```

Methods: `GET, POST, PUT, DELETE, OPTIONS`
Headers: `*` (or at least `Authorization, Content-Type, x-client-info, apikey`)

### 4. Smoke test

From the browser console (logged in as an admin):

```js
const file = new File([new Uint8Array([0xff,0xd8])], 'test.jpg', { type: 'image/jpeg' });
const { uploadContentImage } = await import('/src/lib/storage.ts');
const result = await uploadContentImage(file, 'blog');
console.log(result);
// → { url: 'https://...supabase.co/storage/v1/object/public/content-images/blog/abc.webp', path: 'blog/abc.webp' }
```

If you see the URL, setup is done. Visit the URL in a new tab — should render a (broken/tiny) image, confirming public read works.

## When the bucket is missing

If you visit `/admin` and try to upload an image but get a "bucket not found" error, this runbook hasn't been completed for that project. Run steps 1–3.

## What happens if I delete the bucket

Every uploaded image goes 404. Database rows still hold `path` strings but they point nowhere. Don't delete.
