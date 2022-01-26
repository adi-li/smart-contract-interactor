import useChainName from '@/hooks/useChainName';
import { SavedContract } from '@/hooks/useSavedContracts';
import useWeb3 from '@/hooks/useWeb3';
import { FormEventHandler, useCallback, useEffect, useState } from 'react';
import { AbiItem } from 'web3-utils';
import Input from './Input';
import Textarea from './Textarea';

export interface NewContractFormProps {
  onSubmit: (address: string, abi: AbiItem[]) => void;
  defaultContract?: SavedContract | null;
}

export default function NewContractForm({
  onSubmit,
  defaultContract,
}: NewContractFormProps) {
  const { web3, chainId } = useWeb3();
  const chainName = useChainName(chainId);
  const [address, setAddress] = useState<string>('');
  const [abi, setAbi] = useState<string>('');

  const wrappedOnSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();
      if (!web3) return;
      if (!address) {
        window.alert('Invalid address');
        return;
      }
      if (!abi) {
        window.alert('Invalid ABI json');
        return;
      }
      let json: AbiItem[];
      try {
        json = JSON.parse(abi);
      } catch (error) {
        window.alert('Invalid ABI json');
        return;
      }
      onSubmit(address, json);
    },
    [abi, address, onSubmit, web3],
  );

  useEffect(() => {
    if (!defaultContract) return;
    setAddress(defaultContract.address);
    setAbi(JSON.stringify(defaultContract.abi, null, 2));
  }, [defaultContract]);

  return (
    <form className="w-full" onSubmit={wrappedOnSubmit}>
      <h3 className="mb-2 text-xl font-bold">New Contract</h3>
      <div className="grid grid-cols-2 gap-6">
        <Input
          title="Current Chain Id"
          helpText="Change it via MetaMask plugin"
          type="text"
          disabled
          value={chainName}
        />
        <Input
          required
          title="Contract Address"
          helpText="Starts with 0x"
          type="text"
          name="address"
          pattern="^0x[a-fA-F0-9]{40}$"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <Textarea
          required
          title="ABI JSON"
          name="abi"
          helpText="Paste ABI JSON array above"
          wrapperClassName="col-span-full"
          value={abi}
          onChange={(e) => setAbi(e.target.value)}
        />
        <div className="col-span-full text-right">
          <button className="py-2 px-3 hover:bg-indigo-100 rounded-md border">
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}
