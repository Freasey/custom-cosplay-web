# SEO

Target: pencarian berbahasa Indonesia dari orang yang ingin memesan kostum cosplay custom. Volume keyword di bawah masih asumsi dan belum dicek di Google Keyword Planner.

## Keyword

Utama (dipakai di title, H1 atau H2, dan paragraf pembuka):

- custom cosplay
- jasa custom cosplay
- jasa pembuatan kostum cosplay

Pendukung (dipakai alami di bagian layanan dan FAQ):

- bikin kostum cosplay
- custom armor cosplay
- props cosplay custom
- jasa jahit kostum cosplay
- custom cosplay Indonesia

Aturan: jangan menumpuk keyword. Jangan memakai nama karakter atau judul anime dan game sebagai keyword.

## Metadata

- `title` beranda: `Jasa Custom Cosplay: Kostum, Armor, dan Props | [NAMA BRAND]` (maksimal sekitar 60 karakter setelah nama brand diisi, pendekkan bila perlu).
- `description` beranda: `Pesan kostum cosplay custom sesuai karakter pilihanmu. Kirim referensi dan ukuran, kami kabari harga dan estimasi pengerjaan lewat WhatsApp. Kirim ke seluruh Indonesia.`
- `title` halaman syarat: `Syarat Pemesanan | [NAMA BRAND]`
- `lang="id"` di elemen `html`.
- Open Graph dan Twitter card: judul, deskripsi, dan satu gambar 1200x630. Gambar OG jangan memakai ilustrasi AI tanpa label.
- `canonical` di setiap halaman, dibangun dari `domain` di konfigurasi.

## Structured data

JSON-LD di beranda:

- `Organization`: nama, URL, logo, `sameAs` (Instagram, TikTok).
- `Service`: `serviceType` "Jasa pembuatan kostum cosplay custom", `areaServed` Indonesia.
- `FAQPage`: dari data FAQ yang sama dengan yang tampil di halaman.

Jangan menambahkan `AggregateRating` atau `Review` sampai ada ulasan asli.

## Teknis

- `sitemap.xml` dan `robots.txt` dihasilkan saat build.
- Satu `h1` per halaman, urutan heading tidak melompat.
- Gambar memakai nama file deskriptif (contoh: `armor-ksatria-biru-konsep.webp`) dan `alt` yang menjelaskan isi gambar. Untuk ilustrasi, `alt` diawali "Ilustrasi konsep".
- Gambar hero dimuat prioritas, sisanya lazy load.
- Tidak ada skrip pihak ketiga selain analitik. Analitik ditambahkan belakangan lewat variabel lingkungan, jangan ditulis langsung.

## Pelacakan konversi

Setiap klik tombol WhatsApp memicu satu event bernama `whatsapp_click` dengan parameter `location` (hero, layanan, siapkan, faq, penutup, melayang). Siapkan fungsi pembungkusnya sekarang walaupun analitik belum dipasang, supaya nanti tinggal disambungkan ke Google Ads dan Analytics.
