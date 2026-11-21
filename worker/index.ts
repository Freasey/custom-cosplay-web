/**
 * Worker Cloudflare untuk situs ini.
 *
 * Halaman publik dilayani langsung dari folder out/ (static assets) tanpa melewati kode ini.
 * Worker hanya dijalankan untuk /admin* dan /api/* (lihat `run_worker_first` di wrangler.jsonc):
 * - /admin/login/           : halaman login (statis, terbuka).
 * - /admin/*                : halaman admin (statis), hanya untuk yang sudah login.
 * - /api/admin/*            : API admin: login, data media, unggah, terbitkan, bersihkan.
 */
import { BlobApiError, createBlobClient, type BlobClient } from "../src/lib/blob.ts";
import { manifestFingerprint, referencedUrls, validateManifest, type MediaManifest } from "../src/lib/media.ts";
import {
  DRAFT_PREFIX,
  MEDIA_PREFIX,
  PUBLISHED_PREFIX,
  loadAllVersions,
  loadLatest,
  saveVersion,
} from "../src/lib/media-store.ts";
import { clearSessionCookie, createSessionCookie, credentialsMatch, hasValidSession } from "./auth.ts";

export interface Env {
  ASSETS: Fetcher;
  ADMIN_EMAIL?: string;
  ADMIN_PASSWORD?: string;
  BLOB_READ_WRITE_TOKEN?: string;
  /** URL Deploy Hook Cloudflare Workers Builds untuk branch prod. Opsional. */
  DEPLOY_HOOK_URL?: string;
}

const UPLOAD_RULES: Record<string, { ext: string; maxBytes: number }> = {
  "image/webp": { ext: "webp", maxBytes: 5 * 1024 * 1024 },
  "image/avif": { ext: "avif", maxBytes: 5 * 1024 * 1024 },
  "video/mp4": { ext: "mp4", maxBytes: 20 * 1024 * 1024 },
};

/** File yang baru diunggah tidak dihapus saat bersih-bersih: mungkin belum sempat disimpan ke draf. */
const CLEANUP_GRACE_MS = 24 * 60 * 60 * 1000;

const PRIVATE_HEADERS = {
  "cache-control": "no-store",
  "x-robots-tag": "noindex, nofollow",
  "x-frame-options": "DENY",
  "x-content-type-options": "nosniff",
  "referrer-policy": "same-origin",
};

function json(data: unknown, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...PRIVATE_HEADERS, "content-type": "application/json; charset=utf-8", ...extra },
  });
}

function withPrivateHeaders(response: Response): Response {
  const copy = new Response(response.body, response);
  for (const [key, value] of Object.entries(PRIVATE_HEADERS)) copy.headers.set(key, value);
  return copy;
}

function redirect(location: string): Response {
  return new Response(null, { status: 302, headers: { ...PRIVATE_HEADERS, location } });
}

function adminConfigured(env: Env): env is Env & { ADMIN_EMAIL: string; ADMIN_PASSWORD: string; BLOB_READ_WRITE_TOKEN: string } {
  return Boolean(env.ADMIN_EMAIL && env.ADMIN_PASSWORD && env.BLOB_READ_WRITE_TOKEN);
}

/** Nama file aman: huruf kecil, angka, tanda hubung. */
function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/\.[a-z0-9]+$/, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "media"
  );
}

async function currentDraft(client: BlobClient): Promise<MediaManifest | null> {
  return (await loadLatest(client, DRAFT_PREFIX)) ?? (await loadLatest(client, PUBLISHED_PREFIX));
}

/** Semua URL di manifest harus milik blob store ini (atau file lokal situs). */
function foreignUrls(client: BlobClient, manifest: MediaManifest): string[] {
  return referencedUrls(manifest).filter((url) => url.startsWith("https://") && !client.ownsUrl(url));
}

async function handleApi(request: Request, env: Env, path: string): Promise<Response> {
  const method = request.method;

  // Permintaan yang mengubah data harus datang dari situs ini sendiri (perlindungan CSRF).
  if (method !== "GET" && method !== "HEAD") {
    const origin = request.headers.get("origin");
    if (origin !== new URL(request.url).origin) return json({ error: "Asal permintaan tidak diizinkan." }, 403);
  }

  if (!adminConfigured(env)) {
    return json(
      { error: "Admin belum diaktifkan. Isi ADMIN_EMAIL, ADMIN_PASSWORD, dan BLOB_READ_WRITE_TOKEN di Cloudflare." },
      503,
    );
  }

  if (path === "/api/admin/login" && method === "POST") {
    const body = (await request.json().catch(() => null)) as { email?: unknown; password?: unknown } | null;
    const email = typeof body?.email === "string" ? body.email : "";
    const password = typeof body?.password === "string" ? body.password : "";
    if (!(await credentialsMatch(env, email, password))) {
      // Jeda kecil memperlambat tebak-tebakan kata sandi.
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return json({ error: "Email atau kata sandi salah." }, 401);
    }
    return json({ ok: true }, 200, { "set-cookie": await createSessionCookie(env) });
  }

  if (path === "/api/admin/logout" && method === "POST") {
    return json({ ok: true }, 200, { "set-cookie": clearSessionCookie() });
  }

  if (!(await hasValidSession(request, env))) return json({ error: "Sesi berakhir. Silakan masuk lagi." }, 401);

  const client = createBlobClient(env.BLOB_READ_WRITE_TOKEN);

  if (path === "/api/admin/media" && method === "GET") {
    const [draft, published] = await Promise.all([currentDraft(client), loadLatest(client, PUBLISHED_PREFIX)]);
    return json({
      draft,
      published,
      hasUnpublishedChanges: Boolean(draft && (!published || manifestFingerprint(draft) !== manifestFingerprint(published))),
      deployHookConfigured: Boolean(env.DEPLOY_HOOK_URL),
    });
  }

  if (path === "/api/admin/media" && method === "PUT") {
    const result = validateManifest(await request.json().catch(() => null));
    if (!result.ok) return json({ error: "Data belum lengkap.", details: result.errors }, 422);
    const foreign = foreignUrls(client, result.manifest);
    if (foreign.length > 0) return json({ error: "Ada file dari luar penyimpanan situs.", details: foreign }, 422);
    const saved = await saveVersion(client, DRAFT_PREFIX, result.manifest);
    return json({ ok: true, draft: saved });
  }

  if (path === "/api/admin/upload" && method === "POST") {
    const contentType = (request.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
    const rule = UPLOAD_RULES[contentType];
    if (!rule) return json({ error: "Format file harus WebP, AVIF, atau MP4." }, 415);
    const declared = Number(request.headers.get("content-length") ?? "0");
    if (declared > rule.maxBytes) return json({ error: `File terlalu besar. Maksimal ${rule.maxBytes / 1048576} MB.` }, 413);
    const body = await request.arrayBuffer();
    if (body.byteLength === 0) return json({ error: "File kosong." }, 400);
    if (body.byteLength > rule.maxBytes) return json({ error: `File terlalu besar. Maksimal ${rule.maxBytes / 1048576} MB.` }, 413);
    const name = slugify(new URL(request.url).searchParams.get("name") ?? "");
    const item = await client.put(`${MEDIA_PREFIX}${name}.${rule.ext}`, body, {
      contentType,
      addRandomSuffix: true,
      // Nama file unik per unggahan, jadi isinya tidak pernah berubah: aman di-cache setahun.
      cacheControlMaxAge: 31536000,
    });
    return json({ ok: true, url: item.url, pathname: item.pathname, size: item.size });
  }

  if (path === "/api/admin/publish" && method === "POST") {
    const draft = await currentDraft(client);
    if (!draft) return json({ error: "Belum ada data untuk diterbitkan." }, 409);
    const published = await saveVersion(client, PUBLISHED_PREFIX, draft);
    let deploy: "triggered" | "not_configured" | "failed" = "not_configured";
    if (env.DEPLOY_HOOK_URL) {
      const hook = await fetch(env.DEPLOY_HOOK_URL, { method: "POST" }).catch(() => null);
      deploy = hook?.ok ? "triggered" : "failed";
    }
    return json({ ok: true, published, deploy });
  }

  if (path === "/api/admin/cleanup" && method === "POST") {
    const versions = [
      ...(await loadAllVersions(client, DRAFT_PREFIX)),
      ...(await loadAllVersions(client, PUBLISHED_PREFIX)),
    ];
    const used = new Set(versions.flatMap(referencedUrls));
    const now = Date.now();
    const unused = (await client.list(MEDIA_PREFIX)).filter(
      (item) => !used.has(item.url) && now - Date.parse(item.uploadedAt) > CLEANUP_GRACE_MS,
    );
    await client.del(unused.map((item) => item.url));
    return json({ ok: true, deleted: unused.map((item) => item.pathname) });
  }

  return json({ error: "Tidak ditemukan." }, 404);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path.startsWith("/api/")) {
      try {
        return await handleApi(request, env, path);
      } catch (error) {
        console.error(error);
        const message =
          error instanceof BlobApiError ? "Penyimpanan file sedang bermasalah. Coba lagi sebentar." : "Terjadi kesalahan di server.";
        return json({ error: message }, 500);
      }
    }

    if (path === "/admin" || path.startsWith("/admin/")) {
      const isLogin = path === "/admin/login" || path.startsWith("/admin/login/");
      const loggedIn = adminConfigured(env) && (await hasValidSession(request, env));
      if (isLogin && loggedIn && !path.endsWith(".txt")) return redirect("/admin/");
      if (!isLogin && !loggedIn) return redirect("/admin/login/");
      return withPrivateHeaders(await env.ASSETS.fetch(request));
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
