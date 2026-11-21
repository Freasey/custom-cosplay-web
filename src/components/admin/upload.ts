/**
 * Unggah file dari halaman admin.
 *
 * Gambar diubah ke WebP dan diperkecil di browser sebelum dikirim, jadi file
 * di situs selalu ringan (aturan CLAUDE.md: WebP atau AVIF, ukuran eksplisit).
 */
import { hardNavigate } from "@/components/admin/navigate";

export type UploadedImage = { src: string; width: number; height: number };

export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/avif";
export const VIDEO_ACCEPT = "video/mp4";
const VIDEO_MAX_BYTES = 20 * 1024 * 1024;

export class UploadError extends Error {}

async function readError(response: Response): Promise<string> {
  const data = (await response.json().catch(() => ({}))) as { error?: string };
  if (response.status === 401) {
    hardNavigate("/admin/login/");
  }
  return data.error ?? `Gagal mengunggah (HTTP ${response.status}).`;
}

async function sendFile(body: Blob, contentType: string, name: string): Promise<string> {
  const response = await fetch(`/api/admin/upload?${new URLSearchParams({ name })}`, {
    method: "POST",
    headers: { "content-type": contentType },
    body,
  });
  if (!response.ok) throw new UploadError(await readError(response));
  const data = (await response.json()) as { url: string };
  return data.url;
}

/** Ubah gambar ke WebP dengan sisi maksimal tertentu, lalu unggah. */
export async function uploadImage(
  file: File,
  options: { name: string; maxWidth: number; maxHeight: number },
): Promise<UploadedImage> {
  if (!IMAGE_ACCEPT.split(",").includes(file.type)) {
    throw new UploadError(`${file.name}: format harus JPG, PNG, WebP, atau AVIF.`);
  }
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new UploadError(`${file.name}: file gambar tidak bisa dibaca.`);
  }
  const originalWidth = bitmap.width;
  const originalHeight = bitmap.height;
  const scale = Math.min(1, options.maxWidth / originalWidth, options.maxHeight / originalHeight);
  const width = Math.round(originalWidth * scale);
  const height = Math.round(originalHeight * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new UploadError("Browser ini tidak bisa memproses gambar.");
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const webp = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.82));

  if (webp && webp.type === "image/webp") {
    return { src: await sendFile(webp, "image/webp", options.name), width, height };
  }
  // Browser lama (misalnya Safari versi lama) tidak bisa membuat WebP: kirim apa adanya kalau sudah WebP/AVIF.
  if (file.type === "image/webp" || file.type === "image/avif") {
    return { src: await sendFile(file, file.type, options.name), width: originalWidth, height: originalHeight };
  }
  throw new UploadError(
    `${file.name}: browser ini tidak bisa mengubah gambar ke WebP. Pakai Chrome atau Firefox, atau unggah file WebP.`,
  );
}

export async function uploadVideo(file: File, name: string): Promise<string> {
  if (file.type !== "video/mp4") throw new UploadError(`${file.name}: video harus berformat MP4.`);
  if (file.size > VIDEO_MAX_BYTES) throw new UploadError(`${file.name}: video maksimal 20 MB.`);
  return sendFile(file, "video/mp4", name);
}

/** Nama file deskriptif untuk SEO, contoh "armor-ksatria-biru-konsep". */
export function fileBaseName(fileName: string, suffix: string): string {
  const base = fileName
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
  return `${base || "gambar"}-${suffix}`;
}
