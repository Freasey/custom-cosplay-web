# Halaman admin dan penyimpanan gambar

Pemilik mengelola gambar situs lewat `https://<domain>/admin/`. Gambar disimpan di Vercel Blob, bukan di repo.

## Yang bisa diatur

- Hero: gambar utama (sekaligus poster video), teks alt, jenis gambar, video MP4 opsional.
- Galeri: tambah beberapa gambar sekaligus, isi teks alt, pilih jenis (Ilustrasi konsep atau Foto hasil asli) dan kategori, ubah urutan, hapus.
- Logo header.
- Bersihkan file yang tidak dipakai lagi.

Gambar yang diunggah otomatis diubah ke WebP dan diperkecil di browser (galeri maksimal 1080x1350, hero 1200x1200, logo 192x192). Nama file dibuat dari nama file asli ditambah `-konsep` atau `-asli`.

## Alur kerja

1. Ubah gambar atau teks, lalu tekan **Simpan draf**. Situs belum berubah.
2. Tekan **Terbitkan**. Data draf disalin jadi versi terbit, lalu Worker memanggil `DEPLOY_HOOK_URL`.
3. Cloudflare membangun ulang situs. `scripts/pull-media.ts` mengambil versi terbit dan menanamkannya ke HTML statis. Situs berubah dalam 1 sampai 3 menit.

Situs publik tidak pernah memuat data gambar lewat JavaScript. Semua gambar, alt, dan badge sudah ada di HTML sejak awal, jadi mesin pencari selalu melihat isi lengkap.

## Aturan yang dijaga otomatis

- Teks alt wajib, 10 sampai 200 karakter, tanpa tanda pisah panjang. Untuk ilustrasi, awalan "Ilustrasi konsep" ditambahkan otomatis di situs.
- Jenis gambar wajib dipilih, dan badge mengikuti jenis itu.
- Foto asli selalu tampil lebih dulu daripada ilustrasi.
- Hanya file dari blob store situs ini yang diterima.
- Format unggahan: WebP, AVIF (gambar, maks 5 MB) dan MP4 (video, maks 20 MB).

Yang tidak bisa dicek otomatis dan tetap jadi tanggung jawab pengunggah: jangan memakai gambar, nama, atau logo karakter berhak cipta (aturan 4 di `CLAUDE.md`), dan pilih jenis gambar dengan jujur.

## Penyimpanan di Vercel Blob

| Awalan | Isi |
|---|---|
| `media/` | File gambar dan video. Setiap unggahan dapat nama unik, jadi aman di-cache setahun. |
| `content/draft-*.json` | Riwayat draf, 10 versi terakhir. |
| `content/published-*.json` | Riwayat versi terbit, 10 versi terakhir. Build hanya membaca yang terbaru. |

Menghapus gambar dari galeri tidak langsung menghapus filenya. Tombol **Bersihkan file tidak terpakai** menghapus file di `media/` yang tidak dipakai oleh draf atau versi terbit mana pun yang masih tersimpan, dan lebih lama dari 24 jam.

`src/content/media.json` di repo adalah salinan versi terbit. File ini dipakai kalau build berjalan tanpa `BLOB_READ_WRITE_TOKEN` (misalnya build lokal). Saat build di Cloudflare, file ini ditulis ulang dari Blob.

## Keamanan

- Login memakai satu akun dari secret `ADMIN_EMAIL` dan `ADMIN_PASSWORD` (lihat `docs/deploy.md`).
- Sesi disimpan di cookie `HttpOnly`, `Secure`, `SameSite=Strict`, berlaku 7 hari. Mengganti kata sandi membuat semua sesi lama tidak berlaku.
- Permintaan yang mengubah data hanya diterima dari domain situs sendiri.
- Login yang gagal dijeda 1 detik.
- Halaman admin memakai `noindex`, tidak masuk sitemap, dan diblokir di `robots.txt`.

## Kode

- `worker/index.ts`: rute admin dan API. `worker/auth.ts`: login dan sesi.
- `src/lib/media.ts`: skema dan validasi data media (dipakai situs, Worker, dan skrip).
- `src/lib/blob.ts`: klien REST Vercel Blob berbasis `fetch` (SDK resmi tidak jalan di Workers).
- `src/lib/media-store.ts`: simpan dan baca versi draf atau terbit.
- `src/components/admin/`: tampilan admin.
- `scripts/pull-media.ts`: dijalankan sebelum build.

## Menjalankan secara lokal

Buat file `.dev.vars` (sudah diabaikan git) berisi `ADMIN_EMAIL`, `ADMIN_PASSWORD`, dan `BLOB_READ_WRITE_TOKEN`, lalu:

```bash
npm run build
npm run preview
```

Buka `http://localhost:8787/admin/`. Hati-hati: tombol Terbitkan di lokal tetap menulis ke blob store yang sama dengan produksi.
