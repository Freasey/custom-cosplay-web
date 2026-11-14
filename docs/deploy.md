# Build dan deploy

## Target

Cloudflare Pages, paket gratis, dengan domain sendiri. Situs sepenuhnya statis.

Jangan deploy ke Vercel paket Hobby. Paket itu dibatasi untuk pemakaian non-komersial, sedangkan situs ini mempromosikan jasa berbayar.

## Branch

- `main`: khusus perencanaan (panduan dan dokumen). Tidak di-deploy.
- `dev`: pengembangan dan pengujian. Semua perubahan kode dan unggahan bahan masuk ke sini dulu.
- `prod`: yang tayang. Hanya diisi dari `dev` setelah lolos build, lint, dan pengecekan.

## Build

- `next.config`: `output: 'export'`, `images: { unoptimized: true }`, `trailingSlash: true`.
- Perintah build: `npm run build`
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

Belum ada yang wajib. Yang disiapkan untuk nanti:

- `NEXT_PUBLIC_GA_ID`: Google Analytics.
- `NEXT_PUBLIC_GADS_ID`: Google Ads conversion.

Kode harus tetap jalan saat variabel ini kosong.

## Sebelum rilis

- [ ] `brandName`, `domain`, `whatsappNumber` di `src/config/site.ts` sudah diisi pemilik.
- [ ] Tidak ada teks `[NAMA BRAND]` atau `[HARGA]` yang tersisa di halaman, kecuali harga yang memang ditampilkan sebagai "Harga dibahas saat konsultasi".
- [ ] Semua gambar AI punya badge "Ilustrasi konsep".
- [ ] Tautan WhatsApp membuka chat dengan pesan awal yang benar di HP.
- [ ] Lighthouse mobile memenuhi target di `CLAUDE.md`.
- [ ] `sitemap.xml` dan `robots.txt` memakai domain yang benar.
