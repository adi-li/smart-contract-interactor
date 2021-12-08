import type { ReactNode } from 'react';
import Head from 'next/head';
import Footer from './Footer';
import Header from './Header';

export default function Layout({ children }: { children?: ReactNode }) {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <Head>
        <title>Smart Contract Interactor</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="flex flex-col flex-1 justify-center items-center w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
