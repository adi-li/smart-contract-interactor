import useWeb3 from '@/hooks/useWeb3';
import type { Contract } from 'web3-eth-contract';
import type { AbiItem } from 'web3-utils';
import AbiItemRow from './AbiItemRow';

export interface ContractInteractorProps {
  contract: Contract;
  address: string;
  abi: AbiItem[];
}

export default function ContractInteractor({
  contract,
  address,
  abi,
}: ContractInteractorProps) {
  const { account, connect } = useWeb3();
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="items-center grid grid-cols-1 gap-2 lg:grid-cols-3">
          <h2 className="font-bold">Contract address:</h2>
          <span className="block px-3 py-2 font-mono border rounded-md col-span-2">
            {address}
          </span>
        </div>
        <div className="items-center grid grid-cols-1 gap-2 lg:grid-cols-3">
          <h2 className="font-bold">Wallet address:</h2>
          <div className="col-span-2">
            {account ? (
              <span className="block w-full px-3 py-2 font-mono border rounded-md">
                {account}
              </span>
            ) : (
              <button
                className="w-full px-3 py-2 border rounded-md hover:bg-gray-200"
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
