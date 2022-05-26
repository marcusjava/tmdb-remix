import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { auth } from "~/utils/firebase";
import { logout } from "~/utils/session.server";

export const loader: LoaderFunction = () => redirect("/home");

export const action: ActionFunction = async ({ request }) => {
  await auth.signOut();
  return logout(request);
};
