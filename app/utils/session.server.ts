import { createCookieSessionStorage, json, redirect } from "@remix-run/node";
import * as admin from "firebase-admin";

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
    maxAge: 60 * 60 * 24 * 30,
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
export const isSessionValid = async (request: Request, redirectTo: string) => {
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
    throw new Error(error.message);
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

export async function getAccessToken(request: Request) {
  const session = await getUserSession(request);
  console.log(session);
  const token = session?.get("idToken");

  if (!token || typeof token !== "string") return null;
  return token;
}

/**
 * set the cookie on the header and redirect to the specified route
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
  redirectTo: string
) => {
  const token = await admin.auth().verifyIdToken(idToken);
  console.log("idtoken verified", token);

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
      console.log(error);
      // Session cookie is unavailable or invalid. Force user to login.
      return { error: error?.message };
    });
};
/* switch (error.code) {
  case "auth/wrong-password": {
    return badRequest({
      fields: { email, password },
      fieldErrors: { password: "Senha incorreta" },
    });
  }
  case "auth/invalid-email": {
    return badRequest({
      fields: { email, password },
      fieldErrors: { email: "Email invalido" },
    });
  }

  case "auth/user-disabled": {
    return badRequest({
      fields: { email, password },
      fieldErrors: { email: "Usuario desabilitado" },
    });
  }
  case "auth/user-not-found": {
    return badRequest({
      fields: { email, password },
      fieldErrors: { email: "Usuario não encontrado" },
    });
  }
  default:
    throw new Error(`An error occurred ${error.message}`);
} */
