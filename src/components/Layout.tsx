import type { ReactNode } from 'react';
import Head from 'next/head';
import Footer from './Footer';
import Header from './Header';

export default function Layout({ children }: { children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Head>
        <title>Smart Contract Interactor</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="flex flex-col items-center justify-center flex-1 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
