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
