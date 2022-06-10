/* eslint-disable @typescript-eslint/no-explicit-any */
import useWeb3 from '@/hooks/useWeb3';
import { Disclosure } from '@headlessui/react';
import clsx from 'clsx';
import set from 'lodash.set';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Contract } from 'web3-eth-contract';
import { AbiInput, AbiItem } from 'web3-utils';
import AbiInputComponent from './AbiInputs/AbiInput';
import NumberInput from './AbiInputs/NumberInput';
import ChevronRightIcon from './ChevronRightIcon';
import Loading from './Loading';

export interface AbiItemRowProps {
  contract: Contract;
  abiItem: AbiItem;
}

const TRANSACTION_VALUE_INPUT: AbiInput = {
  name: 'Transaction value',
  type: 'uint256',
};

export default function AbiItemRow({ contract, abiItem }: AbiItemRowProps) {
  const [isQuerying, setIsQuerying] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const [params, setParams] = useState<any[]>([]);
  const [value, setValue] = useState('');

  const { account, connect } = useWeb3();

  const isReadFunc =
    abiItem.stateMutability === 'pure' || abiItem.stateMutability === 'view';

  const handleParamChange = useCallback((keyPath: string, value: any) => {
    setParams((prev: any[]) => [...set(prev, keyPath, value)]);
  }, []);

  const handleEthValue = useCallback((keyPath: string, value: any) => {
    setValue(value as string);
  }, []);

  const paramsRef = useRef(params);
  const valueRef = useRef(value);

  useEffect(() => {
    paramsRef.current = params;
    valueRef.current = value;
  }, [params, value]);

  const onSubmit = useCallback(
    (e?: FormEvent<HTMLFormElement>) => {
      e?.preventDefault();
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

      new Promise((resolve, reject) => {
        if (!abiItem.name) {
          reject(new Error('Invalid function name'));
          return;
        }
        try {
          const method = contract.methods[abiItem.name](...paramsRef.current);
          resolve(
            isReadFunc
              ? method.call()
              : method.send({ from: account, value: valueRef.current || '0' }),
          );
        } catch (err) {
          reject(err);
        }
      })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((data: any) => setResult(JSON.stringify(data, null, 2)))
        .catch((err: Error) => setError(err.message))
        .finally(() => setIsQuerying(false));
    },
    [abiItem.name, isReadFunc, contract.methods, account],
  );

  useEffect(() => {
    if (isReadFunc && abiItem.inputs?.length === 0) {
      onSubmit();
    }
  }, [abiItem.inputs?.length, isReadFunc, onSubmit]);

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex justify-between py-2 px-4 w-full text-sm font-medium text-left bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus-visible:ring focus-visible:ring-gray-500/75">
            <span>
              {abiItem.name}
              {!isReadFunc && '*'}
            </span>
            <ChevronRightIcon
              className={clsx(open && 'rotate-90', 'w-5 h-5')}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500 rounded-md border">
            <form onSubmit={onSubmit}>
              <div className="flex flex-col gap-4 items-start p-2">
                {abiItem.inputs?.map((input, i) => (
                  <AbiInputComponent
                    key={input.name || i}
                    keyPath={i.toString()}
                    input={input}
                    onUserInput={handleParamChange}
                    defaultValue={params[i]}
                  />
                ))}
                {abiItem.stateMutability === 'payable' && (
                  <NumberInput
                    keyPath="value"
                    input={TRANSACTION_VALUE_INPUT}
                    onUserInput={handleEthValue}
                    required={false}
                    defaultValue={value}
                    type="uint"
                    bits={256}
                  />
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
                  <>
                    {(abiItem.outputs?.length || 0) > 0 && (
                      <ol className="pl-4 list-decimal">
                        {abiItem.outputs?.map((output, idx) => (
                          <li key={idx}>
                            {output.name}({output.internalType || output.type})
                            {(output.components?.length || 0) > 0 &&
                              output.components?.map((component, cidx) => (
                                <span key={cidx} className="block">
                                  &gt; {component.name}(
                                  {component.internalType || component.type})
                                </span>
                              ))}
                          </li>
                        ))}
                      </ol>
                    )}
                    <pre className="overflow-auto p-2 w-full max-h-60 rounded-md border">
                      {result}
                    </pre>
                  </>
                )}
              </div>
            </form>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
