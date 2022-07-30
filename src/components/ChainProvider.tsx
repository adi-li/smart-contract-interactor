import ChainContext, { Chain } from '@/context/ChainsContext';
import noop from '@/utils/noop';
import { ReactNode, useEffect, useState } from 'react';

const DEFAULT_CHAINS: Chain[] = [
  {
    name: 'Ethereum Mainnet',
    chainId: 1,
  },
];

export default function ChainProvider({ children }: { children: ReactNode }) {
  const [chains, setChains] = useState<Chain[]>(DEFAULT_CHAINS);
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
