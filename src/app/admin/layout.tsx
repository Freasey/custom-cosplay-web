import type { Metadata } from "next";

/**
 * Halaman admin. Akses dijaga oleh Worker (worker/index.ts): tanpa sesi login,
 * semua /admin/* dialihkan ke /admin/login/. Tidak diindeks dan tidak masuk sitemap.
 */
export const metadata: Metadata = {
  title: { absolute: "Admin media" },
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: null },
  openGraph: null,
  twitter: null,
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-dvh bg-bg">{children}</div>;
}
