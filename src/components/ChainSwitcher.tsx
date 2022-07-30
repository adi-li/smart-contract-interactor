import useWeb3 from '@/hooks/useWeb3';
import noop from '@/utils/noop';
import { Combobox, Transition } from '@headlessui/react';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { getInputClass } from './BaseInput';

export interface Chain {
  name: string;
  chainId: number;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpc: string[];
  explorers?: { url: string }[];
}

const DEFAULT_CHAINS: Chain[] = [
  {
    name: 'Ethereum Mainnet',
    chainId: 1,
    rpc: [],
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
];

export default function ChainSwitcher() {
  const { web3, chainId: chainIdHex } = useWeb3();
  const [chains, setChains] = useState(DEFAULT_CHAINS);
  const [query, setQuery] = useState('');
  const chainId = parseInt(chainIdHex ?? '0x0', 16);
  const selectedChain = useMemo(
    () => chains.find((chain) => chainId === chain.chainId),
    [chains, chainId],
  );
  const filteredChains = useMemo(() => {
    const normalizedQuery = query.toLowerCase().replace(/\s+/g, '');
    return !normalizedQuery
      ? chains
      : chains.filter(
          ({ chainId, name }) =>
            chainId.toString().includes(query) ||
            name.toLowerCase().replace(/\s+/g, '').includes(normalizedQuery),
        );
  }, [query, chains]);

  const onSelectNetwork = useCallback(
    (targetChain: Chain | null) => {
      if (!web3 || chainId === targetChain?.chainId || !targetChain) return;
      const chainIdHex = `0x${targetChain.chainId.toString(16)}`;
      web3
        .send('wallet_switchEthereumChain', [{ chainId: chainIdHex }])
        .then(() => window.location.reload())
        .catch((error) => {
          if (error.code === 4902) {
            web3
              .send('wallet_addEthereumChain', [
                {
                  chainId: chainIdHex,
                  chainName: targetChain.name,
                  rpcUrls: targetChain.rpc,
                  nativeCurrency: targetChain.nativeCurrency,
                  blockExplorerUrls: targetChain.explorers?.map(
                    ({ url }) => url,
                  ),
                },
              ])
              .then(() => window.location.reload())
              .catch(noop);
          }
        });
    },
    [web3, chainId],
  );

  useEffect(() => {
    fetch('https://chainid.network/chains.json')
      .then((res) => res.json())
      .then(setChains)
      .catch(noop);
  }, []);

  return (
    <label className="block w-full">
      <h3 className="text-gray-700">Current Chain</h3>
      <Combobox value={selectedChain} onChange={onSelectNetwork}>
        <div className="relative">
          <div className={getInputClass('form-input flex')}>
            <Combobox.Input
              className="grow p-0 disabled:text-gray-400 disabled:bg-gray-200 border-none focus:border-none focus:outline-none focus:ring-0"
              displayValue={(chain: Chain | undefined) =>
                chain ? `${chain.chainId}: ${chain.name}` : ''
              }
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="hover:text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="overflow-auto absolute py-1 mt-1 w-full max-h-60 text-base bg-white rounded-md focus:outline-none ring-1 ring-black/5 shadow-lg sm:text-sm">
              {filteredChains.length === 0 && query !== '' ? (
                <div className="relative py-2 px-4 text-gray-700 cursor-default select-none">
                  Nothing found.
                </div>
              ) : (
                filteredChains.map((chain) => (
                  <Combobox.Option
                    key={chain.chainId}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 px-3 text-gray-900 ${
                        active ? 'bg-indigo-100' : ''
                      }`
                    }
                    value={chain}
                  >
                    {({ selected }) => (
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {chain.chainId}: {chain.name}
                      </span>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </label>
  );
}
