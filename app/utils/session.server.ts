import { createCookieSessionStorage, json, redirect } from "@remix-run/node";
import * as admin from "firebase-admin";
import { auth } from "./firebase.server";

const serviceAccount = require("../../serviceAccount.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 5 * 1000,
    httpOnly: true,
  },
});

/**
 * checks that the current session is a valid session be getting the token
 * from the session cookie and validating it with firebase
 *
 * @param {*} param0
 * @returns
 */
export const isSessionValid = async (
  request: Request,
  redirectTo: string = "/home"
) => {
  const session = await storage.getSession(request.headers.get("cookie"));
  try {
    // Verify the session cookie. In this case an additional check is added to detect
    // if the user's Firebase session was revoked, user deleted/disabled, etc.
    const decodedClaims = await admin
      .auth()
      .verifySessionCookie(session.get("idToken"), true /** checkRevoked */);
    return { success: true, decodedClaims };
  } catch (error: any) {
    // Session cookie is unavailable or invalid. Force user to login.
    // return { error: error?.message };

    throw redirect(redirectTo, {
      statusText: error?.message,
    });
  }
};

export async function getUserSession(request: Request) {
  const cookieSession = await storage.getSession(request.headers.get("Cookie"));
  const token = cookieSession.get("idToken");

  if (!token) return null;

  try {
    const tokenUser = await admin.auth().verifySessionCookie(token, true);
    return tokenUser;
  } catch (error) {
    return null;
  }
}

export async function getUserInfo(request: Request) {
  const session = await storage.getSession(request.headers.get("cookie"));
  const token = session.get("idToken");

  if (!token) return null;

  const decoded = await admin
    .auth()
    .verifySessionCookie(token, true /** checkRevoked */);

  return admin.auth().getUser(decoded.uid);
}
export async function getAccessToken(request: Request) {
  const token = await getUserSession(request);

  return token;
}

/**
 * set the cookie on the header and redirect to the specified route
 *
 *
 * @param {*} sessionCookie
 * @param {*} redirectTo
 * @returns
 */
const setCookieAndRedirect = async (
  request: Request,
  sessionCookie: string,
  redirectTo = "/"
) => {
  const session = await storage.getSession(request.headers.get("cookie"));
  session.set("idToken", sessionCookie);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
};

/**
 * login the session by verifying the token, if all is good create/set cookie
 * and redirect to the appropriate route
 *
 * @param {*} idToken
 * @param {*} redirectTo
 * @returns
 */
export const sessionLogin = async (
  request: Request,
  idToken: string,
  redirectTo: string,
  displayName?: string
) => {
  const token = await admin.auth().verifyIdToken(idToken);

  return admin
    .auth()
    .createSessionCookie(idToken, {
      expiresIn: 60 * 60 * 24 * 5 * 1000,
    })
    .then(
      (sessionCookie) => {
        // Set cookie policy for session cookie.
        return setCookieAndRedirect(request, sessionCookie, redirectTo);
      },
      (error: any) => {
        throw new Error(error.message);
      }
    );
};

/**
 * revokes the session cookie from the firebase admin instance
 * @param {*} request
 * @returns
 */
export const sessionLogout = async (request: Request) => {
  const session = await storage.getSession(request.headers.get("cookie"));

  // Verify the session cookie. In this case an additional check is added to detect
  // if the user's Firebase session was revoked, user deleted/disabled, etc.
  return admin
    .auth()
    .verifySessionCookie(session.get("idToken"), true /** checkRevoked */)
    .then((decodedClaims) => {
      return admin.auth().revokeRefreshTokens(decodedClaims?.sub);
    })
    .then(async () => {
      return redirect("/home", {
        headers: {
          "Set-Cookie": await storage.destroySession(session),
        },
      });
    })
    .catch((error) => {
      // Session cookie is unavailable or invalid. Force user to login.
      throw new Error(error.message);
    });
};
