import type { ServiceKey } from "@/config/site";

export type ServiceQuestion = {
  question: string;
  answer: string;
};

export type Service = {
  key: ServiceKey;
  /** Alamat halaman layanan, contoh "kostum-kain" untuk /kostum-kain/. */
  slug: string;
  name: string;
  /** Satu baris di kartu layanan beranda. */
  description: string;
  /** H1 halaman layanan. */
  pageTitle: string;
  metaTitle: string;
  metaDescription: string;
  /** Paragraf pembuka halaman layanan. */
  intro: string;
  /** Daftar "Yang bisa dibuat". */
  makes: string[];
  /** Daftar "Yang perlu kamu kirim". */
  send: string[];
  questions: ServiceQuestion[];
};

const materialQuestion: ServiceQuestion = {
  question: "Bahannya apa?",
  answer:
    "Bahan kami sesuaikan dengan desain dan budget. Pilihan bahannya kami tuliskan di penawaran, sebelum kamu membayar DP.",
};

export const services: Service[] = [
  {
    key: "kain",
    slug: "kostum-kain",
    name: "Kostum kain",
    description: "Jasa jahit kostum cosplay: seragam, gaun, jubah, dan pakaian karakter.",
    pageTitle: "Jasa jahit kostum cosplay custom",
    metaTitle: "Jasa Jahit Kostum Cosplay Custom",
    metaDescription:
      "Jasa jahit kostum cosplay custom: seragam, gaun, jubah, dan pakaian karakter sesuai ukuran badanmu. Kirim referensi lewat WhatsApp, kami kabari harga dan estimasinya.",
    intro:
      "Bikin kostum cosplay dari kain sesuai gambar referensi dan ukuran badanmu. Dikerjakan pengrajin berpengalaman, dari pola sampai jahit.",
    makes: [
      "Seragam dan setelan karakter.",
      "Gaun dan rok berlapis.",
      "Jubah, mantel, dan kerudung.",
      "Pakaian bergaya tradisional dan fantasi.",
      "Pelengkap kain: sarung tangan, dasi, dan ikat pinggang.",
    ],
    send: [
      "Gambar referensi tampak depan, belakang, dan samping.",
      "Ukuran badan: tinggi, berat, lingkar dada, pinggang, pinggul, dan panjang lengan.",
      "Tanggal kostum akan dipakai.",
      "Bagian yang ingin diubah dari desain aslinya, kalau ada.",
    ],
    questions: [
      materialQuestion,
      {
        question: "Kalau ukurannya tidak pas?",
        answer:
          "Kostum dibuat dari ukuran yang kamu kirim, jadi ukur dengan teliti. Revisi kecil gratis satu kali.",
      },
    ],
  },
  {
    key: "armor",
    slug: "armor",
    name: "Armor",
    description: "Custom armor cosplay: pelindung badan, helm, dan bagian keras lainnya.",
    pageTitle: "Custom armor cosplay",
    metaTitle: "Custom Armor Cosplay: Helm dan Pelindung Badan",
    metaDescription:
      "Custom armor cosplay: pelindung dada, bahu, lengan, kaki, dan helm sesuai referensi dan ukuran badanmu. Kirim gambar lewat WhatsApp, kami kabari harga dan estimasinya.",
    intro:
      "Custom armor cosplay untuk pelindung badan, helm, dan bagian keras lain dari kostummu. Dibuat mengikuti gambar referensi dan ukuran badan, dikerjakan pengrajin berpengalaman.",
    makes: [
      "Pelindung dada dan punggung.",
      "Pelindung bahu, lengan, dan kaki.",
      "Helm dan topeng.",
      "Satu set armor lengkap.",
      "Bagian armor untuk melengkapi kostum kain.",
    ],
    send: [
      "Gambar referensi dari beberapa sudut, termasuk detail ukirannya.",
      "Ukuran badan. Tambahkan lingkar kepala kalau memesan helm.",
      "Tanggal armor akan dipakai.",
      "Rencana pemakaian: berapa lama dipakai dan perlu dibawa bepergian atau tidak.",
    ],
    questions: [
      materialQuestion,
      {
        question: "Bisa pesan sebagian saja?",
        answer:
          "Bisa, misalnya helm saja atau pelindung bahu saja. Sebutkan bagian yang kamu butuhkan saat chat.",
      },
    ],
  },
  {
    key: "props",
    slug: "props",
    name: "Props",
    description: "Props cosplay custom: senjata tiruan, aksesori, dan perlengkapan.",
    pageTitle: "Props cosplay custom",
    metaTitle: "Props Cosplay Custom: Senjata dan Aksesori",
    metaDescription:
      "Props cosplay custom: pedang, tongkat, perisai, dan aksesori karakter sesuai referensi. Kirim gambar lewat WhatsApp, kami kabari harga dan estimasi pengerjaannya.",
    intro:
      "Props cosplay custom untuk melengkapi kostummu: senjata tiruan, aksesori, dan perlengkapan karakter. Dibuat mengikuti gambar referensi dan ukuran yang kamu minta.",
    makes: [
      "Pedang, tombak, dan senjata tiruan lainnya.",
      "Tongkat dan tongkat sihir.",
      "Perisai.",
      "Aksesori: mahkota, tanduk, sayap, dan perhiasan.",
      "Perlengkapan kecil pelengkap karakter.",
    ],
    send: [
      "Gambar referensi dari beberapa sudut.",
      "Ukuran yang kamu inginkan, atau tinggi badanmu supaya proporsinya pas.",
      "Tanggal props akan dipakai.",
      "Aturan props di event yang kamu datangi, kalau ada batas ukuran atau bahan.",
    ],
    questions: [
      materialQuestion,
      {
        question: "Apakah props boleh dibawa ke event?",
        answer:
          "Props adalah tiruan untuk pelengkap kostum, bukan senjata sungguhan. Tiap event punya aturan sendiri, jadi cek aturannya dan beri tahu kami sejak awal.",
      },
    ],
  },
];

export function serviceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}
