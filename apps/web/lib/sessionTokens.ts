import { jwtVerify, SignJWT } from "jose";

export type Session = {
  user: {
    id: number;
    name: string;
  };
  accessToken: string;
};

export const SESSION_COOKIE_NAME = "session";

const sessionSecretKey = process.env.SESSION_SECRET_KEY || "";
const encodedKey = new TextEncoder().encode(sessionSecretKey);

export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function createSessionExpirationDate(now: Date = new Date()) {
  return new Date(now.getTime() + SESSION_TTL_MS);
}

export async function signSessionToken(
  payload: Session,
  now: Date = new Date(),
): Promise<string> {
  const expiresAt = createSessionExpirationDate(now);
  return new SignJWT(payload)
    .setProtectedHeader({ typ: "JWT", alg: "HS256" })
    .setIssuedAt(now)
    .setExpirationTime(expiresAt)
    .sign(encodedKey);
}

export async function verifySessionToken(
  token: string | undefined,
): Promise<Session | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as Session;
  } catch {
    return null;
  }
}

export const DEFAULT_AUTH_URL = "/auth/signin";
export const DEFAULT_AFTER_LOGIN_URL = "/dashboard";
export const DEFAULT_PUBLIC_HOME_URL = "/";
