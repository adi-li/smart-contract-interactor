import { useMetaMask } from 'metamask-react';
import { useMemo } from 'react';
import Web3 from 'web3';
import { toChecksumAddress } from 'web3-utils';

let cachedWeb3: Web3 | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getWeb3 = (ethereum: any) => {
  if (!cachedWeb3) {
    cachedWeb3 = new Web3(ethereum);
  }
  return cachedWeb3;
};

export default function useWeb3() {
  const context = useMetaMask();
  const { ethereum, account: address } = context;
  const web3 = useMemo(() => {
    if (!ethereum) return null;
    return getWeb3(ethereum);
  }, [ethereum]);
  const account = useMemo(
    () => address && toChecksumAddress(address),
    [address],
  );

  return { ...context, web3, account };
}
