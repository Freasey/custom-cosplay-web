# Halaman dan isi

Teks di bawah adalah draf awal. Boleh dirapikan asal tetap mengikuti aturan penulisan di `CLAUDE.md`. Nilai dalam kurung siku adalah placeholder dari `src/config/site.ts`.

## Beranda (`/`)

Urutan bagian dari atas ke bawah. Tiap bagian punya `id` supaya bisa dituju dari menu.

### 1. Hero

- H1: Kostum custom untuk karakter favoritmu
- Sub: Kirim referensi, ukuran, dan tanggal event. Harga dan estimasi pengerjaan kami kabari lewat WhatsApp.
- Tombol primary: Konsultasi gratis (menuju WhatsApp)
- Tombol secondary: Lihat cara pesan (menuju `#cara-pesan`)
- Baris kecil: DP 50% · Foto progres selama produksi · Kirim ke seluruh Indonesia
- Gambar: satu gambar utama dengan badge sesuai jenisnya.

### 2. Layanan dan harga mulai (`#layanan`)

- Label: LAYANAN
- H2: Apa saja yang bisa dibuat
- Tiga kartu:
  - Kostum kain. Seragam, gaun, jubah, dan pakaian karakter. Harga dibahas saat konsultasi.
  - Armor. Pelindung badan, helm, dan bagian keras lainnya. Harga dibahas saat konsultasi.
  - Props. Senjata tiruan, aksesori, dan perlengkapan. Harga dibahas saat konsultasi.
- Catatan di bawah kartu: Harga bergantung pada barang yang kamu inginkan: desain, bahan, dan tingkat kesulitannya. Kirim referensinya lewat WhatsApp, kami hitungkan untukmu.

### 3. Cara pesan (`#cara-pesan`)

- Label: CARA PESAN
- H2: Empat langkah sampai kostum di tanganmu
- Langkah:
  1. Kirim referensi. Gambar karakter, ukuran badan, dan tanggal event.
  2. Terima penawaran. Harga dan estimasi waktu pengerjaan.
  3. DP dan produksi. Kami kirim foto progres selama pengerjaan.
  4. Pelunasan dan kirim. Cek foto final dulu, lunasi, lalu kostum dikirim.

### 4. Contoh konsep (`#contoh`)

- Label: CONTOH
- H2: Gambaran yang bisa kami kerjakan
- Kalimat pembuka: Setiap kostum dibuat custom sesuai permintaan. Gambar berlabel "Ilustrasi konsep" adalah gambaran desain, bukan foto hasil produksi.
- Grid gambar: 3 kolom di desktop, 2 di tablet, 1 di HP. Rasio 4:5.
- Tiap item dari `src/content/gallery.ts`: `src`, `alt`, `category` (kain, armor, props), `kind` (`real` atau `concept`).
- Foto `real` selalu ditampilkan lebih dulu daripada `concept`.
- Judul bagian ini sengaja bukan "Portofolio" atau "Hasil Karya". Ganti ke "Hasil kerja kami" hanya setelah semua gambarnya foto asli.

### 5. Yang perlu disiapkan (`#siapkan`)

- H2: Sebelum chat, siapkan ini
- Daftar pendek:
  - Gambar referensi karakter dari beberapa sudut.
  - Ukuran badan: tinggi, berat, lingkar dada, pinggang, pinggul, dan panjang lengan.
  - Tanggal kostum akan dipakai.
  - Kisaran budget kalau ada.
- Tombol primary: Kirim referensi lewat WhatsApp

### 6. FAQ (`#faq`)

Pakai elemen `<details>` supaya tetap jalan tanpa JavaScript. Isi dari `src/content/faq.ts`:

- Berapa lama pengerjaannya? Tergantung tingkat kesulitan dan antrian saat itu. Estimasi kami berikan bersama penawaran harga, jadi sebutkan tanggal event-mu sejak awal.
- Bagaimana cara bayarnya? DP 50% saat order disetujui, pelunasan setelah kamu melihat foto atau video hasil akhirnya.
- Bisa revisi? Revisi kecil gratis satu kali. Perubahan desain di tengah pengerjaan dikenakan biaya tambahan.
- Kalau saya batal? DP tidak dikembalikan setelah bahan dibeli.
- Bisa kirim ke luar Jawa? Bisa, ke seluruh Indonesia. Ongkir ditanggung pembeli dan dihitung saat barang siap kirim.
- Apakah gambar di situs ini foto asli? Yang berlabel "Foto hasil asli" adalah hasil produksi. Yang berlabel "Ilustrasi konsep" adalah gambaran desain.

Di akhir FAQ: tautan "Baca syarat pemesanan lengkap" ke `/syarat`.

### 7. Ajakan penutup

- H2: Punya karakter yang ingin kamu perankan?
- Sub: Kirim referensinya, kami bantu hitung harga dan waktunya.
- Tombol primary: Konsultasi via WhatsApp

### Tombol WhatsApp melayang

Hanya di HP (di bawah 768px). Posisi kanan bawah, bulat, 56px, dengan `aria-label` "Chat WhatsApp". Muncul setelah pengguna scroll melewati hero.

## Syarat pemesanan (`/syarat`)

Halaman teks sederhana, lebar baca maksimal 720px. Isi diambil dari bagian "Syarat yang ditampilkan" di `docs/business-rules.md`. Akhiri dengan tombol WhatsApp.

## Tautan WhatsApp

Semua tombol memakai satu helper yang menghasilkan `https://wa.me/<nomor>?text=<pesan>` dari konfigurasi. Pesan awal default:

> Halo, saya mau tanya custom cosplay. Karakter: ... Tanggal dipakai: ...

Tombol di bagian yang berbeda boleh menambahkan konteks ke pesan (misalnya nama layanan dari kartu yang diklik).

## Halaman yang belum dibuat

Jangan dibuat dulu sampai diminta: blog, halaman per karakter, lacak status order, testimoni.
