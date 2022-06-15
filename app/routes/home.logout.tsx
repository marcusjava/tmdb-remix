import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { sessionLogout } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  await sessionLogout(request);
  return redirect("/home");
};

export const action: ActionFunction = async ({ request }) => {
  return sessionLogout(request);
};
