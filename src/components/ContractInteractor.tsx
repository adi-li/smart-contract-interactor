import { SavedContract } from '@/hooks/useSavedContracts';
import useWeb3 from '@/hooks/useWeb3';
import type { Contract } from 'web3-eth-contract';
import type { AbiItem } from 'web3-utils';
import AbiItemRow from './AbiItemRow';

export interface ContractInteractorProps {
  contract: Contract;
  savedContract: SavedContract;
  address: string;
  abi: AbiItem[];
}

export default function ContractInteractor({
  contract,
  savedContract,
  address,
  abi,
}: ContractInteractorProps) {
  const { account, connect } = useWeb3();
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

      <div className="flex flex-col gap-4">
        {abi.map((abiItem) => {
          if (abiItem.type !== 'function' || !abiItem.name) {
            return null;
          }
          const key = `${abiItem.name}(${abiItem.inputs
            ?.map((input) => input.type)
            .join(',')})`;
          return <AbiItemRow key={key} contract={contract} abiItem={abiItem} />;
        })}
      </div>
    </div>
  );
}
