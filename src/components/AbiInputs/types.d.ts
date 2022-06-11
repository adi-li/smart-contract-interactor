/* eslint-disable @typescript-eslint/no-explicit-any */

import { ParamType } from 'ethers/lib/utils';

export interface InputProps {
  keyPath: string;
  defaultValue?: any;
  input: ParamType;
  onUserInput: (keyPath: string, value: any) => void;
}
