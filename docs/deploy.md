# Build dan deploy

## Target

Cloudflare Workers (static assets), paket gratis, dengan domain sendiri. Halaman publik sepenuhnya statis. Worker kecil di `worker/` hanya melayani `/admin*` dan `/api/*` untuk halaman admin (lihat `docs/admin.md`).

Gambar dan video disimpan di Vercel Blob. Catatan: Vercel paket Hobby dibatasi untuk pemakaian non-komersial, dan aturan itu berlaku juga untuk Blob. Untuk situs jasa berbayar ini, blob store sebaiknya ada di akun Vercel Pro.

Jangan deploy ke Vercel paket Hobby. Paket itu dibatasi untuk pemakaian non-komersial, sedangkan situs ini mempromosikan jasa berbayar.

## Branch

- `main`: khusus perencanaan (panduan dan dokumen). Tidak di-deploy.
- `dev`: pengembangan dan pengujian. Semua perubahan kode dan unggahan bahan masuk ke sini dulu.
- `prod`: yang tayang. Hanya diisi dari `dev` setelah lolos build, lint, dan pengecekan.

## Build

- `next.config`: `output: 'export'`, `images: { unoptimized: true }`, `trailingSlash: true`.
- Perintah build: `npm run build`. Script `prebuild` (`scripts/pull-media.ts`) mengambil data media versi terbit dari Vercel Blob dan menulis `src/content/media.json`. Kalau Blob tidak bisa dibaca atau ada file gambar yang rusak, build dihentikan supaya situs yang tayang tidak pernah berisi galeri rusak.
- Folder output: `out`
- Versi Node: tetapkan lewat file `.nvmrc` (LTS terbaru).

## Pengaturan Cloudflare

Proyek dibuat sebagai Workers (bukan Pages) dengan nama `custom-cosplay-web`. Situs statis dilayani dari folder `out/` sesuai `wrangler.jsonc`.

- Git repository: repo GitHub ini, production branch `prod`.
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Root directory: `/`
- Kalau build gagal karena versi Node, tambah variabel build `NODE_VERSION` dengan nilai `22`.
- Pasang domain di tab Domains setelah domain dibeli.

## Variabel lingkungan

Ada dua tempat di dashboard Cloudflare (Workers & Pages, pilih `custom-cosplay-web`, Settings):

**Build variables** (Settings > Builds > Variables and secrets), dipakai saat `npm run build`:

| Nama | Wajib | Isi |
|---|---|---|
| `BLOB_READ_WRITE_TOKEN` | ya | Token Vercel Blob. Tanpa ini build memakai `src/content/media.json` dari repo, jadi perubahan dari admin tidak ikut tayang. |
| `NEXT_PUBLIC_GA_ID` | tidak | Google Analytics. |
| `NEXT_PUBLIC_GADS_ID` | tidak | Google Ads conversion. |

**Runtime secrets** (Settings > Variables and Secrets, jenis Secret), dipakai Worker admin:

| Nama | Wajib | Isi |
|---|---|---|
| `ADMIN_EMAIL` | ya | Email untuk login admin. |
| `ADMIN_PASSWORD` | ya | Kata sandi admin. Pakai minimal 16 karakter acak. Menggantinya membuat semua sesi login lama tidak berlaku. |
| `BLOB_READ_WRITE_TOKEN` | ya | Token Vercel Blob yang sama. |
| `DEPLOY_HOOK_URL` | disarankan | URL Deploy Hook untuk branch `prod` (Settings > Builds > Deploy Hooks). Dipanggil saat admin menekan Terbitkan. Perlakukan seperti kata sandi. |

Tanpa ketiga secret wajib, `/admin` tetap tertutup dan API menjawab "Admin belum diaktifkan". Situs publik tetap jalan. `wrangler.jsonc` memakai `keep_vars: true` supaya variabel di dashboard tidak terhapus saat deploy.

Jangan pernah menulis nilai token atau kata sandi di repo.

## Sebelum rilis

- [ ] `brandName`, `domain`, `whatsappNumber` di `src/config/site.ts` sudah diisi pemilik.
- [ ] Tidak ada teks `[NAMA BRAND]` atau `[HARGA]` yang tersisa di halaman, kecuali harga yang memang ditampilkan sebagai "Harga dibahas saat konsultasi".
- [ ] Semua gambar AI punya badge "Ilustrasi konsep".
- [ ] Build log Cloudflare menampilkan `[pull-media] OK` (data media diambil dari Blob, bukan salinan repo).
- [ ] Tautan WhatsApp membuka chat dengan pesan awal yang benar di HP.
- [ ] Lighthouse mobile memenuhi target di `CLAUDE.md`.
- [ ] `sitemap.xml` dan `robots.txt` memakai domain yang benar.
