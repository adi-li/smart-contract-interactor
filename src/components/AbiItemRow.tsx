import { Disclosure } from '@headlessui/react';
import clsx from 'clsx';
import { FormEventHandler, useCallback, useState } from 'react';
import { Contract } from 'web3-eth-contract';
import { AbiItem, toWei } from 'web3-utils';
import useWeb3 from '@/hooks/useWeb3';
import parseInputValue from '@/utils/parseInputValue';
import Loading from './Loading';
import ChevronRightIcon from './ChevronRightIcon';

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
          <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75">
            <span>{abiItem.name}</span>
            <ChevronRightIcon
              className={clsx(open && 'transform rotate-90', 'w-5 h-5')}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500 border rounded-md">
            <form onSubmit={onSubmit}>
              <div className="flex flex-col items-start p-2 gap-4">
                {abiItem.inputs?.map((input) => (
                  <label key={input.name} className="block w-full">
                    <span className="text-gray-700">
                      {input.name} ({input.type})
                    </span>
                    <input
                      required
                      type={input.type === 'uint256' ? 'number' : 'text'}
                      className="block w-full px-4 py-2 rounded-md"
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
                      className="block w-full px-4 py-2 rounded-md"
                    />
                  </label>
                )}
                {isQuerying ? (
                  <Loading />
                ) : isReadFunc || account ? (
                  <input
                    className="px-4 py-2 bg-gray-200 cursor-pointer rounded-md hover:bg-gray-300"
                    type="submit"
                    value="Send Request"
                  />
                ) : (
                  <button
                    className="px-4 py-2 bg-gray-200 cursor-pointer rounded-md hover:bg-gray-300"
                    onClick={() => connect().catch(console.error)}
                  >
                    Connect MetaMask
                  </button>
                )}
                {error && (
                  <pre className="w-full p-2 overflow-auto text-red-500 border rounded-md max-h-60">
                    {error}
                  </pre>
                )}
                {result && (
                  <pre className="w-full p-2 overflow-auto border rounded-md max-h-60">
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
