const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

/**
 * Keputusan pemilik: harga tidak ditampilkan, karena sangat bergantung pada
 * barang yang dipesan. Selama harga null, kartu mengajak diskusi.
 * "Mulai Rp350.000" hanya muncul kalau suatu saat harga diisi di konfigurasi.
 */
export function startingPriceLabel(price: number | null): string {
  if (price === null || !Number.isFinite(price) || price <= 0) {
    return "Harga dibahas saat konsultasi";
  }
  return `Mulai ${rupiah.format(price)}`;
}
