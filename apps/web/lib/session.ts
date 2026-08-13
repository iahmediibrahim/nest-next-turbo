"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  DEFAULT_AUTH_URL,
  SESSION_COOKIE_NAME,
  createSessionExpirationDate,
  signSessionToken,
  verifySessionToken,
  type Session,
} from "./sessionTokens";

export type { Session };

export async function createSession(payload: Session) {
  console.log("createSession", payload);
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

export async function getSessionOrNull(): Promise<Session | null> {
  const cookie = await cookies();
  const token = cookie.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function getSession() {
  const session = await getSessionOrNull();
  if (!session) {
    redirect(DEFAULT_AUTH_URL);
  }
  return session;
}

export async function destroySession() {
  const cookie = await cookies();
  cookie.delete(SESSION_COOKIE_NAME);
}
