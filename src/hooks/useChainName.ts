import ChainContext from '@/context/ChainsContext';
import { useContext, useMemo } from 'react';

export default function useChainName(chainId: string | null) {
  const chains = useContext(ChainContext);
  return useMemo(() => {
    const chainNum = parseInt(chainId || '0', 16);
    return (
      (chains.length > 0 &&
        chainNum != null &&
        chains.find((chain) => chain.chainId === chainNum)?.name) ||
      chainId ||
      'N/A'
    );
  }, [chains, chainId]);
}
