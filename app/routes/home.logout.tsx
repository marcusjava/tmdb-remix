import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { signOut } from "~/utils/session.server";

export const loader: LoaderFunction = () => redirect("/home");

export const action: ActionFunction = async ({ request }) => {
  return signOut(request);
};
