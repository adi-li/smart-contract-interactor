import useWeb3 from '@/hooks/useWeb3';
import parseInputValue from '@/utils/parseInputValue';
import { Disclosure } from '@headlessui/react';
import clsx from 'clsx';
import { FormEventHandler, useCallback, useState } from 'react';
import { Contract } from 'web3-eth-contract';
import { AbiItem, toWei } from 'web3-utils';
import ChevronRightIcon from './ChevronRightIcon';
import Loading from './Loading';

export interface AbiItemRowProps {
  contract: Contract;
  abiItem: AbiItem;
}

export default function AbiItemRow({ contract, abiItem }: AbiItemRowProps) {
  const [isQuerying, setIsQuerying] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const { account, connect } = useWeb3();
  const isReadFunc =
    abiItem.stateMutability === 'pure' || abiItem.stateMutability === 'view';
  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();
      if (!abiItem.name) return;

      setResult('');
      setError('');

      if (!isReadFunc) {
        if (!account) {
          setError('Please connect with wallet to continue.');
          return;
        }
      }

      setIsQuerying(true);

      const inputs = e.currentTarget.querySelectorAll(
        'input:not([type="submit"]):not([data-txn-value])',
      ) as NodeListOf<HTMLInputElement>;
      const data = Array.from(inputs.values()).map(parseInputValue);
      const value = (
        e.currentTarget.querySelector(
          'input[data-txn-value]',
        ) as HTMLInputElement | null
      )?.value;

      const method = contract.methods[abiItem.name](...data);
      const promise = isReadFunc
        ? method.call()
        : method.send({ from: account, value: toWei(value || '0') });
      promise
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((data: any) => setResult(JSON.stringify(data, null, 2)))
        .catch((err: Error) => setError(err.message))
        .finally(() => setIsQuerying(false));
    },
    [abiItem.name, isReadFunc, contract.methods, account],
  );
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex justify-between py-2 px-4 w-full text-sm font-medium text-left bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus-visible:ring focus-visible:ring-gray-500/75">
            <span>{abiItem.name}</span>
            <ChevronRightIcon
              className={clsx(open && 'rotate-90', 'w-5 h-5')}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500 rounded-md border">
            <form onSubmit={onSubmit}>
              <div className="flex flex-col gap-4 items-start p-2">
                {abiItem.inputs?.map((input) => (
                  <label key={input.name} className="block w-full">
                    <span className="text-gray-700">
                      {input.name} ({input.type})
                    </span>
                    <input
                      required
                      type={input.type === 'uint256' ? 'number' : 'text'}
                      className="block py-2 px-4 w-full rounded-md"
                      data-data-type={input.type}
                    />
                  </label>
                ))}
                {abiItem.stateMutability === 'payable' && (
                  <label className="block w-full">
                    <span className="text-gray-700">
                      Transaction value (in Eth)
                    </span>
                    <input
                      required
                      data-txn-value
                      type="number"
                      step={1e-9}
                      className="block py-2 px-4 w-full rounded-md"
                    />
                  </label>
                )}
                {isQuerying ? (
                  <Loading />
                ) : isReadFunc || account ? (
                  <input
                    className="py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-md cursor-pointer"
                    type="submit"
                    value="Send Request"
                  />
                ) : (
                  <button
                    className="py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-md cursor-pointer"
                    onClick={() => connect().catch(console.error)}
                  >
                    Connect MetaMask
                  </button>
                )}
                {error && (
                  <pre className="overflow-auto p-2 w-full max-h-60 text-red-500 rounded-md border">
                    {error}
                  </pre>
                )}
                {result && (
                  <pre className="overflow-auto p-2 w-full max-h-60 rounded-md border">
                    {result}
                  </pre>
                )}
              </div>
            </form>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
