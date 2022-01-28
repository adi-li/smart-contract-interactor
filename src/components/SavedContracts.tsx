import { SavedContract } from '@/hooks/useSavedContracts';
import clsx from 'clsx';
import { MouseEventHandler, useCallback } from 'react';
import CogIcon from './CogIcon';
import TrashIcon from './TrashIcon';

export interface SavedContractsProps {
  contracts: SavedContract[];
  highlightContract?: SavedContract;
  onSelect: (contract: SavedContract) => void;
  onUpdate: (contract: SavedContract) => void;
  onRemove: (contract: SavedContract) => void;
}

export default function SavedContracts({
  contracts,
  highlightContract,
  onSelect,
  onUpdate,
  onRemove,
}: SavedContractsProps) {
  const wrappedOnSelect: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault();
      const { index } = event.currentTarget.dataset;
      if (typeof index === 'undefined') return;
      onSelect(contracts[parseInt(index, 10)]);
    },
    [contracts, onSelect],
  );

  const wrappedOnUpdate: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      event.preventDefault();
      const { index } = event.currentTarget.dataset;
      if (typeof index === 'undefined') return;
      onUpdate(contracts[parseInt(index, 10)]);
    },
    [contracts, onUpdate],
  );

  const wrappedOnRemove: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      event.preventDefault();
      const { index } = event.currentTarget.dataset;
      if (typeof index === 'undefined') return;
      onRemove(contracts[parseInt(index, 10)]);
    },
    [contracts, onRemove],
  );

  if (contracts.length === 0) return null;
  return (
    <div>
      <h3 className="mb-2 text-xl font-bold">Saved Contracts</h3>
      <div className="flex flex-wrap gap-4">
        {contracts.map((contract, index) => (
          <div
            tabIndex={0}
            key={contract.address}
            className={clsx(
              'flex gap-2 justify-center py-2 px-4 hover:bg-indigo-100 rounded-md border',
              'focus:border-indigo-300 focus:ring focus:ring-indigo-200/50 cursor-pointer',
              highlightContract?.address === contract.address &&
                'bg-indigo-200',
            )}
            onClick={wrappedOnSelect}
            data-index={index}
          >
            <span>{contract.name}</span>
            <button
              className="hover:text-gray-400"
              onClick={wrappedOnUpdate}
              data-index={index}
            >
              <CogIcon />
            </button>
            <button
              className="hover:text-gray-400"
              onClick={wrappedOnRemove}
              data-index={index}
            >
              <TrashIcon />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
