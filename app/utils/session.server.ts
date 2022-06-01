import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { getSessionToken, signOutFirebase, adminAuth } from "~/utils/db.server";
require("dotenv").config();

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

async function createUserSession(idToken: string, redirectTo: string) {
  const session = await storage.getSession();
  const token = await getSessionToken(idToken);
  session.set("token", token);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

async function destroySession(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));

  return redirect("/home", {
    headers: { "Set-Cookie": await storage.destroySession(session) },
  });
}

async function signOut(request: Request) {
  await signOutFirebase();
  return await destroySession(request);
}

async function getUserSession(request: Request) {
  const cookieSession = await storage.getSession(request.headers.get("Cookie"));
  const token = cookieSession.get("token");
  if (!token) return null;

  try {
    const tokenUser = await adminAuth.verifySessionCookie(token, true);
    return tokenUser;
  } catch (error) {
    return null;
  }
}

async function getAccessToken(request: Request) {
  const session = await getUserSession(request);
  console.log(session);
  const token = session?.get("token");

  if (!token || typeof token !== "string") return null;
  return token;
}

export { createUserSession, signOut, getUserSession, getAccessToken };
