import SavedContract from '@/models/SavedContract';
import { useCallback, useEffect, useMemo, useState } from 'react';

const KEY = 'eth-contract-gui.saved-contracts';

export type NewContract = Parameters<
  typeof SavedContract['prototype']['update']
>[0];

const fetchSavedContracts = () => {
  const value =
    typeof window === 'undefined' ? null : window.localStorage.getItem(KEY);
  const obj: Record<
    string,
    Record<string, ConstructorParameters<typeof SavedContract>[0]>
  > = value ? JSON.parse(value) : {};

  return Object.fromEntries(
    Object.entries(obj).map(([networkId, contractsMap]) => [
      networkId,
      Object.fromEntries(
        Object.entries(contractsMap).map(([address, contract]) => [
          address,
          new SavedContract(contract),
        ]),
      ),
    ]),
  );
};

export default function useSavedContracts(
  chainId: string | null,
): [
  SavedContract[],
  (newContract: NewContract) => void,
  (address: string) => void,
] {
  const [savedContracts, setSavedContracts] = useState(fetchSavedContracts);

  const update = useCallback(
    (newContract: NewContract) => {
      if (!chainId) return;
      setSavedContracts((prevState) => {
        const oldContract = prevState?.[chainId]?.[newContract.address];
        return {
          ...prevState,
          [chainId]: {
            ...prevState[chainId],
            [newContract.address]: oldContract
              ? oldContract.update(newContract)
              : new SavedContract(newContract),
          },
        };
      });
    },
    [chainId],
  );

  const remove = useCallback(
    (address: string) => {
      if (!chainId) return;
      setSavedContracts((prevState) => {
        const newContracts = { ...prevState[chainId] };
        delete newContracts[address];
        return {
          ...prevState,
          [chainId]: newContracts,
        };
      });
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
    return Object.values(contracts).sort(
      (aContract, bContract) =>
        bContract.lastUpdatedAt - aContract.lastUpdatedAt,
    );
  }, [savedContracts, chainId]);

  return [data, update, remove];
}
