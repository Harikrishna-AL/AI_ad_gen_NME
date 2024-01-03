// @ts-nocheck


import { AppContextProvider } from "@/context/app.context";
import Layout from "@/layouts/app.layout";
import "@/styles/globals.css";
import ThemeProvider, { ThemedGlobalStyle } from "@/theme";
import type { AppProps } from "next/app";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import "../styles/globals.css";

export default function App({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
  if (typeof window === "undefined") React.useLayoutEffect = () => {};

  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <AppContextProvider>
        <ThemeProvider>
          <ThemedGlobalStyle />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </AppContextProvider>
    </SessionContextProvider>
  );
}
