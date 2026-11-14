export type FaqItem = {
  question: string;
  answer: string;
};

/** Dipakai di bagian FAQ dan structured data FAQPage. */
export const faqItems: FaqItem[] = [
  {
    question: "Berapa lama pengerjaannya?",
    answer:
      "Tergantung tingkat kesulitan dan antrian saat itu. Estimasi kami berikan bersama penawaran harga, jadi sebutkan tanggal event-mu sejak awal.",
  },
  {
    question: "Bagaimana cara bayarnya?",
    answer:
      "DP 50% saat order disetujui, pelunasan setelah kamu melihat foto atau video hasil akhirnya.",
  },
  {
    question: "Bisa revisi?",
    answer:
      "Revisi kecil gratis satu kali. Perubahan desain di tengah pengerjaan dikenakan biaya tambahan.",
  },
  {
    question: "Kalau saya batal?",
    answer: "DP tidak dikembalikan setelah bahan dibeli.",
  },
  {
    question: "Bisa kirim ke luar Jawa?",
    answer:
      "Bisa, ke seluruh Indonesia. Ongkir ditanggung pembeli dan dihitung saat barang siap kirim.",
  },
  {
    question: "Apakah gambar di situs ini foto asli?",
    answer:
      'Yang berlabel "Foto hasil asli" adalah hasil produksi. Yang berlabel "Ilustrasi konsep" adalah gambaran desain.',
  },
];
