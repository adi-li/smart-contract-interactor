import toChecksumAddress from '@/utils/toChecksumAddress';
import { ethers } from 'ethers';
import { useMetaMask } from 'metamask-react';
import { useMemo } from 'react';

const cachedWeb3: Record<string, ethers.providers.Web3Provider> = {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getWeb3 = (ethereum: any, chainId: string | null) => {
  if (!chainId) return null;
  if (!cachedWeb3[chainId]) {
    cachedWeb3[chainId] = new ethers.providers.Web3Provider(ethereum);
  }
  return cachedWeb3[chainId];
};

export default function useWeb3() {
  const context = useMetaMask();
  const { chainId, ethereum, account: address } = context;

  const web3 = useMemo(() => {
    if (!ethereum) return null;
    return getWeb3(ethereum, chainId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ethereum, chainId]);

  const account = useMemo(
    () => address && toChecksumAddress(address),
    [address],
  );

  return { ...context, web3, account };
}
