"use client";

import { useState, type FormEvent } from "react";
import { buttonBase, buttonVariants } from "@/components/ui/Button";
import { fieldClass, labelClass } from "@/components/admin/styles";
import { hardNavigate } from "@/components/admin/navigate";

export function LoginForm() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
      });
      if (response.ok) {
        hardNavigate("/admin/");
        return;
      }
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "Gagal masuk. Coba lagi.");
    } catch {
      setError("Tidak bisa terhubung. Periksa koneksi internet.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-7 space-y-4">
      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required className={fieldClass} />
      </div>
      <div>
        <label htmlFor="password" className={labelClass}>
          Kata sandi
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={fieldClass}
        />
      </div>
      {error ? (
        <p role="alert" className="rounded-chip border border-[#b42318] bg-white px-3 py-2 text-caption-lg text-[#b42318]">
          {error}
        </p>
      ) : null}
      <button type="submit" disabled={busy} className={`${buttonBase} ${buttonVariants.primary} w-full disabled:opacity-60`}>
        {busy ? "Memeriksa..." : "Masuk"}
      </button>
    </form>
  );
}
