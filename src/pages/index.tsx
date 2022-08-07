import ContractTools from '@/components/ContractTools';
import Layout from '@/components/Layout';
import NewContractForm from '@/components/NewContractForm';
import SavedContracts from '@/components/SavedContracts';
import useSavedContracts from '@/hooks/useSavedContracts';
import useWeb3 from '@/hooks/useWeb3';
import SavedContract from '@/models/SavedContract';
import toChecksumAddress from '@/utils/toChecksumAddress';
import { Contract } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import Head from 'next/head';
import Link from 'next/link';
import { useCallback, useMemo, useRef, useState } from 'react';

const TITLE = 'ecrw by Adi Li';

export default function Home() {
  const { ethereum, chainId, web3 } = useWeb3();
  const [address, setAddress] = useState<string>('');
  const [abi, setAbi] = useState<Interface>();
  const [savedContracts, updateContract, removeContract] =
    useSavedContracts(chainId);
  const interactorRef = useRef<HTMLDivElement | null>(null);

  const contract = useMemo(() => {
    if (!web3 || !address || !abi) return null;
    return new Contract(address, abi, web3.getSigner() ?? web3);
  }, [address, abi, web3]);

  const savedContract = useMemo(() => {
    if (!savedContracts || savedContracts.length === 0) return undefined;
    return savedContracts.find((c) => c.address === address);
  }, [address, savedContracts]);

  const onCreate = useCallback(
    (addressInput: string, abiInput: Interface) => {
      if (!web3) return;
      const checksum = toChecksumAddress(addressInput);
      if (!checksum) {
        window.alert('Invalid contract address');
        return;
      }
      try {
        updateContract({
          address: checksum,
          abi: abiInput,
        });
        setAbi(abiInput);
        setAddress(checksum);
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
        name,
        address: contract.address,
        abi: contract.abi,
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
          {savedContract ? `${savedContract.name} | ${TITLE}` : TITLE}
        </title>
      </Head>
      {!ethereum ? (
        <div className="flex grow items-center justify-center">
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
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 pb-8">
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
            <div ref={interactorRef} className="w-full border-t py-8">
              <div className="mx-auto w-full max-w-3xl px-4">
                <ContractTools
                  address={address}
                  contract={contract}
                  savedContract={savedContract}
                  savedContracts={savedContracts}
                />
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
