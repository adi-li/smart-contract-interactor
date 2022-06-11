/* eslint-disable @typescript-eslint/no-explicit-any */
import useWeb3 from '@/hooks/useWeb3';
import callWeb3 from '@/utils/callWeb3';
import type { TransactionReceipt } from '@ethersproject/abstract-provider';
import { Disclosure } from '@headlessui/react';
import clsx from 'clsx';
import { Contract } from 'ethers';
import { ParamType, Result } from 'ethers/lib/utils';
import set from 'lodash.set';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import AbiInputComponent from './AbiInputs/AbiInput';
import NumberInput from './AbiInputs/NumberInput';
import CallResultSection from './CallResultSection';
import ChevronRightIcon from './ChevronRightIcon';
import Loading from './Loading';

export interface AbiItemRowProps {
  contract: Contract;
  functionKey: string;
}

const TRANSACTION_VALUE_INPUT = ParamType.fromObject({
  name: 'Transaction value',
  type: 'uint256',
});

export default function AbiItemRow({ contract, functionKey }: AbiItemRowProps) {
  const abiItem = contract.interface.functions[functionKey];

  const [isQuerying, setIsQuerying] = useState(false);
  const [result, setResult] = useState<Result | TransactionReceipt>();
  const [error, setError] = useState('');

  const [params, setParams] = useState<any[]>([]);
  const [value, setValue] = useState('');

  const { account, connect, web3 } = useWeb3();

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

      setResult(undefined);
      setError('');

      if (!abiItem.constant && !account) {
        setError('Please connect with wallet to continue.');
        return;
      }

      setIsQuerying(true);

      // Allow time for the ref to update their value.
      setTimeout(async () => {
        if (!web3) return;
        try {
          const data = contract.interface.encodeFunctionData(
            abiItem,
            paramsRef.current,
          );
          const result = await callWeb3(web3, abiItem, {
            data,
            from: account ?? undefined,
            to: contract.address,
            value: valueRef.current || undefined,
          });
          const parsedResult =
            typeof result === 'string'
              ? contract.interface.decodeFunctionResult(abiItem, result)
              : result;
          setResult(parsedResult);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : JSON.stringify(err, null, 2),
          );
        } finally {
          setIsQuerying(false);
        }
      }, 10);
    },
    [abiItem, account, contract.address, contract.interface, web3],
  );

  // Auto call method when function is view and no input needs
  useEffect(() => {
    if (abiItem.constant && abiItem.inputs.length === 0) {
      onSubmit();
    }
  }, [abiItem.constant, abiItem.inputs?.length, onSubmit]);

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex justify-between py-2 px-4 w-full text-sm font-medium text-left bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus-visible:ring focus-visible:ring-gray-500/75">
            <span>
              {abiItem.name}
              {!abiItem.constant && '*'}
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
                ) : abiItem.constant || account ? (
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
                <CallResultSection result={result} abiItems={abiItem.outputs} />
              </div>
            </form>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
