# Custom Cosplay Web

Website landing page untuk jasa custom cosplay (kostum kain, armor, props) dengan target pembeli di Indonesia. Tujuan utamanya satu: pengunjung menekan tombol WhatsApp untuk konsultasi. Tidak ada keranjang, checkout, atau login.

Nama brand, nomor WhatsApp, domain, dan harga belum final. Semua nilai itu dibaca dari satu file konfigurasi (lihat "Konfigurasi situs"), jangan ditulis langsung di komponen.

## Baca dulu

- `docs/design-system.md`: warna, font, ukuran, komponen (arah desain "Studio Terang").
- `docs/pages.md`: struktur halaman, urutan bagian, dan teks tiap bagian.
- `docs/business-rules.md`: aturan bisnis yang memengaruhi isi situs (alur pesan, DP, label gambar).
- `docs/seo.md`: keyword, metadata, structured data.
- `docs/deploy.md`: build statis dan deploy ke Cloudflare Pages.

## Stack

- Next.js (App Router) versi stabil terbaru, TypeScript, Tailwind CSS.
- Wajib static export (`output: 'export'` di `next.config`). Jangan pakai fitur yang butuh server: API routes, server actions, middleware, ISR, atau `next/image` tanpa `unoptimized`.
- Font dari `next/font/google`: Sora (judul) dan Plus Jakarta Sans (isi).
- Tanpa backend dan tanpa database. Semua konversi lewat tautan `https://wa.me/`.
- Tanpa library UI besar. Komponen ditulis sendiri sesuai `docs/design-system.md`.

## Struktur yang diharapkan

```
src/
  app/
    layout.tsx        metadata, font, header, footer
    page.tsx          beranda (semua bagian)
    syarat/page.tsx   syarat pemesanan dan DP
  components/         satu file per bagian dan per komponen UI
  config/site.ts      nama brand, nomor WA, domain, harga mulai
  content/            data galeri, layanan, FAQ, langkah pesan
public/
  images/             foto asli dan ilustrasi konsep
```

## Konfigurasi situs

`src/config/site.ts` mengekspor satu objek berisi: `brandName`, `domain`, `whatsappNumber` (format internasional tanpa plus), `whatsappMessage` (pesan awal), dan `startingPrices` per layanan. Selama nilainya belum diisi pemilik, pakai placeholder yang jelas seperti `[NAMA BRAND]` dan `[HARGA]`, jangan mengarang angka atau nama.

## Aturan penting

1. Jangan membuat testimoni, jumlah pelanggan, rating, atau angka apa pun yang tidak diberikan pemilik. Bagian testimoni tidak dibuat sampai ada testimoni asli.
2. Setiap gambar hasil AI wajib memakai badge "Ilustrasi konsep". Foto asli memakai badge "Foto hasil asli". Lihat `docs/business-rules.md`.
3. Jangan menyebut nama workshop atau mitra produksi di mana pun. Jangan juga menulis klaim "dibuat di workshop kami sendiri".
4. Jangan memakai nama, gambar, atau logo karakter berhak cipta (anime, game, film) di teks, alt, metadata, maupun gambar.
5. Mobile first. Sebagian besar pengunjung datang dari HP lewat iklan dan media sosial. Uji di lebar 360px.
6. Tombol WhatsApp selalu terlihat: di hero, di akhir halaman, dan sebagai tombol melayang di HP.

## Aturan penulisan teks

- Bahasa Indonesia santai tapi rapi, kata ganti "kamu" dan "kami".
- Jangan pernah memakai tanda em dash. Pakai koma, titik, atau titik dua.
- Hindari frasa klise iklan dan buzzword ("solusi terbaik", "wujudkan impianmu", "terpercaya nomor satu"). Tulis yang konkret: apa yang dikerjakan, berapa lama, bagaimana bayarnya.
- Kalimat pendek. Satu bagian, satu pesan.

## Perintah

Setelah proyek di-scaffold, perintah standarnya:

- `npm run dev`: server lokal.
- `npm run build`: build statis ke folder `out/`.
- `npm run lint`: pemeriksaan lint.

## Kualitas

- Lighthouse mobile: Performance dan SEO minimal 90, Accessibility minimal 95.
- Kontras teks minimal 4.5:1. Target sentuh minimal 44px.
- Semua gambar punya `alt` deskriptif, ukuran eksplisit, format WebP atau AVIF, dan lazy load kecuali gambar hero.
- HTML semantik: satu `h1` per halaman, tombol memakai `<a>` atau `<button>` asli.

## Urutan pengerjaan yang disarankan

1. Scaffold Next.js, Tailwind, font, dan token warna dari `docs/design-system.md`.
2. `src/config/site.ts` dan data di `src/content/`.
3. Komponen UI dasar: Button, Badge, Chip, Card, Container.
4. Bagian beranda sesuai urutan di `docs/pages.md`.
5. Halaman `/syarat`.
6. Metadata, structured data, sitemap, dan robots sesuai `docs/seo.md`.
7. Build statis dan cek deploy sesuai `docs/deploy.md`.
