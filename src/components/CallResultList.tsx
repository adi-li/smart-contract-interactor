import bnReplacer from '@/utils/bnReplacer';
import clsx from 'clsx';
import { BigNumber } from 'ethers';
import type { ParamType, Result } from 'ethers/lib/utils';

export default function CallResultList({
  result,
  types,
  showLeftLine = false,
}: {
  result: Result;
  types?: ParamType[];
  showLeftLine?: boolean;
}) {
  if (!types || types.length === 0) return null;
  return (
    <ol className={clsx('w-full', showLeftLine && 'pl-2 border-l')}>
      {types.map((type, index) => (
        <li key={index}>
          <div className="flex flex-col gap-1">
            <i className="text-gray-300 select-none">
              {type.name || index} ({type.type})
            </i>{' '}
            {type.arrayChildren ? (
              <CallResultList
                result={result[index]}
                types={Array(result[index].length).fill(type.arrayChildren)}
                showLeftLine
              />
            ) : type.components ? (
              <CallResultList
                result={result[index]}
                types={type.components}
                showLeftLine
              />
            ) : (
              <p className="font-mono">
                {BigNumber.isBigNumber(result[index])
                  ? result[index].toString()
                  : JSON.stringify(result[index], bnReplacer)}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
