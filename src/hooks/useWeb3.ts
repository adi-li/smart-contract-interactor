import toChecksumAddress from '@/utils/toChecksumAddress';
import { ethers } from 'ethers';
import { useMetaMask } from 'metamask-react';
import { useMemo } from 'react';

let cachedWeb3: ethers.providers.Web3Provider | undefined;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getWeb3 = (ethereum: any) => {
  if (!cachedWeb3) {
    cachedWeb3 = new ethers.providers.Web3Provider(ethereum, 'any');
    cachedWeb3.on('network', (newNetwork, oldNetwork) => {
      // When a Provider makes its initial connection, it emits a "network"
      // event with a null oldNetwork along with the newNetwork. So, if the
      // oldNetwork exists, it represents a changing network
      if (oldNetwork) {
        window.location.reload();
      }
    });
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
