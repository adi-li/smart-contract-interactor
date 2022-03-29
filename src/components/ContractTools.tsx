import AbiDecoderContext from '@/context/AbiDecoderContext';
import type { SavedContract } from '@/hooks/useSavedContracts';
import useWeb3 from '@/hooks/useWeb3';
import AbiDecoder from '@/utils/abi-decoder';
import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import type { Contract } from 'web3-eth-contract';
import type { AbiItem } from 'web3-utils';
import CalldataDecoder from './CalldataDecoder';
import ContractInteractor from './ContractInteractor';

export interface ContractToolsProps {
  abi: AbiItem[];
  address: string;
  contract: Contract;
  savedContract: SavedContract;
}

const tabClasses = ({ selected }: { selected?: boolean }) =>
  clsx(
    'py-2.5 w-full text-sm font-medium leading-5 rounded-lg',
    'focus:outline-none focus:ring-2 ring-white/60 ring-offset-2 ring-offset-blue-400',
    selected ? 'bg-indigo-200 shadow' : 'hover:bg-indigo-100',
  );

export default function ContractTools({
  abi,
  address,
  contract,
  savedContract,
}: ContractToolsProps) {
  const { account, connect } = useWeb3();
  const [abiDecoder, setAbiDecoder] = useState(() => new AbiDecoder(abi));

  useEffect(() => {
    setAbiDecoder(new AbiDecoder(abi));
  }, [abi]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        {savedContract.name !== savedContract.address && (
          <h3 className="text-xl font-bold text-center">
            {savedContract.name}
          </h3>
        )}
        <div className="grid grid-cols-1 gap-2 items-center lg:grid-cols-3">
          <h2 className="font-bold">Contract address:</h2>
          <span className="block overflow-hidden col-span-2 py-2 px-3 font-mono text-ellipsis rounded-md border">
            {address}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-2 items-center lg:grid-cols-3">
          <h2 className="font-bold">Wallet address:</h2>
          <div className="col-span-2">
            {account ? (
              <span className="block overflow-hidden py-2 px-3 w-full font-mono text-ellipsis rounded-md border">
                {account}
              </span>
            ) : (
              <button
                className="py-2 px-3 w-full hover:bg-gray-200 rounded-md border"
                onClick={() => connect().catch(console.error)}
              >
                Connect MetaMask
              </button>
            )}
          </div>
        </div>
      </div>
      <AbiDecoderContext.Provider value={abiDecoder}>
        <Tab.Group>
          <Tab.List className="flex p-1 space-x-1 bg-gray-100 rounded-xl">
            <Tab className={tabClasses}>Read/Write</Tab>
            <Tab className={tabClasses}>Calldata decoder</Tab>
            {/* <Tab className={tabClasses}>Log decoder</Tab> */}
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <ContractInteractor contract={contract} abi={abi} />
            </Tab.Panel>
            <Tab.Panel>
              <CalldataDecoder />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </AbiDecoderContext.Provider>
    </div>
  );
}
