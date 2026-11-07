import "server-only";

import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { usersTable } from "@/lib/schema";

const scrypt = promisify(scryptCallback);
const USER_SESSION_COOKIE = "cb_user_session";
const ADMIN_SESSION_COOKIE = "cb_admin_session";
const REGISTRATION_SESSION_COOKIE = "cb_registration_session";

function getSessionSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must contain at least 32 characters.");
  }
  return secret;
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt$${salt}$${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [algorithm, salt, hashHex] = storedHash.split("$");
  if (algorithm !== "scrypt" || !salt || !hashHex || !/^[a-f0-9]{128}$/i.test(hashHex)) {
    return false;
  }

  const expected = Buffer.from(hashHex, "hex");
  const actual = (await scrypt(password, salt, expected.length)) as Buffer;
  return timingSafeEqual(actual, expected);
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function encodeSession(subject: string, expiresAt: number) {
  const payload = Buffer.from(JSON.stringify({ sub: subject, exp: expiresAt })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function decodeSession(token: string | undefined) {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = Buffer.from(sign(payload));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      sub?: unknown;
      exp?: unknown;
    };
    if (typeof session.sub !== "string" || typeof session.exp !== "number" || session.exp <= Date.now()) {
      return null;
    }
    return session.sub;
  } catch {
    return null;
  }
}

async function setSession(cookieName: string, subject: string, maxAge: number) {
  const expiresAt = Date.now() + maxAge * 1000;
  (await cookies()).set(cookieName, encodeSession(subject, expiresAt), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export async function createUserSession(userId: string) {
  await setSession(USER_SESSION_COOKIE, userId, 60 * 60 * 24 * 7);
}

export async function createAdminSession() {
  await setSession(ADMIN_SESSION_COOKIE, "admin", 60 * 60 * 24);
}

export async function createRegistrationSession(email: string) {
  await setSession(REGISTRATION_SESSION_COOKIE, email, 60 * 30);
}

export async function getRegistrationSessionEmail() {
  return decodeSession((await cookies()).get(REGISTRATION_SESSION_COOKIE)?.value);
}

export async function clearUserSession() {
  (await cookies()).delete(USER_SESSION_COOKIE);
}

export async function clearRegistrationSession() {
  (await cookies()).delete(REGISTRATION_SESSION_COOKIE);
}

export async function clearAdminSession() {
  (await cookies()).delete(ADMIN_SESSION_COOKIE);
}

export async function isAdminAuthenticated() {
  return decodeSession((await cookies()).get(ADMIN_SESSION_COOKIE)?.value) === "admin";
}

export async function getApprovedUser() {
  const userId = decodeSession((await cookies()).get(USER_SESSION_COOKIE)?.value);
  if (!userId) return null;

  const [user] = await db
    .select({ id: usersTable.id, status: usersTable.status })
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);

  return user?.status === "approved" ? user : null;
}

export function hashOtp(email: string, otp: string) {
  return createHmac("sha256", getSessionSecret()).update(`${email}:${otp}`).digest("hex");
}

export function verifyOtpHash(email: string, otp: string, expectedHash: string) {
  if (!/^[a-f0-9]{64}$/i.test(expectedHash)) return false;
  const expected = Buffer.from(expectedHash, "hex");
  const actual = Buffer.from(hashOtp(email, otp), "hex");
  return timingSafeEqual(actual, expected);
}

export function secureCompare(value: string, expectedValue: string) {
  const actual = Buffer.from(value);
  const expected = Buffer.from(expectedValue);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
