"use server";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type Session = {
  user: {
    id: number;
    name: string;
  };
  // accessToken: string;
  // refreshToken: string;
};

// get the session secret key from the environment variables
const sessionSecretKey = process.env.SESSION_SECRET_KEY || "";

// encode the session secret key
const encodedKey = new TextEncoder().encode(sessionSecretKey);

export async function createSession(payload: Session) {
  const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // create a jwt token for the session
  const session = await new SignJWT(payload)
    .setProtectedHeader({
      typ: "JWT",
      alg: "HS256",
    })
    .setIssuedAt(new Date())
    .setExpirationTime(expiredAt)
    .sign(encodedKey);

  // set the session as a http only secure cookie with lax same site
  const cookie = await cookies();
  cookie.set("session", session, {
    expires: expiredAt,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  const cookie = await cookies();

  // get the session value from the cookie
  const session = cookie.get("session")?.value;
  if (!session) return null;

  try {
    // verify the session value with the encoded key
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as Session;
  } catch (error) {
    console.error("Error verifying session:", error);
    redirect("/auth/signin");
  }
}

export async function destroySession() {
  const cookie = await cookies();
  cookie.delete("session");
}
