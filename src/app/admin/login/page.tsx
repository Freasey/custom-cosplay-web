import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[420px] flex-col justify-center px-5 py-10">
      <h1 className="font-heading text-section font-bold">Masuk admin</h1>
      <p className="mt-2 text-ink-soft">Kelola logo, hero, dan galeri situs.</p>
      <LoginForm />
    </main>
  );
}
