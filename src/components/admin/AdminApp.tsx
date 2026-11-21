"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ImageBadge } from "@/components/ui/Badge";
import { buttonBase, buttonVariants } from "@/components/ui/Button";
import { fieldClass, labelClass, panelClass, smallButton, dangerButton } from "@/components/admin/styles";
import { hardNavigate } from "@/components/admin/navigate";
import {
  IMAGE_ACCEPT,
  VIDEO_ACCEPT,
  UploadError,
  fileBaseName,
  uploadImage,
  uploadVideo,
} from "@/components/admin/upload";
import {
  ALT_MAX,
  ALT_MIN,
  GALLERY_MAX,
  SERVICE_KEYS,
  imageAlt,
  manifestFingerprint,
  validateManifest,
  type GalleryImage,
  type ImageKind,
  type MediaManifest,
  type ServiceKey,
} from "@/lib/media";

const categoryLabels: Record<ServiceKey, string> = { kain: "Kostum kain", armor: "Armor", props: "Props" };
const kindLabels: Record<ImageKind, string> = { concept: "Ilustrasi konsep (AI)", real: "Foto hasil asli" };
const kindSuffix: Record<ImageKind, string> = { concept: "konsep", real: "asli" };

type Notice = { tone: "ok" | "error"; text: string; details?: string[] };

type MediaResponse = {
  draft: MediaManifest | null;
  published: MediaManifest | null;
  deployHookConfigured: boolean;
};

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: init?.body ? { "content-type": "application/json" } : undefined,
  });
  const data = (await response.json().catch(() => ({}))) as T & { error?: string; details?: string[] };
  if (response.status === 401) {
    hardNavigate("/admin/login/");
    throw new UploadError("Sesi berakhir.");
  }
  if (!response.ok) {
    const error = new UploadError(data.error ?? `Permintaan gagal (HTTP ${response.status}).`);
    (error as UploadError & { details?: string[] }).details = data.details;
    throw error;
  }
  return data;
}

function errorNotice(error: unknown): Notice {
  const details = (error as { details?: string[] }).details;
  const text = error instanceof Error ? error.message : "Terjadi kesalahan.";
  return { tone: "error", text, details };
}

function move<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const copy = [...list];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

export function AdminApp() {
  const [manifest, setManifest] = useState<MediaManifest | null>(null);
  const [savedFingerprint, setSavedFingerprint] = useState("");
  const [publishedFingerprint, setPublishedFingerprint] = useState("");
  const [deployHookConfigured, setDeployHookConfigured] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState<Notice | null>(null);
  const noticeRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const data = await api<MediaResponse>("/api/admin/media");
      const current = data.draft ?? data.published;
      if (!current) {
        setLoadError("Belum ada data media di penyimpanan. Jalankan migrasi awal (lihat docs/admin.md).");
        return;
      }
      setManifest(current);
      setSavedFingerprint(manifestFingerprint(current));
      setPublishedFingerprint(data.published ? manifestFingerprint(data.published) : "");
      setDeployHookConfigured(data.deployHookConfigured);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Gagal memuat data.");
    }
  }, []);

  useEffect(() => {
    // Data admin dimuat dari API (bukan bagian dari halaman publik, jadi tidak berpengaruh ke SEO).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const fingerprint = manifest ? manifestFingerprint(manifest) : "";
  const unsaved = Boolean(manifest) && fingerprint !== savedFingerprint;
  const unpublished = Boolean(manifest) && fingerprint !== publishedFingerprint;
  const validation = useMemo(() => (manifest ? validateManifest(manifest) : null), [manifest]);
  const problems = validation && !validation.ok ? validation.errors : [];

  useEffect(() => {
    if (!unsaved) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [unsaved]);

  useEffect(() => {
    if (notice) noticeRef.current?.focus();
  }, [notice]);

  function update(change: (current: MediaManifest) => MediaManifest) {
    setManifest((current) => (current ? change(current) : current));
  }

  function updateGallery(index: number, patch: Partial<GalleryImage>) {
    update((m) => ({ ...m, gallery: m.gallery.map((item, i) => (i === index ? { ...item, ...patch } : item)) }));
  }

  async function run(label: string, task: () => Promise<Notice | void>) {
    setBusy(label);
    setNotice(null);
    try {
      const result = await task();
      if (result) setNotice(result);
    } catch (error) {
      setNotice(errorNotice(error));
    } finally {
      setBusy("");
    }
  }

  async function saveDraft(): Promise<boolean> {
    if (!manifest) return false;
    if (problems.length > 0) {
      setNotice({ tone: "error", text: "Masih ada data yang perlu dilengkapi.", details: problems });
      return false;
    }
    const data = await api<{ draft: MediaManifest }>("/api/admin/media", {
      method: "PUT",
      body: JSON.stringify(manifest),
    });
    setManifest(data.draft);
    setSavedFingerprint(manifestFingerprint(data.draft));
    return true;
  }

  const onSave = () =>
    run("Menyimpan draf...", async () => {
      if (await saveDraft()) return { tone: "ok", text: "Draf tersimpan. Situs belum berubah sampai kamu menekan Terbitkan." };
    });

  const onPublish = () =>
    run("Menerbitkan...", async () => {
      if (unsaved && !(await saveDraft())) return;
      const data = await api<{ published: MediaManifest; deploy: "triggered" | "not_configured" | "failed" }>(
        "/api/admin/publish",
        { method: "POST" },
      );
      setPublishedFingerprint(manifestFingerprint(data.published));
      if (data.deploy === "triggered") {
        return { tone: "ok", text: "Diterbitkan. Situs sedang dibangun ulang dan akan berubah dalam 1 sampai 3 menit." };
      }
      if (data.deploy === "failed") {
        return {
          tone: "error",
          text: "Data sudah diterbitkan, tapi build ulang gagal dipicu. Jalankan build ulang dari dashboard Cloudflare.",
        };
      }
      return {
        tone: "ok",
        text: "Data sudah diterbitkan. DEPLOY_HOOK_URL belum diisi, jadi situs baru berubah setelah build berikutnya.",
      };
    });

  const onCleanup = () => {
    if (!window.confirm("Hapus file yang tidak dipakai lagi oleh draf maupun versi terbit? File yang diunggah dalam 24 jam terakhir tidak dihapus.")) {
      return;
    }
    void run("Membersihkan...", async () => {
      const data = await api<{ deleted: string[] }>("/api/admin/cleanup", { method: "POST" });
      return {
        tone: "ok",
        text: data.deleted.length ? `${data.deleted.length} file tidak terpakai dihapus.` : "Tidak ada file yang perlu dihapus.",
      };
    });
  };

  const onLogout = async () => {
    if (unsaved && !window.confirm("Ada perubahan yang belum disimpan. Tetap keluar?")) return;
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => null);
    hardNavigate("/admin/login/");
  };

  const onAddImages = (files: FileList, kind: ImageKind, category: ServiceKey) =>
    run("Mengunggah gambar...", async () => {
      if (!manifest) return;
      const room = GALLERY_MAX - manifest.gallery.length;
      const list = Array.from(files).slice(0, Math.max(0, room));
      const added: GalleryImage[] = [];
      const failed: string[] = [];
      for (const [index, file] of list.entries()) {
        setBusy(`Mengunggah gambar ${index + 1} dari ${list.length}...`);
        try {
          const uploaded = await uploadImage(file, {
            name: fileBaseName(file.name, kindSuffix[kind]),
            maxWidth: 1080,
            maxHeight: 1350,
          });
          added.push({ ...uploaded, alt: "", category, kind });
        } catch (error) {
          failed.push(error instanceof Error ? error.message : file.name);
        }
      }
      update((m) => ({ ...m, gallery: [...m.gallery, ...added] }));
      if (failed.length) return { tone: "error", text: `${failed.length} file gagal diunggah.`, details: failed };
      return {
        tone: "ok",
        text: `${added.length} gambar ditambahkan di akhir galeri. Isi teks alt-nya, lalu simpan draf.`,
      };
    });

  const onHeroImage = (file: File) =>
    run("Mengunggah gambar hero...", async () => {
      const kind = manifest?.hero.image?.kind ?? "concept";
      const uploaded = await uploadImage(file, {
        name: fileBaseName(file.name, `hero-${kindSuffix[kind]}`),
        maxWidth: 1200,
        maxHeight: 1200,
      });
      update((m) => ({
        ...m,
        hero: {
          ...m.hero,
          image: m.hero.image ? { ...m.hero.image, ...uploaded } : { ...uploaded, alt: "", category: "armor", kind },
        },
      }));
      return { tone: "ok", text: "Gambar hero diganti. Periksa teks alt-nya, lalu simpan draf." };
    });

  const onHeroVideo = (file: File) =>
    run("Mengunggah video...", async () => {
      const kind = manifest?.hero.image?.kind ?? "concept";
      const src = await uploadVideo(file, fileBaseName(file.name, `hero-${kindSuffix[kind]}`));
      update((m) => ({ ...m, hero: { ...m.hero, videoSrc: src } }));
      return { tone: "ok", text: "Video hero diganti. Pastikan gambar hero cocok sebagai poster videonya." };
    });

  const onLogo = (file: File) =>
    run("Mengunggah logo...", async () => {
      const uploaded = await uploadImage(file, { name: "logo", maxWidth: 192, maxHeight: 192 });
      update((m) => ({ ...m, logo: uploaded }));
      return { tone: "ok", text: "Logo diganti. Simpan draf lalu terbitkan." };
    });

  if (loadError) {
    return (
      <main className="mx-auto max-w-reading px-5 py-16">
        <h1 className="font-heading text-section font-bold">Admin media</h1>
        <p role="alert" className="mt-4 text-[#b42318]">
          {loadError}
        </p>
        <button type="button" className={`${smallButton} mt-6`} onClick={() => window.location.reload()}>
          Muat ulang
        </button>
      </main>
    );
  }

  if (!manifest) {
    return (
      <main className="mx-auto max-w-reading px-5 py-16">
        <p className="text-muted">Memuat data...</p>
      </main>
    );
  }

  const status = unsaved
    ? "Ada perubahan yang belum disimpan."
    : unpublished
      ? "Draf tersimpan, belum diterbitkan. Situs masih menampilkan versi lama."
      : "Semua perubahan sudah terbit.";

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border-soft bg-surface">
        <div className="mx-auto flex max-w-content flex-wrap items-center gap-3 px-5 py-3 md:px-7">
          <div className="mr-auto min-w-0">
            <h1 className="font-heading text-card font-bold">Admin media</h1>
            <p className="text-caption text-muted" aria-live="polite">
              {busy || status}
            </p>
          </div>
          <button type="button" onClick={onSave} disabled={Boolean(busy) || !unsaved} className={smallButton}>
            Simpan draf
          </button>
          <button
            type="button"
            onClick={onPublish}
            disabled={Boolean(busy) || (!unsaved && !unpublished)}
            className={`${buttonBase} ${buttonVariants.primary} min-h-11 px-4 text-caption-lg disabled:cursor-not-allowed disabled:opacity-50 md:px-5`}
          >
            Terbitkan
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-content space-y-6 px-5 py-6 md:px-7 md:py-8">
        {notice ? (
          <div
            ref={noticeRef}
            tabIndex={-1}
            role={notice.tone === "error" ? "alert" : "status"}
            className={`rounded-card border px-4 py-3 text-caption-lg ${
              notice.tone === "error" ? "border-[#b42318] bg-[#fef3f2] text-[#b42318]" : "border-primary bg-white text-ink"
            }`}
          >
            <p className="font-semibold">{notice.text}</p>
            {notice.details?.length ? (
              <ul className="mt-1 list-disc pl-5">
                {notice.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        {!deployHookConfigured ? (
          <p className="rounded-card border border-accent bg-white px-4 py-3 text-caption-lg text-ink">
            DEPLOY_HOOK_URL belum diisi. Setelah menekan Terbitkan, situs baru berubah pada build berikutnya.
          </p>
        ) : null}

        <section aria-labelledby="hero-heading" className={panelClass}>
          <h2 id="hero-heading" className="font-heading text-card font-bold md:text-card-lg">
            Hero
          </h2>
          <p className="mt-1 text-caption-lg text-muted">
            Gambar utama di bagian atas beranda. Kalau ada video, gambar ini menjadi posternya dan dimuat paling awal.
          </p>
          <div className="mt-5 grid gap-6 md:grid-cols-[280px_1fr]">
            <div className="space-y-3">
              {manifest.hero.image ? (
                <Preview image={manifest.hero.image} />
              ) : (
                <EmptyBox label="Belum ada gambar hero" />
              )}
              <FileButton label="Ganti gambar hero" accept={IMAGE_ACCEPT} disabled={Boolean(busy)} onFiles={(f) => onHeroImage(f[0])} />
              {manifest.hero.image ? (
                <button
                  type="button"
                  className={`${dangerButton} w-full`}
                  disabled={Boolean(busy)}
                  onClick={() => update((m) => ({ ...m, hero: { image: null, videoSrc: null } }))}
                >
                  Hapus hero
                </button>
              ) : null}
            </div>
            <div className="space-y-4">
              {manifest.hero.image ? (
                <ImageFields
                  idPrefix="hero"
                  image={manifest.hero.image}
                  onChange={(patch) =>
                    update((m) => ({ ...m, hero: { ...m.hero, image: m.hero.image ? { ...m.hero.image, ...patch } : null } }))
                  }
                />
              ) : null}
              <div className="rounded-card border border-border-soft p-4">
                <p className="text-caption-lg font-semibold">Video hero (opsional)</p>
                <p className="mt-1 text-caption text-muted">
                  {manifest.hero.videoSrc ? `Terpasang: ${manifest.hero.videoSrc.split("/").pop()}` : "Tidak ada video."} MP4, tanpa
                  suara, maksimal 20 MB. Usahakan di bawah 2 MB supaya cepat di HP.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <FileButton
                    label={manifest.hero.videoSrc ? "Ganti video" : "Pasang video"}
                    accept={VIDEO_ACCEPT}
                    disabled={Boolean(busy) || !manifest.hero.image}
                    onFiles={(f) => onHeroVideo(f[0])}
                  />
                  {manifest.hero.videoSrc ? (
                    <button
                      type="button"
                      className={dangerButton}
                      disabled={Boolean(busy)}
                      onClick={() => update((m) => ({ ...m, hero: { ...m.hero, videoSrc: null } }))}
                    >
                      Lepas video
                    </button>
                  ) : null}
                </div>
                {!manifest.hero.image ? <p className="mt-2 text-caption text-muted">Pasang gambar hero dulu.</p> : null}
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="gallery-heading" className={panelClass}>
          <h2 id="gallery-heading" className="font-heading text-card font-bold md:text-card-lg">
            Galeri ({manifest.gallery.length}/{GALLERY_MAX})
          </h2>
          <p className="mt-1 text-caption-lg text-muted">
            Di situs, foto asli selalu tampil lebih dulu daripada ilustrasi. Urutan di bawah berlaku di dalam tiap jenis.
            Jangan memakai gambar atau nama karakter berhak cipta.
          </p>

          <AddImages disabled={Boolean(busy) || manifest.gallery.length >= GALLERY_MAX} onAdd={onAddImages} />

          {manifest.gallery.length === 0 ? (
            <p className="mt-6 text-muted">Galeri kosong. Situs akan menampilkan kotak gambar kosong per kategori.</p>
          ) : (
            <ol className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {manifest.gallery.map((image, index) => (
                <li key={image.src} className="rounded-card border border-border-soft p-3">
                  <Preview image={image} />
                  <div className="mt-3 space-y-3">
                    <ImageFields
                      idPrefix={`g${index}`}
                      image={image}
                      onChange={(patch) => updateGallery(index, patch)}
                      withCategory
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className={smallButton}
                        disabled={Boolean(busy) || index === 0}
                        onClick={() => update((m) => ({ ...m, gallery: move(m.gallery, index, index - 1) }))}
                        aria-label={`Geser gambar ${index + 1} ke atas`}
                      >
                        ↑ Naik
                      </button>
                      <button
                        type="button"
                        className={smallButton}
                        disabled={Boolean(busy) || index === manifest.gallery.length - 1}
                        onClick={() => update((m) => ({ ...m, gallery: move(m.gallery, index, index + 1) }))}
                        aria-label={`Geser gambar ${index + 1} ke bawah`}
                      >
                        ↓ Turun
                      </button>
                      <button
                        type="button"
                        className={`${dangerButton} ml-auto`}
                        disabled={Boolean(busy)}
                        onClick={() => update((m) => ({ ...m, gallery: m.gallery.filter((_, i) => i !== index) }))}
                        aria-label={`Hapus gambar ${index + 1} dari galeri`}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section aria-labelledby="logo-heading" className={panelClass}>
          <h2 id="logo-heading" className="font-heading text-card font-bold md:text-card-lg">
            Logo
          </h2>
          <p className="mt-1 text-caption-lg text-muted">
            Logo kecil di header. Pakai gambar persegi. Ikon tab browser dan logo di hasil pencarian Google diatur terpisah di
            repo (src/app/icon.png dan public/logo.png).
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Image
              src={manifest.logo.src}
              alt="Logo saat ini"
              width={64}
              height={64}
              className="size-16 rounded-chip border border-border-soft"
            />
            <FileButton label="Ganti logo" accept={IMAGE_ACCEPT} disabled={Boolean(busy)} onFiles={(f) => onLogo(f[0])} />
          </div>
        </section>

        <section aria-labelledby="tools-heading" className={panelClass}>
          <h2 id="tools-heading" className="font-heading text-card font-bold md:text-card-lg">
            Lainnya
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" className={smallButton} disabled={Boolean(busy)} onClick={onCleanup}>
              Bersihkan file tidak terpakai
            </button>
            <button type="button" className={smallButton} onClick={onLogout}>
              Keluar
            </button>
          </div>
        </section>
      </main>
    </>
  );
}

function Preview({ image }: { image: GalleryImage }) {
  return (
    <figure className="relative aspect-[4/5] overflow-hidden rounded-media border border-border bg-bg">
      <Image
        src={image.src}
        alt={image.alt ? imageAlt(image) : "Pratinjau gambar"}
        width={image.width}
        height={image.height}
        className="h-full w-full object-cover"
      />
      <ImageBadge kind={image.kind} className="absolute left-3 top-3" />
    </figure>
  );
}

function EmptyBox({ label }: { label: string }) {
  return (
    <div className="flex aspect-[4/5] items-center justify-center rounded-media border-[1.5px] border-dashed border-placeholder bg-bg p-4 text-center text-caption-lg text-muted">
      {label}
    </div>
  );
}

function ImageFields({
  idPrefix,
  image,
  onChange,
  withCategory = false,
}: {
  idPrefix: string;
  image: GalleryImage;
  onChange: (patch: Partial<GalleryImage>) => void;
  withCategory?: boolean;
}) {
  const length = image.alt.trim().length;
  const altInvalid = length < ALT_MIN || length > ALT_MAX || /[\u2014\u2013]/.test(image.alt);
  return (
    <>
      <div>
        <label htmlFor={`${idPrefix}-alt`} className={labelClass}>
          Teks alt (isi gambar)
        </label>
        <textarea
          id={`${idPrefix}-alt`}
          value={image.alt}
          rows={3}
          maxLength={ALT_MAX + 20}
          aria-invalid={altInvalid}
          aria-describedby={`${idPrefix}-alt-hint`}
          onChange={(event) => onChange({ alt: event.target.value })}
          placeholder="Contoh: Armor ksatria biru dengan jubah putih, di manekin"
          className={`${fieldClass} min-h-24 ${altInvalid ? "border-[#b42318]" : ""}`}
        />
        <p id={`${idPrefix}-alt-hint`} className="mt-1 text-caption text-muted">
          {length}/{ALT_MAX}. Jelaskan apa yang terlihat.
          {image.kind === "concept" ? " Awalan \"Ilustrasi konsep\" ditambahkan otomatis." : ""}
        </p>
      </div>
      <fieldset>
        <legend className={labelClass}>Jenis gambar</legend>
        <div className="flex flex-col gap-1">
          {(["concept", "real"] as const).map((kind) => (
            <label key={kind} className="flex min-h-11 cursor-pointer items-center gap-2 text-caption-lg">
              <input
                type="radio"
                name={`${idPrefix}-kind`}
                checked={image.kind === kind}
                onChange={() => onChange({ kind })}
                className="size-5 accent-primary"
              />
              {kindLabels[kind]}
            </label>
          ))}
        </div>
      </fieldset>
      {withCategory ? (
        <div>
          <label htmlFor={`${idPrefix}-category`} className={labelClass}>
            Kategori
          </label>
          <select
            id={`${idPrefix}-category`}
            value={image.category}
            onChange={(event) => onChange({ category: event.target.value as ServiceKey })}
            className={fieldClass}
          >
            {SERVICE_KEYS.map((key) => (
              <option key={key} value={key}>
                {categoryLabels[key]}
              </option>
            ))}
          </select>
        </div>
      ) : null}
    </>
  );
}

function FileButton({
  label,
  accept,
  multiple = false,
  disabled,
  onFiles,
}: {
  label: string;
  accept: string;
  multiple?: boolean;
  disabled: boolean;
  onFiles: (files: FileList) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <button type="button" className={`${smallButton} w-full sm:w-auto`} disabled={disabled} onClick={() => ref.current?.click()}>
        {label}
      </button>
      <input
        ref={ref}
        type="file"
        accept={accept}
        multiple={multiple}
        hidden
        onChange={(event) => {
          if (event.target.files?.length) onFiles(event.target.files);
          event.target.value = "";
        }}
      />
    </>
  );
}

function AddImages({
  disabled,
  onAdd,
}: {
  disabled: boolean;
  onAdd: (files: FileList, kind: ImageKind, category: ServiceKey) => void;
}) {
  const [kind, setKind] = useState<ImageKind>("concept");
  const [category, setCategory] = useState<ServiceKey>("kain");
  return (
    <div className="mt-5 rounded-card border border-border-soft bg-bg p-4">
      <p className="text-caption-lg font-semibold">Tambah gambar</p>
      <p className="mt-1 text-caption text-muted">
        JPG, PNG, WebP, atau AVIF. Otomatis diubah ke WebP dan diperkecil. Bisa pilih beberapa file sekaligus.
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div>
          <label htmlFor="add-kind" className={labelClass}>
            Jenis
          </label>
          <select id="add-kind" value={kind} onChange={(e) => setKind(e.target.value as ImageKind)} className={fieldClass}>
            <option value="concept">{kindLabels.concept}</option>
            <option value="real">{kindLabels.real}</option>
          </select>
        </div>
        <div>
          <label htmlFor="add-category" className={labelClass}>
            Kategori
          </label>
          <select
            id="add-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as ServiceKey)}
            className={fieldClass}
          >
            {SERVICE_KEYS.map((key) => (
              <option key={key} value={key}>
                {categoryLabels[key]}
              </option>
            ))}
          </select>
        </div>
        <FileButton
          label="Pilih file"
          accept={IMAGE_ACCEPT}
          multiple
          disabled={disabled}
          onFiles={(files) => onAdd(files, kind, category)}
        />
      </div>
    </div>
  );
}
