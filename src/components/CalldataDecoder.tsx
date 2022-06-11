import useWeb3 from '@/hooks/useWeb3';
import SavedContract from '@/models/SavedContract';
import bnReplacer from '@/utils/bnReplacer';
import callWeb3 from '@/utils/callWeb3';
import type { TransactionReceipt } from '@ethersproject/abstract-provider';
import clsx from 'clsx';
import { Contract } from 'ethers';
import { FunctionFragment, Result } from 'ethers/lib/utils';
import {
  ChangeEventHandler,
  FormEventHandler,
  MouseEventHandler,
  useCallback,
  useState,
} from 'react';
import CallResultSection from './CallResultSection';
import Loading from './Loading';
import Textarea from './Textarea';

export default function CalldataDecoder({
  contract,
  savedContract,
}: {
  contract: Contract;
  savedContract: SavedContract;
}) {
  const { account, web3 } = useWeb3();
  const [calldata, setCalldata] = useState('');
  const [decodedData, setDecodedData] = useState('');
  const [functionFragment, setFunctionFragment] = useState<FunctionFragment>();
  const [isQuerying, setIsQuerying] = useState(false);
  const [callResult, setCallResult] = useState<Result | TransactionReceipt>();
  const [callError, setCallError] = useState('');

  const onChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback((e) => {
    setCalldata(e.target.value);
    setFunctionFragment(undefined);
  }, []);

  const onCall: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (!web3 || !account || !functionFragment) return;

    setCallResult(undefined);
    setCallError('');
    setIsQuerying(true);
    callWeb3(web3, functionFragment, {
      from: account,
      to: savedContract.address,
      data: calldata.trim(),
    })
      .then((data) => {
        setCallResult(
          typeof data === 'string'
            ? contract.interface.decodeFunctionResult(functionFragment, data)
            : data,
        );
      })
      .catch(console.error)
      .finally(() => setIsQuerying(false));
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    try {
      const decoded = savedContract.abi.parseTransaction({
        data: calldata.trim(),
      });
      setDecodedData(JSON.stringify(decoded, bnReplacer, 2));
      setFunctionFragment(decoded.functionFragment);
    } catch (err) {
      setDecodedData(err as string);
      return;
    }
  };

  return (
    <div className="divide-y-container">
      <form className="w-full" onSubmit={onSubmit}>
        <div className="grid gap-6">
          <Textarea
            required
            title="Calldata"
            name="calldata"
            helpText="Paste txn calldata (starting with 0x) above"
            className="min-h-[12rem]"
            value={calldata}
            onChange={onChange}
          />
          <div className="flex gap-4 justify-end">
            {account &&
              (isQuerying ? (
                <Loading />
              ) : (
                <button
                  className="py-2 px-3 disabled:text-gray-400 hover:bg-indigo-100 disabled:bg-gray-200 rounded-md border disabled:cursor-not-allowed"
                  onClick={onCall}
                  disabled={!functionFragment}
                >
                  Send Request
                </button>
              ))}
            <button
              type="submit"
              className="py-2 px-3 hover:bg-indigo-100 rounded-md border"
            >
              Decode
            </button>
          </div>
        </div>
      </form>
      <Textarea
        disabled
        title="Decoded result"
        wrapperClassName="w-full"
        className="min-h-[12rem]"
        value={decodedData}
      />
      {callResult && (
        <CallResultSection
          result={callResult}
          abiItems={functionFragment?.outputs}
        />
      )}
      {(callError || isQuerying) && (
        <div>
          <h3 className="text-gray-700">Transaction Result</h3>
          {isQuerying ? (
            <Loading />
          ) : callError ? (
            <pre
              className={clsx(
                'overflow-auto p-2 mt-1 w-full max-h-60 rounded-md border',
                callError && 'text-red-500',
              )}
            >
              {callError}
            </pre>
          ) : null}
        </div>
      )}
    </div>
  );
}
