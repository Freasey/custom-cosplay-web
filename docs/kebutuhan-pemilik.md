# Yang dibutuhkan dari pemilik

Situs sudah jalan dengan placeholder. Begitu data di bawah dikirim, nilainya dimasukkan ke `src/config/site.ts` dan `src/content/gallery.ts`, lalu situs siap rilis.

Status:

- Diterima: nama brand (Cospwork Id), nomor WhatsApp (6281717812783).
- Menyusul: domain, dan semua poin di bagian B sampai D.

## A. Wajib sebelum rilis

| No | Data | Contoh format | Dipakai di |
| --- | --- | --- | --- |
| 1 | Nama brand | `Nama Brand` | Header, footer, judul halaman, metadata, gambar share |
| 2 | Nomor WhatsApp | `6281234567890` (62 di depan, tanpa +, spasi, atau 0 di depan) | Semua tombol WhatsApp |
| 3 | Domain | `namabrand.com` | Canonical, sitemap, robots, gambar share |

Catatan: selama domain belum diisi, canonical, sitemap, robots, dan gambar share memakai `example.com`. Situs sudah bisa dipakai dan diuji, tapi sebaiknya domain diisi sebelum didaftarkan ke Google Search Console atau dipakai untuk iklan.

## B. Sangat disarankan sebelum iklan jalan

4. **Harga mulai per layanan** (dalam rupiah, angka bulat):
   - Kostum kain: Rp ...
   - Armor: Rp ...
   - Props: Rp ...

   Boleh dikosongkan. Kartu layanan akan menampilkan "Harga lewat konsultasi".

5. **Gambar hero** (1 gambar): rasio potret 4:5, minimal 1200 x 1500 px.

6. **Gambar galeri** (disarankan 3 sampai 9, idealnya kelipatan 3): rasio 4:5, minimal 1200 x 1500 px.

   Untuk setiap gambar (hero dan galeri), sebutkan:
   - Jenis: **foto asli** hasil produksi atau **gambar AI**.
   - Kategori: kain, armor, atau props.
   - Deskripsi singkat isi gambar, untuk teks alt. Contoh: "Armor perak dengan ukiran di bahu, dipasang di manekin, latar abu polos".

   Aturan gambar AI (dari `docs/business-rules.md`): desain orisinal saja, tidak boleh mirip karakter anime, game, atau film yang dikenal. Gaya foto produk: di manekin atau dipakai orang, latar polos, bahan terlihat nyata. Badge "Ilustrasi konsep" dipasang otomatis.

   Format JPG atau PNG tidak masalah, nanti dikonversi ke WebP.

7. **Akun media sosial**: URL lengkap Instagram dan TikTok. Kalau belum ada, tautannya disembunyikan.

## C. Opsional

8. **Logo**: persegi, SVG atau PNG minimal 512 x 512 px. Dipakai sebagai favicon dan logo di data Google. Sekarang masih ikon sementara (gantungan baju biru).
9. **Kalimat deskripsi footer**. Draf sekarang: "Jasa custom cosplay untuk kostum kain, armor, dan props. Konsultasi dan pemesanan lewat WhatsApp."
10. **Pesan awal WhatsApp**. Draf sekarang: "Halo, saya mau tanya custom cosplay. Karakter: ... Tanggal dipakai: ..."

## D. Nanti, setelah rilis

11. **Google Analytics 4** Measurement ID (`G-XXXXXXX`) dan/atau **Google Ads** ID (`AW-XXXXXXX`). Diisi sebagai variabel lingkungan di Cloudflare Pages, bukan di kode.
12. **Keputusan kompensasi keterlambatan**. Tidak ditampilkan di situs sampai diputuskan.
13. **Testimoni asli** (dengan izin pembeli). Bagian testimoni baru dibuat setelah ada.

## E. Konfirmasi keputusan kecil

Hal-hal ini sudah saya putuskan di kode. Kalau tidak setuju, cukup bilang:

- Judul FAQ: "Pertanyaan yang sering ditanyakan" (di `docs/pages.md` belum ada judulnya).
- Ada satu kalimat pembuka di bagian Layanan yang memuat keyword SEO: "Jasa custom cosplay untuk kostum kain, armor, dan props. Semua dikerjakan pengrajin berpengalaman sesuai referensi dan ukuranmu."
- Tiap kartu layanan punya tautan "Tanya armor" dan sejenisnya, yang membuka WhatsApp dengan nama layanan di pesan awal.
- Event `whatsapp_click` punya tiga lokasi tambahan di luar daftar `docs/seo.md`: `header` (tombol WA kecil di header HP), `footer`, dan `syarat` (tombol di halaman syarat).
- Tautan menu "Harga" menuju catatan harga di bagian Layanan, karena tidak ada bagian harga terpisah.
