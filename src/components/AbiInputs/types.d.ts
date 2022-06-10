/* eslint-disable @typescript-eslint/no-explicit-any */
import { AbiInput } from 'web3-utils';

export interface InputProps {
  keyPath: string;
  defaultValue?: any;
  input: AbiInput;
  onUserInput: (keyPath: string, value: any) => void;
}
