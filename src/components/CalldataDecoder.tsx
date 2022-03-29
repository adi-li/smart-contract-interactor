import useAbiDecoder from '@/hooks/useAbiDecoder';
import { FormEventHandler, useEffect, useState } from 'react';
import Textarea from './Textarea';

export default function CalldataDecoder() {
  const abiDecoder = useAbiDecoder();
  const [calldata, setCalldata] = useState('');
  const [result, setResult] = useState('');

  console.log({ result });

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!abiDecoder) return;
    let decoded: ReturnType<typeof abiDecoder.decodeMethod>;
    try {
      decoded = abiDecoder.decodeMethod(calldata);
    } catch (err) {
      setResult(JSON.stringify(err, null, 2));
      return;
    }
    if (decoded) {
      setResult(JSON.stringify(decoded, null, 2));
    } else {
      setResult('Cannot decode calldata');
    }
  };

  useEffect(() => {
    setCalldata('');
  }, [abiDecoder]);

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
