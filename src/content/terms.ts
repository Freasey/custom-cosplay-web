export type Term = {
  title: string;
  body: string;
};

/** Isi halaman /syarat, dari docs/business-rules.md bagian "Syarat yang ditampilkan". */
export const terms: Term[] = [
  {
    title: "DP 50%",
    body: "DP 50% dibayar saat order disetujui. Pengerjaan dimulai setelah DP diterima.",
  },
  {
    title: "Pembatalan",
    body: "DP tidak dikembalikan jika pembeli membatalkan setelah bahan dibeli.",
  },
  {
    title: "Revisi",
    body: "Revisi kecil gratis satu kali. Perubahan desain setelah produksi berjalan dikenakan biaya tambahan.",
  },
  {
    title: "Ukuran",
    body: "Ukuran dibuat berdasarkan data yang dikirim pembeli. Ketidaksesuaian akibat data ukuran yang salah bukan tanggungan kami.",
  },
  {
    title: "Estimasi waktu",
    body: "Estimasi waktu adalah perkiraan. Pembeli wajib menyebutkan tanggal pakai sejak awal supaya bisa dipastikan sanggup atau tidak.",
  },
  {
    title: "Pelunasan",
    body: "Pelunasan dilakukan setelah pembeli melihat foto atau video hasil akhir, sebelum barang dikirim.",
  },
  {
    title: "Pengiriman",
    body: "Ongkos kirim ditanggung pembeli. Kerusakan akibat ekspedisi mengikuti ketentuan ekspedisi.",
  },
];
