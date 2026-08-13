"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE_NAME,
  createSessionExpirationDate,
  signSessionToken,
  verifySessionToken,
  DEFAULT_AUTH_URL,
  type Session,
} from "./sessionTokens";

export type { Session };

export async function createSession(payload: Session) {
  const expiredAt = createSessionExpirationDate();
  const token = await signSessionToken(payload);

  const cookie = await cookies();
  cookie.set(SESSION_COOKIE_NAME, token, {
    expires: expiredAt,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  const cookie = await cookies();
  const token = cookie.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await verifySessionToken(token);
  if (!session) {
    console.error("Error verifying session: invalid or expired token");
    redirect(DEFAULT_AUTH_URL);
  }
  return session;
}

export async function destroySession() {
  const cookie = await cookies();
  cookie.delete(SESSION_COOKIE_NAME);
}
