import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Global } from "@emotion/react";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { GlobalStyles } from "./global.styles";
import { Header } from "./components/Header";
import { getAccessToken, getUserSession } from "./utils/session.server";
import Loader from "./components/Loader";
import { adminAuth } from "./utils/db.server";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export const loader: LoaderFunction = async ({ request }) => {
  const currentUser = await getUserSession(request);

  return {
    currentUser: currentUser?.name,
  };
};

export default function App() {
  return (
    <Document>
      <Global styles={GlobalStyles} />
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

function Document({ children }: any) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        {typeof document === "undefined" ? "__STYLES__" : null}
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

export function Layout({ children }: any) {
  const data = useLoaderData();
  const transition = useTransition();

  console.log(data);

  return (
    /* 
    It is possible to define the Default Layout here. 
    In that way, all the pages are going to be in the same format.
    Examples of components to be added here: Toolbar/Navbar, Footer and etc...
    */
    <>
      <Header currentUser={data?.currentUser} />
      {transition.state === "loading" ? <Loader /> : null}
      <main>{children}</main>
    </>
  );
}
