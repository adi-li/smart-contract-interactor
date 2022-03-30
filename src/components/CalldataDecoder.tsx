import type { SavedContract } from '@/hooks/useSavedContracts';
import { FormEventHandler, useState } from 'react';
import Textarea from './Textarea';

export default function CalldataDecoder({
  savedContract,
}: {
  savedContract: SavedContract;
}) {
  const [calldata, setCalldata] = useState('');
  const [result, setResult] = useState('');

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!savedContract.abiDecoder) return;
    let decoded: ReturnType<typeof savedContract.abiDecoder.decodeMethod>;
    try {
      decoded = savedContract.abiDecoder.decodeMethod(calldata);
    } catch (err) {
      setResult(err as string);
      return;
    }
    if (decoded) {
      setResult(JSON.stringify(decoded, null, 2));
    } else {
      setResult('Cannot decode calldata');
    }
  };

  return (
    <>
      <form className="mb-4 w-full" onSubmit={onSubmit}>
        <div className="grid grid-cols-2 gap-6">
          <Textarea
            required
            title="Calldata"
            name="calldata"
            helpText="Paste txn calldata (starting with 0x) above"
            wrapperClassName="col-span-full"
            className="min-h-[12rem]"
            value={calldata}
            onChange={(e) => setCalldata(e.target.value)}
          />
          <div className="col-span-full text-right">
            <button
              type="submit"
              className="py-2 px-3 hover:bg-indigo-100 rounded-md border"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
      <hr />
      <Textarea
        disabled
        title="Decoded result"
        wrapperClassName="w-full mt-4"
        className="min-h-[12rem]"
        value={result}
      />
    </>
  );
}
