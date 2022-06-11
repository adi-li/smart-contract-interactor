import type { Contract } from 'ethers';
import AbiItemRow from './AbiItemRow';

export interface ContractInteractorProps {
  contract: Contract;
}

export default function ContractInteractor({
  contract,
}: ContractInteractorProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>* state mutating function</div>
      {Object.keys(contract.interface.functions).map((abiName) => (
        <AbiItemRow key={abiName} contract={contract} functionKey={abiName} />
      ))}
    </div>
  );
}
