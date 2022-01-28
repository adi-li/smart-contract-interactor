import ContractInteractor from '@/components/ContractInteractor';
import Layout from '@/components/Layout';
import NewContractForm from '@/components/NewContractForm';
import SavedContracts from '@/components/SavedContracts';
import useSavedContracts, { SavedContract } from '@/hooks/useSavedContracts';
import useWeb3 from '@/hooks/useWeb3';
import Head from 'next/head';
import Link from 'next/link';
import { useCallback, useMemo, useRef, useState } from 'react';
import { AbiItem } from 'web3-utils';

export default function Home() {
  const { ethereum, chainId, web3 } = useWeb3();
  const [address, setAddress] = useState<string>('');
  const [abi, setAbi] = useState<AbiItem[]>([]);
  const [savedContracts, updateContract, removeContract] =
    useSavedContracts(chainId);
  const interactorRef = useRef<HTMLDivElement | null>(null);

  const contract = useMemo(() => {
    if (!web3 || !address || !abi) return null;
    return new web3.eth.Contract(abi, address);
  }, [address, abi, web3]);

  const savedContract = useMemo(() => {
    if (!savedContracts || savedContracts.length === 0) return undefined;
    return savedContracts.find((c) => c.address === address);
  }, [address, savedContracts]);

  const onCreate = useCallback(
    (addressInput: string, abiInput: AbiItem[]) => {
      if (!web3) return;
      try {
        updateContract({
          address: addressInput,
          abi: abiInput,
        });
        setAbi(abiInput);
        setAddress(addressInput);
      } catch (error) {
        window.alert('Cannot parse ABI value');
      }
      setTimeout(() => {
        interactorRef.current?.scrollIntoView();
      }, 0);
    },
    [updateContract, web3],
  );

  const onSelectContract = useCallback(
    (contract: SavedContract) => {
      if (!web3) return null;
      setAbi(contract.abi);
      setAddress(contract.address);
      setTimeout(() => {
        interactorRef.current?.scrollIntoView();
      }, 0);
    },
    [web3],
  );

  const onUpdateContract = useCallback(
    (contract: SavedContract) => {
      const name = window.prompt('Please enter a nickname');
      if (!name) return;
      updateContract({
        ...contract,
        name,
      });
    },
    [updateContract],
  );

  const onRemoveContract = useCallback(
    (contract: SavedContract) => {
      const confirm = window.confirm(`Remove ${contract.name}?`);
      if (confirm) removeContract(contract.address);
    },
    [removeContract],
  );

  return (
    <Layout>
      <Head>
        <title>
          {savedContract
            ? `${savedContract.name} | eth-contract-gui`
            : 'eth-contract-gui'}
        </title>
      </Head>
      {!ethereum ? (
        <div className="flex grow justify-center items-center">
          <p>
            Please download and use&nbsp;
            <Link href="https://metamask.io/">
              <a
                className="underline hover:no-underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                MetaMask
              </a>
            </Link>
            &nbsp;to continue.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-8 px-4 pb-8 mx-auto w-full max-w-3xl">
            <SavedContracts
              contracts={savedContracts}
              highlightContract={savedContract}
              onSelect={onSelectContract}
              onUpdate={onUpdateContract}
              onRemove={onRemoveContract}
            />
            <NewContractForm
              onSubmit={onCreate}
              defaultContract={savedContract}
            />
          </div>

          {contract && savedContract && (
            <div ref={interactorRef} className="py-8 w-full border-t">
              <div className="px-4 mx-auto w-full max-w-3xl">
                <ContractInteractor
                  contract={contract}
                  savedContract={savedContract}
                  address={address}
                  abi={abi}
                />
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
