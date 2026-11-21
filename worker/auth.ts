/**
 * Login admin dengan satu akun dari variabel lingkungan (ADMIN_EMAIL, ADMIN_PASSWORD).
 *
 * Sesi disimpan di cookie bertanda tangan HMAC, tanpa database. Kunci tanda tangan
 * diturunkan dari email, kata sandi, dan token Blob: mengganti kata sandi otomatis
 * membuat semua sesi lama tidak berlaku.
 */

const COOKIE_NAME = "__Host-admin_session";
const SESSION_SECONDS = 7 * 24 * 60 * 60;

type AuthEnv = { ADMIN_EMAIL?: string; ADMIN_PASSWORD?: string; BLOB_READ_WRITE_TOKEN?: string };

const encoder = new TextEncoder();

function toBase64Url(bytes: ArrayBuffer): string {
  let binary = "";
  for (const byte of new Uint8Array(bytes)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sha256(value: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
}

/** Perbandingan waktu-konstan untuk dua nilai dengan panjang sama. */
function equalBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function signingKey(env: AuthEnv): Promise<CryptoKey> {
  const secret = await sha256(`${env.ADMIN_EMAIL}\n${env.ADMIN_PASSWORD}\n${env.BLOB_READ_WRITE_TOKEN}`);
  return crypto.subtle.importKey("raw", secret, { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

async function sign(env: AuthEnv, payload: string): Promise<string> {
  return toBase64Url(await crypto.subtle.sign("HMAC", await signingKey(env), encoder.encode(payload)));
}

export async function credentialsMatch(env: AuthEnv, email: string, password: string): Promise<boolean> {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) return false;
  // Hash dulu supaya panjang sama, lalu bandingkan waktu-konstan. Keduanya selalu dicek.
  const [a, b, c, d] = await Promise.all([
    sha256(email.trim().toLowerCase()),
    sha256(env.ADMIN_EMAIL.trim().toLowerCase()),
    sha256(password),
    sha256(env.ADMIN_PASSWORD),
  ]);
  const emailOk = equalBytes(a, b);
  const passwordOk = equalBytes(c, d);
  return emailOk && passwordOk;
}

export async function createSessionCookie(env: AuthEnv): Promise<string> {
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const value = `${expires}.${await sign(env, String(expires))}`;
  return `${COOKIE_NAME}=${value}; Path=/; Max-Age=${SESSION_SECONDS}; HttpOnly; Secure; SameSite=Strict`;
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`;
}

export async function hasValidSession(request: Request, env: AuthEnv): Promise<boolean> {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.split(/;\s*/).find((part) => part.startsWith(`${COOKIE_NAME}=`));
  if (!match) return false;
  const [expires, signature] = match.slice(COOKIE_NAME.length + 1).split(".");
  if (!expires || !signature || !/^\d+$/.test(expires)) return false;
  if (Number(expires) < Date.now() / 1000) return false;
  const expected = await sign(env, expires);
  return equalBytes(encoder.encode(signature), encoder.encode(expected));
}
