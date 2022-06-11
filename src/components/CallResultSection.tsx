import bnReplacer from '@/utils/bnReplacer';
import type { TransactionReceipt } from '@ethersproject/abstract-provider';
import { ParamType, Result } from 'ethers/lib/utils';
import CallResultList from './CallResultList';

export default function CallResultSection({
  result,
  abiItems,
}: {
  result?: Result | TransactionReceipt;
  abiItems?: ParamType[];
}) {
  if (!result) return null;

  return (
    <div className="w-full">
      <div className="flex justify-between">
        <h3 className="text-gray-700">Transaction Result</h3>
      </div>
      {Array.isArray(result) ? (
        <div className="overflow-auto p-2 w-full max-h-60 break-all rounded-md border">
          <CallResultList result={result as Result} types={abiItems} />
        </div>
      ) : (
        <pre className="overflow-auto p-2 w-full max-h-60 break-all rounded-md border">
          {JSON.stringify(result, bnReplacer, 2)}
        </pre>
      )}
    </div>
  );
}
