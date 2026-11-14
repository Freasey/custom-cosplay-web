const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

/** "Mulai Rp350.000" atau "Harga lewat konsultasi" kalau harga belum diisi. */
export function startingPriceLabel(price: number | null): string {
  if (price === null || !Number.isFinite(price) || price <= 0) {
    return "Harga lewat konsultasi";
  }
  return `Mulai ${rupiah.format(price)}`;
}
