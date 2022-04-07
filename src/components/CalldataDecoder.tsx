import type { SavedContract } from '@/hooks/useSavedContracts';
import useWeb3 from '@/hooks/useWeb3';
import clsx from 'clsx';
import {
  ChangeEventHandler,
  FormEventHandler,
  MouseEventHandler,
  useCallback,
  useState,
} from 'react';
import Loading from './Loading';
import Textarea from './Textarea';

export default function CalldataDecoder({
  savedContract,
}: {
  savedContract: SavedContract;
}) {
  const { account, web3 } = useWeb3();
  const [calldata, setCalldata] = useState('');
  const [decodedData, setDecodedData] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);
  const [callResult, setCallResult] = useState('');
  const [callError, setCallError] = useState('');

  const onChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback((e) => {
    setCalldata(e.target.value);
    setIsValid(false);
  }, []);

  const onCall: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (!web3 || !account) return;
    setCallResult('');
    setCallError('');
    setIsQuerying(true);
    web3.eth
      .sendTransaction({
        from: account,
        to: savedContract.address,
        data: calldata.trim(),
      })
      .then((data) => setCallResult(JSON.stringify(data, null, 2)))
      .catch(console.error)
      .finally(() => setIsQuerying(false));
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!savedContract.abiDecoder) return;
    let decoded: ReturnType<typeof savedContract.abiDecoder.decodeMethod>;
    try {
      decoded = savedContract.abiDecoder.decodeMethod(calldata.trim());
    } catch (err) {
      setDecodedData(err as string);
      return;
    }
    if (decoded) {
      setDecodedData(JSON.stringify(decoded, null, 2));
      setIsValid(true);
    } else {
      setDecodedData('Cannot decode calldata');
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
                  disabled={!isValid}
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
      {(callResult || callError || isQuerying) && (
        <div>
          <h3 className="text-gray-700">Transaction Result</h3>
          {isQuerying ? (
            <Loading />
          ) : (
            <pre
              className={clsx(
                'overflow-auto p-2 mt-1 w-full max-h-60 rounded-md border',
                callError && 'text-red-500',
              )}
            >
              {callError ? callError : callResult}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
