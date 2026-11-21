/**
 * Pindah halaman admin dengan muat ulang penuh, bukan lewat router Next.
 * Disengaja: Worker harus menerima permintaan asli supaya bisa memeriksa cookie login
 * dan mengalihkan ke /admin/login/ kalau sesi sudah habis.
 */
export function hardNavigate(path: "/admin/" | "/admin/login/") {
  window.location.assign(path);
}
