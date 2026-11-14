# custom-cosplay-web

Landing page jasa custom cosplay untuk pasar Indonesia. Situs statis (Next.js static export) yang mengarahkan pengunjung ke WhatsApp.

Status: situs sudah dibangun dengan placeholder. Data yang masih ditunggu dari pemilik ada di `docs/kebutuhan-pemilik.md`.

## Stack

- Next.js 16.4 (App Router, Turbopack, `output: 'export'`), React 19.3
- Tailwind CSS 4.3, TypeScript 6.0, ESLint 10
- Node 26 LTS (lihat `.nvmrc`)

TypeScript dipasang di 6.0, bukan 7.0, karena `typescript-eslint` (dipakai `eslint-config-next`) belum mendukung TypeScript 7.

## Perintah

```bash
npm install
npm run dev            # server lokal di http://localhost:3000
npm run build          # build statis ke folder out/
npm run lint           # pemeriksaan lint
npm run check:release  # gagal kalau masih ada placeholder di out/
```

## Mengisi data

- `src/config/site.ts`: nama brand, domain, nomor WhatsApp, pesan awal, harga mulai, media sosial.
- `src/content/gallery.ts`: gambar hero dan galeri. Badge "Ilustrasi konsep" atau "Foto hasil asli" ditentukan dari field `kind`.
- `src/content/`: teks layanan, langkah pesan, FAQ, syarat.

## Panduan

- `CLAUDE.md`: ringkasan proyek, stack, dan aturan.
- `docs/design-system.md`: warna, font, komponen.
- `docs/pages.md`: struktur halaman dan teks.
- `docs/business-rules.md`: aturan bisnis dan label gambar.
- `docs/seo.md`: keyword dan metadata.
- `docs/deploy.md`: build dan deploy ke Cloudflare Pages.
- `docs/kebutuhan-pemilik.md`: data yang dibutuhkan dari pemilik.
- `docs/prompt-gambar.md`: prompt AI untuk gambar hero dan galeri.
