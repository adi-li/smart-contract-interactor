import ContractInteractor from '@/components/ContractInteractor';
import Input from '@/components/Input';
import Layout from '@/components/Layout';
import Textarea from '@/components/Textarea';
import useWeb3 from '@/hooks/useWeb3';
import noop from '@/utils/noop';
import Link from 'next/link';
import { FormEventHandler, useCallback, useEffect, useState } from 'react';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';

interface Chain {
  network: string;
  chainId: number;
}

const getChainName = (chains: Chain[], chainIdStr: string | null) => {
  const chainNum = parseInt(chainIdStr || '0', 16);
  return (
    (chains.length > 0 &&
      chainNum > 0 &&
      chains.find((chain) => chain.chainId === chainNum)?.network) ||
    chainIdStr ||
    'N/A'
  );
};

export default function Home() {
  const { ethereum, chainId, web3 } = useWeb3();
  const [chains, setChains] = useState<Chain[]>([]);
  const [abi, setAbi] = useState<AbiItem[]>([]);
  const [address, setAddress] = useState<string>('');
  const [contract, setContract] = useState<Contract | undefined>();

  const onChangeAbi: FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();
      if (!web3) return;
      const address = (
        e.currentTarget.querySelector(
          'input[name="address"]',
        ) as HTMLInputElement | null
      )?.value;
      const jsonStr = e.currentTarget.querySelector('textarea')?.value;
      if (!address) {
        window.alert('Invalid address');
        return;
      }
      if (!jsonStr) {
        window.alert('Invalid ABI json');
        return;
      }
      let json: AbiItem[];
      try {
        json = JSON.parse(jsonStr);
      } catch (error) {
        window.alert('Invalid ABI json');
        return;
      }
      try {
        const contract = new web3.eth.Contract(json, address);
        setAbi(json);
        setAddress(address);
        setContract(contract);
      } catch (error) {
        window.alert('Cannot parse ABI value');
      }
    },
    [web3],
  );

  useEffect(() => {
    fetch('https://chainid.network/chains.json')
      .then((res) => res.json())
      .then(setChains)
      .catch(noop);
  }, []);

  return (
    <Layout>
      {!ethereum ? (
        <div className="flex flex-grow justify-center items-center">
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
          <form
            className="px-4 pb-8 mx-auto w-full max-w-3xl"
            onSubmit={onChangeAbi}
          >
            <div className="grid grid-cols-2 gap-6">
              <Input
                title="Current Chain Id"
                helpText="Change it via MetaMask plugin"
                type="text"
                disabled
                value={getChainName(chains, chainId)}
              />
              <Input
                required
                title="Contract Address"
                helpText="Starts with 0x"
                type="text"
                name="address"
                pattern="^0x[a-fA-F0-9]{40}$"
              />
              <Textarea
                required
                title="ABI JSON"
                name="abi"
                helpText="Paste ABI JSON array above"
                wrapperClassName="col-span-full"
              />
              <div className="col-span-full text-right">
                <button className="py-2 px-3 hover:bg-gray-200 rounded-md border">
                  Submit
                </button>
              </div>
            </div>
          </form>

          {contract && (
            <div className="py-8 w-full border-t">
              <div className="px-4 mx-auto w-full max-w-3xl">
                <ContractInteractor
                  contract={contract}
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
