import { BigNumber } from 'ethers';
import isPlainObject from 'lodash.isplainobject';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function bnReplacer(k: string, v: any) {
  if (Array.isArray(v)) {
    return v.map((value) =>
      BigNumber.isBigNumber(value) ? value.toString() : value,
    );
  }
  if (isPlainObject(v)) {
    return Object.fromEntries(
      Object.entries(v).map(([key, value]) => [
        key,
        BigNumber.isBigNumber(value) ? value.toString() : value,
      ]),
    );
  }
  return BigNumber.isBigNumber(v) ? v.toString() : v;
}
