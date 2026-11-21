/**
 * Klien REST kecil untuk Vercel Blob, hanya memakai `fetch`.
 *
 * SDK resmi (@vercel/blob) bergantung pada undici dan stream Node, jadi tidak dipakai:
 * file ini harus jalan di Cloudflare Workers dan di skrip build Node.
 */

const API_URL = "https://vercel.com/api/blob";
const API_VERSION = "13";

export type BlobItem = {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
};

export type PutOptions = {
  contentType: string;
  /** Tambah akhiran acak ke nama file supaya URL tidak pernah berubah isi (aman di-cache lama). */
  addRandomSuffix?: boolean;
  allowOverwrite?: boolean;
  /** Lama cache CDN dalam detik. */
  cacheControlMaxAge?: number;
};

export class BlobApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "BlobApiError";
    this.status = status;
  }
}

/** Token berformat vercel_blob_rw_<storeId>_<rahasia>. */
export function storeIdFromToken(token: string): string {
  const parts = token.split("_");
  if (parts.length < 5 || parts[0] !== "vercel" || parts[1] !== "blob" || !parts[3]) {
    throw new Error("BLOB_READ_WRITE_TOKEN tidak valid.");
  }
  return parts[3];
}

export function createBlobClient(token: string) {
  const storeId = storeIdFromToken(token);
  const publicBaseUrl = `https://${storeId.toLowerCase()}.public.blob.vercel-storage.com`;

  async function request<T>(path: string, init: RequestInit & { headers?: Record<string, string> }): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { ...init.headers, authorization: `Bearer ${token}`, "x-api-version": API_VERSION },
    });
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new BlobApiError(`Vercel Blob ${response.status}: ${text.slice(0, 300)}`, response.status);
    }
    const text = await response.text();
    return (text ? JSON.parse(text) : {}) as T;
  }

  return {
    publicBaseUrl,

    /** True kalau URL berasal dari blob store milik token ini. */
    ownsUrl(url: string): boolean {
      return url.startsWith(`${publicBaseUrl}/`);
    },

    async put(pathname: string, body: ArrayBuffer | Uint8Array | string, options: PutOptions): Promise<BlobItem> {
      const headers: Record<string, string> = {
        "x-vercel-blob-access": "public",
        "x-content-type": options.contentType,
      };
      if (options.addRandomSuffix !== undefined) headers["x-add-random-suffix"] = options.addRandomSuffix ? "1" : "0";
      if (options.allowOverwrite !== undefined) headers["x-allow-overwrite"] = options.allowOverwrite ? "1" : "0";
      if (options.cacheControlMaxAge !== undefined) {
        headers["x-cache-control-max-age"] = String(options.cacheControlMaxAge);
      }
      const result = await request<{ url: string; pathname: string }>(
        `/?${new URLSearchParams({ pathname }).toString()}`,
        { method: "PUT", body: body as BodyInit, headers },
      );
      const size = typeof body === "string" ? new TextEncoder().encode(body).byteLength : body.byteLength;
      return { url: result.url, pathname: result.pathname, size, uploadedAt: new Date().toISOString() };
    },

    /** Semua file dengan awalan tertentu (mengikuti semua halaman hasil). */
    async list(prefix: string): Promise<BlobItem[]> {
      const items: BlobItem[] = [];
      let cursor: string | undefined;
      do {
        const params = new URLSearchParams({ prefix, limit: "1000" });
        if (cursor) params.set("cursor", cursor);
        const page = await request<{ blobs: BlobItem[]; cursor?: string; hasMore: boolean }>(`/?${params}`, {
          method: "GET",
        });
        items.push(...page.blobs);
        cursor = page.hasMore ? page.cursor : undefined;
      } while (cursor);
      return items;
    },

    async del(urls: string[]): Promise<void> {
      if (urls.length === 0) return;
      for (let i = 0; i < urls.length; i += 100) {
        await request("/delete", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ urls: urls.slice(i, i + 100) }),
        });
      }
    },
  };
}

export type BlobClient = ReturnType<typeof createBlobClient>;
