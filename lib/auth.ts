import crypto from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "about_me_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours

function getSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSCODE ||
    "about-me-local-dev-secret"
  );
}

function getExpectedPasscode(): string {
  return process.env.ADMIN_PASSCODE || "mahdi2026";
}

function signPayload(payload: string): string {
  return crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function verifyPasscode(input: string): boolean {
  const expected = getExpectedPasscode();
  return safeEqual(input.trim(), expected);
}

export function createSessionToken(): string {
  const issuedAt = Date.now().toString();
  const nonce = crypto.randomBytes(12).toString("hex");
  const payload = `${issuedAt}.${nonce}`;
  const signature = signPayload(payload);
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [issuedAtStr, nonce, providedSig] = parts;
  const issuedAt = Number(issuedAtStr);
  if (!Number.isFinite(issuedAt) || !nonce || !providedSig) return false;
  if (Date.now() - issuedAt > SESSION_MAX_AGE_SECONDS * 1000) return false;
  const expectedSig = signPayload(`${issuedAtStr}.${nonce}`);
  return safeEqual(providedSig, expectedSig);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export function isSecureRequest(request?: Request): boolean {
  if (!request) return process.env.NODE_ENV === "production";
  const forwardedProto = request.headers.get("x-forwarded-proto");
  if (forwardedProto) {
    return forwardedProto.split(",")[0].trim() === "https";
  }
  try {
    return new URL(request.url).protocol === "https:";
  } catch {
    return false;
  }
}

export function buildAdminCookieOptions(request?: Request) {
  return {
    name: ADMIN_COOKIE_NAME,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isSecureRequest(request),
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}
