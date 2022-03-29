import type { Contract } from 'web3-eth-contract';
import type { AbiItem } from 'web3-utils';
import AbiItemRow from './AbiItemRow';

export interface ContractInteractorProps {
  contract: Contract;
  abi: AbiItem[];
}

export default function ContractInteractor({
  contract,
  abi,
}: ContractInteractorProps) {
  return (
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
  );
}
