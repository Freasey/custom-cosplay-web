# Build dan deploy

## Target

Cloudflare Pages, paket gratis, dengan domain sendiri. Situs sepenuhnya statis.

Jangan deploy ke Vercel paket Hobby. Paket itu dibatasi untuk pemakaian non-komersial, sedangkan situs ini mempromosikan jasa berbayar.

## Build

- `next.config`: `output: 'export'`, `images: { unoptimized: true }`, `trailingSlash: true`.
- Perintah build: `npm run build`
- Folder output: `out`
- Versi Node: tetapkan lewat file `.nvmrc` (LTS terbaru).

## Pengaturan Cloudflare Pages

- Sambungkan repo GitHub ini, branch produksi `main`.
- Framework preset: Next.js (Static HTML Export).
- Build command: `npm run build`
- Build output directory: `out`
- Pasang domain di tab Custom domains setelah domain dibeli.

## Variabel lingkungan

Belum ada yang wajib. Yang disiapkan untuk nanti:

- `NEXT_PUBLIC_GA_ID`: Google Analytics.
- `NEXT_PUBLIC_GADS_ID`: Google Ads conversion.

Kode harus tetap jalan saat variabel ini kosong.

## Sebelum rilis

- [ ] `brandName`, `domain`, `whatsappNumber` di `src/config/site.ts` sudah diisi pemilik.
- [ ] Tidak ada teks `[NAMA BRAND]` atau `[HARGA]` yang tersisa di halaman, kecuali harga yang memang ditampilkan sebagai "Harga lewat konsultasi".
- [ ] Semua gambar AI punya badge "Ilustrasi konsep".
- [ ] Tautan WhatsApp membuka chat dengan pesan awal yang benar di HP.
- [ ] Lighthouse mobile memenuhi target di `CLAUDE.md`.
- [ ] `sitemap.xml` dan `robots.txt` memakai domain yang benar.
