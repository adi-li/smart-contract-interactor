import type { AppProps } from 'next/app';
import { MetaMaskProvider } from '@/vendors/metamask-react';
import '@/styles/index.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MetaMaskProvider>
      <Component {...pageProps} />
    </MetaMaskProvider>
  );
}

export default MyApp;
