import "@/styles/globals.css";
import { SessionProvider } from 'next-auth/react';
import Layout from "@/components/Layout";
import {AppContextProvider} from "@/Components/AppContextProvider"; // همین رو بساز

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <AppContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppContextProvider>
    </SessionProvider>
  );
}
