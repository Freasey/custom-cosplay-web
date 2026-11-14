# Aturan bisnis

Konteks supaya isi situs sesuai dengan cara usaha ini berjalan.

## Model usaha

- Brand ini menerima order custom cosplay dan mengurus seluruh komunikasi dengan pembeli. Produksi dikerjakan mitra pengrajin.
- Pembeli hanya berhubungan dengan brand ini. Situs tidak menyebut nama mitra produksi dan tidak mengklaim punya workshop sendiri. Kalimat yang aman: "dikerjakan pengrajin berpengalaman".
- Semua order dimulai dari percakapan WhatsApp. Situs tidak menerima pembayaran.
- Usaha baru mulai dari nol: belum ada pelanggan dan belum ada testimoni. Situs harus jujur soal itu dengan cara tidak mengklaim apa pun yang belum ada.

## Alur order

1. Pembeli mengirim referensi karakter, ukuran badan, dan tanggal pakai.
2. Brand meminta harga dan estimasi ke pengrajin, lalu mengirim penawaran.
3. Pembeli membayar DP 50%.
4. Produksi berjalan. Foto progres diteruskan ke pembeli.
5. Barang jadi. Pembeli melihat foto atau video final, lalu melunasi.
6. Barang dikirim ke alamat pembeli.

Estimasi waktu tidak pernah ditulis sebagai angka pasti di situs, karena bergantung pada tingkat kesulitan dan antrian.

## Syarat yang ditampilkan

Dipakai di FAQ dan halaman `/syarat`:

- DP 50% dibayar saat order disetujui. Pengerjaan dimulai setelah DP diterima.
- DP tidak dikembalikan jika pembeli membatalkan setelah bahan dibeli.
- Revisi kecil gratis satu kali. Perubahan desain setelah produksi berjalan dikenakan biaya tambahan.
- Ukuran dibuat berdasarkan data yang dikirim pembeli. Ketidaksesuaian akibat data ukuran yang salah bukan tanggungan kami.
- Estimasi waktu adalah perkiraan. Pembeli wajib menyebutkan tanggal pakai sejak awal supaya bisa dipastikan sanggup atau tidak.
- Pelunasan dilakukan setelah pembeli melihat foto atau video hasil akhir, sebelum barang dikirim.
- Ongkos kirim ditanggung pembeli. Kerusakan akibat ekspedisi mengikuti ketentuan ekspedisi.

Kompensasi keterlambatan belum diputuskan pemilik. Jangan menulis janji kompensasi sampai ada keputusan.

## Aturan gambar

- Foto asli hasil produksi diberi badge "Foto hasil asli".
- Gambar buatan AI diberi badge "Ilustrasi konsep" yang selalu terlihat.
- Bagian galeri berjudul "Contoh" atau "Gambaran", bukan "Portofolio" atau "Hasil Karya", selama masih ada gambar AI.
- Gambar AI hanya menampilkan desain orisinal. Tidak ada karakter dari anime, game, atau film yang dikenal.
- Gambar AI bergaya foto produk: kostum di manekin atau dipakai orang, latar polos, bahan terlihat nyata.
- Setiap ada foto asli baru di satu kategori, gambar AI di kategori itu dikurangi.
- Data galeri memakai field `kind` supaya badge ditentukan dari data, bukan ditulis manual per gambar.

## Yang tidak boleh ada di situs

- Testimoni, rating, atau jumlah order buatan.
- Hitung mundur palsu, stok palsu, atau klaim "terbatas" tanpa dasar.
- Logo atau nama pihak lain sebagai "klien" tanpa izin.
- Janji hasil "100% mirip" atau garansi yang belum diputuskan pemilik.

## Harga

- Hanya ditampilkan sebagai "Mulai [HARGA]" per jenis layanan.
- Angka diisi pemilik di `src/config/site.ts` setelah menerima daftar harga dari pengrajin.
- Selama belum diisi, kartu layanan menampilkan "Harga lewat konsultasi" dan bukan angka karangan.
