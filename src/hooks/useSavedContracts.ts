import AbiDecoder from '@/utils/abi-decoder';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AbiItem } from 'web3-utils';

const KEY = 'eth-contract-gui.saved-contracts';

export interface SavedContract {
  name: string;
  lastUpdatedAt: number;
  address: string;
  abi: AbiItem[];
  abiDecoder: AbiDecoder;
}

export type RawSavedContract = Omit<SavedContract, 'abiDecoder'>;

export type NewContract = Pick<SavedContract, 'address' | 'abi'> &
  Partial<Pick<SavedContract, 'name'>>;

export default function useSavedContracts(
  chainId: string | null,
): [
  SavedContract[],
  (newContract: NewContract) => void,
  (address: string) => void,
] {
  const [savedContracts, setSavedContracts] = useState<
    Record<string, Record<string, RawSavedContract>>
  >(() => {
    const value =
      typeof window === 'undefined' ? null : window.localStorage.getItem(KEY);
    return value ? JSON.parse(value) : {};
  });

  const update = useCallback(
    (newContract: NewContract) => {
      if (!chainId) return;
      setSavedContracts(
        (prevState: Record<string, Record<string, RawSavedContract>>) => {
          const oldContract = prevState?.[chainId]?.[newContract.address] || {};
          return {
            ...prevState,
            [chainId]: {
              ...prevState[chainId],
              [newContract.address]: {
                name: oldContract.name || newContract.address,
                ...newContract,
                lastUpdatedAt: Date.now(),
              },
            },
          };
        },
      );
    },
    [chainId],
  );

  const remove = useCallback(
    (address: string) => {
      if (!chainId) return;
      setSavedContracts(
        (prevState: Record<string, Record<string, RawSavedContract>>) => {
          const newContracts = { ...prevState[chainId] };
          delete newContracts[address];
          const newState = {
            ...prevState,
            [chainId]: newContracts,
          };
          return newState;
        },
      );
    },
    [chainId],
  );

  useEffect(() => {
    window.localStorage.setItem(KEY, JSON.stringify(savedContracts));
  }, [savedContracts]);

  const data = useMemo(() => {
    if (!chainId) return [];
    const contracts = savedContracts[chainId];
    if (!contracts) return [];
    return Object.values(contracts)
      .sort(
        (aContract, bContract) =>
          bContract.lastUpdatedAt - aContract.lastUpdatedAt,
      )
      .map((contract) => ({
        ...contract,
        abiDecoder: new AbiDecoder(contract.abi),
      }));
  }, [savedContracts, chainId]);

  return [data, update, remove];
}
