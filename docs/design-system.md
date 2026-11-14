# Design system: Studio Terang

Arah desain yang dipilih pemilik. Kesan yang dituju: terang, rapi, terasa seperti jasa profesional. Menonjolkan proses dan kejelasan harga supaya orang berani DP ke brand yang masih baru. Foto kostum menjadi satu-satunya elemen yang ramai, sisanya tenang.

## Warna

| Token | Hex | Pemakaian |
| --- | --- | --- |
| `bg` | `#F4F6FA` | Latar halaman |
| `surface` | `#FFFFFF` | Kartu, header, panel |
| `ink` | `#10182B` | Judul dan teks utama |
| `ink-soft` | `#2A3550` | Teks isi di atas `surface` |
| `muted` | `#55607A` | Teks sekunder, keterangan |
| `border` | `#C9D1E0` | Garis kartu dan pemisah |
| `border-soft` | `#E3E8F1` | Pemisah halus di dalam kartu |
| `primary` | `#2B4EFF` | Tombol utama, tautan, harga |
| `primary-hover` | `#1A36C4` | Hover tombol dan tautan |
| `accent` | `#FF9A3D` | Badge "Ilustrasi konsep", sorotan kecil |
| `placeholder` | `#9AA6BD` | Garis putus-putus kotak gambar kosong |

Aturan kontras:

- Teks putih hanya di atas `primary`. Jangan menaruh teks putih di atas `accent`.
- Teks di atas `accent` selalu `ink`.
- `muted` hanya untuk teks 13px ke atas di atas `bg` atau `surface`.
- `accent` dipakai hemat. Kalau ragu, pakai `primary` atau netral.

Daftarkan semua token ini sebagai warna tema Tailwind, jangan menulis hex langsung di komponen.

## Tipografi

- Judul: Sora, bobot 700 (600 untuk subjudul kecil).
- Isi: Plus Jakarta Sans, bobot 400. Tombol dan label 600.
- Fallback keduanya: `system-ui, sans-serif`.

| Gaya | Desktop | HP | Line height |
| --- | --- | --- | --- |
| H1 hero | 52px | 34px | 1.1 |
| H2 bagian | 34px | 26px | 1.15 |
| H3 kartu | 20px | 18px | 1.3 |
| Isi | 16px | 16px | 1.6 |
| Isi besar (sub hero) | 18px | 16px | 1.5 |
| Keterangan | 13px sampai 14px | 13px | 1.5 |
| Label kecil huruf besar | 14px, letter spacing 2px, bobot 600 | sama | 1.4 |

Label kecil huruf besar berwarna `primary` dipakai sebagai penanda di atas H2 (contoh: "CARA PESAN").

## Ruang dan bentuk

- Skala jarak kelipatan 4: 4, 8, 12, 16, 24, 32, 40, 56, 80.
- Lebar konten maksimal 1120px, padding sisi 20px di HP dan 28px ke atas di desktop.
- Jarak vertikal antar bagian: 56px di HP, 80px di desktop.
- Radius: tombol 12px, chip dan badge 8px, kartu 14px sampai 16px, panel besar 20px.
- Bayangan: hampir tidak dipakai. Pemisahan memakai `border` 1px. Bayangan tipis hanya untuk tombol WhatsApp melayang.

## Komponen

### Button

- Primary: latar `primary`, teks putih, bobot 600, tinggi minimal 48px, padding sisi 24px sampai 28px, radius 12px. Hover: `primary-hover`.
- Secondary: tanpa latar, border 1.5px `ink`, teks `ink`, ukuran sama.
- Tombol WhatsApp memakai gaya primary dengan ikon WhatsApp inline SVG di kiri teks. Jangan memakai warna hijau WhatsApp supaya palet tetap konsisten.
- Fokus keyboard: outline 2px `primary` dengan offset 2px.

### Chip layanan

Latar `surface`, border 1px `border`, radius 8px, tinggi 32px, teks 14px. Dipakai untuk "Kostum kain", "Armor", "Props".

### Badge gambar

- "Ilustrasi konsep": latar `accent`, teks `ink`, 13px bobot 600, radius 8px.
- "Foto hasil asli": latar `ink`, teks putih, ukuran sama.
- Posisi: pojok kiri atas gambar, jarak 12px. Selalu terlihat, tidak hanya saat hover.

### Kartu layanan

Latar `surface`, border 1px `border`, radius 14px, padding 18px sampai 24px. Isi: nama layanan (H3), satu baris deskripsi (`muted`, 13px sampai 14px), lalu "Mulai [HARGA]" berwarna `primary` bobot 600.

### Langkah pesan

Empat kolom di desktop, satu kolom di HP. Tiap langkah: nomor dua digit (Sora 700, `primary`), judul 15px sampai 16px bobot 600, keterangan satu baris `muted`.

### Kotak gambar kosong

Selama foto belum ada: latar `bg`, border putus-putus 1.5px `placeholder`, radius 16px, teks keterangan `muted` di tengah. Jangan memakai gambar stok.

### Header

Latar `surface`, garis bawah `border-soft`, tinggi sekitar 64px, menempel di atas saat scroll. Kiri: nama brand (Sora 700, 18px). Kanan: tautan Cara pesan, Layanan, Harga, FAQ. Di HP tautan diganti satu tombol WhatsApp kecil, tanpa menu hamburger.

### Footer

Latar `ink`, teks putih dan abu terang. Isi: nama brand, satu kalimat deskripsi, tautan ke `/syarat`, tautan WhatsApp, Instagram, TikTok (URL dari konfigurasi).

## Layout hero

- Desktop: dua kolom sama lebar. Kiri: H1, sub, tombol primary, lalu satu baris jaminan kecil ("DP 50% · Foto progres selama produksi · Kirim ke seluruh Indonesia"). Kanan: satu gambar besar tinggi sekitar 420px dengan badge.
- HP: satu kolom, teks dulu, gambar di bawah tombol.

## Ikon

Inline SVG gaya garis (stroke 1.75px), warna mengikuti teks. Jangan memakai emoji sebagai ikon.

## Yang dihindari

- Gradien sebagai latar bagian.
- Kartu dengan garis tebal berwarna di sisi kiri.
- Animasi masuk yang menunda konten. Transisi hover 150ms sudah cukup.
- Carousel otomatis. Galeri memakai grid biasa.
