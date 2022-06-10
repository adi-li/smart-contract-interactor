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
      <div>* state mutate function</div>
      {abi
        .filter((abiItem) => abiItem.type === 'function' && abiItem.name)
        .map((abiItem) => {
          const key = `${abiItem.name}(${abiItem.inputs
            ?.map((input) => input.type)
            .join(',')})`;
          return <AbiItemRow key={key} contract={contract} abiItem={abiItem} />;
        })}
    </div>
  );
}
