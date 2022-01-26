import ChainContext, { Chain } from '@/context/ChainsContext';
import noop from '@/utils/noop';
import { ReactNode, useEffect, useState } from 'react';

export default function ChainProvider({ children }: { children: ReactNode }) {
  const [chains, setChains] = useState<Chain[]>([]);
  useEffect(() => {
    fetch('https://chainid.network/chains.json')
      .then((res) => res.json())
      .then(setChains)
      .catch(noop);
  }, []);
  return (
    <ChainContext.Provider value={chains}>{children}</ChainContext.Provider>
  );
}
