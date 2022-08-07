import Head from 'next/head';
import type { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';

export default function Layout({ children }: { children?: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Head>
        <title>Ethereum Contract R/W</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="flex w-full flex-1 flex-col items-center justify-center">
        {children}
      </main>
      <Footer />
    </div>
  );
}
