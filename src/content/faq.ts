export type FaqItem = {
  question: string;
  answer: string;
};

/** Dipakai di bagian FAQ dan structured data FAQPage. */
export const faqItems: FaqItem[] = [
  {
    question: "Bisa bikin kostum cosplay dari karakter apa saja?",
    answer:
      "Bisa, selama ada gambar referensinya. Kirim gambarnya dulu lewat WhatsApp, nanti kami cek tingkat kesulitannya dan kabari harganya.",
  },
  {
    question: "Harus datang untuk ukur badan?",
    answer:
      "Tidak perlu. Kami melayani custom cosplay dari seluruh Indonesia lewat WhatsApp. Kamu cukup mengirim ukuran badan sesuai daftar di bagian \"Sebelum chat, siapkan ini\".",
  },
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
